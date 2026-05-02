# Tasks: Design System Reference Migration

*Path: [kitty-specs/design-system-reference-migration-01KQJNTP/tasks.md](tasks.md)*

**Branch**: `main` → `main` | **Mission**: `design-system-reference-migration-01KQJNTP`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Audit `colors_and_type.css` vs current `tokens.css` — document all value discrepancies | WP01 | | [D] |
| T002 | Update `packages/tokens/src/tokens.css` with reconciled canonical values + new token categories | WP01 | | [D] |
| T003 | Regenerate `token-catalogue.json`; verify Stylelint passes on updated tokens | WP01 | | [D] |
| T004 | Complete `ADR-003-addendum-token-values.md` with final values, OKLCH/hex decision, and resolved discrepancies | WP01 | | [D] |
| T005 | Copy 30 OTF font files from `tmp/fonts/` to `packages/tokens/fonts/` | WP02 | | [D] |
| T006 | Add `@font-face` declarations to `tokens.css` with `./fonts/` relative paths; update `--sk-font-*` variables | WP02 | | [D] |
| T007 | Copy `logo.png`, `logo.webp`, `favicon.png` to `packages/tokens/assets/` | WP02 | [D] |
| T008 | Update `packages/tokens/package.json` `files` array + `.npmignore` to include `fonts/` and `assets/` | WP02 | | [D] |
| T009 | Update Storybook `preview.ts` to ensure brand fonts render in all stories | WP02 | | [D] |
| T010 | Validate `npm pack --dry-run` shows fonts and assets; check compressed package size (NFR-101 < 5 MB) | WP02 | | [D] |
| T011 | Create `apps/storybook/src/stories/tokens/colours.mdx` — all colour tokens as labelled swatches | WP03 | | [D] |
| T012 | Create `typography.mdx` — font family specimens, scale steps, weight variants | WP03 | [D] |
| T013 | Create `spacing.mdx` — space scale rulers, radius shapes, shadow + motion tokens | WP03 | [D] |
| T014 | Create `brand.mdx` — logo usage, favicon, icon style guidance, brand voice summary (no illustrations) | WP03 | [D] |
| T015 | Update `getting-started.mdx` with font loading pattern (CDN link vs npm install) | WP03 | | [D] |
| T016 | Implement `ButtonPrimary` and `ButtonSecondary` HTML primitives in `packages/html-js/src/button/` | WP04 | | [D] |
| T017 | Implement `ButtonPrimaryComponent` and `ButtonSecondaryComponent` in `packages/angular/src/lib/button/` | WP04 | [D] |
| T018 | Export both button components from each package's `src/index.ts` | WP04 | | [D] |
| T019 | Write button Storybook stories: Default, Hover, Focus, Disabled, Light-bg states; verify axe passes | WP04 | | [D] |
| T020 | Update visual regression baseline for button stories | WP04 | | [D] |
| T021 | Implement `NavPill` HTML primitive in `packages/html-js/src/nav-pill/` (nav bar with active/hover states) | WP05 | | [D] |
| T022 | Implement `NavPillComponent` in `packages/angular/src/lib/nav-pill/` | WP05 | [D] |
| T023 | Implement `PillTag` and `EyebrowPill` HTML primitives in `packages/html-js/src/pill-tag/` | WP05 | [D] |
| T024 | Implement `PillTagComponent` and `EyebrowPillComponent` in `packages/angular/src/lib/pill-tag/` | WP05 | | [D] |
| T025 | Export NavPill, PillTag, EyebrowPill from package entry points | WP05 | | [D] |
| T026 | Write stories: NavPill (Default, Active, Hover variants), PillTag (Default, Green, Purple, Breaking); verify axe | WP05 | | [D] |
| T027 | Implement `CheckBullet` HTML primitive in `packages/html-js/src/check-bullet/` | WP06 | | [D] |
| T028 | Implement `SectionBanner` HTML primitive in `packages/html-js/src/section-banner/` | WP06 | [D] |
| T029 | Implement `CheckBulletComponent` and `SectionBannerComponent` in `packages/angular/src/lib/` | WP06 | | [D] |
| T030 | Export from package entry points | WP06 | | [D] |
| T031 | Write stories: CheckBullet (Default, List), SectionBanner (Default, purple, green); verify axe | WP06 | | [D] |
| T032 | Implement `FeatureCard` HTML primitive in `packages/html-js/src/feature-card/` | WP07 | | [D] |
| T033 | Implement `RibbonCard` HTML primitive in `packages/html-js/src/ribbon-card/` (card + ribbon banner) | WP07 | [D] |
| T034 | Implement `FeatureCardComponent` and `RibbonCardComponent` in `packages/angular/src/lib/` | WP07 | | [D] |
| T035 | Export from package entry points | WP07 | | [D] |
| T036 | Write stories: FeatureCard (Default, light), RibbonCard (Default, with ribbon, without ribbon); verify axe | WP07 | | [D] |
| T037 | Update visual regression baselines for card stories | WP07 | | [D] |
| T038 | Implement `FormField` container HTML primitive in `packages/html-js/src/form-field/` | WP08 | | [D] |
| T039 | Implement `FormInput` and `FormTextarea` HTML primitives with all validation states | WP08 | | [D] |
| T040 | Implement `FormFieldComponent`, `FormInputComponent`, `FormTextareaComponent` in Angular package | WP08 | | [D] |
| T041 | Export all form components from entry points | WP08 | | [D] |
| T042 | Write stories: FormField (Default, Focus, Error, Disabled, Filled), FormTextarea (same); verify axe | WP08 | | [D] |
| T043 | Update visual regression baselines for form stories | WP08 | | [D] |

| T044 | Create `docs/design-system/README.md` overview and navigation hub | WP09 | | [D] |
| T045 | Create `docs/design-system/using-tokens.md` — install, load, consume `--sk-*` properties | WP09 | [D] |
| T046 | Create `docs/design-system/using-components.md` — import and render all 8 component categories | WP09 | [D] |
| T047 | Create `docs/design-system/brand-guidelines.md` — voice, colour, typography, iconography, mascot policy | WP09 | [D] |
| T048 | Create `docs/design-system/changelog.md` stub | WP09 | [D] |

---

## Work Packages

### WP01 — Token Value Reconciliation

**Goal**: Produce the final canonical `tokens.css` by mapping reference values (`colors_and_type.css`) to ADR-003 naming, adding missing token categories, and completing the ADR-003 addendum.
**Priority**: P0 — all component WPs depend on correct final token values.
**Independent test**: `npm run quality:stylelint` passes; `token-catalogue.json` lists tokens with correct ADR-003 names; ADR-003 addendum shows all discrepancies resolved.
**Estimated prompt size**: ~280 lines
**Prompt**: [WP01-token-value-reconciliation.md](tasks/WP01-token-value-reconciliation.md)

- [x] T001 Audit `colors_and_type.css` vs current `tokens.css` — document value discrepancies (WP01)
- [x] T002 Update `packages/tokens/src/tokens.css` with reconciled canonical values + new token categories (WP01)
- [x] T003 Regenerate `token-catalogue.json`; verify Stylelint passes (WP01)
- [x] T004 Complete `ADR-003-addendum-token-values.md` (WP01)

**Dependencies**: none (pre-work gate for all other WPs)
**Risks**: Reference uses flat naming (`--sk-yellow`) while ADR-003 requires `--sk-color-yellow` — careful mapping required; don't lose the soft/deep colour variants that exist in the reference.

---

### WP02 — Font Bundle + Brand Assets

**Goal**: Bundle 30 brand font OTF files into `@spec-kitty/tokens`, add `@font-face` declarations, copy brand assets (logo, favicon), and validate the published package includes all assets.
**Priority**: P1 — font rendering in Storybook and consuming projects.
**Independent test**: In a blank HTML document loading `tokens.css` via file reference, a heading with `font-family: var(--sk-font-display)` renders in Falling Sky (not a system font). `npm pack --dry-run` lists `fonts/FallingSkyBold-*.otf`.
**Estimated prompt size**: ~340 lines
**Prompt**: [WP02-font-bundle-brand-assets.md](tasks/WP02-font-bundle-brand-assets.md)

- [x] T005 Copy 30 OTF font files to `packages/tokens/fonts/` (WP02)
- [x] T006 Add `@font-face` declarations to `tokens.css` with `./fonts/` paths; update `--sk-font-*` vars (WP02)
- [x] T007 Copy `logo.png`, `logo.webp`, `favicon.png` to `packages/tokens/assets/` (WP02)
- [x] T008 Update `packages/tokens/package.json` files array + `.npmignore` (WP02)
- [x] T009 Update Storybook `preview.ts` to ensure brand fonts render (WP02)
- [x] T010 Validate `npm pack --dry-run` and compressed size (WP02)

**Dependencies**: WP01 (fonts sit alongside the reconciled `tokens.css`)
**Risks**: Swansea font files are TTF (not OTF) — ensure `@font-face` format declaration is correct; font file sizes may push package over 5 MB limit, requiring selective inclusion of font variants.

---

### WP03 — Storybook Token Documentation Pages

**Goal**: Create 4 MDX documentation pages (Colours, Typography, Spacing, Brand) showing all design tokens with live rendered examples. Update Getting Started with font loading guidance.
**Priority**: P1 — token documentation is the primary contributor-facing reference.
**Independent test**: Storybook opens; navigating to each of the 4 pages shows live token examples rendering with brand fonts; no axe violations on any page; Storybook build remains < 3 min.
**Estimated prompt size**: ~380 lines
**Prompt**: [WP03-storybook-token-docs.md](tasks/WP03-storybook-token-docs.md)

- [x] T011 Create `colours.mdx` — colour token swatches (WP03)
- [x] T012 Create `typography.mdx` — font family specimens, scale, weights (WP03)
- [x] T013 Create `spacing.mdx` — space scale, radius, shadow, motion (WP03)
- [x] T014 Create `brand.mdx` — logo, favicon, icon style, brand voice (WP03)
- [x] T015 Update `getting-started.mdx` with font loading pattern (WP03)

**Dependencies**: WP02 (brand fonts must be loaded for typography page to render correctly)
**Parallel with**: WP04–WP08 (different file ownership)

---

### WP04 — Button Components

**Goal**: Implement `ButtonPrimary` and `ButtonSecondary` in both packages matching the `component-buttons.html` reference, with Storybook stories covering all states.
**Priority**: P2
**Independent test**: `<sk-button-primary>Get started</sk-button-primary>` renders yellow fill + dark text + pill radius; `npm run quality:stylelint` passes; zero axe violations.
**Estimated prompt size**: ~320 lines
**Prompt**: [WP04-button-components.md](tasks/WP04-button-components.md)

- [x] T016 Implement ButtonPrimary + ButtonSecondary HTML primitives (WP04)
- [x] T017 Implement ButtonPrimaryComponent + ButtonSecondaryComponent Angular (WP04)
- [x] T018 Export from package entry points (WP04)
- [x] T019 Write button stories with all states; verify axe (WP04)
- [x] T020 Update visual regression baselines (WP04)

**Dependencies**: WP01 (final token values), WP02 (fonts for story rendering)

---

### WP05 — Navigation + Tag Components

**Goal**: Implement `NavPill` (floating nav bar with active/hover states), `PillTag`, and `EyebrowPill` in both packages.
**Priority**: P2
**Independent test**: NavPill renders as a floating pill container with active item highlighted in yellow; PillTag variants render with correct accent colours; zero axe violations.
**Estimated prompt size**: ~360 lines
**Prompt**: [WP05-navigation-tag-components.md](tasks/WP05-navigation-tag-components.md)

- [x] T021 Implement NavPill HTML primitive (WP05)
- [x] T022 Implement NavPillComponent Angular (WP05)
- [x] T023 Implement PillTag + EyebrowPill HTML primitives (WP05)
- [x] T024 Implement PillTagComponent + EyebrowPillComponent Angular (WP05)
- [x] T025 Export from package entry points (WP05)
- [x] T026 Write NavPill and PillTag stories; verify axe (WP05)

**Dependencies**: WP01, WP02
**Parallel with**: WP04, WP06, WP07, WP08

---

### WP06 — Content Marker Components

**Goal**: Implement `CheckBullet` (green checkmark list item) and `SectionBanner` (changelog version section header with coloured dot) in both packages.
**Priority**: P2
**Independent test**: A `<sk-check-bullet>` item renders a green `--sk-color-green` checkmark glyph with `--sk-fg-default` text; SectionBanner with `variant="purple"` renders with purple background tint; zero axe violations.
**Estimated prompt size**: ~290 lines
**Prompt**: [WP06-content-marker-components.md](tasks/WP06-content-marker-components.md)

- [x] T027 Implement CheckBullet HTML primitive (WP06)
- [x] T028 Implement SectionBanner HTML primitive (WP06)
- [x] T029 Implement both Angular components (WP06)
- [x] T030 Export from entry points (WP06)
- [x] T031 Write stories with colour variant states; verify axe (WP06)

**Dependencies**: WP01, WP02
**Parallel with**: WP04, WP05, WP07, WP08

---

### WP07 — Card Components

**Goal**: Implement `FeatureCard` (icon chip + heading + body) and `RibbonCard` (workshop/pricing card with optional "PRIMARY" ribbon banner) in both packages.
**Priority**: P2
**Independent test**: FeatureCard renders icon chip with correct colour variant, heading in `--sk-font-display`, body in `--sk-font-sans`; RibbonCard with ribbon renders the yellow banner overlay; zero axe violations.
**Estimated prompt size**: ~370 lines
**Prompt**: [WP07-card-components.md](tasks/WP07-card-components.md)

- [x] T032 Implement FeatureCard HTML primitive (WP07)
- [x] T033 Implement RibbonCard HTML primitive (WP07)
- [x] T034 Implement both Angular components (WP07)
- [x] T035 Export from entry points (WP07)
- [x] T036 Write card stories with states; verify axe (WP07)
- [x] T037 Update visual regression baselines (WP07)

**Dependencies**: WP01, WP02
**Parallel with**: WP04, WP05, WP06, WP08

---

### WP08 — Form Field Components

**Goal**: Implement `FormField` (container with label/description slot), `FormInput` (text input), and `FormTextarea` covering Default, Focus, Error, Disabled, and Filled states — the most complex component category.
**Priority**: P2
**Independent test**: `FormField` with `state="error"` renders red border + error message in `--sk-color-red`; disabled input has 50% opacity and `cursor: not-allowed`; zero axe violations including label association.
**Estimated prompt size**: ~400 lines
**Prompt**: [WP08-form-field-components.md](tasks/WP08-form-field-components.md)

- [x] T038 Implement FormField container HTML primitive (WP08)
- [x] T039 Implement FormInput + FormTextarea HTML primitives with all states (WP08)
- [x] T040 Implement FormFieldComponent, FormInputComponent, FormTextareaComponent Angular (WP08)
- [x] T041 Export all from entry points (WP08)
- [x] T042 Write stories for all form states; verify axe (label association, error announcements) (WP08)
- [x] T043 Update visual regression baselines (WP08)

**Dependencies**: WP01, WP02
**Parallel with**: WP04, WP05, WP06, WP07

---


### WP09 — User Guide Documentation

**Goal**: Create a consumer-facing user guide in `docs/design-system/` covering token consumption, component usage, brand guidelines, and a changelog stub.
**Priority**: P2 — parallel with component WPs
**Independent test**: All 5 markdown files present; no emoji; sentence case headings; brand voice consistent with the `sk-brand-voice` styleguide.
**Estimated prompt size**: ~340 lines
**Prompt**: [WP09-user-guide-docs.md](tasks/WP09-user-guide-docs.md)

- [x] T044 Create `docs/design-system/README.md` overview (WP09)
- [x] T045 Create `docs/design-system/using-tokens.md` (WP09)
- [x] T046 Create `docs/design-system/using-components.md` (WP09)
- [x] T047 Create `docs/design-system/brand-guidelines.md` (WP09)
- [x] T048 Create `docs/design-system/changelog.md` stub (WP09)

**Dependencies**: WP02 (font loading patterns), WP03 (Storybook URL references)
**Parallel with**: WP04–WP08

---

## Dependency Summary

```
WP01 (token reconciliation) — foundation gate
    └── WP02 (fonts + assets)
            ├── WP03 (token docs)    ─────────────────────────┐
            ├── WP04 (buttons)       ── parallel after WP02   │
            ├── WP05 (nav + tags)    ── parallel              │
            ├── WP06 (check + banner)── parallel              │
            ├── WP07 (cards)         ── parallel              │
            ├── WP08 (form fields)   ── parallel              │
            └── WP09 (user guide docs) ── parallel ─────────────┘
```

## MVP Scope

WP01 + WP02 + WP03 delivers the minimum viable reference migration: correct token values, brand fonts, and complete design-token documentation in Storybook. Component WPs (WP04–WP08) can be delivered incrementally and are independently deployable.
