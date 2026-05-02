# Feature Specification: Design System Remediation + Blog Demo Page

*Path: [kitty-specs/design-system-remediation-and-demo-01KQKSSR/spec.md](spec.md)*

**Mission ID**: 01KQKSSR (design-system-remediation-and-demo-01KQKSSR)
**Created**: 2026-05-02
**Status**: Draft
**Target Branch**: main
**Source**: Issue #10, post-merge mission review `docs/architecture/validation/mission-review-01KQJNTP49SPQNNXQ1TG3BKKKW.md`

## Overview

Three shipping bugs, one missing component, and one new demo page:

1. **BUG-1** — Angular button components are unstyled: `sk-button.css` is not loaded by the Angular build pipeline.
2. **BUG-2** — Five html-js component stories render unstyled: `check-bullet`, `feature-card`, `form-field`, `ribbon-card`, and `section-banner` stories are missing CSS imports.
3. **BUG-3** — No html-js button story exists (FR-119 gap from previous mission).
4. **COMP** — Generic `sk-card` component with coloured border variants (`--blue`, `--purple`, `--inset`) is absent; needed for blog-style layouts.
5. **DEMO** — A static HTML demo page in `apps/demo/` that demonstrates the design system in a blog-like context matching the spec-kitty.ai blog aesthetic.

## User Scenarios & Testing

### User Story 1 — Angular developer using buttons (Priority: P0)

As an Angular developer, I want to import `SkButtonPrimaryComponent` and have it render with correct yellow-fill styling immediately, so that the dashboard UI adoption works without manual CSS configuration.

**Acceptance scenarios:**
1. **Given** `@spec-kitty/angular` is installed and `tokens.css` is loaded, **when** I render `<sk-button-primary>Get started</sk-button-primary>`, **then** the button has yellow fill, dark text, pill shape — no additional CSS required.
2. **Given** a fresh Storybook build, **when** I open the ButtonPrimary Default story, **then** the button renders with correct styling in Storybook.

### User Story 2 — Consumer viewing html-js component demos (Priority: P0)

As a developer evaluating html-js primitives in Storybook, I want all component stories to render with correct visual styling, so that I can assess each component before adopting it.

**Acceptance scenarios:**
1. **Given** the Storybook is open, **when** I navigate to any html-js primitive story (CheckBullet, FeatureCard, FormField, RibbonCard, SectionBanner, Button), **then** the component renders styled — not as bare unstyled HTML.

### User Story 3 — Designer using generic card for blog layout (Priority: P1)

As a designer building a content page, I want a generic `sk-card` component with blue and purple tint variants, so that I can compose blog-style post cards and information panels matching the reference design.

**Acceptance scenarios:**
1. **Given** `@spec-kitty/html-js` is installed, **when** I apply `class="sk-card sk-card--blue"`, **then** the card renders with a blue-tinted background and matching border — matching the reference `kit.css` design.
2. **Given** Storybook is open, **when** I navigate to Cards/SkCard, **then** I see Default, Blue, Purple, and Inset variants.

### User Story 4 — Demo page showing real-world design system usage (Priority: P1)

As a stakeholder evaluating the design system, I want a self-contained static HTML demo page that shows the system in a real blog-like layout, so that I can assess the design quality without setting up a project.

**Acceptance scenarios:**
1. **Given** `apps/demo/blog-demo.html` is opened in a browser, **when** the page loads, **then** it displays a blog-style page with: hero section, navigation pill, 3 post cards using `sk-card`, section banners, feature card grid, and a footer — all styled with `@spec-kitty/tokens`.
2. **Given** the demo page, **when** viewed on mobile (375px) and desktop (1280px), **then** the layout adapts and all components remain readable and correctly styled.

### Edge cases

- Storybook builds must still pass after all CSS import additions — no regressions to the Angular story pipeline.
- The demo page must load the token CSS via a relative file path (no CDN required) so it works offline without a build step.

## Functional Requirements

| ID | Description | Status |
|---|---|---|
| FR-201 | `packages/angular/src/lib/button/sk-button-primary.component.ts`, `sk-button-secondary.component.ts`, and `sk-button-ghost.component.ts` each include `sk-button.css` in their `styleUrls` (or equivalent Angular CSS loading mechanism) so the buttons render correctly in both Storybook and consuming Angular apps | Proposed |
| FR-202 | The following html-js story files each contain an `import './sk-<component>.css'` at the top: `check-bullet`, `feature-card`, `form-field`, `ribbon-card`, `section-banner` | Proposed |
| FR-203 | `packages/html-js/src/button/sk-button-html.stories.ts` exists with Default, Secondary, Ghost, Small, and Disabled story exports | Proposed |
| FR-204 | A generic `sk-card` HTML primitive exists in `packages/html-js/src/card/` with Default, Blue, Purple, and Inset variant classes matching the reference `kit.css` definitions | Proposed |
| FR-205 | `SkCardComponent` exists in `packages/angular/src/lib/card/` with `@Input() variant: 'default' \| 'blue' \| 'purple' \| 'inset' = 'default'` | Proposed |
| FR-206 | Both `sk-card` implementations are exported from their respective package `src/index.ts` entry points | Proposed |
| FR-207 | Storybook stories exist for `sk-card` covering Default, Blue, Purple, Inset variants, and a BlogCardExample composition (card with heading, muted text, and a tag) | Proposed |
| FR-208 | `apps/demo/blog-demo.html` exists as a self-contained static HTML page that references `../../packages/tokens/dist/tokens.css` and uses `sk-*` component classes to render a blog-style page | Proposed |
| FR-209 | The demo page includes: a `NavPill`-style navigation, a hero section using `--sk-font-display` typography, a 3-up grid of `sk-card` post cards (at least one using `sk-card--blue`), a `SectionBanner`, a `FeatureCard` grid row, and a footer | Proposed |
| FR-210 | The demo page is responsive: readable at 375px (single column) and 1280px (full grid) using CSS custom properties and media queries | Proposed |
| FR-211 | All new CSS uses only `--sk-*` custom properties — no hardcoded colour, spacing, or type values (except documented rgba() deviations for tint calculations) | Proposed |
| FR-212 | All new Storybook stories pass axe-core WCAG 2.1 AA (zero violations) | Proposed |

## Non-Functional Requirements

| ID | Description | Threshold | Status |
|---|---|---|---|
| NFR-201 | Storybook build time | Must remain under 3 minutes after additions | Proposed |
| NFR-202 | Demo page load | Must load and render correctly without a build step (plain `file://` URL) | Proposed |

## Constraints

| ID | Description | Status |
|---|---|---|
| C-201 | No mascot/illustration assets in any new story or component (C-008 carried forward) | Confirmed |
| C-202 | All new CSS uses only `--sk-*` custom properties | Confirmed |
| C-203 | `sk-card` CSS must be derived from `tmp/reference_system/ui_kits/marketing-website/kit.css` `.sk-card` definitions to ensure visual consistency with the existing marketing site | Confirmed |
| C-204 | The demo page must not bundle fonts — it loads `tokens.css` which provides `@font-face` via relative `./fonts/` path from the tokens dist directory | Confirmed |

## Key Entities

| Entity | Description |
|---|---|
| `sk-card` | Generic card component: surface background + border + radius + padding; variants `--blue`, `--purple`, `--inset` |
| `blog-demo.html` | Self-contained static demo page in `apps/demo/` showing the design system in a blog context |

## Success Criteria

| # | Criterion | How verified |
|---|---|---|
| SC-201 | All Storybook component stories render with correct visual styles | Open Storybook, visually inspect all html-js stories |
| SC-202 | Angular ButtonPrimary story shows yellow fill button | Open Storybook Components/ButtonPrimary |
| SC-203 | `blog-demo.html` opened via `file://` renders a styled blog-like page | Open file in browser, no unstyled elements |
| SC-204 | Storybook build exits 0 in under 3 minutes | `time npx nx run storybook:storybook:build` |

## Assumptions

- The `tmp/reference_system/ui_kits/marketing-website/kit.css` is the authoritative source for `sk-card` token values (using old flat `--sk-*` naming that maps to current ADR-003 tokens).
- The demo page targets modern browsers — no IE11 compatibility needed.
- `apps/demo/` is a new directory; it is not a publishable npm package and is not built by nx.
