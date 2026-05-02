# Specification: Post-Review Remediation and Demo Deploy

**Mission:** post-review-remediation-and-demo-deploy-01KQM7XS
**Status:** Draft
**Date:** 2026-05-02

---

## Overview

Following a post-implementation code-quality audit (Reviewer Renata) and architectural review (Architect Alphonso), eight outstanding items were identified across the design system. This mission resolves all of them in a single coherent delivery: token compliance violations, a component boundary refactor blocking a 1.0 publish, a JS module that needs extracting into the distributable package, fragile CSS patterns in the dashboard demo, missing light/dark Storybook coverage, demo pages absent from the live deployment, a light-mode surface inconsistency in the blog demo, and an outdated README.

---

## Goals

- Bring `@spec-kitty/tokens` and `@spec-kitty/html-js` into full C-202 token compliance.
- Enforce the component boundary between the nav-pill pill bar and its hamburger/drawer extension before the 1.0 publish gate.
- Make the drawer toggle logic self-contained and distributable.
- Eliminate fragile CSS patterns from the dashboard demo.
- Give every Storybook story entry a verified light-mode and dark-mode variant with correct token rendering.
- Make both demo applications reachable from the live GitHub Pages Storybook site.
- Align the blog-demo light-mode header surface with the dashboard demo.
- Provide a README that communicates the project vision and guides new contributors.

## Non-Goals

- No new components or tokens beyond the alpha-channel additions required by FR-001.
- No changes to Angular component logic.
- No redesign of existing demo page content or copy.
- No migration to a different Storybook version.
- No CSS-relative-colour (`oklch(from …)`) adoption — this is tracked separately as a future DRIFT item.

---

## User Scenarios & Testing

### Scenario A — Token system consumer updates a brand colour

A design engineer changes `--sk-color-yellow` in `tokens.css`. All yellow alpha-tint usages in the design system automatically follow — no manual hunt for `rgba(245, 197, 24, …)` literals required.

### Scenario B — Angular or desktop-only HTML consumer imports nav-pill

A consumer imports only `sk-nav-pill.css`. They receive zero drawer or hamburger bytes. Their build does not include code for an interaction pattern they are not using.

### Scenario C — Storybook contributor previews a component in both themes

A contributor opens any component story and selects the "Light" variant. The component renders with correct light-mode token values — backgrounds, text, and borders all respond to `data-theme="light"` — not merely a white canvas behind unchanged dark-mode tokens.

### Scenario D — Developer finds the live demo from the README

A new contributor lands on the GitHub repository. The README immediately communicates the project purpose, shows a link to the live Storybook and demo pages, and provides a quick-start usage guide for consuming tokens and components.

### Scenario E — Reviewer audits the Storybook deployment

An auditor visits `https://stijn-dejongh.github.io/spec-kitty-design/` and finds both the blog-demo and dashboard-demo pages linked from the Storybook introduction, accessible at predictable URLs without relative-path breakage.

---

## Functional Requirements

| ID | Description | Status | Notes |
|----|-------------|--------|-------|
| FR-001 | The tokens package must expose `--sk-color-yellow-alpha-15`, `--sk-color-yellow-alpha-35`, and `--sk-color-yellow-alpha-60` as named custom properties in `packages/tokens/src/tokens.css`. | Approved | Resolves C-202 violation in `sk-nav-pill.css` |
| FR-002 | The `.sk-nav-pill__hamburger:hover` rule in `sk-nav-pill.css` must reference the three new alpha tokens rather than `rgba()` channel literals. | Approved | Closes DEF-01 from Renata review |
| FR-003 | All hamburger button styles, drawer styles, `--has-drawer` modifier, and `--responsive` modifier (including the 720px media query) must be extracted from `sk-nav-pill.css` into a new file `packages/html-js/src/nav-pill/sk-nav-pill-drawer.css`. The base `sk-nav-pill.css` must contain zero drawer or hamburger CSS after this change. | Approved | Alphonso Concern 3; blocks 1.0 publish |
| FR-004 | The `CollapsedHamburger` Storybook story must import `sk-nav-pill-drawer.css` in addition to `sk-nav-pill.css`, and its `parameters.docs.description` must document the two-file import requirement. | Approved | Companion to FR-003 |
| FR-005 | A function `skToggleDrawer` must be exported from `packages/html-js/src/nav-pill/sk-nav-pill.js` and re-exported from the package `index.ts`. The function must toggle `is-open` on the drawer element, update `aria-expanded`, and update `aria-label` between "Open navigation" and "Close navigation". | Approved | Alphonso Concern 4 / Renata Check F |
| FR-006 | The `CollapsedHamburger` Storybook story must import `skToggleDrawer` from the package and use it as the hamburger `onclick` handler, making the drawer interactive within Storybook. | Approved | Companion to FR-005 |
| FR-007 | The demo pages (`apps/demo/dashboard-demo.html`, `apps/demo/blog-demo.html`) must import `skToggleDrawer` from `packages/html-js/src/nav-pill/sk-nav-pill.js` rather than defining it inline. | Approved | Companion to FR-005 |
| FR-008 | The Done-lane header in `apps/demo/dashboard-demo.html` must apply `color: var(--sk-fg-muted)` and `background: var(--sk-surface-card)` directly to the header element and its dot, replacing the `opacity: 0.6` / `opacity: 1` cascade. | Approved | Closes DEF-06 from Renata review |
| FR-009 | The `storybook-deploy.yml` GitHub Actions workflow must copy `apps/demo/blog-demo.html` and `apps/demo/dashboard-demo.html` into the `storybook-static/` output directory after the Storybook build step, with all `../../packages/` relative asset paths replaced by paths valid from the Storybook deployment root. | Approved | Issue #15 |
| FR-010 | The Storybook introduction page (`apps/storybook/src/stories/Introduction.mdx` or equivalent) must include navigable links to both deployed demo pages. | Approved | Companion to FR-009 |
| FR-011 | Every non-stub component story in `packages/html-js/src/` must export a `LightMode` story variant that wraps its render output in a `data-theme="light"` container and sets `parameters.backgrounds.default` to `'sk-light'`. Stories that already have a `LightBackground` or `OnLightBackground` variant must be upgraded to also apply `data-theme="light"`. | Approved | Applies to: button, card, check-bullet, feature-card, form-field, nav-pill, pill-tag, ribbon-card, section-banner, site-footer |
| FR-012 | Every non-stub component story in `packages/angular/src/` must export a `LightMode` story variant that applies `data-theme="light"` via a decorator or wrapper and sets `parameters.backgrounds.default` to `'sk-light'`. | Approved | Applies to: button-primary, button-secondary, feature-card, nav-pill, pill-tag, ribbon-card |
| FR-013 | The `[data-theme="light"] header` background in `apps/demo/blog-demo.html` must be changed from `var(--sk-surface-hero)` to `var(--sk-surface-card)` to align with the dashboard demo header surface. | Approved | User-reported visual inconsistency |
| FR-014 | `README.md` must be updated to include: (a) a vision/description section explaining the design-system purpose and its relationship to the Spec Kitty ecosystem; (b) a condensed usage guide covering token import, component CSS consumption, and Storybook exploration; (c) a link to the live Storybook site at `https://stijn-dejongh.github.io/spec-kitty-design/` and to both demo pages. | Approved | Issue #15 companion / new contributor onboarding |

---

## Non-Functional Requirements

| ID | Description | Threshold | Status |
|----|-------------|-----------|--------|
| NFR-001 | All modified CSS files must pass the existing project lint/build pipeline without errors or new warnings. | Zero new errors or warnings in `nx run tokens:build` and `nx run html-js:build` | Approved |
| NFR-002 | The Storybook build must complete without TypeScript errors after story changes. | Zero TS errors in `nx run storybook:build` | Approved |
| NFR-003 | The GitHub Actions `storybook-deploy.yml` must complete end-to-end in under 10 minutes on a standard GitHub-hosted runner. | < 10 minutes total workflow duration | Approved |
| NFR-004 | Light-mode story variants must pass axe accessibility checks at the same level as existing dark-mode variants (no new axe violations introduced). | Zero new axe violations across all LightMode stories | Approved |
| NFR-005 | The `sk-nav-pill-drawer.css` split must not change any rendered visual output — dark-mode and light-mode rendering of the nav pill with drawer must be pixel-equivalent before and after the split. | Visual equivalence confirmed by Storybook story rendering | Approved |

---

## Constraints

| ID | Description | Status |
|----|-------------|--------|
| C-001 | All CSS values must use `--sk-*` design tokens. No hardcoded hex, `rgb()`, or `rgba()` with channel literals is permitted in any modified CSS file, except where explicitly documented as a known deviation (DRIFT entry). The new `--sk-color-yellow-alpha-*` tokens added by FR-001 resolve the existing DRIFT-level deviation in `sk-nav-pill.css`. | Binding |
| C-002 | No new `window.*` globals may be introduced in demo pages. The `skToggleDrawer` extraction (FR-005) must remove the existing inline definition; the drawer toggle must be the only global interaction script remaining after FR-007 is implemented. | Binding |
| C-003 | The `sk-nav-pill.css` file after FR-003 must import zero CSS from `sk-nav-pill-drawer.css` — the split is a strict separation, not a re-export chain. Consumers choose which file to import. | Binding |
| C-004 | The README (FR-014) must not contain implementation details (framework names, file paths, internal architecture). It is written for contributors and evaluators, not for implementers. | Binding |
| C-005 | The demo page asset-path fix required by FR-009 must not alter the local development paths (`../../packages/`) — the fix applies only to the CI copy step or via self-contained asset embedding, leaving local file:// serving intact. | Binding |

---

## Assumptions

- `--sk-color-yellow` resolves to `#F5C518` (channels: 245, 197, 24). Alpha tokens in FR-001 are derived from this value.
- Browser baseline for `data-theme` attribute on a wrapper `<div>` is sufficient for light-mode token propagation (no `<html>`-root requirement for the component scope used in Storybook stories).
- The Storybook introduction page already exists or can be created as an MDX file without restructuring the Storybook configuration.
- GitHub Pages serves the `storybook-static/` output at `https://stijn-dejongh.github.io/spec-kitty-design/`; demo pages copied into that directory will be reachable at `https://stijn-dejongh.github.io/spec-kitty-design/blog-demo.html` etc.
- Angular story light-mode variants use a story-level decorator that wraps the component host in a `data-theme="light"` element; no global `preview.ts` decorator change is required.

---

## Success Criteria

- Zero `rgba()` channel literals remain in any `@spec-kitty/html-js` CSS file after delivery.
- `sk-nav-pill.css` contains no hamburger or drawer CSS; `sk-nav-pill-drawer.css` exists and is independently importable.
- `skToggleDrawer` is importable from `@spec-kitty/html-js` (or its dist equivalent); the function is not defined inline in any demo page.
- Every non-stub Storybook story has a `LightMode` export that renders components with correct light-mode token values.
- Both demo pages are reachable from the live Storybook GitHub Pages deployment without broken asset links.
- The blog-demo header background matches the dashboard header background in light mode.
- The README communicates project purpose, provides a usage quick-start, and links to the live site.
- `nx run storybook:build` completes without TypeScript errors or new axe violations.

---

## Key Entities

- **Design token** — a `--sk-*` CSS custom property defined in `packages/tokens/src/tokens.css`; the single authoritative source for all visual values (ADR-001).
- **Alpha token** — a design token whose value is a semi-transparent colour, used when a component needs a tinted surface derived from a brand colour.
- **Component CSS file** — a single-responsibility CSS file under `packages/html-js/src/<component>/`; consumers import only the files for components they use.
- **Storybook story variant** — a named export from a `.stories.ts` file that renders a component in a specific state or context; `LightMode` and `Default` (dark) are the two required baseline variants for every component.
- **Demo page** — a self-contained static HTML file under `apps/demo/` demonstrating real-world usage of the design system; part of the live Storybook deployment.
