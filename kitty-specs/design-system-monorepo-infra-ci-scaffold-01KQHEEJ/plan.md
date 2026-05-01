# Implementation Plan: Design System Monorepo Infrastructure & CI Scaffold

*Path: [kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/plan.md](kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/plan.md)*

**Branch**: `main` | **Date**: 2026-05-01 | **Spec**: [spec.md](spec.md)
**Input**: [kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/spec.md](spec.md)

## Summary

Establish the nx monorepo structure, three publishable npm packages (`@spec-kitty/tokens`, `@spec-kitty/angular`, `@spec-kitty/html-js`), multi-framework Storybook, documentation scaffold, doctrine bundle (`doctrine/`), and a full CI quality pipeline — before any visual components are authored. A single minimal stub component validates the end-to-end pipeline. PR preview deployments use surge.sh via GitHub Actions.

## Technical Context

**Language/Version**: TypeScript 5.x (Angular package, Storybook stories); SCSS/CSS (token package); HTML5 + ES2022 modules (html-js package); Node.js 22 LTS (tooling runtime)
**Primary Dependencies**: nx 20.x (monorepo orchestration); Angular 19.x LTS; Storybook 8.x; Playwright 1.x; axe-core 4.x; Stylelint 16.x; ESLint 9.x; HTMLHint 1.x; commitlint 19.x; `@cyclonedx/cyclonedx-npm` 4.x
**Storage**: N/A — static assets and npm packages only
**Testing**: No unit coverage target — quality signal is visual conformance and WCAG 2.1 AA. Storybook interaction tests + Playwright cross-browser smoke tests + axe-core accessibility scans + Lighthouse audits + visual regression snapshots as the primary test surface.
**Target Platform**: Browser (Chrome, Firefox, Safari latest); npm registry (`@spec-kitty` scope); GitHub Pages (Storybook public URL); surge.sh (PR preview)
**Project Type**: nx monorepo with separate publishable packages
**Performance Goals**: Token file < 20 KB uncompressed (NFR-004); Angular chunk < 150 KB compressed (NFR-005); Storybook CI build < 3 min (NFR-003); full CI pipeline < 10 min (NFR-002)
**Constraints**: All CSS output uses `--sk-*` custom properties only (C-003, C-009); no `*`/`latest` version specifiers; Actions pinned to SHA (FR-043); `npm ci --ignore-scripts` in CI (FR-046); `@spec-kitty` npm scope must be owned before release pipeline is active (ADR-005 pre-flight)

## Charter Check

**GATE: PASS** — Reviewed against charter and five ADRs. No conflicts.

Active directives confirmed applicable to this plan:
- **DIRECTIVE_001** (Architectural Integrity): Package boundaries enforced by nx project graph; no cross-package value duplication
- **DIRECTIVE_003** (Decision Documentation): ADR-001 through ADR-005 cover all key decisions; `docs/architecture/decisions/` is pre-populated
- **DIRECTIVE_010** (Specification Fidelity): Implementation must match FR-001 through FR-046 without silent deviation
- **DIRECTIVE_031** (Context-Aware Design): Each package owns exactly its bounded context; no implicit cross-context coupling
- **DIRECTIVE_032** (Conceptual Alignment): `--sk-*` namespace is the canonical token vocabulary; no informal aliases
- **DIRECTIVE_037** (Living Documentation Sync): Storybook stories and `doctrine/` must be updated alongside component changes

**Pre-implementation gates (must clear before WP-TOKEN-001 starts):**
1. `@spec-kitty` npm scope ownership confirmed (ADR-005 pre-flight)
2. Token schema value reconciliation complete — `tmp/colors_and_type.css` audited against live `spec-kitty.ai` CSS (FR-034, ADR-003)

**Architectural review check:** All five ADRs reviewed. No mission WP contradicts any Accepted ADR. (Charter `architectural_review_requirement` satisfied.)

## Project Structure

### Documentation (this mission)

```
kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output (token schema + package contracts)
├── quickstart.md        ← Phase 1 output (contributor onboarding)
├── contracts/           ← Phase 1 output (package.json shapes, nx project.json contracts)
└── tasks/               ← Phase 2 output (/spec-kitty.tasks)
```

### Source Code (repository root)

```
spec-kitty-design/                         ← repository root
├── nx.json                                ← nx workspace config
├── package.json                           ← workspace root (no publishable code)
├── package-lock.json                      ← committed lockfile
├── .npmrc                                 ← scope config (@spec-kitty → npm)
├── .github/
│   ├── dependabot.yml                     ← FR-040: npm + Actions Dependabot
│   ├── workflows/
│   │   ├── ci-quality.yml                 ← PR gates (FR-016–027, FR-041–043, FR-046)
│   │   ├── storybook-deploy.yml           ← GitHub Pages on main merge (FR-033)
│   │   ├── pr-preview.yml                 ← surge.sh preview on PR (NFR-008)
│   │   └── release.yml                    ← npm publish + SBOM on vX.Y.Z tag (FR-044–045)
│   └── security-allowlist.md             ← FR-046: postinstall exceptions with rationale
├── packages/
│   ├── tokens/                            ← @spec-kitty/tokens
│   │   ├── package.json
│   │   ├── src/
│   │   │   └── tokens.css                 ← --sk-* custom properties (ADR-001, ADR-003)
│   │   ├── token-catalogue.json           ← enumerated schema (FR-034)
│   │   └── README.md                      ← FR-030
│   ├── angular/                           ← @spec-kitty/angular
│   │   ├── package.json
│   │   ├── src/
│   │   │   └── lib/
│   │   │       └── stub/                  ← FR-032: stub component
│   │   └── README.md
│   └── html-js/                           ← @spec-kitty/html-js
│       ├── package.json
│       ├── src/
│       │   └── stub/                      ← FR-032: stub component
│       └── README.md
├── apps/
│   └── storybook/                         ← Storybook host app (internal, not published)
│       ├── .storybook/
│       │   ├── main.ts                    ← multi-framework renderer config
│       │   └── preview.ts
│       └── src/
│           └── stories/
│               └── getting-started.mdx   ← FR-031
├── doctrine/                              ← ADR-004: org-layer doctrine bundle
│   ├── directives/
│   │   ├── SK-D01-token-authority.directive.yaml
│   │   └── SK-D02-illustration-boundary.directive.yaml
│   ├── styleguides/
│   │   ├── sk-brand-voice.styleguide.yaml
│   │   └── sk-visual-identity.styleguide.yaml
│   └── graph.yaml                         ← org-layer DRG stub
├── skills/
│   └── spec-kitty-design/                 ← FR-039: enhanced SKILL.md
│       ├── SKILL.md
│       └── rules/
│           ├── brand-voice.md
│           ├── visual-identity.md
│           └── component-authoring.md
├── docs/
│   ├── architecture/                      ← existing SAD-lite + ADRs + diagrams
│   ├── decisions/                         ← ADR directory (FR-029)
│   └── contributing/
│       ├── README.md                      ← FR-028: contributor guide
│       ├── adding-a-token.md
│       ├── adding-a-component.md
│       └── running-quality-checks.md
├── eslint.config.mjs                      ← FR-018: ESLint config (flat config)
├── stylelint.config.mjs                   ← FR-017: Stylelint config
├── .htmlhintrc                            ← FR-019: HTMLHint config
├── commitlint.config.cjs                  ← FR-020: conventional commits
└── playwright.config.ts                   ← FR-023: cross-browser config
```

**Structure decision:** nx monorepo (`packages/` for publishable libs, `apps/storybook/` for the internal Storybook host). No `src/` at repo root — all code lives in packages. The token catalogue (`token-catalogue.json`) is a generated artefact derived from `tokens.css` and committed alongside it.

## Work Package Outline

The following WPs are sequenced by dependency. Hard gates listed; later WPs cannot begin until their gates are satisfied.

### Pre-flight (not a WP — manual checks before any implementation)
- Confirm `@spec-kitty` npm scope is owned and 2FA is enabled (ADR-005)
- Complete token value reconciliation (FR-034, ADR-003) — audit `tmp/colors_and_type.css` vs live `spec-kitty.ai` CSS; record in ADR-003 addendum

### WP-INFRA-001 — nx workspace + lockfile foundation
Sets up the nx workspace root, `package.json`, `nx.json`, `.npmrc`, lockfile, and three empty package skeletons. No code — structure only.
- Gate: pre-flight checks complete
- Deliverables: `nx.json`, root `package.json`, `package-lock.json`, `packages/{tokens,angular,html-js}/package.json`

### WP-TOKEN-001 — Token package implementation
Implements `packages/tokens/src/tokens.css` from the reconciled token catalogue (ADR-003 addendum). Generates `token-catalogue.json`. Adds package `README.md`.
- Gate: WP-INFRA-001 complete; ADR-003 value reconciliation done (FR-034)
- Deliverables: `tokens.css`, `token-catalogue.json`, `packages/tokens/README.md`

### WP-STUB-001 — Stub components (Angular + HTML/JS)
Adds a minimal, unstyled stub component in each framework package — just enough to wire the Storybook and CI pipeline end-to-end (FR-032). No visual design.
- Gate: WP-TOKEN-001 complete
- Deliverables: `packages/angular/src/lib/stub/`, `packages/html-js/src/stub/`

### WP-STORYBOOK-001 — Storybook multi-framework setup
Configures the `apps/storybook/` host with Angular and plain HTML renderers in the same story (FR-006, FR-007). Adds the "Getting Started" page (FR-031) and stub stories for both targets.
- Gate: WP-STUB-001 complete
- Deliverables: `.storybook/main.ts`, `.storybook/preview.ts`, stub stories, `getting-started.mdx`

### WP-CI-001 — Code quality gates (lint, commit, lockfile)
Wires ESLint (FR-018), Stylelint (FR-017), HTMLHint (FR-019), commitlint (FR-020), lockfile drift check (FR-042), `npm audit` (FR-041), `--ignore-scripts` enforcement (FR-046), Actions SHA pinning (FR-043). No visual or browser tests.
- Gate: WP-INFRA-001 complete
- Deliverables: `eslint.config.mjs`, `stylelint.config.mjs`, `.htmlhintrc`, `commitlint.config.cjs`, `.github/workflows/ci-quality.yml` (lint jobs only), `security-allowlist.md`, `dependabot.yml` (FR-040)

### WP-CI-002 — Visual, accessibility, and browser quality gates
Adds Storybook interaction tests (FR-025), axe-core WCAG 2.1 AA (FR-021), Playwright cross-browser (FR-023), Lighthouse (FR-022), visual regression baseline + CI check (FR-024). Extends `ci-quality.yml`.
- Gate: WP-STORYBOOK-001 complete; WP-CI-001 complete
- Deliverables: visual baseline snapshots, `playwright.config.ts`, extended `ci-quality.yml` (visual + a11y + browser jobs)

### WP-DEPLOY-001 — GitHub Pages + surge.sh PR preview
GitHub Pages auto-deploy on `main` merge (FR-033) and surge.sh PR preview workflow (NFR-008). Both via GitHub Actions.
- Gate: WP-STORYBOOK-001 complete; WP-CI-001 complete
- Deliverables: `storybook-deploy.yml`, `pr-preview.yml`

### WP-RELEASE-001 — npm publish pipeline + SBOM
Release workflow triggered on `vX.Y.Z` tag: `npm publish --provenance` (FR-044), CycloneDX SBOM (FR-045), `npm pack --dry-run` dist contents audit.
- Gate: WP-CI-001 complete; WP-TOKEN-001 complete
- Deliverables: `release.yml`

### WP-DOCTRINE-001 — Doctrine bundle + enhanced SKILL.md
Authors and validates the four org-layer doctrine artifacts (FR-036–038): `SK-D01`, `SK-D02`, `sk-brand-voice`, `sk-visual-identity`. Enhances `SKILL.md` with progressive disclosure sub-rules (FR-039). Stubs `doctrine/graph.yaml`.
- Gate: WP-INFRA-001 complete (directory structure)
- Deliverables: `doctrine/directives/SK-D01-*.yaml`, `doctrine/directives/SK-D02-*.yaml`, `doctrine/styleguides/sk-brand-voice.styleguide.yaml`, `doctrine/styleguides/sk-visual-identity.styleguide.yaml`, `doctrine/graph.yaml`, `skills/spec-kitty-design/SKILL.md`, `skills/spec-kitty-design/rules/*.md`

### WP-DOCS-001 — Documentation scaffold
Contributor guide (FR-028), ADR index in `docs/decisions/` (FR-029, already partially populated), per-package READMEs (FR-030). Token schema document (FR-034) produced as part of WP-TOKEN-001 but wired into the docs here.
- Gate: WP-TOKEN-001 complete; WP-STORYBOOK-001 complete
- Deliverables: `docs/contributing/README.md`, `docs/contributing/adding-a-token.md`, `docs/contributing/adding-a-component.md`, `docs/contributing/running-quality-checks.md`

## WP Dependency Graph

```
pre-flight
    └── WP-INFRA-001
            ├── WP-TOKEN-001
            │       └── WP-STUB-001
            │               └── WP-STORYBOOK-001
            │                       ├── WP-CI-002
            │                       └── WP-DEPLOY-001
            ├── WP-CI-001
            │       ├── WP-CI-002
            │       ├── WP-DEPLOY-001
            │       └── WP-RELEASE-001
            └── WP-DOCTRINE-001
```

Parallelisable after WP-INFRA-001: `{WP-CI-001, WP-DOCTRINE-001}` can run alongside `WP-TOKEN-001`.

## Complexity Tracking

No charter violations. All WPs are within the established architectural boundaries. The only non-trivial complexity is the dual-role Storybook (documentation + CI visual regression) acknowledged in `sad-lite.md §4.3` — this is accepted and handled by separate deploy and baseline steps.
