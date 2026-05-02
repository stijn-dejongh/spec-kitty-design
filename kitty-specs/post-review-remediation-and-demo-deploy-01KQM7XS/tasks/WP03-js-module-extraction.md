---
work_package_id: WP03
title: JS Module + Story Update + Demo Page Fixes
dependencies:
- WP01
- WP02
requirement_refs:
- FR-005
- FR-006
- FR-007
- FR-008
- FR-013
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: Planning artifacts for this feature were generated on feature/post-review-remediation-and-demo-deploy. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/post-review-remediation-and-demo-deploy unless the human explicitly redirects the landing branch.
subtasks:
- T007
- T008
- T009
- T010
- T011
- T012
- T013
- T014
agent: "claude:sonnet-4-6:reviewer:reviewer"
shell_pid: "915593"
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
- date: '2026-05-02'
  event: expanded
  note: Merged WP04 (demo CSS fixes) and absorbed T006 story update from WP02 into this WP to resolve file ownership conflicts
agent_profile: implementer-ivan
authoritative_surface: packages/html-js/src/nav-pill/
execution_mode: code_change
owned_files:
- packages/html-js/src/nav-pill/sk-nav-pill.js
- packages/html-js/src/nav-pill/index.ts
- packages/html-js/src/nav-pill/sk-nav-pill.stories.ts
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

Extract the `skToggleDrawer` function from the inline demo page script into a named ES module export at `packages/html-js/src/nav-pill/sk-nav-pill.js`. Re-export it from the package `index.ts`. Update the `CollapsedHamburger` Storybook story and both demo pages to import from the module, making the component self-contained and the drawer toggle exercisable in Storybook.

---

## Context

Currently `skToggleDrawer` is defined as `window.skToggleDrawer` inside an IIFE in `apps/demo/dashboard-demo.html` (lines 482–488). The function is duplicated in `blog-demo.html`. This means:
- The nav pill component is not self-contained — consumers must copy the script
- The `CollapsedHamburger` Storybook story cannot exercise the toggle
- C-002 constraint: no new `window.*` globals may be introduced

**Exact current implementation to extract (from `dashboard-demo.html`):**
```js
window.skToggleDrawer = function(btn) {
  var drawer = document.getElementById('sk-nav-drawer');
  if (!drawer) return;
  var isOpen = drawer.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
};
```

**Important:** `skToggleTheme` is a different function and stays in the demo pages — only `skToggleDrawer` moves.

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Depends on: WP01 (approved)
Your worktree is allocated by `spec-kitty agent action implement WP03`.

---

## Subtask Guidance

### T007 — Create `packages/html-js/src/nav-pill/sk-nav-pill.js`

**Purpose:** Create the new JS module with the exported toggle function.

**New file:** `packages/html-js/src/nav-pill/sk-nav-pill.js`

**Full file content:**
```js
/* @spec-kitty/html-js — sk-nav-pill toggle behaviour */

/**
 * Toggle the nav drawer open/closed.
 * Call from the hamburger button's onclick handler.
 * @param {HTMLElement} btn - the hamburger button element
 */
export function skToggleDrawer(btn) {
  const drawer = document.getElementById('sk-nav-drawer');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  btn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}
```

Use `const`/arrow functions if desired, but keep the logic identical to the original. Do not add `window.skToggleDrawer` assignment — the function is a named export only.

---

### T008 — Re-export from `packages/html-js/src/nav-pill/index.ts`

**Purpose:** Make `skToggleDrawer` part of the package's public API.

**File:** `packages/html-js/src/nav-pill/index.ts`

Add at the end of the file:
```ts
export { skToggleDrawer } from './sk-nav-pill.js';
```

If TypeScript raises an error about importing a `.js` module, use:
```ts
// @ts-expect-error — JS module, no types file required
export { skToggleDrawer } from './sk-nav-pill.js';
```

Or create a minimal `sk-nav-pill.d.ts` alongside the `.js` file:
```ts
export declare function skToggleDrawer(btn: HTMLElement): void;
```

Prefer the `.d.ts` approach as it gives type safety to consumers.

---

### T009 — Update `CollapsedHamburger` Storybook story

**Purpose:** Apply three distinct changes to `sk-nav-pill.stories.ts` — CSS drawer import, JS module import and use, and LightMode story. This task absorbs work originally split across WP02 (CSS import) and the story's LightMode variant.

**File:** `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts`

#### Step A — Add CSS and JS imports (top of file)

```ts
import './sk-nav-pill.css';
import './sk-nav-pill-drawer.css';   // ← NEW: drawer CSS (FR-003/FR-004)
import { skToggleDrawer } from './index';  // ← NEW: JS module (FR-005/FR-006)
```

#### Step B — Update `CollapsedHamburger` story parameters and docs

Replace the story's `parameters` block to add the two-file + JS dependency note:

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
  decorators: [
    (story) => {
      (window as any).__skToggleDrawer = skToggleDrawer;
      return story();
    },
  ],
  render: () => `…`, // existing render unchanged — update onclick to use window.__skToggleDrawer
};
```

In the render's hamburger button, change the onclick from the inline IIFE to:
```html
onclick="window.__skToggleDrawer && window.__skToggleDrawer(this)"
```

**Alternative**: if the decorator approach introduces complexity, keep the existing inline IIFE onclick — the goal is the module existing as a distributable and being imported; perfect story interactivity is a nice-to-have.

#### Step C — Add `LightMode` story

After the `CollapsedHamburger` story, add:

```ts
export const LightMode: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: (args) => {
    const items = args['items'] ?? [
      { label: 'Platform', href: '#' },
      { label: 'Getting Started', href: '#', active: true },
      { label: 'About', href: '#' },
    ];
    const itemsHtml = items.map((item: any) =>
      `<a href="${item.href}" class="sk-nav-pill__item${item.active ? ' sk-nav-pill__item--active' : ''}">${item.label}</a>`
    ).join('\n    ');
    return `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6);">
        <nav class="sk-nav-pill" aria-label="Primary navigation">
          <div class="sk-nav-pill__items">${itemsHtml}</div>
          <div class="sk-nav-pill__cta">
            <button class="sk-nav-pill__cta-btn" type="button">Book Demo</button>
          </div>
        </nav>
      </div>
    `;
  },
};
```

---

### T010 — Update `apps/demo/dashboard-demo.html`

**Purpose:** Remove the inline `skToggleDrawer` definition and import from the module.

**File:** `apps/demo/dashboard-demo.html`

**Find the IIFE script block** (lines 465–495 approx):
```html
<script>(function(){
  var p = new URLSearchParams(location.search).get('theme');
  ...
  window.skToggleDrawer = function(btn) {
    var drawer = document.getElementById('sk-nav-drawer');
    if (!drawer) return;
    var isOpen = drawer.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  };
})();</script>
```

**Changes:**
1. Remove the `window.skToggleDrawer = function(btn) { ... };` block from the IIFE (keep `skToggleTheme` intact)
2. Add a new `<script type="module">` tag immediately after the IIFE script block:

```html
<script type="module">
  import { skToggleDrawer } from '../../packages/html-js/src/nav-pill/sk-nav-pill.js';
  window.skToggleDrawer = skToggleDrawer;
</script>
```

**Why `window.skToggleDrawer = skToggleDrawer`:** The hamburger button uses `onclick="skToggleDrawer(this)"` as an inline attribute — inline handlers resolve against `window` scope. The module export must be re-attached to window for the inline handler to call it. This is acceptable per C-002 (no *new* globals introduced; this re-uses the existing global name with a module-sourced implementation).

**Validate:** Open `http://localhost:7778/apps/demo/dashboard-demo.html` (or equivalent), click the hamburger button at narrow viewport, and confirm the drawer opens/closes correctly.

---

### T011 — Update `apps/demo/blog-demo.html`

**Purpose:** Same extraction as T010 but for the blog demo.

**File:** `apps/demo/blog-demo.html`

Check if `blog-demo.html` contains a `skToggleDrawer` definition. If it does not have a hamburger menu, this task is a no-op — confirm and mark done.

If it does contain an inline `skToggleDrawer`, apply the same pattern as T010:
1. Remove the inline definition from the IIFE
2. Add a `<script type="module">` import tag

**Validate:** If the blog demo has a hamburger, verify toggle works. If not, confirm no regression.

---

## Definition of Done

- [ ] `packages/html-js/src/nav-pill/sk-nav-pill.js` exists with exported `skToggleDrawer`
- [ ] `packages/html-js/src/nav-pill/index.ts` exports `skToggleDrawer`
- [ ] `CollapsedHamburger` story drawer is interactive in Storybook
- [ ] `dashboard-demo.html` has no inline `skToggleDrawer` function definition; imports from the module
- [ ] `blog-demo.html` has no inline `skToggleDrawer` definition (or confirmed none existed)
- [ ] `window.skToggleDrawer` is still available in demo pages for inline `onclick` handlers
- [ ] Storybook build passes

---

## Reviewer Guidance

- `grep -n "window.skToggleDrawer = function" apps/demo/dashboard-demo.html` — must return zero (function definition removed; window assignment via import is acceptable)
- Open Storybook `CollapsedHamburger` story, click hamburger — drawer must open/close
- Open `dashboard-demo.html` locally, click hamburger at ≤720px — drawer must open/close
- Confirm `sk-nav-pill.js` contains no `window.*` assignment in its export

## Activity Log

- 2026-05-02T13:01:47Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=914367 – Started implementation via action command
- 2026-05-02T13:04:44Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=914367 – Ready for review: extracted skToggleDrawer to ES module, updated stories with decorator and LightMode variant, removed inline definition from dashboard-demo.html
- 2026-05-02T13:04:57Z – claude:sonnet-4-6:reviewer:reviewer – shell_pid=915593 – Started review via action command
