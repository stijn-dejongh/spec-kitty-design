---
work_package_id: WP09
title: User Guide Documentation
dependencies:
- WP02
- WP03
requirement_refs:
- FR-124
- FR-125
- FR-126
- FR-127
- FR-128
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T044
- T045
- T046
- T047
- T048
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "1650896"
history:
- date: '2026-05-02'
  event: created
agent_profile: curator-carla
authoritative_surface: docs/design-system/
execution_mode: code_change
owned_files:
- docs/design-system/**
role: curator
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load curator-carla
```

---

## Objective

Create a consumer-facing user guide in `docs/design-system/` covering how to install and use `@spec-kitty/tokens` and the component packages, brand guidelines, and a changelog stub. All content must follow the SK brand voice (sentence case, no emoji, concrete outcomes over abstract claims).

## Context

- **Brand voice**: `doctrine/styleguides/sk-brand-voice.styleguide.yaml` — sentence case, no emoji, no exclamation marks, concrete > abstract, canonical SK noun capitalisation
- **Visual identity**: `doctrine/styleguides/sk-visual-identity.styleguide.yaml` — token naming reference
- **Storybook URL**: After GitHub Pages deployment, the Storybook lives at the repo's Pages URL (`https://stijn-dejongh.github.io/spec-kitty-design/`). Reference this in the docs as the live catalog.
- **Reference for component examples**: `tmp/Spec Kitty Design System(1)/ui_kits/marketing-website/README.md` for usage patterns
- **Existing contributor docs**: `docs/contributing/` covers contributor workflow — the user guide covers consumption, not contribution

## Subtask Guidance

### T044 — `docs/design-system/README.md`

Overview page and navigation hub. Structure:

```markdown
# Spec Kitty Design System

The Spec Kitty design system provides design tokens, components, and brand guidelines
for teams building Spec Kitty-branded interfaces.

## Packages

| Package | Purpose | Install |
|---|---|---|
| `@spec-kitty/tokens` | CSS custom properties, brand fonts, brand assets | `npm install @spec-kitty/tokens` |
| `@spec-kitty/angular` | Angular component library | `npm install @spec-kitty/angular @spec-kitty/tokens` |
| `@spec-kitty/html-js` | Framework-agnostic HTML primitives | `npm install @spec-kitty/html-js @spec-kitty/tokens` |

## Guides

- [Using tokens](using-tokens.md) — install, load, and apply `--sk-*` custom properties
- [Using components](using-components.md) — import and render each component category
- [Brand guidelines](brand-guidelines.md) — voice, colour, typography, iconography
- [Changelog](changelog.md) — design system release history

## Live catalog

Browse the full component catalog and design token reference at the [Storybook](https://stijn-dejongh.github.io/spec-kitty-design/).
```

### T045 — `docs/design-system/using-tokens.md`

Covers: installation, CDN link, Angular project setup, using `--sk-*` properties, the semantic pairing rule, and the token catalogue reference.

Include concrete examples for each consumption path:

**Plain HTML:**
```html
<!-- CDN link — no build step required -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
<style>
  .my-heading {
    font-family: var(--sk-font-display);
    color: var(--sk-fg-default);
  }
</style>
```

**npm + Angular:**
```json
// angular.json → projects → yourApp → architect → build → options
"styles": ["node_modules/@spec-kitty/tokens/dist/tokens.css"]
```

**SCSS:**
```scss
// Import in your global stylesheet
@import '@spec-kitty/tokens/dist/tokens.css';

.hero-title {
  font-family: var(--sk-font-display);
  font-weight: var(--sk-weight-extrabold);
  color: var(--sk-fg-default);
}
```

**Semantic pairing rule section:**
```markdown
## Semantic pairing rule

Every surface token has a paired foreground token. Always use them together
to ensure sufficient colour contrast:

| Surface | Use with |
|---|---|
| `--sk-surface-page` | `--sk-fg-default` |
| `--sk-surface-card` | `--sk-fg-on-card` |
| `--sk-color-yellow` (CTAs) | `--sk-fg-on-primary` |
```

**Token catalogue reference:**
Link to the published catalogue and the Storybook token documentation pages.

### T046 — `docs/design-system/using-components.md`

For each of the 8 component categories, provide:
1. A one-sentence description
2. Import path
3. Minimal usage example (HTML and Angular)
4. Link to the Storybook story

Structure:
```markdown
# Using components

## Installation

\`\`\`bash
npm install @spec-kitty/angular @spec-kitty/tokens    # Angular
npm install @spec-kitty/html-js @spec-kitty/tokens    # plain HTML/JS
\`\`\`

## Buttons

Primary and secondary call-to-action buttons.

**Angular:**
\`\`\`typescript
import { SkButtonPrimaryComponent } from '@spec-kitty/angular';
\`\`\`
\`\`\`html
<sk-button-primary>Get started</sk-button-primary>
<sk-button-secondary>Learn more</sk-button-secondary>
\`\`\`

**HTML:**
\`\`\`html
<button class="sk-btn sk-btn--primary">Get started</button>
<button class="sk-btn sk-btn--secondary">Learn more</button>
\`\`\`

→ [View in Storybook](https://stijn-dejongh.github.io/spec-kitty-design/?path=/story/components-buttonprimary--default)

## Navigation + Tags

[NavPill, PillTag, EyebrowPill — same pattern]

## Content markers
## Cards
## Form fields
```

### T047 — `docs/design-system/brand-guidelines.md`

Consumer-facing brand reference. Structure:

1. **Voice** — sentence case, no emoji, concrete outcomes; table of wrong/correct examples
2. **Colour palette** — the 6 brand colours with their use cases (yellow = CTAs only; green = success; red = errors only); the dark surface scale; the semantic pairing rule
3. **Typography** — Falling Sky for headlines (display/marketing), Swansea for editorial prose, JetBrains Mono for code; type scale reference
4. **Iconography** — Lucide-style stroke icons (2px, rounded caps); no emoji; colour rules for icons
5. **Mascot policy** — the bespectacled cat is for supporting materials (marketing, docs, slides) only; never embedded in software packages (C-101)

### T048 — `docs/design-system/changelog.md` stub

```markdown
# Changelog

All notable changes to the Spec Kitty Design System are documented here.
This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

---

## [Unreleased]

### Added

- Initial token layer (`@spec-kitty/tokens`) with 93 design tokens across 13 categories
- Brand fonts bundled: Falling Sky family (30 files), Swansea family
- Brand assets: logo, favicon
- Angular component library (`@spec-kitty/angular`) with 8 component categories
- HTML/JS primitives (`@spec-kitty/html-js`) with 8 component categories
- Storybook catalog with design token documentation pages (Colours, Typography, Spacing, Brand)
- User guide documentation (`docs/design-system/`)

---

*Releases are tagged on the `main` branch following semantic versioning.*
*Breaking `--sk-*` token name changes increment the major version.*
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `docs/design-system/README.md` with package table and guide links
- [ ] `docs/design-system/using-tokens.md` with HTML, Angular, SCSS examples and semantic pairing rule
- [ ] `docs/design-system/using-components.md` with examples for all 8 component categories
- [ ] `docs/design-system/brand-guidelines.md` with voice, colour, typography, iconography, mascot policy
- [ ] `docs/design-system/changelog.md` stub with initial release notes
- [ ] No emoji anywhere; all headings sentence case; brand voice consistent

## Risks

- Storybook story URLs may not be final until GitHub Pages deploy runs — use the correct base URL pattern and note that URLs are approximate until first deploy
- Component import paths reference packages that will be published; note that the packages must be published before the import paths work in consumer projects

## Reviewer Guidance

Check: no emoji, sentence case headings, concrete examples rather than vague descriptions. Verify the semantic pairing rule table is present in using-tokens.md. Check that brand-guidelines.md includes the mascot usage policy (C-101). Spot-check 2 component examples in using-components.md for correctness.

## Activity Log

- 2026-05-02T06:24:17Z – claude:claude-sonnet-4-6:curator-carla:curator – shell_pid=1629773 – Started implementation via action command
- 2026-05-02T06:27:36Z – claude:claude-sonnet-4-6:curator-carla:curator – shell_pid=1629773 – 5 user guide docs created: README, using-tokens, using-components, brand-guidelines, changelog
- 2026-05-02T06:27:58Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=1650896 – Started review via action command
