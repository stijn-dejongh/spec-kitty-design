# Implementation Plan: Design System Reference Migration

*Path: [kitty-specs/design-system-reference-migration-01KQJNTP/plan.md](kitty-specs/design-system-reference-migration-01KQJNTP/plan.md)*

**Branch**: `main` | **Date**: 2026-05-01 | **Spec**: [spec.md](spec.md)

## Summary

Migrate the Claude Design reference (`tmp/`) into the live monorepo: update token values from the authoritative `colors_and_type.css`, bundle 30 brand font OTF files in `@spec-kitty/tokens`, add brand assets (logo, favicon), create Storybook documentation pages for all 4 token categories, and implement all 8 component categories as distributable HTML/JS primitives and Angular components with stories.

## Technical Context

**Language/Version**: TypeScript 5.x; CSS; HTML5; Angular 21.x LTS
**Primary Dependencies**: `@spec-kitty/tokens` (extended with fonts + assets); `@spec-kitty/angular` (8 new components); `@spec-kitty/html-js` (8 new primitives); Storybook 10.x (4 MDX doc pages + stories)
**Storage**: N/A — static assets and CSS only
**Testing**: axe-core WCAG 2.1 AA per story; Stylelint token enforcement on all new CSS; visual fidelity by human reviewer against reference HTML previews
**Target Platform**: Browser; npm registry (`@spec-kitty` scope)
**Project Type**: nx monorepo — existing packages extended
**Performance Goals**: Token package < 5 MB compressed (NFR-101); Storybook build < 3 min (NFR-102)
**Constraints**: No illustration assets; no hardcoded CSS values; fonts bundled in tokens package only; JetBrains Mono via Google Fonts CDN; font licence must be verified before publish

## Charter Check

**GATE: PASS** — Reviewed against ADR-001 through ADR-007 and charter directives.

- **ADR-001** (token distribution): `@font-face` declarations in `tokens.css` with local font files — consistent with CSS custom property distribution; consumers get fonts alongside tokens via the same package.
- **ADR-002** (monorepo topology): New components added to existing `packages/angular/` and `packages/html-js/` — no new packages, no topology change.
- **ADR-003** (token schema): Token reconciliation must complete the ADR-003 addendum (FR-121) as a pre-work gate. All new tokens follow `--sk-<category>-<name>` convention.
- **C-008** (illustration boundary): Mascot assets explicitly excluded from all stories and package distribution.
- **DIRECTIVE_037** (living documentation sync): Storybook stories created alongside components; token docs regenerated after reconciliation.

**Pre-work gate:** ADR-003 addendum must be completed (token values reconciled and committed) before components begin implementing CSS, so Stylelint can validate against the correct token list.

## Project Structure

### Documentation (this mission)

```
kitty-specs/design-system-reference-migration-01KQJNTP/
├── plan.md              ← this file
├── research.md          ← token reconciliation findings
└── tasks/               ← work packages
```

### Source changes (repository root)

```
packages/tokens/
├── src/tokens.css          ← UPDATED: canonical values + @font-face declarations
├── fonts/                  ← NEW: 30 OTF font files (Falling Sky family + Swansea)
├── assets/                 ← NEW: logo.png, logo.webp, favicon.png
├── package.json            ← UPDATED: files[] includes fonts/ and assets/
├── .npmignore              ← UPDATED: fonts/ and assets/ no longer excluded
└── dist/token-catalogue.json ← REGENERATED

packages/angular/src/lib/
├── button/                 ← NEW: ButtonPrimary + ButtonSecondary
├── nav-pill/               ← NEW: NavPill
├── pill-tag/               ← NEW: PillTag
├── check-bullet/           ← NEW: CheckBullet
├── ribbon-card/            ← NEW: RibbonCard
├── section-banner/         ← NEW: SectionBanner
├── feature-card/           ← NEW: FeatureCard
└── form-field/             ← NEW: FormField

packages/html-js/src/
├── button/                 ← NEW: sk-button-primary.html + sk-button-secondary.html
├── nav-pill/               ← NEW
├── pill-tag/               ← NEW
├── check-bullet/           ← NEW
├── ribbon-card/            ← NEW
├── section-banner/         ← NEW
├── feature-card/           ← NEW
└── form-field/             ← NEW

apps/storybook/src/stories/
├── tokens/
│   ├── colours.mdx         ← NEW: colour swatch documentation
│   ├── typography.mdx      ← NEW: type scale + font family docs
│   ├── spacing.mdx         ← NEW: spacing + radius + shadow + motion
│   └── brand.mdx           ← NEW: logo, favicon, icon style, brand voice
└── components/             ← NEW: stories for all 8 component categories

docs/architecture/decisions/ADR-003-addendum-token-values.md  ← COMPLETED
```

## Work Package Outline

### WP-TOKEN-001 — Token reconciliation + fonts + brand assets
Complete ADR-003 addendum; update `tokens.css` with canonical values; add `@font-face` declarations; copy 30 font files to `packages/tokens/fonts/`; copy brand assets to `packages/tokens/assets/`; update `package.json` and `.npmignore`; regenerate catalogue.

**Gate:** First — all subsequent WPs depend on final token values.
**Deliverables:** Updated `tokens.css`, `fonts/` (30 files), `assets/` (3 files), `token-catalogue.json`, completed ADR-003 addendum.

### WP-DOCS-001 — Storybook token documentation pages
Create 4 MDX documentation pages (Colours, Typography, Spacing, Brand) showing all tokens in context with live rendered examples. Update Getting Started page with font loading guidance.

**Gate:** WP-TOKEN-001 complete (tokens and fonts must be present for docs to render correctly).
**Deliverables:** `apps/storybook/src/stories/tokens/{colours,typography,spacing,brand}.mdx`, updated `getting-started.mdx`.

### WP-COMP-001 — Button components
`ButtonPrimary` and `ButtonSecondary` in `packages/html-js` and `packages/angular`, matching `component-buttons.html`. Stories with Default, Hover, Focus, Disabled, Light background states.

**Gate:** WP-TOKEN-001 complete.
**Parallel with:** WP-COMP-002 through WP-COMP-005 (different file ownership).

### WP-COMP-002 — NavPill + PillTag components
`NavPill` and `PillTag` (eyebrow chip + tag variants). Both packages. Stories with Default + active/selected states.

**Gate:** WP-TOKEN-001 complete. **Parallel with:** WP-COMP-001, 003, 004, 005.

### WP-COMP-003 — CheckBullet + SectionBanner components
`CheckBullet` (green checkmark bullet item) and `SectionBanner` (changelog version header). Both packages.

**Gate:** WP-TOKEN-001 complete. **Parallel with:** WP-COMP-001, 002, 004, 005.

### WP-COMP-004 — RibbonCard + FeatureCard components
`RibbonCard` (pricing/workshop card with "PRIMARY" ribbon) and `FeatureCard` (icon + heading + body). Both packages.

**Gate:** WP-TOKEN-001 complete. **Parallel with:** WP-COMP-001, 002, 003, 005.

### WP-COMP-005 — FormField component
`FormField` with `FormInput` (label + input field, validation states). Both packages. This is the most complex component — has Default, Focus, Error, Disabled states.

**Gate:** WP-TOKEN-001 complete. **Parallel with:** WP-COMP-001, 002, 003, 004.

## WP Dependency Graph

```
WP-TOKEN-001 (token reconciliation + fonts + assets)
    ├── WP-DOCS-001 (Storybook token docs)
    ├── WP-COMP-001 (Button) ─────┐
    ├── WP-COMP-002 (NavPill/PillTag)     │ all parallel
    ├── WP-COMP-003 (CheckBullet/Banner)  │
    ├── WP-COMP-004 (Ribbon/Feature)  ────┤
    └── WP-COMP-005 (FormField) ─────────┘
```

Five WPs (DOCS-001 and COMP-001 through COMP-005) can run in parallel after WP-TOKEN-001 completes.

## Complexity Tracking

No charter violations. All work is additive to existing packages. The pre-work gate (ADR-003 addendum completion) is the primary sequencing constraint.
