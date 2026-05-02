---
work_package_id: WP04
title: Button Components
dependencies:
- WP01
- WP02
requirement_refs:
- FR-111
- FR-119
- FR-120
- FR-122
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T016
- T017
- T018
- T019
- T020
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "1731116"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/button/
execution_mode: code_change
owned_files:
- packages/html-js/src/button/**
- packages/angular/src/lib/button/**
- packages/angular/src/lib/button/sk-button-primary.stories.ts
- apps/storybook/src/tests/visual.spec.ts-snapshots/sk-button*
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Implement `ButtonPrimary` and `ButtonSecondary` in both `packages/html-js` and `packages/angular`, matching the `component-buttons.html` reference exactly.

## Context

Read the reference: `tmp/Spec\ Kitty\ Design\ System\(1\)/preview/component-buttons.html`

Key visual spec from the reference:
- **Primary**: Full pill (`--sk-radius-pill`), yellow fill (`--sk-color-yellow`), dark ink text (`--sk-fg-on-primary`), 12–14px vertical padding, optional yellow glow on hover (`--sk-shadow-glow-primary`)
- **Secondary**: Pill outline with `--sk-fg-default` text on dark; border `--sk-border-default`; on hover `--sk-border-strong`
- **Small variant**: Same shapes, `--sk-text-sm` size, reduced padding
- **Ghost variant**: No border, transparent background, `--sk-fg-muted` text (for low-emphasis actions)

## Subtask Guidance

### T016 — HTML primitives

Create in `packages/html-js/src/button/`:

**`sk-button-primary.html`** — the markup template:
```html
<!-- @spec-kitty/html-js — sk-button-primary -->
<button class="sk-btn sk-btn--primary" type="button">
  <slot>Label</slot>
</button>
```

**`sk-button.css`** — shared button styles (all variants):
```css
.sk-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sk-space-2);
  padding: var(--sk-space-3) var(--sk-space-7);
  border: 1px solid transparent;
  border-radius: var(--sk-radius-pill);
  font-family: var(--sk-font-sans);
  font-size: var(--sk-text-base);
  font-weight: var(--sk-weight-medium);
  line-height: 1;
  cursor: pointer;
  transition: box-shadow var(--sk-motion-duration-fast) var(--sk-motion-ease-out),
              border-color var(--sk-motion-duration-fast) var(--sk-motion-ease-out),
              background var(--sk-motion-duration-fast) var(--sk-motion-ease-out);
  text-decoration: none;
}

.sk-btn--primary {
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  border-color: transparent;
}
.sk-btn--primary:hover { box-shadow: var(--sk-shadow-glow-primary); }
.sk-btn--primary:active { transform: scale(0.97); }

.sk-btn--secondary {
  background: transparent;
  color: var(--sk-fg-default);
  border-color: var(--sk-border-default);
}
.sk-btn--secondary:hover { border-color: var(--sk-border-strong); }

.sk-btn--ghost {
  background: transparent;
  color: var(--sk-fg-muted);
  border-color: transparent;
}
.sk-btn--ghost:hover { color: var(--sk-fg-default); }

.sk-btn--sm { padding: var(--sk-space-2) var(--sk-space-5); font-size: var(--sk-text-sm); }

.sk-btn:disabled,
.sk-btn[disabled] { opacity: 0.4; cursor: not-allowed; }
```

Create `index.ts`:
```typescript
export const SkButtonPrimaryHTML = `<button class="sk-btn sk-btn--primary" type="button">Label</button>`;
export const SkButtonSecondaryHTML = `<button class="sk-btn sk-btn--secondary" type="button">Label</button>`;
```

### T017 — Angular components

```bash
npx nx g @nx/angular:component sk-button-primary --project=angular --path=packages/angular/src/lib/button --standalone --no-interactive
```

Adapt the generated component to use `sk-btn sk-btn--primary` classes. Add an `@Input() disabled: boolean = false` and `@Input() size: 'sm' | 'default' = 'default'`. Repeat for `sk-button-secondary` and `sk-button-ghost`.

### T018 — Export from entry points

Update `packages/html-js/src/index.ts`:
```typescript
export { SkButtonPrimaryHTML, SkButtonSecondaryHTML } from './button/index';
```

Update `packages/angular/src/index.ts`:
```typescript
export { SkButtonPrimaryComponent, SkButtonSecondaryComponent } from './lib/button/sk-button-primary.component';
```

### T019 — Stories and axe check

Create `packages/angular/src/lib/button/sk-button-primary.stories.ts`:
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { SkButtonPrimaryComponent } from './sk-button-primary.component';

const meta: Meta<SkButtonPrimaryComponent> = {
  title: 'Components/ButtonPrimary',
  component: SkButtonPrimaryComponent,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
};
export default meta;
export const Default: StoryObj = { render: () => ({ template: '<sk-button-primary>Get started</sk-button-primary>' }) };
export const Disabled: StoryObj = { render: () => ({ template: '<sk-button-primary [disabled]="true">Disabled</sk-button-primary>' }) };
export const Small: StoryObj = { render: () => ({ template: '<sk-button-primary size="sm">Small</sk-button-primary>' }) };
export const LightBackground: StoryObj = { parameters: { backgrounds: { default: 'sk-light' } }, render: () => ({ template: '<sk-button-primary>On light</sk-button-primary>' }) };
```

Create similar stories for `ButtonSecondary`.

After build, run `node scripts/run-axe-storybook.js` — must exit 0.

### T020 — Update visual regression baselines

```bash
npx nx run storybook:storybook:build
npx playwright test apps/storybook/src/tests/visual.spec.ts --update-snapshots
git add apps/storybook/src/tests/visual.spec.ts-snapshots/
```

## Definition of Done

- [ ] `sk-btn--primary` renders yellow fill + dark ink + pill radius
- [ ] `sk-btn--secondary` renders transparent + border + pill radius
- [ ] Hover state adds glow (primary) or stronger border (secondary)
- [ ] Disabled state at 40% opacity, `cursor: not-allowed`
- [ ] No hardcoded values — Stylelint passes
- [ ] Axe passes zero WCAG 2.1 AA violations
- [ ] Visual baselines committed

## Reviewer Guidance

Check that `sk-btn--primary:hover` shows the yellow glow (not just a colour change). Check disabled state is visually distinct. Run Stylelint against `sk-button.css` — must pass.

## Activity Log

- 2026-05-02T06:23:25Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – Started implementation via action command
- 2026-05-02T06:27:52Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – ButtonPrimary + ButtonSecondary in both packages, stories written
- 2026-05-02T06:28:28Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1654523 – Started review via action command
- 2026-05-02T06:33:01Z – claude – shell_pid=1654523 – Review rejected: angular:build fails due to missing @angular/forms peer dependency in packages/angular/package.json. Button CSS, tokens, hover/disabled states all pass. See review-cycle-1.md.
- 2026-05-02T06:39:26Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1713625 – Started implementation via action command
- 2026-05-02T06:43:21Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1713625 – Cycle 2: @angular/forms added to peerDependencies in systemic fix; Angular build passes
- 2026-05-02T06:43:23Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1731116 – Started review via action command
- 2026-05-02T06:44:10Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1731116 – Review passed cycle 2: @angular/forms peerDep added, Angular build passes
