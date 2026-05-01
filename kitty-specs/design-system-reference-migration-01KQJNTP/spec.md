# Feature Specification: Design System Reference Migration

*Path: [kitty-specs/design-system-reference-migration-01KQJNTP/spec.md](kitty-specs/design-system-reference-migration-01KQJNTP/spec.md)*

**Mission ID**: 01KQJNTP49SPQNNXQ1TG3BKKKW
**Created**: 2026-05-01
**Status**: Draft
**Target Branch**: main

## Overview

The monorepo infrastructure exists but holds only a minimal stub component. The Claude Design reference (`tmp/`) contains the authoritative token values, 30 brand font files, brand assets (logo, favicon), 8 component categories as HTML previews, and design-token documentation pages. This mission migrates that reference into the live system: canonical token values, bundled fonts, brand assets, Storybook documentation pages for every token category, and all 8 component categories as distributable HTML/JS primitives and Angular components.

The React/JSX marketing-site UI kit (`tmp/ui_kits/marketing-website/`) is explicitly out of scope.

## Domain Language

| Term | Definition | Avoid |
|---|---|---|
| **Token reconciliation** | Updating `tokens.css` with final values from the Claude Design reference and the ADR-003 addendum | "token sync" |
| **Brand asset** | Logo, favicon — non-illustration brand marks | Illustrations (C-008 boundary) |
| **Primitive** | A framework-agnostic HTML + CSS component with no JavaScript behaviour | "base component" without context |
| **Component story** | A Storybook CSF entry documenting a component in all named states | "demo", "example" |
| **Preview page** | One of the 26 standalone HTML files in `tmp/preview/` | "reference page" |
| **Reference set** | The full contents of `tmp/Spec Kitty Design System(1)/` | "tmp assets" |

## User Scenarios & Testing

### User Story 1 — Consumer using tokens with brand fonts (Priority: P1)

As a developer building a Spec Kitty-branded interface, I want to install `@spec-kitty/tokens` and have all brand fonts available without any additional setup, so that headlines render in Falling Sky immediately.

**Acceptance scenarios:**
1. **Given** a plain HTML document that loads `tokens.css` via a file link, **when** a heading uses `font-family: var(--sk-font-display)`, **then** the text renders in Falling Sky at the correct weight.
2. **Given** a plain HTML document with no build tool, **when** `tokens.css` is the only stylesheet, **then** `--sk-color-yellow` resolves to its canonical value in browser DevTools.

### User Story 2 — Contributor reviewing design token docs (Priority: P1)

As a contributor, I want to open Storybook and browse all design token categories with live rendered examples so I can verify system accuracy and contribute correctly.

**Acceptance scenarios:**
1. **Given** Storybook is running, **when** I navigate to Colours, **then** I see every `--sk-color-*` token as a labelled swatch with name and value.
2. **Given** Storybook is running, **when** I navigate to Typography, **then** all font families, scale steps, and weights render in Falling Sky, Swansea, and JetBrains Mono.
3. **Given** Storybook is running, **when** I navigate to Spacing, **then** every `--sk-space-*` step appears as a visual ruler with its rem value.

### User Story 3 — Importing a primitive component (Priority: P2)

As an Angular developer, I want to import `ButtonPrimary` from `@spec-kitty/angular` and have it match the Claude Design reference exactly.

**Acceptance scenarios:**
1. **Given** `@spec-kitty/angular` is installed, **when** I render `<sk-button-primary>Get started</sk-button-primary>`, **then** the button matches the reference: yellow fill, dark ink text, pill border-radius, correct padding.
2. **Given** any component story, **when** the accessibility check runs, **then** zero WCAG 2.1 AA violations are reported.

### Edge cases

- A consumer's build tool does not process CSS `url()` references — font files must be accessible at a predictable relative path from the distributed `tokens.css`.
- Storybook must load `tokens.css` (including `@font-face`) before any story renders; fonts must appear in Storybook previews.
- Mascot illustrations (`illustration-*.webp`, `blog-illustrations.png`) must never appear in any story or distributed package (C-008).

## Functional Requirements

| ID | Description | Status |
|---|---|---|
| FR-101 | `packages/tokens/src/tokens.css` is updated with canonical token values from `tmp/colors_and_type.css`, reconciled against the live marketing site CSS (completing ADR-003 addendum) | Proposed |
| FR-102 | All 30 brand font files from `tmp/fonts/` are copied to `packages/tokens/fonts/` and included in the published package `files` array | Proposed |
| FR-103 | `tokens.css` includes `@font-face` declarations for all font variants referencing relative `./fonts/...` paths | Proposed |
| FR-104 | `packages/tokens/dist/token-catalogue.json` is regenerated after token reconciliation | Proposed |
| FR-105 | `logo.png`, `logo.webp`, and `favicon.png` from `tmp/assets/` are copied to `packages/tokens/assets/` and included in the published package | Proposed |
| FR-106 | The Storybook Getting Started page is updated to document the font loading pattern for consumers | Proposed |
| FR-107 | A Colours documentation page in Storybook shows all `--sk-color-*`, `--sk-surface-*`, `--sk-fg-*`, and `--sk-border-*` tokens as labelled swatches | Proposed |
| FR-108 | A Typography documentation page shows all font families, type scale steps, and weight variants rendered in the brand typefaces | Proposed |
| FR-109 | A Spacing documentation page shows all `--sk-space-*`, `--sk-radius-*`, `--sk-shadow-*`, and `--sk-motion-*` tokens with visual examples | Proposed |
| FR-110 | A Brand documentation page shows logo usage, favicon, icon style guidance, and brand voice summary — no mascot illustrations | Proposed |
| FR-111 | `ButtonPrimary` and `ButtonSecondary` components exist in both `packages/html-js` and `packages/angular` matching `component-buttons.html` | Proposed |
| FR-112 | `NavPill` component exists in both packages matching `component-nav-pill.html` | Proposed |
| FR-113 | `PillTag` component exists in both packages matching `component-pills-tags.html` | Proposed |
| FR-114 | `CheckBullet` component exists in both packages matching `component-bullets.html` | Proposed |
| FR-115 | `RibbonCard` component exists in both packages matching `component-ribbon-card.html` | Proposed |
| FR-116 | `SectionBanner` component exists in both packages matching `component-section-banner.html` | Proposed |
| FR-117 | `FeatureCard` component exists in both packages matching `component-feature-cards.html` | Proposed |
| FR-118 | `FormField` component exists in both packages matching `component-form.html` | Proposed |
| FR-119 | Every component (FR-111 – FR-118) has a Storybook story covering Default, Dark background, Light background, and any interactive states from the reference | Proposed |
| FR-120 | Every component story passes the axe-core WCAG 2.1 AA gate with zero violations | Proposed |
| FR-121 | `ADR-003-addendum-token-values.md` is completed with final reconciled values, discrepancy resolutions, and the OKLCH/hex decision | Proposed |
| FR-122 | All new component CSS uses only `--sk-*` custom properties — no hardcoded values | Proposed |
| FR-123 | `packages/tokens/.npmignore` is updated so `fonts/` and `assets/` are included (not excluded) in the published package | Proposed |

## Non-Functional Requirements

| ID | Description | Threshold | Status |
|---|---|---|---|
| NFR-101 | Token package size with fonts bundled | `@spec-kitty/tokens` published package under **5 MB compressed** | Proposed |
| NFR-102 | Storybook build time | Under **3 minutes** after adding documentation pages and component stories | Proposed |
| NFR-103 | Component visual fidelity | Each component visually matches its reference HTML preview to human reviewer satisfaction | Proposed |
| NFR-104 | Font render coverage | All `--sk-font-*` properties resolve to brand typeface renders, not fallback system fonts | Proposed |

## Constraints

| ID | Description | Status |
|---|---|---|
| C-101 | Mascot/illustration assets must not appear in any story, documentation page, or distribution package (C-008) | Confirmed |
| C-102 | React/JSX marketing website components (`tmp/ui_kits/marketing-website/`) are out of scope | Confirmed |
| C-103 | All component CSS uses only `--sk-*` properties — no hardcoded values (C-003) | Confirmed |
| C-104 | Brand fonts are distributed within `@spec-kitty/tokens` under `fonts/`; not bundled into any other package | Confirmed |
| C-105 | JetBrains Mono is loaded via Google Fonts CDN URL, not distributed as a local file | Confirmed |
| C-106 | Font licence for Falling Sky and Swansea must be verified as permitting npm redistribution before first publish that includes `fonts/` | Confirmed |

## Key Entities

| Entity | Description |
|---|---|
| **Token catalogue** | `packages/tokens/dist/token-catalogue.json` — regenerated post-reconciliation; Stylelint allowlist |
| **Font bundle** | `packages/tokens/fonts/` — 30 OTF files, co-located with `tokens.css` |
| **Brand assets** | `packages/tokens/assets/` — `logo.png`, `logo.webp`, `favicon.png` |
| **Token docs** | Storybook MDX pages in `apps/storybook/src/stories/tokens/` |
| **Component primitive** | HTML/CSS element in `packages/html-js/src/` with Angular wrapper, and Storybook story |

## Success Criteria

| # | Criterion | How verified |
|---|---|---|
| SC-101 | `@spec-kitty/tokens` with `tokens.css` in a blank HTML document renders `--sk-color-yellow` at canonical value and Falling Sky for `--sk-font-display` | Manual browser check |
| SC-102 | Every `--sk-*` token name in `token-catalogue.json` matches the ADR-003 schema and completed addendum | Diff catalogue against addendum |
| SC-103 | Storybook shows all 4 token documentation pages with live rendered examples | Visual inspection |
| SC-104 | All 8 component categories have stories passing axe-core with zero violations | CI `a11y` job |
| SC-105 | Storybook build completes under 3 minutes | `time npx nx run storybook:storybook:build` |

## Assumptions

- Font licence for Falling Sky and Swansea permits npm distribution; the maintainer verifies this before publishing a version with `fonts/`.
- JetBrains Mono is served from Google Fonts CDN; its open-source licence permits this.
- Canonical token values are those in `tmp/colors_and_type.css`; discrepancies with the live site resolve in favour of the reference unless the maintainer specifies otherwise in the ADR-003 addendum.
- `tmp/` remains gitignored; no files are committed from it directly.
- All 8 `component-*.html` preview files are in scope with no additional scoping.
