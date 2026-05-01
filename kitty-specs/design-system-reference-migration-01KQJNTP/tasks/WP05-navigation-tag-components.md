---
work_package_id: WP05
title: Navigation + Tag Components
dependencies:
- WP01
- WP02
requirement_refs:
- FR-112
- FR-113
- FR-119
- FR-120
- FR-122
planning_base_branch: main
merge_target_branch: main
branch_strategy: Work in lane worktree; merge to main on approval.
subtasks:
- T021
- T022
- T023
- T024
- T025
- T026
agent: claude
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/nav-pill/
execution_mode: code_change
owned_files:
- packages/html-js/src/nav-pill/**
- packages/html-js/src/pill-tag/**
- packages/angular/src/lib/nav-pill/**
- packages/angular/src/lib/pill-tag/**
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Implement `NavPill` (floating navigation pill bar), `PillTag` (coloured label tags), and `EyebrowPill` (eyebrow chip) in both packages.

## Context

Read references:
- `tmp/preview/component-nav-pill.html` (291 lines — complex with many hover states and colour variants)
- `tmp/preview/component-pills-tags.html` (15 lines — simpler)

**NavPill**: The top-level navigation bar rendered as a floating pill container with `backdrop-filter: blur(12px)` (optional, on scroll), nav items, an active item shown with a filled dark pill, and a right cluster with a theme toggle, GitHub link, and "Book Demo" CTA.

**PillTag**: Small pill-shaped labels used for categorisation — variants: default (neutral), green (success/new), purple (feature), red/breaking. Uses `--sk-bg-pill` background.

**EyebrowPill**: Larger pill used above headings ("For software teams adopting agentic coding") — slightly larger than PillTag, `--sk-bg-pill` fill, `--sk-fg-muted` text.

## Subtask Guidance

### T021 — NavPill HTML primitive

The NavPill is primarily a layout + interaction component. For the HTML primitive, provide the markup structure and CSS — JavaScript interaction (hover state toggling) is minimal and uses CSS `:hover` only.

```html
<!-- sk-nav-pill.html -->
<nav class="sk-nav-pill">
  <div class="sk-nav-pill__items">
    <a href="#" class="sk-nav-pill__item">Platform</a>
    <a href="#" class="sk-nav-pill__item sk-nav-pill__item--active">Getting Started</a>
    <a href="#" class="sk-nav-pill__item">About</a>
    <a href="#" class="sk-nav-pill__item">Blog</a>
  </div>
  <div class="sk-nav-pill__cta">
    <button class="sk-btn sk-btn--primary sk-btn--sm">Book Demo</button>
  </div>
</nav>
```

CSS classes to implement (all token-only):
- `.sk-nav-pill` — floating pill container, `background: var(--sk-surface-card)`, border, pill radius
- `.sk-nav-pill__item` — nav link, no decoration, `--sk-fg-muted` text
- `.sk-nav-pill__item:hover` — `--sk-fg-default` text
- `.sk-nav-pill__item--active` — filled dark pill background (`--sk-surface-input`), `--sk-fg-default` text

### T022 — NavPillComponent Angular

Generate Angular component:
```bash
npx nx g @nx/angular:component sk-nav-pill --project=angular --path=packages/angular/src/lib/nav-pill --standalone
```

Expose `@Input() items: {label: string; href: string; active?: boolean}[] = []`.

### T023 — PillTag + EyebrowPill HTML primitives

```css
.sk-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--sk-space-1) var(--sk-space-3);
  background: var(--sk-bg-pill);
  border-radius: var(--sk-radius-pill);
  font-size: var(--sk-text-xs);
  font-weight: var(--sk-weight-medium);
  color: var(--sk-fg-muted);
  white-space: nowrap;
}
.sk-tag--green   { background: rgba(from var(--sk-color-green) r g b / 0.15); color: var(--sk-color-green); }
.sk-tag--purple  { background: rgba(from var(--sk-color-purple) r g b / 0.15); color: var(--sk-color-purple); }
.sk-tag--breaking { background: rgba(from var(--sk-color-red) r g b / 0.15); color: var(--sk-color-red); }

.sk-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  padding: var(--sk-space-2) var(--sk-space-4);
  background: var(--sk-bg-pill);
  border-radius: var(--sk-radius-sm);
  font-size: var(--sk-text-sm);
  color: var(--sk-fg-muted);
}
```

Note: `rgba(from var(...) r g b / 0.15)` uses CSS relative colour syntax — verify browser support or use a fallback opaque colour if Storybook's Webpack5 doesn't handle it.

### T024 — Angular components

Generate `sk-pill-tag` and `sk-eyebrow-pill` Angular components with `@Input() variant: 'default'|'green'|'purple'|'breaking' = 'default'`.

### T025 — Export from entry points

Add all four new components to both package `src/index.ts` files.

### T026 — Stories and axe

Write stories for NavPill (Default, ActiveItem) and PillTag (Default, Green, Purple, Breaking, EyebrowPill). Verify axe passes — ensure nav items have accessible names.

## Definition of Done

- [ ] NavPill renders floating pill nav with active item highlighted
- [ ] PillTag renders colour variants with token-only CSS
- [ ] EyebrowPill renders correctly
- [ ] No hardcoded values — Stylelint passes
- [ ] Zero axe violations (nav items have text content / aria-label)

## Reviewer Guidance

Verify the active NavPill item has a visually distinct filled background. Check PillTag colour variants render correctly. Run axe — ensure `<a>` items have discernible text.
