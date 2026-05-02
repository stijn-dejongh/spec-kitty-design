---
work_package_id: WP06
title: Angular LightMode Stories — All 6 Non-Stub Components
dependencies:
- WP01
requirement_refs:
- FR-012
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: Planning artifacts for this feature were generated on feature/post-review-remediation-and-demo-deploy. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/post-review-remediation-and-demo-deploy unless the human explicitly redirects the landing branch.
subtasks:
- T025
- T026
- T027
- T028
- T029
- T030
agent: "claude:sonnet-4-6:implementer-ivan:implementer"
shell_pid: "919520"
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
agent_profile: implementer-ivan
authoritative_surface: packages/angular/src/lib/
execution_mode: code_change
owned_files:
- packages/angular/src/lib/button/sk-button-primary.stories.ts
- packages/angular/src/lib/button/sk-button-secondary.stories.ts
- packages/angular/src/lib/feature-card/sk-feature-card.stories.ts
- packages/angular/src/lib/nav-pill/sk-nav-pill.stories.ts
- packages/angular/src/lib/pill-tag/sk-pill-tag.stories.ts
- packages/angular/src/lib/ribbon-card/sk-ribbon-card.stories.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Add a `LightMode` named export to all 6 non-stub Angular component stories. The story variant must render the component inside a `data-theme="light"` wrapper element so light-mode CSS tokens activate.

---

## Context

Angular Storybook stories use `render: () => ({ template: '...' })` rather than raw HTML strings. The `data-theme="light"` wrapper must be part of the template string. The simplest reliable approach is to wrap the component tag in a `<div data-theme="light">`.

**Angular story LightMode pattern:**
```ts
export const LightMode: Story = {
  parameters: {
    backgrounds: { default: 'sk-light' },
  },
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-component-tag>Content</sk-component-tag>
      </div>
    `,
  }),
};
```

For stories that already have a `LightBackground` export, rename it to `LightMode` and add the `data-theme="light"` wrapper.

**Zone.js note:** The `data-theme` attribute on a plain `<div>` requires no Angular component — it is just a host element for the CSS selector. This is safe with zone.js and SSR.

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Depends on: WP01 (tokens only — alpha tokens are in html-js, not angular, but WP01 must pass build first)
Can run in parallel with: WP02, WP03, WP04
Your worktree is allocated by `spec-kitty agent action implement WP06`.

---

## Subtask Guidance

Apply the LightMode pattern to each story file. Read the existing stories first to understand what content to wrap.

### T025 — `sk-button-primary.stories.ts`
File: `packages/angular/src/lib/button/sk-button-primary.stories.ts`

Existing `LightBackground` story:
```ts
export const LightBackground: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: () => ({ template: '<sk-button-primary>On light</sk-button-primary>' }),
};
```

**Action:** Rename to `LightMode` and add wrapper:
```ts
export const LightMode: Story = {
  parameters: { backgrounds: { default: 'sk-light' } },
  render: () => ({
    template: `
      <div data-theme="light" style="background: var(--sk-surface-page); padding: var(--sk-space-6); display: inline-block;">
        <sk-button-primary>Get started</sk-button-primary>
      </div>
    `,
  }),
};
```

### T026 — `sk-button-secondary.stories.ts`
File: `packages/angular/src/lib/button/sk-button-secondary.stories.ts`

Read the existing stories, then add `LightMode` following the same pattern. Wrap the same button content as `Default`.

### T027 — `sk-feature-card.stories.ts`
File: `packages/angular/src/lib/feature-card/sk-feature-card.stories.ts`

If a `LightBackground` story exists, rename to `LightMode` and add wrapper. If none exists, add a new `LightMode` story wrapping the same `Default` template.

Feature cards often use a coloured icon — verify the icon colours respond correctly to `data-theme="light"` (they should, since they reference `--sk-*` tokens).

### T028 — `sk-nav-pill.stories.ts` (Angular)
File: `packages/angular/src/lib/nav-pill/sk-nav-pill.stories.ts`

Read the existing Angular nav pill stories. Add `LightMode` wrapping the default nav pill template. The Angular nav pill uses the CSS from `@spec-kitty/tokens` — the `data-theme="light"` wrapper activates light-mode nav item colours.

### T029 — `sk-pill-tag.stories.ts` (Angular)
File: `packages/angular/src/lib/pill-tag/sk-pill-tag.stories.ts`

Add `LightMode` wrapping pill tag examples. Consider showing multiple tag variants in the light wrapper to demonstrate colour token behaviour.

### T030 — `sk-ribbon-card.stories.ts` (Angular)
File: `packages/angular/src/lib/ribbon-card/sk-ribbon-card.stories.ts`

If `LightBackground` exists, rename to `LightMode` and add wrapper. The ribbon card has a coloured ribbon strip — verify it renders correctly in light mode.

---

## After All Stories Are Updated

```bash
npx nx run storybook:build 2>&1 | grep -E "ERROR|error TS"
```

Zero errors expected. If TypeScript errors appear related to template syntax (missing component imports, etc.), read the file's existing `moduleMetadata` decorator and add any missing component imports to the `LightMode` story's declarations.

---

## Definition of Done

- [ ] All 6 non-stub Angular story files have a `LightMode` named export
- [ ] Each `LightMode` story renders the component inside `<div data-theme="light">`
- [ ] Each `LightMode` story sets `parameters.backgrounds.default: 'sk-light'`
- [ ] `LightBackground` exports are renamed to `LightMode`
- [ ] Storybook build passes with zero TypeScript errors
- [ ] No new axe violations in any `LightMode` story (verify via Storybook a11y addon — charter requirement)
- [ ] **Charter visual diff (D1)**: Each `LightMode` story render is compared against the corresponding component screenshot in `tmp/` — no unexpected colour or layout changes. Document review outcome in PR description.

---

## Reviewer Guidance

- Open each Angular `LightMode` story in Storybook — confirm components render with light-mode colours (not dark tokens on a white background)
- Specifically check button primary: text should be dark, background should be light (token-driven)
- `grep -rn "LightBackground" packages/angular/src/ --include="*.stories.ts"` — should return zero after rename
- **Charter gate**: compare LightMode renders against `tmp/` reference screenshots; flag any divergence in PR review

## Activity Log

- 2026-05-02T13:15:11Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=919520 – Started implementation via action command
- 2026-05-02T13:19:34Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=919520 – Ready for review
