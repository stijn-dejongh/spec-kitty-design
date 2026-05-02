---
work_package_id: WP01
title: Token Value Reconciliation
dependencies: []
requirement_refs:
- FR-101
- FR-104
- FR-121
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-design-system-reference-migration-01KQJNTP
base_commit: 96eb36e5137032ca7fc503ebda1468cae2cd1dda
created_at: '2026-05-02T05:55:00.873458+00:00'
subtasks:
- T001
- T002
- T003
- T004
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "1534973"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/tokens/src/tokens.css
execution_mode: code_change
owned_files:
- packages/tokens/src/tokens.css
- packages/tokens/dist/token-catalogue.json
- packages/tokens/project.json
- docs/architecture/decisions/ADR-003-addendum-token-values.md
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Produce the final canonical `packages/tokens/src/tokens.css` by reconciling the Claude Design reference values with the ADR-003 naming schema, adding missing token categories, and completing the ADR-003 addendum document. This WP is the gate that all component WPs depend on — token values must be final before any component CSS is written.

## Context

- **Reference file**: `tmp/Spec Kitty Design System(1)/colors_and_type.css` (382 lines — the authoritative token source)
- **Current tokens.css**: `packages/tokens/src/tokens.css` — uses ADR-003 naming (`--sk-color-yellow`) but has bootstrap approximation values; missing several token categories
- **Naming mismatch**: Reference uses flat naming (`--sk-yellow`, `--sk-fg-0`, `--sk-bg-0`) while ADR-003 requires `--sk-<category>-<name>`. The reconciliation maps reference values TO our naming schema — we keep ADR-003 names, update actual hex values.
- **Missing categories in current tokens.css**: soft/deep colour variants, accent colours, pill background, section tint backgrounds, additional foreground shades, extended font families (Boldplus, Condensed, Extended, Outline)

## Subtask Guidance

### T001 — Audit discrepancies

Read `tmp/Spec\ Kitty\ Design\ System\(1\)/colors_and_type.css` and compare against the current `packages/tokens/src/tokens.css`.

Produce a mapping table (document this in the addendum). Key mappings needed:

| Reference name | ADR-003 name | Reference value | Notes |
|---|---|---|---|
| `--sk-yellow` | `--sk-color-yellow` | `#F5C518` | already correct |
| `--sk-yellow-soft` | `--sk-color-yellow-soft` | `#FFD84D` | MISSING in current |
| `--sk-yellow-deep` | `--sk-color-yellow-deep` | `#C99A0E` | MISSING |
| `--sk-fg-0` | `--sk-fg-default` | value from ref | map to closest |
| `--sk-bg-0` | `--sk-surface-page` | `#0A0A0B` | verify matches |
| `--sk-bg-pill` | `--sk-bg-pill` | from ref | keep as-is (single segment OK) |
| `--sk-accent` | `--sk-color-accent` | from ref | ADD |
| etc. | | | |

Look for all token categories in the reference:
- `--sk-yellow*`, `--sk-haygold*`, `--sk-blue*`, `--sk-purple*`, `--sk-green*`, `--sk-red*` (brand colours + variants)
- `--sk-fg-*` (foreground shades 0–4 + subtle)
- `--sk-bg-*` (surface/background layers 0–3 + muted + pill)
- `--sk-border`, `--sk-bw-*` (borders and border widths)
- `--sk-accent*` (accent colours for interactive states)
- `--sk-dur-*`, `--sk-ease-*` (motion — map to `--sk-motion-*`)
- `--sk-font-*` (font families including boldplus, condensed, extended, outline)

### T002 — Update `tokens.css`

Rewrite `packages/tokens/src/tokens.css` to:
1. Update all existing token values to match the reference (same ADR-003 names, new canonical hex values)
2. Add missing token categories identified in T001
3. Do NOT add `@font-face` declarations yet — that is WP02
4. Maintain the category comment structure from the current file
5. After updating, run `wc -c packages/tokens/src/tokens.css` — must remain < 20 KB (NFR-004)

**Critical**: Token names MUST remain in ADR-003 `--sk-<category>-<name>` format. Do not copy the flat reference names.

For motion tokens, use our naming: `--sk-motion-duration-fast` not `--sk-dur-fast`.

**New tokens to add** (from reference, mapped to ADR-003):
```css
/* ── Colour variants ─────────────────────────────── */
--sk-color-yellow-soft:  #FFD84D;
--sk-color-yellow-deep:  #C99A0E;
--sk-color-blue-bg:      /* from --sk-blue-bg in ref */;
--sk-color-blue-deep:    /* from --sk-blue-deep in ref */;
/* ── Section tints ───────────────────────────────── */
--sk-surface-blue-tint:  /* from --sk-bg-muted in ref */;
--sk-surface-purple-tint:/* from purple section bg */;
--sk-surface-green-tint: /* from green "by the numbers" bg */;
/* ── Pill/chip background ────────────────────────── */
--sk-bg-pill:            /* from ref --sk-bg-pill */;
/* ── Foreground shades ───────────────────────────── */
--sk-fg-subtle:          /* from --sk-fg-subtle in ref */;
/* ── Accent ──────────────────────────────────────── */
--sk-color-accent:       /* from --sk-accent */;
--sk-color-accent-fg:    /* from --sk-accent-fg */;
/* ── Border widths ───────────────────────────────── */
--sk-border-width-1:     1px;
--sk-border-width-2:     2px;
```

### T003 — Regenerate catalogue and verify Stylelint

```bash
npm run tokens:catalogue
# Verify it exits 0 and catalogue reflects new tokens

npm run quality:stylelint
# Must exit 0 — no hardcoded values crept in
```

If Stylelint reports any violations in components (the stub component's CSS may reference tokens that were renamed), fix them before proceeding.

### T004 — Complete ADR-003 addendum

Update `docs/architecture/decisions/ADR-003-addendum-token-values.md`:
1. Fill in the full reconciliation table (all token categories, reference value → ADR-003 name mapping)
2. Record the OKLCH/hex decision: **hex is the chosen format** (already used in reference; simpler for contributors; browser support is universal for hex)
3. Document which tokens from the reference were renamed, which were added, and which were intentionally excluded
4. Mark the pre-implementation gate as complete

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `tokens.css` updated with canonical reference values under ADR-003 names
- [ ] Missing token categories from reference added with correct ADR-003 names
- [ ] No `@font-face` declarations yet (those come in WP02)
- [ ] `token-catalogue.json` regenerated and committed
- [ ] `npm run quality:stylelint` exits 0
- [ ] `wc -c packages/tokens/src/tokens.css` < 20480 bytes
- [ ] ADR-003 addendum completed with final reconciliation table and OKLCH/hex decision

## Risks

- The reference has `--sk-fg-0` through `--sk-fg-4` as numeric shades; our ADR-003 uses semantic names (`--sk-fg-default`, `--sk-fg-muted`). Map carefully — not all reference shade levels need to be separate tokens in ADR-003.
- Avoid breaking the existing Stylelint `declaration-strict-value` rule, which now reads the token catalogue. After regeneration, any component CSS referencing removed or renamed tokens will fail.

## Reviewer Guidance

Diff `token-catalogue.json` against the completed ADR-003 addendum — every token in the catalogue should have a corresponding row in the addendum. Check that no `@font-face` rules were accidentally included (those belong in WP02). Verify Stylelint passes on the stub component CSS.

## Activity Log

- 2026-05-02T05:58:40Z – claude – shell_pid=1512948 – Token values reconciled with colors_and_type.css; new categories added; ADR-003 addendum completed
- 2026-05-02T06:00:19Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1534973 – Started review via action command
- 2026-05-02T06:03:27Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1534973 – Review passed: tokens reconciled, ADR-003 schema maintained, addendum completed
