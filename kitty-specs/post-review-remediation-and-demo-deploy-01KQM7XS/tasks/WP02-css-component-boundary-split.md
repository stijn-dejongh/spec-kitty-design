---
work_package_id: WP02
title: CSS Component Boundary Split — Extract sk-nav-pill-drawer.css
dependencies:
- WP01
requirement_refs:
- FR-003
- FR-004
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: Planning artifacts for this feature were generated on feature/post-review-remediation-and-demo-deploy. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/post-review-remediation-and-demo-deploy unless the human explicitly redirects the landing branch.
subtasks:
- T004
- T005
- T006-build
agent: "claude:sonnet-4-6:reviewer:reviewer"
shell_pid: "913483"
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
agent_profile: implementer-ivan
authoritative_surface: packages/html-js/src/nav-pill/
execution_mode: code_change
owned_files:
- packages/html-js/src/nav-pill/sk-nav-pill-drawer.css
- packages/html-js/src/nav-pill/sk-nav-pill.css
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Extract the hamburger button, drawer, and responsive breakpoint CSS from `packages/html-js/src/nav-pill/sk-nav-pill.css` into a new `sk-nav-pill-drawer.css` file in the same directory. Update the `CollapsedHamburger` Storybook story to import both files and document the two-file requirement.

---

## Context

`sk-nav-pill.css` is currently 175 lines. Lines 89–175 contain the collapse/hamburger/drawer extension — roughly 40% of the file and a distinct interaction pattern with its own JS dependency. Any consumer importing only `sk-nav-pill.css` currently receives drawer animation CSS they may never use.

**C-003 constraint:** After the split, `sk-nav-pill.css` must NOT import from `sk-nav-pill-drawer.css`. The split is a strict separation: consumers choose which file(s) to import.

**NFR-005:** The visual output must be pixel-equivalent before and after the split.

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Depends on: WP01 (approved)
Your worktree is allocated by `spec-kitty agent action implement WP02`.

---

## Subtask Guidance

### T004 — Create `sk-nav-pill-drawer.css`

**Purpose:** Create the new CSS file containing the extracted hamburger/drawer block.

**New file:** `packages/html-js/src/nav-pill/sk-nav-pill-drawer.css`

**Content to move:** Everything from line 89 (`/* ── Collapsed / hamburger button (mobile) */`) through line 175 (end of file) in `sk-nav-pill.css`.

**File header to add at the top of the new file:**
```css
/* @spec-kitty/html-js — sk-nav-pill-drawer: hamburger trigger + collapsible drawer */
/* Import this file IN ADDITION TO sk-nav-pill.css for responsive/collapsible nav behaviour. */
/* Requires: sk-nav-pill.css (base pill layout must be loaded first) */
/* JS dependency: skToggleDrawer() from sk-nav-pill.js must be wired to the hamburger button */
```

**After the header**, paste the extracted CSS block verbatim. The only change allowed is: the hover rule's `rgba()` calls should already be replaced with token references by WP01 — verify this before creating the file. If WP01 is not yet merged, coordinate with the orchestrator.

**Validate:** The new file should be approximately 88 lines (87 lines of CSS + 4-line header comment).

---

### T005 — Trim `sk-nav-pill.css`

**Purpose:** Remove the extracted block from the source file.

**Edit `packages/html-js/src/nav-pill/sk-nav-pill.css`:**
- Delete everything from line 89 (`/* ── Collapsed / hamburger button (mobile) */`) to end of file
- The file should end after the focus-outline rule block (around line 88):
  ```css
  .sk-nav-pill__item:focus-visible {
    outline: var(--sk-border-width-2) solid var(--sk-border-focus);
    outline-offset: 2px;
  }
  ```
- Do NOT add any `@import` or `@reference` to `sk-nav-pill-drawer.css` — the constraint C-003 forbids it

**Validate:** After trimming, `sk-nav-pill.css` should be approximately 88 lines and contain zero references to `__hamburger`, `__drawer`, `--has-drawer`, `--responsive`, or `@media (max-width: 720px)`.

```bash
grep -n "hamburger\|drawer\|responsive\|has-drawer\|720px" packages/html-js/src/nav-pill/sk-nav-pill.css
# Expected: zero output
```

---

### T006 — Update `CollapsedHamburger` story

**Purpose:** Wire the split CSS into the story and document the two-file import requirement.

**File:** `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts`

**Add the drawer CSS import** at the top of the file, after the existing `import './sk-nav-pill.css'`:
```ts
import './sk-nav-pill-drawer.css';
```

**Update `CollapsedHamburger` story parameters** — replace or add the `docs.description` entry:
```ts
export const CollapsedHamburger: Story = {
  name: 'Collapsed / Hamburger (responsive)',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Responsive nav pill that collapses to a hamburger at ≤ 720 px. ' +
          'Requires both `sk-nav-pill.css` (base) and `sk-nav-pill-drawer.css` (drawer extension). ' +
          'The drawer toggle also requires `skToggleDrawer` from `sk-nav-pill.js`. ' +
          'Drag the right edge of the sandbox to cross the breakpoint.',
      },
    },
  },
  render: () => `…`, // existing render unchanged
};
```

Keep all other stories and the existing `render` function of `CollapsedHamburger` unchanged.

**Validate:** `npx nx run storybook:build 2>&1 | grep -i error` — zero errors expected.

---

## Definition of Done

- [ ] `packages/html-js/src/nav-pill/sk-nav-pill-drawer.css` exists and contains the full hamburger/drawer/responsive block
- [ ] `packages/html-js/src/nav-pill/sk-nav-pill.css` contains zero hamburger, drawer, or responsive breakpoint CSS
- [ ] `sk-nav-pill.css` does NOT import `sk-nav-pill-drawer.css`
- [ ] `sk-nav-pill.stories.ts` imports both CSS files
- [ ] `CollapsedHamburger` story `parameters.docs.description` documents the two-file + JS requirement
- [ ] Storybook build passes without errors

---

## Reviewer Guidance

- Run `grep -n "hamburger\|drawer\|responsive\|720px" packages/html-js/src/nav-pill/sk-nav-pill.css` — must return zero results
- Confirm `sk-nav-pill.css` has no `@import` pointing to `sk-nav-pill-drawer.css`
- Open Storybook `CollapsedHamburger` story and verify the drawer still animates correctly
- Read the docs description in Storybook autodocs and confirm it mentions both CSS files and the JS dependency

## Activity Log

- 2026-05-02T12:57:17Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=912186 – Started implementation via action command
- 2026-05-02T12:59:38Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=912186 – Ready for review: extracted hamburger/drawer/responsive block to sk-nav-pill-drawer.css, trimmed sk-nav-pill.css to base styles only, updated CollapsedHamburger story with two-file import and updated docs description
- 2026-05-02T12:59:52Z – claude:sonnet-4-6:reviewer:reviewer – shell_pid=913483 – Started review via action command
- 2026-05-02T13:01:33Z – claude:sonnet-4-6:reviewer:reviewer – shell_pid=913483 – Review passed: all acceptance criteria met
