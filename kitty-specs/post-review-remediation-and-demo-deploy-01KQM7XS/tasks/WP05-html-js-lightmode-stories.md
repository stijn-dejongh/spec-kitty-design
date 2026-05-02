---
work_package_id: WP05
title: html-js LightMode Stories — All 10 Non-Stub Components
dependencies:
- WP01
- WP02
- WP03
requirement_refs:
- FR-011
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: WP05 executes after WP01+WP02+WP03 are approved. Work in the lane worktree allocated by spec-kitty.
subtasks:
- T015
- T016
- T017
- T018
- T019
- T020
- T021
- T022
- T023
- T024
agent: claude
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
agent_profile: implementer-ivan
authoritative_surface: packages/html-js/src/
execution_mode: code_change
owned_files:
- packages/html-js/src/button/sk-button-html.stories.ts
- packages/html-js/src/card/sk-card-html.stories.ts
- packages/html-js/src/check-bullet/sk-check-bullet-html.stories.ts
- packages/html-js/src/feature-card/sk-feature-card-html.stories.ts
- packages/html-js/src/form-field/sk-form-field-html.stories.ts
- packages/html-js/src/nav-pill/sk-nav-pill.stories.ts
- packages/html-js/src/pill-tag/sk-pill-tag.stories.ts
- packages/html-js/src/ribbon-card/sk-ribbon-card-html.stories.ts
- packages/html-js/src/section-banner/sk-section-banner-html.stories.ts
- packages/html-js/src/site-footer/sk-site-footer.stories.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Add a `LightMode` named export to every non-stub html-js component story. The variant must:
1. Wrap the render output in `<div data-theme="light" style="…">` so components receive correct light-mode token values
2. Set `parameters.backgrounds.default` to `'sk-light'` so the Storybook canvas background matches

Stories that already have `LightBackground` or `OnLightBackground` variants must be upgraded to use the `data-theme="light"` wrapper and renamed to `LightMode`.

---

## Context

The current `LightBackground`/`OnLightBackground` story variants only change the Storybook canvas background colour. They do NOT set `data-theme="light"` on the component wrapper, so CSS rules using `[data-theme="light"]` selectors never fire — components render in dark-mode token values against a white background.

**The correct pattern:**
```ts
export const LightMode: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: () => `
    <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6);">
      <!-- existing render content here -->
    </div>
  `,
};
```

The `data-theme="light"` attribute on the wrapper div triggers all `[data-theme="light"]` CSS rules within the component's scope. The `background: var(--sk-surface-page)` provides appropriate context (in light mode this resolves to the warm cream surface).

**Note on `sk-nav-pill.stories.ts`:** This file is also touched by WP02 (CSS imports) and WP03 (JS module). Ensure you are working from the approved WP02+WP03 state. Do not re-introduce changes those WPs made.

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Depends on: WP01 (tokens), WP02 (CSS split), WP03 (JS module)
Your worktree is allocated by `spec-kitty agent action implement WP05`.

---

## Standard Pattern

Apply this pattern to every story file. The wrapper `div` provides the theme context:

```ts
export const LightMode: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: () => `
    <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
      COMPONENT_HTML_HERE
    </div>
  `,
};
```

For fullscreen layouts (site-footer, section-banner), remove `display: inline-block` and use `display: block; width: 100%`.

For stories that already have a `LightBackground` or `OnLightBackground` export:
- Rename the export to `LightMode`
- Add the `data-theme="light"` wrapper around the existing render output
- Keep all other story properties (backgrounds, render) unchanged except adding the wrapper

---

## Subtask Guidance

Work through each file in order. Each subtask is the same action on a different file.

### T015 — `sk-button-html.stories.ts`
File: `packages/html-js/src/button/sk-button-html.stories.ts`
No existing light variant. Add `LightMode` story after the last existing story. Render the same button(s) as `Default` inside the wrapper.

### T016 — `sk-card-html.stories.ts`
File: `packages/html-js/src/card/sk-card-html.stories.ts`
No existing light variant. Show all four card variants (Default, Blue, Purple, Inset) side-by-side in the LightMode story to demonstrate light-mode surface tokens:
```ts
render: () => `
  <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: flex; gap: var(--sk-space-4); flex-wrap: wrap;">
    <article class="sk-card" style="max-width:200px">Default</article>
    <article class="sk-card sk-card--blue" style="max-width:200px">Blue</article>
    <article class="sk-card sk-card--purple" style="max-width:200px">Purple</article>
    <article class="sk-card sk-card--inset" style="max-width:200px">Inset</article>
  </div>
`
```

### T017 — `sk-check-bullet-html.stories.ts`
File: `packages/html-js/src/check-bullet/sk-check-bullet-html.stories.ts`
No existing light variant. Render the same content as `Default` inside the wrapper.

### T018 — `sk-feature-card-html.stories.ts`
File: `packages/html-js/src/feature-card/sk-feature-card-html.stories.ts`
**Upgrade existing `OnLightBackground`:** Rename to `LightMode` and add the `data-theme="light"` wrapper around `SkFeatureCardYellowHTML`. Keep `parameters.backgrounds.default: 'sk-light'`.

### T019 — `sk-form-field-html.stories.ts`
File: `packages/html-js/src/form-field/sk-form-field-html.stories.ts`
No existing light variant. Render the same form field as `Default` inside the wrapper.

### T020 — `sk-nav-pill.stories.ts` (html-js)
File: `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts`
**Important:** This file was updated by WP02 and WP03. Do not modify the CSS imports or the `CollapsedHamburger` story. Add only a new `LightMode` story at the end using the `Default` nav pill markup wrapped in the theme div.

### T021 — `sk-pill-tag.stories.ts`
File: `packages/html-js/src/pill-tag/sk-pill-tag.stories.ts`
No existing light variant. Render several pill-tag variants together inside the wrapper.

### T022 — `sk-ribbon-card-html.stories.ts`
File: `packages/html-js/src/ribbon-card/sk-ribbon-card-html.stories.ts`
**Upgrade existing `OnLightBackground`:** Rename to `LightMode`, add `data-theme="light"` wrapper around `SkRibbonCardWithRibbonHTML`. Keep backgrounds parameter.

### T023 — `sk-section-banner-html.stories.ts`
File: `packages/html-js/src/section-banner/sk-section-banner-html.stories.ts`
No existing light variant. Use `display: block; width: 100%` on the wrapper since the section banner is typically full-width.

### T024 — `sk-site-footer.stories.ts`
File: `packages/html-js/src/site-footer/sk-site-footer.stories.ts`
**Upgrade existing `LightBackground`:** Rename to `LightMode`, add `data-theme="light"` wrapper around `SkSiteFooterHTML`. Use `display: block; width: 100%` since the footer is fullscreen. Keep `parameters: { backgrounds: { default: 'sk-light' }, layout: 'fullscreen' }`.

---

## After All Stories Are Updated

Run the Storybook build to verify zero errors:
```bash
npx nx run storybook:build 2>&1 | grep -E "ERROR|error TS"
```

Check that zero axe violations were introduced by the new stories:
- Open each `LightMode` story in Storybook dev server
- Click the Accessibility tab in the addons panel
- Confirm no new violations (there may be pre-existing violations from dark mode stories; do not introduce new ones)

---

## Definition of Done

- [ ] All 10 non-stub html-js story files have a `LightMode` named export
- [ ] Each `LightMode` story wraps its render output in `<div data-theme="light">`
- [ ] Each `LightMode` story sets `parameters.backgrounds.default: 'sk-light'`
- [ ] `OnLightBackground` and `LightBackground` exports are renamed to `LightMode` (or removed if superseded)
- [ ] Storybook build passes with zero TypeScript errors
- [ ] No new axe violations in any `LightMode` story

---

## Reviewer Guidance

- Open each component's `LightMode` story in Storybook and confirm the component renders with light-mode tokens (backgrounds should be light, text should be dark)
- Confirm that just changing the Storybook background WITHOUT selecting the LightMode story still shows dark-mode tokens (the two concerns are separate)
- `grep -rn "OnLightBackground\|LightBackground" packages/html-js/src/ --include="*.stories.ts"` — should return zero after rename
