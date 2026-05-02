---
work_package_id: WP04
title: Demo CSS Fixes — Done-lane Opacity and Blog Header Surface
dependencies:
- WP03
requirement_refs:
- FR-008
- FR-013
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: WP04 executes after WP03 is approved (shared file ownership on demo HTML). Work in the lane worktree allocated by spec-kitty.
subtasks:
- T012
- T013
- T014
agent: claude
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
agent_profile: implementer-ivan
authoritative_surface: apps/demo/
execution_mode: code_change
owned_files:
- apps/demo/dashboard-demo.html
- apps/demo/blog-demo.html
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Fix two fragile CSS patterns in the demo pages:
1. Replace the `opacity: 0.6` cascade on the Done-lane header in `dashboard-demo.html` with explicit colour token values.
2. Change the blog-demo light-mode header background to match the dashboard header surface.

---

## Context

**Done-lane opacity (DEF-06):** `.dash-lane__header--done` applies `opacity: 0.6` to the entire element, then `.dash-lane__count` overrides with `opacity: 1`. This cascade breaks if any new child is added to the Done header without a matching opacity restore. The correct pattern is to apply muted colour via tokens directly on the text and dot elements.

**Blog header surface inconsistency:** In light mode, `blog-demo.html` sets `header { background: var(--sk-surface-hero) }` while `dashboard-demo.html` uses `--sk-surface-card` for its header. A contributor switching between the two demos sees inconsistent surface treatment. The fix is a one-line token swap.

**Dependency on WP03:** WP04 depends on WP03 because WP03 also edits these same HTML files (JS module import). WP04 must apply on top of WP03's changes — ensure your worktree is branched from the approved WP03 lane, not from the base branch.

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Depends on: WP03 (approved)
Your worktree is allocated by `spec-kitty agent action implement WP04`.

---

## Subtask Guidance

### T012 — Replace Done-lane `opacity: 0.6` with colour tokens

**Purpose:** Eliminate the fragile opacity cascade on the Done lane header.

**File:** `apps/demo/dashboard-demo.html`

**Find this CSS block** (inside the `<style>` tag, around line 292):
```css
.dash-lane__header--done {
  background: var(--sk-surface-card);
  opacity: 0.6;
}
```

**Replace with:**
```css
.dash-lane__header--done {
  background: var(--sk-surface-card);
  color: var(--sk-fg-muted);
}
.dash-lane__header--done .dash-lane__dot {
  background: var(--sk-fg-subtle);
}
```

This gives the same visual effect (muted text, subtle dot) without the opacity cascade.

**Visual result:** The Done lane header text and dot appear muted/faded. The count badge retains normal contrast since it now inherits `--sk-fg-muted` text colour directly rather than being opacity-faded.

---

### T013 — Remove the `.dash-lane__count { opacity: 1 }` override

**Purpose:** Remove the child opacity override that was only needed to counteract the parent `opacity: 0.6`.

**File:** `apps/demo/dashboard-demo.html`

**Find and remove this rule** (around line 309):
```css
.dash-lane__count {
  opacity: 1; /* ensure count stays visible inside faded Done header */
}
```

If `.dash-lane__count` has other CSS properties besides `opacity: 1`, only remove the `opacity: 1` line and its comment; leave the rest intact.

**Validate:** After T012 + T013, the Done lane count badge should still be clearly readable at full contrast.

---

### T014 — Align blog-demo light-mode header surface

**Purpose:** Change the blog header background in light mode from `--sk-surface-hero` to `--sk-surface-card`.

**File:** `apps/demo/blog-demo.html`

**Find this CSS block** (inside the `<style>` tag, around line 165):
```css
[data-theme="light"] header,
[data-theme="light"] .demo-hero-section,
[data-theme="light"] .demo-posts-section {
  background: var(--sk-surface-hero);
}
```

**Change to:**
```css
[data-theme="light"] header {
  background: var(--sk-surface-card);
}
[data-theme="light"] .demo-hero-section,
[data-theme="light"] .demo-posts-section {
  background: var(--sk-surface-hero);
}
```

Split the rule so `header` gets `--sk-surface-card` while the hero and posts sections keep `--sk-surface-hero`. This matches the dashboard demo's `.dash-header { background: var(--sk-surface-card) }` treatment.

**Validate:** Switch `blog-demo.html` to light mode (append `?theme=light` to URL or click the toggle) and confirm the header now appears with the same surface shade as the `dashboard-demo.html` header in light mode.

---

## Definition of Done

- [ ] `.dash-lane__header--done` in `dashboard-demo.html` uses `color: var(--sk-fg-muted)` and has no `opacity` property
- [ ] `.dash-lane__header--done .dash-lane__dot` in `dashboard-demo.html` uses `background: var(--sk-fg-subtle)`
- [ ] The `.dash-lane__count { opacity: 1 }` rule is removed from `dashboard-demo.html`
- [ ] `[data-theme="light"] header` in `blog-demo.html` uses `var(--sk-surface-card)` (not `--sk-surface-hero`)
- [ ] Blog demo header background in light mode visually matches dashboard demo header

---

## Reviewer Guidance

- `grep -n "opacity" apps/demo/dashboard-demo.html` — should return zero hits in the Done-lane block
- Switch both demo pages to light mode and compare header backgrounds — they should match
- Confirm Done-lane header text is readable (muted, not invisible)
- Confirm count badge in Done lane is readable at full contrast (no opacity applied)
