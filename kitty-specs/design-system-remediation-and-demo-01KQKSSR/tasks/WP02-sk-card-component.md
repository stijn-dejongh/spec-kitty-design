---
work_package_id: WP02
title: Generic SkCard Component
dependencies: []
requirement_refs:
- FR-204
- FR-205
- FR-206
- FR-207
- FR-211
- FR-212
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T009
- T010
- T011
- T012
- T013
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "1999778"
history:
- date: '2026-05-02'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/card/
execution_mode: code_change
owned_files:
- packages/html-js/src/card/**
- packages/angular/src/lib/card/**
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Implement the generic `sk-card` component — a surface + border card with Default, Blue, Purple, and Inset variants — needed for blog-style content layouts. This is the component missing from the previous mission that the reference marketing site uses.

## Context

- **Reference source**: `tmp/reference_system/ui_kits/marketing-website/kit.css` defines `.sk-card`, `.sk-card--blue`, `.sk-card--purple`, `.sk-card--inset`
- The reference uses old flat token names (`--sk-bg-2`, `--sk-border-strong`, `--sk-blue-bg`, `--sk-purple-bg`) — map these to current ADR-003 tokens
- **Token mapping**:

| Reference token | ADR-003 equivalent |
|---|---|
| `--sk-bg-2` | `--sk-surface-card` |
| `--sk-bg-1` | `--sk-surface-input` |
| `--sk-border-strong` | `--sk-border-strong` |
| `--sk-border` | `--sk-border-default` |
| `--sk-blue-bg` | `--sk-surface-blue-tint` or `--sk-color-blue-bg` |
| `--sk-purple-bg` | `--sk-surface-purple-tint` or `--sk-color-purple-bg` |
| `--sk-radius-lg` | `--sk-radius-lg` |

## Subtask Guidance

### T009 — `packages/html-js/src/card/sk-card.css`

Read `tmp/reference_system/ui_kits/marketing-website/kit.css` for the `.sk-card` definitions. Map to ADR-003 tokens:

```css
/* @spec-kitty/html-js — sk-card generic card component */
/* All values use --sk-* tokens only */

.sk-card {
  background: var(--sk-surface-card);
  border: 1px solid var(--sk-border-strong);
  border-radius: var(--sk-radius-lg);
  padding: var(--sk-space-7);
}

.sk-card--inset {
  background: var(--sk-surface-input);
  border-color: var(--sk-border-default);
}

/* Blue tint variant — information/context cards */
.sk-card--blue {
  background: var(--sk-surface-blue-tint);
  border-color: rgba(169, 199, 232, 0.20);
}

/* Purple tint variant — feature/architecture cards */
.sk-card--purple {
  background: var(--sk-surface-purple-tint);
  border-color: rgba(184, 169, 224, 0.25);
}

/* Light mode overrides */
:root[data-theme="light"] .sk-card--blue,
.sk-light .sk-card--blue {
  border-color: rgba(46, 74, 107, 0.15);
}

:root[data-theme="light"] .sk-card--purple,
.sk-light .sk-card--purple {
  border-color: rgba(74, 61, 120, 0.18);
}
```

Note: If `--sk-surface-blue-tint` or `--sk-surface-purple-tint` don't exist in `tokens.css`, use the closest available token (e.g. `--sk-color-blue-bg` or `--sk-bg-pill`) and document the substitution. Do NOT hardcode hex values.

### T010 — `sk-card.html` and `index.ts`

```html
<!-- @spec-kitty/html-js — sk-card generic card -->
<!-- Requires @spec-kitty/tokens to be loaded -->
<article class="sk-card">
  <slot>Card content</slot>
</article>
```

**`index.ts`**:
```typescript
export const SkCardHTML = `<article class="sk-card">Card content</article>`;
export const SkCardBlueHTML = `<article class="sk-card sk-card--blue">Card content</article>`;
export const SkCardPurpleHTML = `<article class="sk-card sk-card--purple">Card content</article>`;
export const SkCardInsetHTML = `<article class="sk-card sk-card--inset">Card content</article>`;
```

### T011 — Angular `SkCardComponent`

```bash
npx nx g @nx/angular:component sk-card --project=angular --path=packages/angular/src/lib/card --standalone
```

```typescript
@Input() variant: 'default' | 'blue' | 'purple' | 'inset' = 'default';
```

Template:
```html
<article
  class="sk-card"
  [class.sk-card--blue]="variant === 'blue'"
  [class.sk-card--purple]="variant === 'purple'"
  [class.sk-card--inset]="variant === 'inset'"
>
  <ng-content />
</article>
```

### T012 — Storybook stories

```typescript
import './sk-card.css';
import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Components/Card',
  parameters: { a11y: { disable: false } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `<article class="sk-card" style="max-width:360px"><p style="color:var(--sk-fg-default);margin:0">Default card content</p></article>`,
};
export const Blue: Story = {
  render: () => `<article class="sk-card sk-card--blue" style="max-width:360px"><p style="color:var(--sk-fg-default);margin:0">Blue tint card — information context</p></article>`,
};
export const Purple: Story = {
  render: () => `<article class="sk-card sk-card--purple" style="max-width:360px"><p style="color:var(--sk-fg-default);margin:0">Purple tint card — feature context</p></article>`,
};
export const Inset: Story = {
  render: () => `<article class="sk-card sk-card--inset" style="max-width:360px"><p style="color:var(--sk-fg-default);margin:0">Inset card — nested content</p></article>`,
};
export const BlogCardExample: Story = {
  render: () => `
    <article class="sk-card" style="max-width:400px">
      <div style="display:flex;gap:var(--sk-space-2);margin-bottom:var(--sk-space-4)">
        <span class="sk-tag sk-tag--green">Release</span>
        <span class="sk-tag">v3.2.0</span>
      </div>
      <h3 style="font-family:var(--sk-font-display);font-size:var(--sk-text-xl);font-weight:var(--sk-weight-bold);color:var(--sk-fg-default);margin:0 0 var(--sk-space-3)">
        Spec Kitty 3.2 ships with org-layer doctrine
      </h3>
      <p style="font-size:var(--sk-text-sm);color:var(--sk-fg-muted);line-height:1.55;margin:0 0 var(--sk-space-4)">
        The new org-level DRG allows teams to publish proprietary governance
        without forking the CLI.
      </p>
      <a href="#" style="font-size:var(--sk-text-sm);color:var(--sk-color-yellow);text-decoration:none">Read the post →</a>
    </article>
  `,
};
```

### T013 — Entry point exports + axe

Update `packages/html-js/src/index.ts`:
```typescript
export { SkCardHTML, SkCardBlueHTML, SkCardPurpleHTML, SkCardInsetHTML } from './card/index';
```

Update `packages/angular/src/index.ts`:
```typescript
export { SkCardComponent } from './lib/card/sk-card.component';
```

Run `node scripts/run-axe-storybook.js` after building — zero violations expected.

## Definition of Done

- [ ] `sk-card.css` with all 4 variants using `--sk-*` tokens only
- [ ] `index.ts` exports four HTML string variants
- [ ] Angular `SkCardComponent` with `variant` input
- [ ] Storybook stories: Default, Blue, Purple, Inset, BlogCardExample
- [ ] Both package entry points export sk-card
- [ ] Zero axe WCAG 2.1 AA violations

## Reviewer Guidance

Check Blue and Purple card variants visually against the reference `kit.css` — background tint and border should be subtly different from the default card. Verify the BlogCardExample story uses tag + heading + muted text composition. Run axe.

## Activity Log

- 2026-05-02T07:45:51Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1979642 – Started implementation via action command
- 2026-05-02T07:48:52Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1979642 – sk-card Default/Blue/Purple/Inset + Angular SkCardComponent + BlogCardExample story
- 2026-05-02T07:50:01Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1999778 – Started review via action command
