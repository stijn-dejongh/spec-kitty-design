---
work_package_id: WP07
title: CI Quality Workflow
dependencies:
- WP05
- WP06
requirement_refs:
- FR-016
- FR-026
- FR-027
- FR-035
- FR-041
- FR-042
- FR-043
- NFR-002
- NFR-007
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T039
- T040
- T041
- T042
- T043
agent: "claude:claude-sonnet-4-6:node-norris:implementer"
shell_pid: "3083970"
history:
- date: '2026-05-01'
  event: created
agent_profile: node-norris
authoritative_surface: .github/workflows/ci-quality.yml
execution_mode: code_change
owned_files:
- .github/workflows/ci-quality.yml
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load node-norris
```

---

## Objective

Wire all quality gates into `.github/workflows/ci-quality.yml` with path-scoped `nx affected` triggering (FR-035), hard merge gates, and PR lint-failure comments. All `uses:` directives must be pinned to SHA (FR-043).

## Context

- Hard gates (block merge): `security` (npm audit), `lint-code`, `workflow-pin-check`, and `gate` (orchestrator)
- Advisory (do not block): `lighthouse` (added in WP08)
- Visual/a11y/browser jobs added by WP08 — this WP creates the skeleton; WP08 extends it
- FR-035: path-scoped triggering via `dorny/paths-filter` and `nx affected`
- FR-027: CI results must be visible on PR without external dashboard access

## Subtask Guidance

### T039 — Write `.github/workflows/ci-quality.yml`

```yaml
name: CI Quality

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    # FR-041: nightly CVE audit on main branch
    # Offset from top of hour to avoid busy scheduling window (matches SK pattern)
    - cron: '17 2 * * *'

concurrency:
  group: ci-quality-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write   # needed for lint-feedback job

jobs:
  # ── Path filter ──────────────────────────────────────────────────────────────
  changes:
    runs-on: ubuntu-latest
    outputs:
      tokens:     ${{ steps.filter.outputs.tokens }}
      components: ${{ steps.filter.outputs.components }}
      docs:       ${{ steps.filter.outputs.docs }}
      ci:         ${{ steps.filter.outputs.ci }}
      doctrine:   ${{ steps.filter.outputs.doctrine }}
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA   # actions/checkout v4
      - uses: dorny/paths-filter@REPLACE_WITH_SHA  # dorny/paths-filter v3
        id: filter
        with:
          filters: |
            tokens:
              - 'packages/tokens/**'
            components:
              - 'packages/angular/**'
              - 'packages/html-js/**'
              - 'apps/storybook/**'
            docs:
              - 'docs/**'
              - '*.md'
            ci:
              - '.github/workflows/**'
              - 'scripts/**'
            doctrine:
              - 'doctrine/**'
              - 'skills/**'

  # ── Security ─────────────────────────────────────────────────────────────────
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - name: "[ENFORCED] npm audit — high/critical gate (FR-041)"
        run: bash scripts/npm-audit-gate.sh
      - name: "[ENFORCED] Lockfile integrity check (FR-042)"
        run: npm ci --dry-run --ignore-scripts

  # ── Workflow pin check ───────────────────────────────────────────────────────
  workflow-pin-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - name: "[ENFORCED] Check all Actions are SHA-pinned (FR-043)"
        run: bash scripts/check-action-pins.sh

  # ── Code lint ────────────────────────────────────────────────────────────────
  lint-code:
    runs-on: ubuntu-latest
    outputs:
      eslint_failures: ${{ steps.eslint.outputs.has_failures }}
      stylelint_failures: ${{ steps.stylelint.outputs.has_failures }}
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - name: "[ENFORCED] ESLint (FR-018)"
        id: eslint
        continue-on-error: true
        run: |
          if npx nx run-many --target=lint --all 2>&1 | tee /tmp/eslint-out.txt; then
            echo "has_failures=false" >> "$GITHUB_OUTPUT"
          else
            echo "has_failures=true" >> "$GITHUB_OUTPUT"
          fi
      - name: "[ENFORCED] Stylelint (FR-017)"
        id: stylelint
        continue-on-error: true
        run: |
          if npm run quality:stylelint 2>&1 | tee /tmp/stylelint-out.txt; then
            echo "has_failures=false" >> "$GITHUB_OUTPUT"
          else
            echo "has_failures=true" >> "$GITHUB_OUTPUT"
          fi
      - name: "[ENFORCED] HTMLHint (FR-019)"
        run: npm run quality:htmlhint
      - name: "[ENFORCED] commitlint (FR-020)"
        if: github.event_name == 'pull_request'
        run: npx commitlint --from=${{ github.event.pull_request.base.sha }} --to=${{ github.sha }}
      - name: "[ENFORCED] Fail if lint errors"
        if: always()
        run: |
          if [ "${{ steps.eslint.outputs.has_failures }}" = "true" ] || \
             [ "${{ steps.stylelint.outputs.has_failures }}" = "true" ]; then
            echo "Lint failures detected. See job summary."
            exit 1
          fi
      - uses: actions/upload-artifact@REPLACE_WITH_SHA
        if: always()
        with:
          name: lint-reports
          path: /tmp/*-out.txt
          if-no-files-found: ignore

  # ── Storybook build ──────────────────────────────────────────────────────────
  storybook-build:
    runs-on: ubuntu-latest
    needs: [changes]
    if: needs.changes.outputs.tokens == 'true' || needs.changes.outputs.components == 'true'
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - name: "[ENFORCED] Storybook build (NFR-003 < 3 min)"
        run: npx nx run storybook:storybook:build
      - uses: actions/upload-artifact@REPLACE_WITH_SHA
        with:
          name: storybook-static
          path: apps/storybook/storybook-static/
          retention-days: 3

  # ── Merge gate ──────────────────────────────────────────────────────────────
  gate:
    runs-on: ubuntu-latest
    needs: [security, workflow-pin-check, lint-code]
    if: always()
    steps:
      - name: "[ENFORCED] All hard gates must pass (FR-026)"
        run: |
          echo "security: ${{ needs.security.result }}"
          echo "workflow-pin-check: ${{ needs.workflow-pin-check.result }}"
          echo "lint-code: ${{ needs.lint-code.result }}"
          if [ "${{ needs.security.result }}"          != "success" ] || \
             [ "${{ needs.workflow-pin-check.result }}" != "success" ] || \
             [ "${{ needs.lint-code.result }}"          != "success" ]; then
            echo "❌ One or more hard gates failed. Merge blocked."
            exit 1
          fi
          echo "✅ All hard gates passed."
```

**Note — nightly audit (FR-041):** The `schedule:` block runs only the `security` job nightly on `main`. Add a conditional to the security job:
```yaml
  security:
    if: github.event_name != 'schedule' || github.ref == 'refs/heads/main'
```

**CRITICAL**: Replace every `REPLACE_WITH_SHA` with the actual current SHA for that Action before committing. Look up current SHAs at:
- `actions/checkout`: `https://github.com/actions/checkout/releases`
- `actions/setup-node`: `https://github.com/actions/setup-node/releases`
- `actions/upload-artifact`: `https://github.com/actions/upload-artifact/releases`
- `dorny/paths-filter`: `https://github.com/dorny/paths-filter/releases`

### T040 — Configure `nx affected` for path-scoped triggering (FR-035)

The `dorny/paths-filter` job (T039) handles file-level path filtering. For nx-level affected computation, add to the nx-targeted jobs:

```yaml
- name: Compute nx affected
  run: |
    echo "NX_BASE=${{ github.event.pull_request.base.sha || 'HEAD~1' }}" >> $GITHUB_ENV
    echo "NX_HEAD=${{ github.sha }}" >> $GITHUB_ENV
```

Then use `npx nx affected --target=lint` instead of `npx nx run-many --target=lint --all` in the lint job. This runs lint only on changed packages.

### T041 — Storybook build job

Already included in T039 as the `storybook-build` job. It:
- Only runs when `tokens` or `components` paths change (path-scoped, FR-035)
- Uploads the static Storybook as an artifact for downstream WP08 jobs
- The `gate` job does NOT depend on `storybook-build` — Storybook build failures are surfaced but do not block the base lint/security gate

**Note for WP08**: WP08 will add jobs `a11y`, `visual-regression`, `playwright`, `lighthouse` that `need: [storybook-build]`.

### T042 — `gate` job wiring

Already in T039. The `gate` job:
- Depends on: `security`, `workflow-pin-check`, `lint-code`
- Runs even when jobs are skipped (`if: always()`)
- Exits 1 if any dependent job did not succeed
- GitHub branch protection must be configured to require `gate` as a required status check

**Note**: Add this to the PR description for the WP07 review: "Configure branch protection to require `gate` status check on `main`."

### T043 — `lint-feedback` job

Add after the `gate` job:
```yaml
  lint-feedback:
    runs-on: ubuntu-latest
    needs: lint-code
    if: >-
      always() && github.event_name == 'pull_request' &&
      github.event.pull_request.head.repo.full_name == github.repository &&
      needs.lint-code.outputs.eslint_failures == 'true' ||
      needs.lint-code.outputs.stylelint_failures == 'true'
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/download-artifact@REPLACE_WITH_SHA
        with: { name: lint-reports, path: /tmp/reports }
      - uses: actions/github-script@REPLACE_WITH_SHA
        with:
          script: |
            const fs = require('fs');
            let body = '## ❌ Lint failures\n\n';
            for (const f of ['eslint-out.txt', 'stylelint-out.txt']) {
              const p = `/tmp/reports/${f}`;
              if (fs.existsSync(p)) body += `**${f}**\n\`\`\`\n${fs.readFileSync(p,'utf8').slice(0,2000)}\n\`\`\`\n\n`;
            }
            github.rest.issues.createComment({
              ...context.repo, issue_number: context.payload.pull_request.number, body
            });
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `.github/workflows/ci-quality.yml` present with all jobs
- [ ] Every `uses:` directive is pinned to a commit SHA (not a `@v*` tag)
- [ ] `npm audit` hard gate wired and tested
- [ ] `gate` job blocks merge on any hard-gate failure
- [ ] Storybook build job runs only on token/component path changes (FR-035)
- [ ] Lint failure PR comment posted on lint failures

## Risks

- `dorny/paths-filter` must be SHA-pinned — use the latest release SHA
- GitHub branch protection settings must be configured manually by the maintainer to require the `gate` status check

## Reviewer Guidance

Open a test PR with a deliberate ESLint violation. Verify: `lint-code` fails, `gate` fails, PR comment is posted with the violation details. Verify `storybook-build` does NOT run for docs-only changes.

## Activity Log

- 2026-05-01T18:48:07Z – claude:claude-sonnet-4-6:node-norris:implementer – shell_pid=3083970 – Started implementation via action command
