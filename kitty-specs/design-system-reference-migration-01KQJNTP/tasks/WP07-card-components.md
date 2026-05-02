---
work_package_id: WP07
title: Card Components
dependencies:
- WP01
- WP02
requirement_refs:
- FR-115
- FR-117
- FR-119
- FR-120
- FR-122
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T032
- T033
- T034
- T035
- T036
- T037
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "1732676"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/feature-card/
execution_mode: code_change
owned_files:
- packages/html-js/src/feature-card/**
- packages/html-js/src/ribbon-card/**
- packages/angular/src/lib/feature-card/**
- packages/angular/src/lib/ribbon-card/**
- apps/storybook/src/tests/visual.spec.ts-snapshots/sk-feature*
- apps/storybook/src/tests/visual.spec.ts-snapshots/sk-ribbon*
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Implement `FeatureCard` (icon chip + heading + description) and `RibbonCard` (workshop/pricing card with optional ribbon banner) in both packages.

## Context

Read references:
- `tmp/preview/component-feature-cards.html` (22 lines)
- `tmp/preview/component-ribbon-card.html` (268 lines — most complex, study carefully)

**FeatureCard**: A card with a small coloured icon chip at top, an `sk-h4` headline, and muted body text. Used in "why teams use it" grids. The icon chip is a small rounded square tinted with one of the accent colours (yellow, green, purple).

**RibbonCard**: A pricing/workshop card (`--sk-surface-card` background, `--sk-border-default` border, 16px radius). Optionally has a diagonal "PRIMARY WORKSHOP" ribbon banner in `--sk-color-yellow`. The reference shows the complex ribbon implementation in the 268-line preview.

## Subtask Guidance

### T032 — FeatureCard HTML primitive

```html
<div class="sk-feature-card">
  <div class="sk-feature-card__icon-chip sk-feature-card__icon-chip--yellow">
    <!-- Icon SVG goes here -->
  </div>
  <h4 class="sk-feature-card__title">Real-time feedback</h4>
  <p class="sk-feature-card__body">Catch issues before they reach production.</p>
</div>
```

CSS:
```css
.sk-feature-card {
  padding: var(--sk-space-6);
  background: var(--sk-surface-card);
  border: 1px solid var(--sk-border-default);
  border-radius: var(--sk-radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--sk-space-4);
}
.sk-feature-card__icon-chip {
  width: 40px; height: 40px;
  border-radius: var(--sk-radius-sm);
  display: flex; align-items: center; justify-content: center;
}
.sk-feature-card__icon-chip--yellow  { background: rgba(245,197,24,0.15); color: var(--sk-color-yellow); }
.sk-feature-card__icon-chip--green   { background: rgba(143,203,143,0.15); color: var(--sk-color-green); }
.sk-feature-card__icon-chip--purple  { background: rgba(184,169,224,0.15); color: var(--sk-color-purple); }
.sk-feature-card__title { font-family: var(--sk-font-sans); font-size: var(--sk-text-lg); font-weight: var(--sk-weight-bold); color: var(--sk-fg-default); margin: 0; }
.sk-feature-card__body  { font-size: var(--sk-text-sm); color: var(--sk-fg-muted); margin: 0; line-height: 1.55; }
```

Note: The rgba() above has hardcoded values — replace with CSS relative colour syntax (`rgba(from var(--sk-color-yellow) r g b / 0.15)`) if supported, otherwise document this as an accepted deviation from C-103 for tint calculations.

### T033 — RibbonCard HTML primitive

Study `component-ribbon-card.html` carefully. The ribbon is positioned absolutely at the top-right, rotated ~45°.

Key structure:
```html
<div class="sk-ribbon-card">
  <div class="sk-ribbon-card__ribbon">PRIMARY WORKSHOP</div>
  <div class="sk-ribbon-card__content">
    <!-- card content -->
  </div>
</div>
```

CSS for the ribbon (diagonal band):
```css
.sk-ribbon-card { position: relative; overflow: hidden; /* ... card base styles */ }
.sk-ribbon-card__ribbon {
  position: absolute;
  top: 16px; right: -30px;
  width: 120px;
  padding: var(--sk-space-1) 0;
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  font-family: var(--sk-font-mono);
  font-size: var(--sk-text-xs);
  font-weight: var(--sk-weight-bold);
  text-align: center;
  transform: rotate(45deg);
  letter-spacing: 0.05em;
}
```

### T034 — Angular components

Generate `sk-feature-card` with `@Input() iconVariant: 'yellow'|'green'|'purple' = 'yellow'` and `@Input() title: string`. Generate `sk-ribbon-card` with `@Input() ribbonLabel: string | null = null` (null = no ribbon).

### T035 — Export from entry points

### T036 — Stories and axe

FeatureCard: Default (yellow icon), Green icon, Purple icon, Light background.
RibbonCard: Default (no ribbon), WithRibbon (yellow "PRIMARY" banner).
Axe check — ensure card headings have correct hierarchy.

### T037 — Update visual regression baselines

## Definition of Done

- [ ] FeatureCard renders icon chip + title + body with colour variants
- [ ] RibbonCard renders with optional diagonal ribbon banner
- [ ] No hardcoded values except documented rgba() tint deviation
- [ ] Zero axe violations
- [ ] Visual baselines committed

## Reviewer Guidance

Check the RibbonCard ribbon is positioned at a 45° angle overlapping the top-right corner. Verify FeatureCard icon chips use the correct tint colours. Note and accept any rgba() deviation in the review.

## Activity Log

- 2026-05-02T06:23:31Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – Started implementation via action command
- 2026-05-02T06:32:15Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – FeatureCard (icon chip variants) + RibbonCard (optional diagonal ribbon) in both packages
- 2026-05-02T06:32:17Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1676252 – Started review via action command
- 2026-05-02T06:36:23Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1676252 – Moved to planned
- 2026-05-02T06:39:31Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1713625 – Started implementation via action command
- 2026-05-02T06:40:20Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1713625 – Cycle 2: ribbon rotation added and stylelint BEM regex fixed in systemic commit
- 2026-05-02T06:43:45Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1732676 – Started review via action command
- 2026-05-02T06:45:03Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1732676 – Approved cycle 2: ribbon rotation confirmed, Stylelint passes, ribbon uses sk-color-yellow token
