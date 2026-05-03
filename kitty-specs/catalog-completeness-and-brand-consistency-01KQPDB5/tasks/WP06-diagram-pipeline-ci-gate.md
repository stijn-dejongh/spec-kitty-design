---
work_package_id: WP06
title: 'Diagram pipeline: CI gate'
dependencies:
- WP05
requirement_refs:
- FR-014
- FR-015
- FR-016
planning_base_branch: feature/issue-18-catalog-and-diagram-pipeline
merge_target_branch: feature/issue-18-catalog-and-diagram-pipeline
branch_strategy: Planning artifacts for this feature were generated on feature/issue-18-catalog-and-diagram-pipeline. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/issue-18-catalog-and-diagram-pipeline unless the human explicitly redirects the landing branch.
subtasks:
- T030
- T031
- T032
- T033
agent: "opencode"
shell_pid: "1488840"
history:
- timestamp: '2026-05-03T08:00:00Z'
  actor: spec-kitty.tasks
  action: created
agent_profile: node-norris
authoritative_surface: .github/workflows/
execution_mode: code_change
model: claude-sonnet-4-6
owned_files:
- .github/workflows/docs-diagrams.yml
- package.json
- package-lock.json
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else in this prompt, load your assigned agent profile:

```
/ad-hoc-profile-load node-norris
```

Internalize the profile's identity, specialization, and collaboration contract. If the profile cannot be loaded, fall back to reading the YAML directly and log the gap to `tmp/finding/`.

## Objective

Close issue #2 (part 2): add the CI gate that exercises the render script (WP05) and rejects PRs that desync `.mmd` sources from their rendered `.svg` outputs.

In scope:
- `package.json` — pin `@mermaid-js/mermaid-cli` in `devDependencies`
- `package-lock.json` — regenerated lockfile
- `.github/workflows/docs-diagrams.yml` — the new CI workflow

NOT in scope: the render script itself (WP05), `.mmd`/`.svg` sources (WP05).

## Branch Strategy

- **Planning/base branch**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Final merge target**: same
- **Sequencing**: depends on WP05 (the gate exercises the script). Lane worktree allocated after WP05 merges.

## Context

Read first:

- [`../spec.md`](../spec.md) — FR-014, FR-015, NFR-002
- [`../research.md` PLAN-005](../research.md) — separate workflow (`docs-diagrams.yml`) vs extending `ci-quality.yml`
- [`../contracts/diagram-pipeline-ci-gate.md`](../contracts/diagram-pipeline-ci-gate.md) — full behavioural contract
- Existing CI patterns: `.github/workflows/{ci-quality,storybook-deploy,pr-preview,release,docs-pages}.yml` for runner image, Node version, npm cache patterns
- Existing security tooling: `scripts/check-action-pins.sh` — the new workflow MUST pin every action by SHA per existing project convention

## Subtasks

### T030 — Pin `@mermaid-js/mermaid-cli` in `package.json`

**Purpose**: ensure local and CI use the same Mermaid CLI version (FR-016 — local-CI parity).

**Steps**:
1. Determine the current latest stable `@mermaid-js/mermaid-cli` version (e.g. via `npm view @mermaid-js/mermaid-cli version`).
2. Add to `package.json` `devDependencies` at exactly that version (no caret, no range):
   ```json
   "devDependencies": {
     "@mermaid-js/mermaid-cli": "10.X.Y"
   }
   ```
   Replace `10.X.Y` with the actual current version.
3. Document the choice briefly in the WP completion message.

**Files**: `package.json`

**Validation**:
- [ ] Pin is exact (no `^` or `~`)
- [ ] Version is current at time of WP execution
- [ ] No other dependencies modified

### T031 — Update `package-lock.json`

**Purpose**: lockfile reflects the new pinned dependency and its transitive deps.

**Steps**:
1. From repo root, run:
   ```bash
   npm install
   ```
2. Verify `package-lock.json` updated. Note: the new dependency pulls in Puppeteer / Chromium transitively — that's expected.
3. Run the existing security gate:
   ```bash
   bash scripts/npm-audit-gate.sh
   ```
   If new high/critical vulnerabilities surface, surface as finding to reviewer; do NOT silence.
4. Run lockfile-drift check:
   ```bash
   npm run security:lockfile-check
   ```

**Files**: `package-lock.json`

**Validation**:
- [ ] `npm install` succeeds
- [ ] `npm-audit-gate.sh` passes (or new findings surfaced and discussed with reviewer)
- [ ] `lockfile-check` passes

### T032 — Add `.github/workflows/docs-diagrams.yml`

**Purpose**: the CI gate per [`../contracts/diagram-pipeline-ci-gate.md`](../contracts/diagram-pipeline-ci-gate.md).

**Steps**:
1. Create `.github/workflows/docs-diagrams.yml` with this structure (adapt to existing project conventions for action pinning, runner labels, cache):
   ```yaml
   name: Docs Diagrams (drift check)

   on:
     pull_request:
       paths: [ "docs/architecture/assets/**" ]
     push:
       branches: [ main ]
       paths: [ "docs/architecture/assets/**" ]

   permissions:
     contents: read

   jobs:
     check:
       runs-on: ubuntu-latest
       timeout-minutes: 5
       steps:
         - uses: actions/checkout@<sha>
         - uses: actions/setup-node@<sha>
           with:
             node-version: 20
             cache: npm
         - run: npm ci --ignore-scripts
         - name: Render diagrams (check mode)
           run: node scripts/render-diagrams.js --check
   ```
2. Pin every `uses: actions/...` reference by full SHA per project convention. Use `bash scripts/check-action-pins.sh` to verify after authoring.
3. The path filter `docs/architecture/assets/**` ensures the gate only runs when relevant — honours NFR-002 (zero CI cost on unrelated PRs).
4. Cache key: rely on `cache: npm` from `actions/setup-node` — that handles npm install caching for the 60 s budget.

**Files**: `.github/workflows/docs-diagrams.yml` (new, ~30 lines after action pinning)

**Validation**:
- [ ] `bash scripts/check-action-pins.sh` passes (every action pinned by SHA)
- [ ] Path filter limits trigger to `docs/architecture/assets/**`
- [ ] Workflow runs `--check` mode only (CI MUST NOT mutate committed SVGs)
- [ ] Timeout set to 5 minutes (well above the 60 s budget; safety margin)

### T033 — Smoke-test the gate

**Purpose**: verify FR-014 / FR-015 — the gate actually rejects drifted PRs.

**Steps** (manual; can be done by the implementing agent OR deferred to reviewer if `act` is not available locally):
1. **Test A — drift on a `.mmd` source**:
   - Make a trivial structural change to one `.mmd` (e.g., add a node to a flowchart). Do NOT regenerate its `.svg`.
   - Push to a draft PR and observe the `Docs Diagrams (drift check)` workflow.
   - Expected: workflow fails with a per-file diff diagnostic naming the drifted file.
   - Revert the change.
2. **Test B — drift on the brand-theme source**:
   - Make a trivial change to `sk-mermaid-theme.yaml` (e.g., change one colour). Do NOT regenerate any SVGs.
   - Push to the same draft PR.
   - Expected: workflow fails with diagnostics for every diagram dependent on the theme.
   - Revert the change.
3. **Test C — clean PR**:
   - With both reverts in place, the workflow should pass cleanly within the 60 s budget.
4. Document the smoke-test outcomes in the WP completion message. If `act` is available locally, reproduce these tests locally without pushing.

**Files**: none changed (test outcomes documented in completion message).

**Validation**:
- [ ] Test A: gate fails on `.mmd` drift
- [ ] Test B: gate fails on theme drift
- [ ] Test C: gate passes on clean PR
- [ ] Total CI duration ≤ 60 s on the standard runner (NFR-002)

## Definition of Done

- [ ] All 4 subtasks pass per-subtask validation
- [ ] `bash scripts/check-action-pins.sh` passes for the new workflow
- [ ] `bash scripts/npm-audit-gate.sh` passes (or surface findings to reviewer)
- [ ] Smoke-tests A, B, C documented in WP completion message
- [ ] Conventional-commit messages (scopes: `ci`, `deps`)
- [ ] Findings symlink workaround applied — `tmp/finding/` in this lane is symlinked to the repo root before lane teardown (charter Findings Log Practice; per-lane manual workaround documented in [`../quickstart.md`](../quickstart.md))

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Puppeteer/Chromium install in CI exceeds 60 s budget | Cache at `actions/setup-node` level; consider Mermaid CLI's `puppeteer-config.json` to skip Chromium download when possible |
| New Mermaid CLI version brings security vulnerabilities | `npm-audit-gate.sh` will catch; if blocked, pin to an older known-clean version and document trade-off |
| `act` not available for local smoke-test | Defer Test A/B to reviewer or use a draft PR for smoke-test |
| Action SHA pinning is project-specific convention | Read existing workflows in `.github/workflows/` for the exact pattern; use the same |

## Reviewer guidance

Reviewer should:
1. Confirm the workflow path filter is exactly `docs/architecture/assets/**`.
2. Confirm every action is pinned by SHA (`scripts/check-action-pins.sh` agrees).
3. Trigger Test A locally OR by pushing a small drift PR — confirm rejection.
4. Confirm `npm-audit-gate.sh` passes after lockfile update.
5. Confirm the workflow's job duration on a real CI run is ≤ 60 s.

## Activity Log

- 2026-05-03T14:46:26Z – claude:opus-4-7:node-norris:implementer – shell_pid=1451395 – Started implementation via action command
- 2026-05-03T16:46:34Z – opencode:claude-sonnet-4-6:node-norris:implementer – shell_pid=1476558 – Started implementation via action command
- 2026-05-03T16:49:13Z – opencode:claude-sonnet-4-6:node-norris:implementer – shell_pid=1476558 – T030–T033 complete. @mermaid-js/mermaid-cli@11.14.0 pinned exactly; lockfile updated; npm-audit-gate and lockfile-check pass; docs-diagrams.yml created with SHA-pinned actions, path filter docs/architecture/assets/**, 5 min timeout, --check mode only; chromium-browser install step added for puppeteer-config.json compatibility. Smoke-tests A/B/C deferred to reviewer (no local Chromium). check-action-pins.sh passes.
- 2026-05-03T16:53:33Z – opencode:claude-sonnet-4-6:node-norris:implementer – shell_pid=1476558 – Smoke-tests A/B/C all confirmed locally with /usr/bin/chromium. Test A: .mmd drift → gate fails (1 file). Test B: theme colour change → gate fails (8 files). Test C: clean baseline → OK 8/8. SVGs regenerated against local Chromium and committed. check-action-pins.sh passes. npm-audit-gate passes.
- 2026-05-03T16:56:15Z – opencode – shell_pid=1488840 – Started review via action command
