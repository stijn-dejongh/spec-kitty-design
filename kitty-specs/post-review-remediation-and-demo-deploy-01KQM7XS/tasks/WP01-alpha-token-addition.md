---
work_package_id: WP01
title: Alpha Token Addition — Yellow Channel Tokens
dependencies: []
requirement_refs:
- FR-001
- FR-002
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: Planning artifacts for this feature were generated on feature/post-review-remediation-and-demo-deploy. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/post-review-remediation-and-demo-deploy unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-post-review-remediation-and-demo-deploy-01KQM7XS
base_commit: f2d2799f2807c533ff4fd098da567074b351165b
created_at: '2026-05-02T12:38:34.032846+00:00'
subtasks:
- T001
- T002
- T003
agent: "claude:sonnet-4-6:reviewer:reviewer"
shell_pid: "904045"
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
agent_profile: implementer-ivan
authoritative_surface: packages/tokens/src/
execution_mode: code_change
owned_files:
- packages/tokens/src/tokens.css
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else, load the implementer profile:

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Add three named alpha-channel tokens for the yellow brand colour to `packages/tokens/src/tokens.css`, then update the single CSS rule in `packages/html-js/src/nav-pill/sk-nav-pill.css` that contains hardcoded `rgba(245, 197, 24, …)` channel literals to use the new tokens. This resolves a C-202 token-compliance violation (DEF-01 from the post-implementation audit).

---

## Context

ADR-001 mandates that `@spec-kitty/tokens` is the single authoritative source for all design values. The `.sk-nav-pill__hamburger:hover` rule currently contains three raw `rgba()` calls with hardcoded channels derived from `--sk-color-yellow` (`#F5C518`, channels: 245, 197, 24). If the brand yellow ever changes, these values will silently diverge. Adding named tokens eliminates that coupling.

**The three violations to fix (lines 118–125 of `sk-nav-pill.css`):**
```css
background: rgba(245, 197, 24, 0.14);
box-shadow:
  0 0 0 1px rgba(245, 197, 24, 0.35),
  0 6px 22px -4px rgba(245, 197, 24, 0.60);
```

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Merge target: `feature/post-review-remediation-and-demo-deploy`
Your worktree is allocated by `spec-kitty agent action implement WP01`. Work only within that worktree.

---

## Subtask Guidance

### T001 — Add alpha tokens to `packages/tokens/src/tokens.css`

**Purpose:** Create three new `--sk-color-yellow-alpha-*` custom properties in the token catalogue.

**Location:** In `packages/tokens/src/tokens.css`, find the colour section where `--sk-color-yellow` is defined. Add the three alpha tokens immediately after it, inside the `:root` block.

**Values to add:**
```css
--sk-color-yellow-alpha-15: rgba(245, 197, 24, 0.14);
--sk-color-yellow-alpha-35: rgba(245, 197, 24, 0.35);
--sk-color-yellow-alpha-60: rgba(245, 197, 24, 0.60);
```

**Naming rationale:** The suffix represents the percentage opacity (15%, 35%, 60%) for human readability; the exact `rgba()` alpha values (0.14, 0.35, 0.60) match the original hardcoded values precisely. Do not round or change the alpha values.

**Add a comment above the block:**
```css
/* Yellow alpha variants — used for hover accents and glow effects */
```

**Validation:** After adding, grep tokens.css for `--sk-color-yellow-alpha` and confirm all three are present.

---

### T002 — Update `sk-nav-pill.css` hover rule

**Purpose:** Replace the three hardcoded `rgba()` calls with the new token references.

**File:** `packages/html-js/src/nav-pill/sk-nav-pill.css`

**Find this block** (around line 118):
```css
/* Deviation: rgba() channels derived from --sk-color-yellow (#F5C518).
   CSS relative colour syntax pending broad support. (See sk-card.css DRIFT-2 note.) */
.sk-nav-pill__hamburger:hover {
  color: var(--sk-color-yellow);
  background: rgba(245, 197, 24, 0.14);   /* from --sk-color-yellow at 14% */
  box-shadow:
    0 0 0 1px rgba(245, 197, 24, 0.35),   /* from --sk-color-yellow at 35% */
    0 6px 22px -4px rgba(245, 197, 24, 0.60);  /* from --sk-color-yellow at 60% */
  transform: translateY(-1px);
}
```

**Replace with:**
```css
.sk-nav-pill__hamburger:hover {
  color: var(--sk-color-yellow);
  background: var(--sk-color-yellow-alpha-15);
  box-shadow:
    0 0 0 1px var(--sk-color-yellow-alpha-35),
    0 6px 22px -4px var(--sk-color-yellow-alpha-60);
  transform: translateY(-1px);
}
```

**Also remove** the now-obsolete deviation comment block above the rule (the lines beginning with `/* Deviation: rgba() channels derived from...`). The C-202 violation is resolved; the deviation comment no longer applies.

**Validation:** After editing, grep `sk-nav-pill.css` for `rgba(245` — zero hits expected.

---

### T003 — Verify builds pass

**Purpose:** Confirm no regressions from the token and CSS changes.

**Run from the repo root:**
```bash
npx nx run tokens:build
```
Confirm zero errors. The build copies `tokens.css` to `packages/tokens/dist/tokens.css` — the new alpha tokens will be present in the dist output.

Then:
```bash
npx nx run html-js:build 2>&1 | head -30
```
Confirm zero errors.

If the build scripts are not available, verify that `packages/tokens/src/tokens.css` and `packages/html-js/src/nav-pill/sk-nav-pill.css` at least parse correctly by checking for obvious syntax errors (unmatched braces, missing semicolons).

---

## Definition of Done

- [ ] `packages/tokens/src/tokens.css` contains `--sk-color-yellow-alpha-15`, `--sk-color-yellow-alpha-35`, `--sk-color-yellow-alpha-60`
- [ ] `sk-nav-pill.css` `.sk-nav-pill__hamburger:hover` rule contains zero `rgba()` channel literals
- [ ] The old deviation comment is removed from `sk-nav-pill.css`
- [ ] `nx run tokens:build` exits 0
- [ ] `nx run html-js:build` exits 0 (or equivalent build check)
- [ ] **Charter sign-off**: Token namespace change (FR-001) flagged for maintainer approval per charter Review Policy — do not merge without one human approval on the PR.

---

## Reviewer Guidance

- Confirm the three alpha token values exactly match the original `rgba()` values (0.14, 0.35, 0.60) — do not accept rounding
- Confirm the tokens are in the `:root` block of `tokens.css`, not in a component file
- Confirm zero `rgba(245` hits remain in any `packages/html-js/` CSS file
- The visual output of `.sk-nav-pill__hamburger:hover` must be pixel-identical before and after (same colour, same glow)
- **Charter gate**: this WP adds to the `--sk-*` token namespace; one maintainer approval is required before the branch merges (charter Review Policy)

---

## Ownership Note (F3 — analysis finding)

`sk-nav-pill.css` is listed in WP02's `owned_files`, not WP01's. WP01 is permitted to make the T002 hover-rule change because WP02 depends on WP01 — WP01 commits first, then WP02 takes over the file for the CSS split. Scope of T002 is strictly limited to the `.sk-nav-pill__hamburger:hover` rule. Do not make any other edits to `sk-nav-pill.css` beyond replacing the three `rgba()` literals.

## Activity Log

- 2026-05-02T12:50:53Z – claude – shell_pid=894550 – Ready for review: alpha tokens added, nav-pill hover rule updated, deviation comment removed, builds verified clean (CSS syntax check passed; nx unavailable — no node_modules installed)
- 2026-05-02T12:51:08Z – claude:sonnet-4-6:reviewer:reviewer – shell_pid=904045 – Started review via action command
