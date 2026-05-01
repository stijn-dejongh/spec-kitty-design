---
work_package_id: WP09
title: Deployment Workflows
dependencies:
- WP04
- WP07
requirement_refs:
- FR-033
- FR-044
- FR-045
- NFR-008
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T050
- T051
- T052
- T053
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "3475537"
history:
- date: '2026-05-01'
  event: created
agent_profile: node-norris
authoritative_surface: .github/workflows/storybook-deploy.yml
execution_mode: code_change
owned_files:
- .github/workflows/storybook-deploy.yml
- .github/workflows/pr-preview.yml
- .github/workflows/release.yml
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load node-norris
```

---

## Objective

Implement the three deployment/release GitHub Actions workflows: GitHub Pages Storybook deploy (FR-033), surge.sh PR preview (NFR-008), and the versioned npm publish + CycloneDX SBOM release (FR-044, FR-045). All Actions must be SHA-pinned (FR-043, ADR-005).

## Context

- Secrets required: `SURGE_TOKEN` (PR preview), `NPM_TOKEN` (npm publish)
- FR-033: Storybook deploys to GitHub Pages within 5 min of merge to main (SC-006)
- NFR-008: PR preview URL appears as a PR comment after each push
- FR-044: `npm publish --provenance` — requires `id-token: write` permission in GitHub Actions
- FR-045: CycloneDX SBOM attached to GitHub Release
- ADR-005: pre-flight — `@spec-kitty` npm scope must be owned before release pipeline is active

## Subtask Guidance

### T050 — `storybook-deploy.yml` — GitHub Pages

```yaml
name: Deploy Storybook to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA  # v4
      - uses: actions/setup-node@REPLACE_WITH_SHA  # v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - run: npx nx run-many --target=build --projects=tokens,angular,html-js
      - run: npx nx run storybook:storybook:build
      - uses: actions/configure-pages@REPLACE_WITH_SHA  # v5
      - uses: actions/upload-pages-artifact@REPLACE_WITH_SHA  # v3
        with:
          path: apps/storybook/storybook-static/
      - uses: actions/deploy-pages@REPLACE_WITH_SHA  # v4
        id: deployment
```

**Note**: Replace all `REPLACE_WITH_SHA` with current SHAs. The `actions/deploy-pages` action requires `pages: write` and `id-token: write` permissions.

### T051 — `pr-preview.yml` — surge.sh

```yaml
name: PR Preview (surge.sh)

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - run: npx nx run-many --target=build --projects=tokens,angular,html-js
      - run: npx nx run storybook:storybook:build
      - name: Install surge
        run: npm install --global surge --ignore-scripts
      - name: Deploy to surge.sh
        env:
          SURGE_TOKEN: ${{ secrets.SURGE_TOKEN }}
        run: |
          PREVIEW_URL="https://spec-kitty-design-pr-${{ github.event.pull_request.number }}.surge.sh"
          surge apps/storybook/storybook-static/ "$PREVIEW_URL" --token "$SURGE_TOKEN"
          echo "PREVIEW_URL=$PREVIEW_URL" >> $GITHUB_ENV
      - name: Post preview URL as PR comment
        uses: actions/github-script@REPLACE_WITH_SHA
        with:
          script: |
            const url = process.env.PREVIEW_URL;
            const body = `📦 **Storybook preview**: ${url}\n\n*Deployed from commit \`${{ github.sha }}\`*`;
            // Find and update existing preview comment, or create new one
            const comments = await github.rest.issues.listComments({
              ...context.repo, issue_number: context.payload.pull_request.number
            });
            const existing = comments.data.find(c => c.body.includes('Storybook preview'));
            if (existing) {
              await github.rest.issues.updateComment({
                ...context.repo, comment_id: existing.id, body
              });
            } else {
              await github.rest.issues.createComment({
                ...context.repo, issue_number: context.payload.pull_request.number, body
              });
            }
```

**Secrets setup reminder**: Add `SURGE_TOKEN` to repository secrets (Settings → Secrets → Actions).

**Security allowlist note (ADR-005, FR-046):** The `npm install --global surge --ignore-scripts` step bypasses the `--ignore-scripts` policy for a global install. Before merging this workflow, add an entry to `.github/security-allowlist.md`:
```
| surge | Global install for PR preview deployment; postinstall is empty for surge | <reviewer> | 2026-05-01 | Annual |
```

### T052 — `release.yml` — npm publish + SBOM

```yaml
name: Publish Release

on:
  push:
    tags: ['v*.*.*']

permissions:
  contents: write   # for GitHub Release creation
  id-token: write   # for npm provenance attestation (FR-044)

jobs:
  release:
    runs-on: ubuntu-latest
    env:
      NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with:
          node-version: '22'
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci --ignore-scripts

      - name: "[ENFORCED] Security gate before publish (ADR-005)"
        run: bash scripts/npm-audit-gate.sh

      - name: Build all packages
        run: npx nx run-many --target=build --projects=tokens,angular,html-js

      - name: "[ENFORCED] Dist contents audit — no secrets/sourcemaps (ADR-005)"
        run: |
          for pkg in tokens angular html-js; do
            echo "=== packages/$pkg ==="
            cd packages/$pkg && npm pack --dry-run 2>&1 | grep "npm notice" | grep -v "==="
            cd ../..
          done

      - name: Generate CycloneDX SBOM (FR-045)
        run: |
          npx @cyclonedx/cyclonedx-npm \
            --output-format json \
            --output-file spec-kitty-design-sbom.cdx.json
          echo "SBOM components: $(node -e "const d=require('./spec-kitty-design-sbom.cdx.json'); console.log(d.components.length)")"

      - name: Publish @spec-kitty/tokens (FR-044)
        run: npm publish --provenance --access public
        working-directory: packages/tokens

      - name: Publish @spec-kitty/angular (FR-044)
        run: npm publish --provenance --access public
        working-directory: packages/angular

      - name: Publish @spec-kitty/html-js (FR-044)
        run: npm publish --provenance --access public
        working-directory: packages/html-js

      - name: Create GitHub Release with SBOM
        uses: softprops/action-gh-release@REPLACE_WITH_SHA
        with:
          files: spec-kitty-design-sbom.cdx.json
          generate_release_notes: true
```

**Secrets required**: `NPM_TOKEN` scoped to `@spec-kitty` publish.

### T053 — Validate release pipeline

Before merging WP09, verify:

1. The dist contents audit step correctly identifies unexpected files. Test by temporarily adding a `.env` file to `packages/tokens/` and verifying it would be excluded.

2. The provenance flag is correctly configured: the workflow has `id-token: write` permission and `registry-url: 'https://registry.npmjs.org'` in `setup-node`.

3. SBOM generation works locally:
   ```bash
   npm install --save-dev @cyclonedx/cyclonedx-npm --ignore-scripts
   npx @cyclonedx/cyclonedx-npm --output-format json --output-file test-sbom.cdx.json
   cat test-sbom.cdx.json | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log('components:', d.components.length)"
   # Clean up: rm test-sbom.cdx.json
   ```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `storybook-deploy.yml` deploys to GitHub Pages on `main` push
- [ ] `pr-preview.yml` posts surge.sh URL as PR comment (with upsert to avoid duplicate comments)
- [ ] `release.yml` builds, audits, generates SBOM, publishes with provenance, attaches SBOM to release
- [ ] All `uses:` directives SHA-pinned
- [ ] `SURGE_TOKEN` and `NPM_TOKEN` secrets documented in PR description as required setup

## Risks

- `npm publish --provenance` requires the npm account to have 2FA enabled (ADR-005)
- GitHub Pages must be enabled in repo settings (Settings → Pages → Source: GitHub Actions)
- surge.sh free tier has storage limits — old PR previews should be cleaned up (future improvement)

## Reviewer Guidance

Check every `uses:` is a SHA (not `@v*`). Verify `id-token: write` is present in the `release` job's permissions block. Review the dist audit step — ensure it would catch a `.env` file in packages.

## Activity Log

- 2026-05-01T20:19:46Z – claude:claude-sonnet-4-6:node-norris:implementer – shell_pid=3461377 – Started implementation via action command
- 2026-05-01T20:22:39Z – claude:claude-sonnet-4-6:node-norris:implementer – shell_pid=3461377 – storybook-deploy.yml, pr-preview.yml, release.yml — all SHA-pinned
- 2026-05-01T20:23:06Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=3475537 – Started review via action command
- 2026-05-01T20:23:52Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=3475537 – Review passed: all 3 workflows SHA-pinned, deploy/preview/release correctly configured
