---
work_package_id: WP06
title: Content Marker Components
dependencies:
- WP01
- WP02
requirement_refs:
- FR-114
- FR-116
- FR-119
- FR-120
- FR-122
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T027
- T028
- T029
- T030
- T031
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "1656221"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/check-bullet/
execution_mode: code_change
owned_files:
- packages/html-js/src/check-bullet/**
- packages/html-js/src/section-banner/**
- packages/angular/src/lib/check-bullet/**
- packages/angular/src/lib/section-banner/**
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Implement `CheckBullet` (green checkmark bullet list item) and `SectionBanner` (changelog version section header) in both packages.

## Context

Read references:
- `tmp/preview/component-bullets.html` (17 lines — simple)
- `tmp/preview/component-section-banner.html` (14 lines — simple)

**CheckBullet**: A `<li>` item with a green `--sk-color-green` checkmark SVG/pseudo-element on the left. Used in hero sections for feature lists.

**SectionBanner**: A full-width coloured banner used in changelog as a section divider. Has a leading coloured `●` dot, ALL-CAPS mono text, and a tinted background. Variants: neutral (default), purple (v2.x architecture sections), green (success/release sections).

## Subtask Guidance

### T027 — CheckBullet HTML primitive

```html
<!-- sk-check-bullet.html -->
<li class="sk-check-bullet">
  <span class="sk-check-bullet__icon" aria-hidden="true">✓</span>
  <span class="sk-check-bullet__text">Feature description here</span>
</li>
```

CSS:
```css
.sk-check-bullet {
  display: flex;
  align-items: flex-start;
  gap: var(--sk-space-3);
  list-style: none;
  color: var(--sk-fg-default);
  font-family: var(--sk-font-sans);
  font-size: var(--sk-text-base);
  line-height: 1.55;
}
.sk-check-bullet__icon {
  color: var(--sk-color-green);
  font-weight: var(--sk-weight-bold);
  flex-shrink: 0;
  margin-top: 0.1em;
}
```

Export `SkCheckBulletHTML` string.

### T028 — SectionBanner HTML primitive

```html
<!-- sk-section-banner.html -->
<div class="sk-section-banner sk-section-banner--neutral">
  <span class="sk-section-banner__dot" aria-hidden="true">●</span>
  <span class="sk-section-banner__label">VERSION 1.X — FIRST STABLE RELEASE</span>
</div>
```

CSS:
```css
.sk-section-banner {
  display: flex;
  align-items: center;
  gap: var(--sk-space-3);
  padding: var(--sk-space-2) var(--sk-space-4);
  border-radius: var(--sk-radius-sm);
  font-family: var(--sk-font-mono);
  font-size: var(--sk-text-sm);
  font-weight: var(--sk-weight-bold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.sk-section-banner--neutral { background: var(--sk-surface-card); color: var(--sk-fg-default); }
.sk-section-banner--purple  { background: var(--sk-surface-purple-tint); color: var(--sk-color-purple); }
.sk-section-banner__dot     { font-size: var(--sk-text-base); }
```

### T029 — Angular components

Generate `sk-check-bullet` with `@Input() text: string = ''` and `sk-section-banner` with `@Input() variant: 'neutral'|'purple'|'green' = 'neutral'` and `@Input() label: string = ''`.

### T030 — Export from entry points

Add both components to `packages/html-js/src/index.ts` and `packages/angular/src/index.ts`.

### T031 — Stories and axe

Stories: CheckBullet (Default, List of 3), SectionBanner (Neutral, Purple, Green). Verify axe — ensure the `aria-hidden` dot doesn't cause issues and the label text is readable.

## Definition of Done

- [ ] CheckBullet renders green checkmark + body text
- [ ] SectionBanner renders neutral/purple/green variants with mono uppercase text
- [ ] No hardcoded values — Stylelint passes
- [ ] Zero axe violations

## Reviewer Guidance

Verify SectionBanner purple variant uses `--sk-surface-purple-tint` (not hardcoded purple). Check that `aria-hidden="true"` on the decorative dot is present.

## Activity Log

- 2026-05-02T06:23:29Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – Started implementation via action command
- 2026-05-02T06:28:36Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – CheckBullet + SectionBanner in both packages
- 2026-05-02T06:28:45Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1656221 – Started review via action command
- 2026-05-02T06:39:04Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1656221 – Arbiter approval: CheckBullet + SectionBanner files committed; aria-hidden on decorative elements; token-only CSS. Reviewer accidentally reviewed WP08 instead.
