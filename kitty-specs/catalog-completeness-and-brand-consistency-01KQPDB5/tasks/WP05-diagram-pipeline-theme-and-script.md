---
work_package_id: WP05
title: 'Diagram pipeline: theme source + render script'
dependencies: []
requirement_refs:
- FR-013
- FR-016
planning_base_branch: feature/issue-18-catalog-and-diagram-pipeline
merge_target_branch: feature/issue-18-catalog-and-diagram-pipeline
branch_strategy: Lane worktree under .worktrees/<slug>-<mid8>-lane-<id>/, branched from planning_base_branch, merging back to merge_target_branch.
subtasks:
- T025
- T026
- T027
- T028
- T029
agent: claude
history:
- timestamp: '2026-05-03T08:00:00Z'
  actor: spec-kitty.tasks
  action: created
agent_profile: node-norris
authoritative_surface: docs/architecture/assets/
execution_mode: code_change
model: claude-sonnet-4-6
owned_files:
- docs/architecture/assets/**
- scripts/render-diagrams.js
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else in this prompt, load your assigned agent profile:

```
/ad-hoc-profile-load node-norris
```

This is a Node-script + Mermaid CLI WP — node-norris's specialization is the right fit. Internalize the profile's identity, specialization, and collaboration contract. If the profile cannot be loaded, fall back to reading the YAML directly and log the gap to `tmp/finding/`.

## Objective

Close issue #2 (part 1): introduce a single shared brand-theme source for Mermaid architecture diagrams, plus a Node render script that injects the theme into each `.mmd` file, renders SVGs via `mmdc`, and supports a `--check` mode for CI drift detection.

In scope: `docs/architecture/assets/**` (theme YAML, all 8 `.mmd` sources, all 8 `.svg` outputs, and a workflow README) and `scripts/render-diagrams.js`.

NOT in scope: the CI workflow YAML (WP06 owns that), pinning Mermaid CLI in package.json (WP06).

## Branch Strategy

- **Planning/base branch**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Final merge target**: same
- **Lane worktree**: created automatically. Findings symlink workaround per [`../quickstart.md`](../quickstart.md).

## Context

Read first:

- [`../spec.md`](../spec.md) — FR-013, FR-014 (read for context only — WP06 enforces), FR-016
- [`../research.md` PLAN-004](../research.md) — Node script choice rationale; mmdc invocation pattern
- [`../contracts/brand-theme-source.md`](../contracts/brand-theme-source.md) — schema and `%%THEME%%` injection contract
- [`../contracts/diagram-pipeline-ci-gate.md`](../contracts/diagram-pipeline-ci-gate.md) — what `--check` mode must do (WP06 will exercise)
- Existing diagrams: `docs/architecture/assets/*.mmd` (8 files); current inline `%%{init}%%` blocks are the source of truth for the YAML's initial values.
- Existing config: `docs/architecture/assets/puppeteer-config.json` (used by `mmdc`).

## Subtasks

### T025 — Create `sk-mermaid-theme.yaml` from current inline themes

**Purpose**: extract the canonical brand theme into a single source file.

**Steps**:
1. Read each of the 8 existing `*.mmd` files under `docs/architecture/assets/`. Locate the inline `%%{init: {…}}%%` block in each.
2. Confirm all 8 use the **same** themeVariables (they should — that's the existing pattern). If any diverge, treat the divergence as a finding and surface to the reviewer; default to the most-common value set.
3. Create `docs/architecture/assets/sk-mermaid-theme.yaml` with the schema shown in [`../contracts/brand-theme-source.md`](../contracts/brand-theme-source.md). Use the values found in step 1. Include a comment header pointing to the contract and to `tokens.css` as the upstream brand source.

**Files**: `docs/architecture/assets/sk-mermaid-theme.yaml` (new, ~25 lines)

**Validation**:
- [ ] YAML is well-formed (`node -e "require('js-yaml').load(require('fs').readFileSync('docs/architecture/assets/sk-mermaid-theme.yaml','utf8'))"` succeeds — once `js-yaml` is available)
- [ ] All current Mermaid theme variables represented
- [ ] Comment header present

### T026 — Create `scripts/render-diagrams.js`

**Purpose**: implement the render + check tool per the contracts.

**Steps**:
1. Create `scripts/render-diagrams.js`. Top-level structure:
   ```js
   #!/usr/bin/env node
   // node scripts/render-diagrams.js [--check]
   //
   // Render mode (no flag): replaces %%THEME%% with the inline %%{init}%% block
   //   built from sk-mermaid-theme.yaml; renders each *.mmd to *.svg via mmdc.
   // Check mode (--check): renders to a temp dir; byte-compares against committed SVGs;
   //   exits non-zero with a per-file diff summary on first mismatch.
   ```
2. Implement:
   - YAML parse via `js-yaml` (or another small dependency already present in repo).
   - File walk: `docs/architecture/assets/*.mmd`.
   - Theme injection: replace exactly one `%%THEME%%` line with `%%{init: <JSON>}%%`. Validate that every source file contains exactly one `%%THEME%%` and zero inline `%%{init}%%` blocks. If invalid, fail with clear stderr.
   - Compile to temp file under `tmp/diagrams/<basename>.compiled.mmd`.
   - Invoke `mmdc -p docs/architecture/assets/puppeteer-config.json -i <temp> -o <output>`.
   - In render mode: write SVG alongside source. In check mode: write SVG to temp, compare bytes against committed SVG, accumulate diffs, exit non-zero on first mismatch (or print all mismatches and exit non-zero — implementer's choice).
   - Cleanup temp files on exit.
3. Add a `package.json` `scripts` entry: `"render-diagrams": "node scripts/render-diagrams.js"` and `"render-diagrams:check": "node scripts/render-diagrams.js --check"`. (NOTE: editing `package.json` is in WP06's scope. Either (a) create the script file but do not edit `package.json` here — leave that to WP06, or (b) add a tiny coordination note and let WP06 add the entries. Recommend option a.)

**Files**: `scripts/render-diagrams.js` (new, ~150 lines)

**Validation**:
- [ ] Script is executable (`chmod +x` not required since invoked via `node`)
- [ ] Render mode regenerates SVGs without error (will be exercised in T028)
- [ ] Check mode passes when SVGs are in sync; fails with clear diagnostic when not
- [ ] Validation rejects malformed sources (missing `%%THEME%%`, present inline `%%{init}%%`)
- [ ] No CI-only flags or env-var dependencies (FR-016)

### T027 [P] — Migrate every `*.mmd` file to use `%%THEME%%` placeholder

**Purpose**: source files become diff-friendly — only structural changes appear in PRs, not theme boilerplate.

**Steps**:
1. For each of the 8 `*.mmd` files in `docs/architecture/assets/`:
   - Delete the inline `%%{init: {…}}%%` block at the top.
   - Insert `%%THEME%%` on its own line, followed by a blank line, before the rest of the diagram content.
2. Resulting file structure:
   ```mermaid
   %%THEME%%

   flowchart TB
       …diagram body…
   ```
3. Do NOT touch the `.svg` files in this subtask — T028 regenerates them all.

**Files**: 8 × `docs/architecture/assets/*.mmd`

**Validation**:
- [ ] Every `.mmd` file contains exactly one `%%THEME%%` line
- [ ] No `%%{init}%%` blocks remain in any `.mmd` file
- [ ] PR diff for the source files shows ONLY the theme-block deletion + `%%THEME%%` addition (no structural changes)

### T028 — Regenerate every `*.svg` via the new script and commit

**Purpose**: produce the canonical rendered output for each migrated source.

**Steps**:
1. Ensure `mmdc` is available locally. If not, install it temporarily for this subtask:
   ```bash
   npx --yes @mermaid-js/mermaid-cli --version
   ```
   (WP06 will pin the version in `package.json` formally.)
2. From repo root, run:
   ```bash
   node scripts/render-diagrams.js
   ```
3. Verify all 8 SVGs were regenerated. Diff against the previous SVGs — there will be **byte-level differences** because the inline JSON theme block format may differ slightly from the original YAML-derived format. Visual content should be effectively identical.
4. Commit all 8 regenerated SVGs in a single commit alongside the source-file migrations from T027.

**Files**: 8 × `docs/architecture/assets/*.svg`

**Validation**:
- [ ] All 8 SVGs regenerated successfully
- [ ] `node scripts/render-diagrams.js --check` passes after commit
- [ ] Visual content of each diagram is unchanged (manual review of rendered SVGs)

### T029 — Add `docs/architecture/assets/README.md` with workflow instructions

**Purpose**: contributors landing in `docs/architecture/assets/` see how to update diagrams correctly.

**Steps**:
1. Create `docs/architecture/assets/README.md` covering:
   - The `%%THEME%%` source-file invariant (NEVER add inline `%%{init}%%` blocks)
   - How to regenerate after editing a `.mmd`: `node scripts/render-diagrams.js`
   - How to verify before pushing: `node scripts/render-diagrams.js --check`
   - The brand-theme source file location and how to modify it
   - The CI gate behaviour (forward-reference WP06's workflow)
2. Keep it short (≤ 80 lines) — this is a directory-level quick reference, not a full doc.

**Files**: `docs/architecture/assets/README.md` (new, ~60 lines)

**Validation**:
- [ ] Workflow instructions present for both render and check modes
- [ ] Source-file invariant documented (NEVER inline `%%{init}%%`)
- [ ] Brand-theme source location named explicitly

## Definition of Done

- [ ] All 5 subtasks pass per-subtask validation
- [ ] `node scripts/render-diagrams.js --check` passes from a clean checkout
- [ ] All 8 `.mmd` files use `%%THEME%%`; all 8 `.svg` files are regenerated
- [ ] `sk-mermaid-theme.yaml` exists and validates
- [ ] README documents the workflow
- [ ] Conventional-commit messages (scopes: `docs`, possibly `ci` for the script)

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| `mmdc` rendering produces non-deterministic SVG output (e.g., timestamp comments) | Use `--quiet` flag; if non-determinism persists, surface as a finding — may need a small post-processor to strip volatile comments |
| The 8 existing files use slightly different themeVariables | Default to the most-common set; flag divergences in the WP completion message |
| `puppeteer-config.json` triggers Chromium download in CI (WP06's concern) | Note explicitly to WP06; document the dependency in `docs/architecture/assets/README.md` |
| Some `.mmd` files have content the script doesn't handle (e.g., gantt vs flowchart vs sequence) | Test each file; if a file fails, surface as finding — the script must handle all current diagram types |

## Reviewer guidance

Reviewer should:
1. Run `node scripts/render-diagrams.js --check` from a clean checkout — must pass.
2. Verify each `.mmd` source file shows ONLY the `%%THEME%%` migration in its diff (no structural changes).
3. Open each rendered SVG visually and confirm the brand looks correct (yellow border, dark background, etc.).
4. Read `sk-mermaid-theme.yaml` and confirm values match the upstream brand tokens.
5. Read the new `README.md` and confirm a fresh contributor could follow the workflow.
