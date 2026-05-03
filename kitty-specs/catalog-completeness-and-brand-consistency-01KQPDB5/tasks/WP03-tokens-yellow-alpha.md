---
work_package_id: WP03
title: 'Tokens: yellow alpha bucket'
dependencies: []
requirement_refs:
- FR-012
planning_base_branch: feature/issue-18-catalog-and-diagram-pipeline
merge_target_branch: feature/issue-18-catalog-and-diagram-pipeline
branch_strategy: Planning artifacts for this feature were generated on feature/issue-18-catalog-and-diagram-pipeline. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/issue-18-catalog-and-diagram-pipeline unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-catalog-completeness-and-brand-consistency-01KQPDB5
base_commit: 9fd60cd389a77b5a5af50f7e113444aca158996c
created_at: '2026-05-03T08:57:40.027785+00:00'
subtasks:
- T013
- T014
- T015
- T016
agent: "claude:opus-4-7:designer-dagmar:reviewer"
shell_pid: "1372322"
history:
- timestamp: '2026-05-03T08:00:00Z'
  actor: spec-kitty.tasks
  action: created
agent_profile: designer-dagmar
authoritative_surface: packages/tokens/
execution_mode: code_change
model: claude-sonnet-4-6
owned_files:
- packages/tokens/src/tokens.css
- packages/tokens/dist/token-catalogue.json
- docs/contributing/adding-a-token.md
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else in this prompt, load your assigned agent profile:

```
/ad-hoc-profile-load designer-dagmar
```

This is a token-governance WP — designer-dagmar's specialization in design-system asset stewardship is the right fit. Internalize the profile's identity, specialization, and collaboration contract. If the profile cannot be loaded, fall back to reading the YAML directly and log the gap to `tmp/finding/`.

## Objective

Add three additive yellow-alpha tokens to the token catalogue per [`../research.md` PLAN-001](../research.md):

```css
--sk-color-yellow-alpha-15: rgba(245, 197, 24, 0.14);
--sk-color-yellow-alpha-35: rgba(245, 197, 24, 0.35);
--sk-color-yellow-alpha-60: rgba(245, 197, 24, 0.60);
```

These tokens are **prerequisites for WP04** (which retires the residual `rgba()` literals in nav-pill CSS). This WP does not modify any consumer.

In scope: `packages/tokens/src/tokens.css`, the regenerated catalogue, and (only if a new prefix is introduced — likely no-op) `docs/contributing/adding-a-token.md`.

NOT in scope:
- Updating consumers (WP04 owns nav-pill replacement)
- Adding alpha tokens for green/purple (out of mission scope; would close additional `rgba()` debt in feature-card/card — surface as analyze finding)
- Migration to `oklch(from …)` or `color-mix()` (explicitly deferred per spec Out of Scope)

## Branch Strategy

- **Planning/base branch**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Final merge target**: same
- **Lane worktree**: created automatically. Findings symlink workaround per [`../quickstart.md`](../quickstart.md).

## Context

Read first:

- [`../spec.md`](../spec.md) — C-001, C-008, C-011; SC-002
- [`../research.md` PLAN-001](../research.md) — full rationale, alternatives considered, naming pattern
- Existing token file: `packages/tokens/src/tokens.css` — locate the existing `--sk-color-yellow` definition; the new tokens go adjacent to it
- Charter rule: "Token additions or renames require maintainer sign-off. One human approval required for any change to the --sk-* token namespace"

## Subtasks

### T013 — Add `--sk-color-yellow-alpha-{15,35,60}` to tokens.css

**Purpose**: introduce the three additive tokens.

**Steps**:
1. Open `packages/tokens/src/tokens.css`.
2. Locate the section containing `--sk-color-yellow` (likely the brand colours block).
3. Add three new declarations immediately after `--sk-color-yellow`, with a brief inline comment explaining intended use buckets:
   ```css
   /* Yellow alpha buckets — see PLAN-001 for naming rationale.
      Suffix is the rounded percent of the alpha channel. */
   --sk-color-yellow-alpha-15: rgba(245, 197, 24, 0.14);
   --sk-color-yellow-alpha-35: rgba(245, 197, 24, 0.35);
   --sk-color-yellow-alpha-60: rgba(245, 197, 24, 0.60);
   ```
4. Do NOT modify any other tokens.

**Files**: `packages/tokens/src/tokens.css`

**Validation**:
- [ ] Three new tokens present
- [ ] Existing tokens untouched
- [ ] File parses (CSS is well-formed)
- [ ] Comment references PLAN-001

### T014 — Regenerate token catalogue

**Purpose**: regenerate `packages/tokens/dist/token-catalogue.json` so stylelint's strict-value rule recognizes the new tokens.

**Steps**:
1. From repo root, run:
   ```bash
   npx nx run tokens:catalogue
   ```
2. Verify `packages/tokens/dist/token-catalogue.json` now contains entries for the three new tokens (search for `yellow-alpha-15`, `-35`, `-60`).
3. Stage both `tokens.css` and the regenerated catalogue for the same commit (per C-008).

**Files**: `packages/tokens/dist/token-catalogue.json`

**Validation**:
- [ ] Catalogue regenerated successfully
- [ ] Three new entries present in the JSON
- [ ] Both `tokens.css` and `token-catalogue.json` will be in the same commit

### T015 — Verify stylelint accepts the new tokens

**Purpose**: confirm the regenerated catalogue is correctly loaded by stylelint and the new tokens are recognized as valid values.

**Steps**:
1. Create a temporary `tmp/lint-probe.css` with a single declaration using one of the new tokens:
   ```css
   .probe { background: var(--sk-color-yellow-alpha-15); }
   ```
2. Run stylelint against this file to confirm it doesn't report a strict-value violation:
   ```bash
   npx stylelint tmp/lint-probe.css
   ```
3. If clean, delete the probe file. If stylelint complains, check that the catalogue regenerated properly and the strict-value config includes the new tokens.
4. Run the full repo lint (`npm run quality:stylelint`) to confirm no regression elsewhere.

**Files**: none changed by this subtask (probe file is temporary).

**Validation**:
- [ ] Probe lint passes (new tokens recognized)
- [ ] Full repo stylelint passes (no regression)

### T016 — Update `docs/contributing/adding-a-token.md` if a new prefix is introduced

**Purpose**: keep the token-addition contributor doc current per C-011.

**Steps**:
1. Read `docs/contributing/adding-a-token.md`.
2. Determine if `--sk-color-yellow-alpha-*` constitutes a "new prefix". Likely answer: **no** — the prefix is the existing `--sk-color-*` family; only the suffix pattern (`-yellow-alpha-NN`) is new.
3. If no new prefix: this subtask is a no-op. Briefly note in the WP completion message: "T016: no-op — `--sk-color-yellow-alpha-*` is part of the existing `--sk-color-*` family".
4. If a new prefix has been introduced (e.g., a maintainer decides to retroactively rename to `--sk-alpha-yellow-*`): update the doc to list the new prefix, its naming convention, and its intended use.

**Files**: `docs/contributing/adding-a-token.md` (only if changed)

**Validation**:
- [ ] Determination made and documented in WP completion message
- [ ] Doc updated only if needed

## Definition of Done

- [ ] All four subtasks complete or explicitly no-op'd with rationale
- [ ] `tokens.css` and `token-catalogue.json` committed together (one commit, conventional-commits scope `tokens`)
- [ ] `npm run quality:stylelint` passes
- [ ] `npm run quality:all` passes
- [ ] No files outside `owned_files` modified
- [ ] WP completion message lists the three new token names so WP04 can reference them
- [ ] Findings symlink workaround applied — `tmp/finding/` in this lane is symlinked to the repo root before lane teardown (charter Findings Log Practice; per-lane manual workaround documented in [`../quickstart.md`](../quickstart.md))

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Token catalogue regen fails (Nx cache or build issue) | Run `nx reset` and retry; if persistent, log finding to `tmp/finding/` |
| Charter requires maintainer sign-off for token additions | This WP does the technical work; reviewer is expected to be a maintainer (or escalate) per charter Review Policy |
| Stylelint strict-value rule expects an exact token-catalogue format | Cross-check the existing catalogue entries — match their shape exactly |

## Reviewer guidance

Reviewer (must be a maintainer per charter):
1. Confirm the three token names match the PLAN-001 spec exactly (`--sk-color-yellow-alpha-{15,35,60}`).
2. Confirm `tokens.css` and `token-catalogue.json` are in the same commit.
3. Confirm no consumer was changed (WP04 owns that).
4. Confirm `npm run quality:all` passes.
5. Per charter Review Policy: this token addition is additive (no rename, no removal) — does NOT trigger a major version bump.

## Activity Log

- 2026-05-03T08:57:41Z – claude:sonnet-4-6:designer-dagmar:implementer – shell_pid=1294993 – Assigned agent via action command
- 2026-05-03T13:49:19Z – codex:gpt-5:designer-dagmar:implementer – shell_pid=1294993 – Ready for review: added --sk-color-yellow-alpha-15, --sk-color-yellow-alpha-35, --sk-color-yellow-alpha-60; regenerated token catalogue; T016 no-op because these remain under existing --sk-color-* prefix; stylelint and quality:all passed.
- 2026-05-03T14:18:56Z – claude:opus-4-7:designer-dagmar:reviewer – shell_pid=1372322 – Started review via action command
