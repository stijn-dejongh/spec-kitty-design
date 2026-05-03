# Implementation Plan: Catalog Completeness & Brand Consistency Pass

**Mission ID**: `01KQPDB5J5EK82K39TF1MPQA7H`
**Slug**: `catalog-completeness-and-brand-consistency-01KQPDB5`
**Branch**: `feature/issue-18-catalog-and-diagram-pipeline`
**Date**: 2026-05-03
**Spec**: [`./spec.md`](./spec.md)
**Origin tracker**: GitHub epic [`#18`](https://github.com/stijn-dejongh/spec-kitty-design/issues/18)

## Summary

Close the post-review backlog so the design system reaches a 1.0-ready state. The work splits into four engineering tracks: (1) **catalog completeness** — fill missing/empty Storybook stories, add a grid layout primitive and a blog-style SkCard; (2) **token compliance** — introduce yellow alpha tokens to retire `rgba()` literals in `sk-nav-pill.css`, replace the dashboard-demo Done-lane opacity cascade with a semantic muted-colour token; (3) **drawer self-containment** — split `sk-nav-pill-drawer.css` from `sk-nav-pill.css` and move `skToggleDrawer` into the package as an ES module export; (4) **diagram branding pipeline** — extract the inline `%%{init}%%` Mermaid theme blocks into a single `sk-mermaid-theme.yaml`, add a Node render script driven by `mmdc`, and gate it in CI so source/SVG drift is rejected.

The technical approach is conservative: reuse every existing tool already in the monorepo (Nx, Storybook 10.x, stylelint, ESLint, axe, commitlint, GitHub Actions). No new framework, no new test runner, no new package manager. Five ADR-worthy decisions are surfaced in [`./research.md`](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 (Storybook stories, Angular components), JavaScript ES2022 (html-js component modules), CSS3 / CSS Custom Properties (component styles), YAML (brand-theme source), Bash + Node 20 (build/render scripts)
**Primary Dependencies**: Storybook 10.x, Nx 21.x, stylelint with `stylelint-declaration-strict-value` (against `packages/tokens/dist/token-catalogue.json`), ESLint with `@nx/enforce-module-boundaries`, htmlhint, axe-core (Storybook a11y addon), Mermaid CLI (`@mermaid-js/mermaid-cli`, binary `mmdc`), commitlint, GitHub Actions
**Storage**: N/A — purely presentational; no persisted state
**Testing**: Storybook visual baselines (Playwright-driven snapshot test, ≤2% pixel-count drift tolerance), axe-core WCAG 2.1 AA scans on every story, stylelint strict-value rule, htmlhint on `apps/demo/*.html`, ESLint module-boundary rule. No unit-test runner. New tests for `skToggleDrawer` are visual-via-Storybook, not headless DOM.
**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari — latest two majors per charter), Node 20+ for build and CI
**Project Type**: Nx monorepo — three publishable packages (`@spec-kitty/tokens`, `@spec-kitty/html-js`, `@spec-kitty/angular`), one Storybook app, one demo apps directory; deploys to GitHub Pages
**Performance Goals** (from spec NFRs, restated): Storybook build ≤ 3 minutes total CI duration (NFR-001); diagram-render CI step adds ≤ 60 s when triggered (NFR-002); combined byte size of basic-pill CSS + drawer-CSS ≤ current `sk-nav-pill.css` byte size + 5 % (NFR-006); first-time integrator can produce a working drawer in ≤ 10 minutes using only public package docs (NFR-007)
**Constraints**: Token-only sourcing for all design values (charter + C-001); token-only dependency boundary html-js / angular → tokens (C-002); BEM with `sk-` prefix (C-003); every component story exports a `LightMode` variant (C-004); `apps/demo/*.html` must work in both file:// dev and the deploy `sed`-rewritten path (C-005); zero regression to existing stories or demo pages (C-006); conventional commits with existing scope vocabulary (C-007); token-catalogue regenerated and committed with any token change (C-008); no new top-level Storybook category without justification (C-009); Mermaid stays as the diagram engine (C-010); new tokens follow `--sk-color-*` naming (C-011); reasoning-loop / skill errors logged to `tmp/finding/` per charter Findings Log Practice (C-012)
**Scale/Scope**: ≈ 6 component story files touched or expanded (Button, FeatureCard, RibbonCard, NavPill, PillTag, SectionBanner); ≈ 2 net-new components (grid layout primitive, blog-style SkCard); ≈ 3 new tokens (`--sk-color-yellow-alpha-*`); ≈ 1 CSS file split (`sk-nav-pill-drawer.css`); ≈ 1 new JS module export (`skToggleDrawer`); ≈ 1 new build script (`scripts/render-diagrams.{sh,js}`); ≈ 1 new CI workflow or job (`docs-diagrams.yml` per ADR-PLAN-005); 8 Mermaid `.mmd` files migrated to use `%%THEME%%` placeholder

## Charter Check

*GATE: must pass before Phase 0 research. Re-check after Phase 1 design.*

| Charter rule | Plan compliance | Notes |
|---|---|---|
| Tokens are the single source of truth for all design values | ✅ Pass | Mission is precisely closing residual debt against this rule. New `--sk-color-yellow-alpha-*` tokens added centrally; Done-lane fix uses `--sk-fg-muted` and `--sk-fg-subtle` semantic tokens. |
| No hardcoded `rgba()`, hex, or pixel literals in shipped component CSS | ✅ Pass | Stylelint strict-value gate already enforces this; mission removes the existing `sk-nav-pill.css` violations and the dashboard-demo opacity cascade. |
| `packages/html-js` and `packages/angular` only import from `packages/tokens` | ✅ Pass | No new cross-package imports introduced. The `skToggleDrawer` module lives within `packages/html-js`, so internal imports stay within the package. |
| Every component story exports a `LightMode` variant | ✅ Pass | New stories (grid primitive, blog SkCard, populated HTML stories for NavPill / PillTag / SectionBanner) all add `LightMode`. |
| Storybook build ≤ 3 minutes | ✅ Pass | New stories are static markdown/HTML examples; no runtime dependency adds. Build budget held. |
| Token additions / renames must regenerate the catalogue | ✅ Pass | Yellow alpha additions trigger `npx nx run tokens:catalogue` as part of the WP that introduces them. |
| Conventional commits with existing scope vocabulary | ✅ Pass | All anticipated commits map to `tokens`, `html-js`, `angular`, `storybook`, `ci`, `docs`. |
| Demo-page dual-path (file:// + deploy `sed` rewrite) | ✅ Pass | New components added via the same relative-path pattern; deploy workflow's `sed` step covers `packages/...` paths generically — no new mapping required unless a new top-level package directory is created (none planned). |
| Findings Log Practice | ✅ Pass | Implementer agents log to `tmp/finding/`; per charter, lane worktrees should symlink the directory (CLI gap noted in `tmp/finding/2026-05-03-worktree-tmp-finding-symlink-not-automated.md`). |
| Semver — additive tokens don't bump major | ✅ Pass | `--sk-color-yellow-alpha-*` are additive; no rename/removal of existing tokens. |
| Visual baselines must not regress beyond 2 % pixel-count drift | ✅ Pass | Mission deliberately changes specific stories (NavPill drawer extraction, dashboard-demo Done lane). Baselines for those stories will be refreshed in the same WP that changes them. Untouched component baselines stay green. |

**Result**: ✅ All gates pass at plan time. Re-check after Phase 1 design.

## Project Structure

### Documentation (this mission)

```
kitty-specs/catalog-completeness-and-brand-consistency-01KQPDB5/
├── meta.json
├── spec.md
├── plan.md                       # this file
├── research.md                   # Phase 0 — ADR-worthy decisions with rationale
├── contracts/
│   ├── nav-pill-drawer-module.md     # JS module export contract for skToggleDrawer
│   ├── diagram-pipeline-ci-gate.md   # CI gate behavioural contract
│   └── brand-theme-source.md         # Schema + injection contract for sk-mermaid-theme.yaml
├── quickstart.md                 # Phase 1 — contributor onboarding for the mission's tracks
├── checklists/
│   └── requirements.md           # spec quality checklist (created during specify)
├── status.json
├── status.events.jsonl
└── tasks/                        # populated by /spec-kitty.tasks
```

(`data-model.md` is intentionally omitted — this is a presentational mission with no persisted entities, value objects, or state transitions to model.)

### Source code (repository root)

```
packages/
├── tokens/
│   ├── src/tokens.css                # ADD: --sk-color-yellow-alpha-{15,35,60} (or chosen scale)
│   └── dist/token-catalogue.json     # REGENERATE after token additions
├── html-js/
│   └── src/
│       ├── nav-pill/
│       │   ├── sk-nav-pill.css           # MODIFY — remove rgba() literals, drop drawer rules
│       │   ├── sk-nav-pill-drawer.css    # NEW — drawer/hamburger/breakpoint rules
│       │   ├── sk-nav-pill.js            # NEW or MODIFY — export skToggleDrawer (named export)
│       │   ├── sk-nav-pill.d.ts          # NEW or MODIFY — typing for the JS module
│       │   ├── sk-nav-pill.stories.ts    # MODIFY — populated HTML story; CollapsedHamburger uses module
│       │   └── index.ts                  # MODIFY — re-export module + CSS files
│       ├── pill-tag/
│       │   └── sk-pill-tag.stories.ts    # MODIFY — populated HTML story
│       ├── section-banner/
│       │   └── sk-section-banner.stories.ts  # MODIFY — populated HTML story
│       ├── feature-card/
│       │   └── sk-feature-card.stories.ts    # MODIFY — colorized-border variant
│       ├── ribbon-card/
│       │   └── sk-ribbon-card.stories.ts     # MODIFY — colorized-border variant
│       ├── grid/                          # NEW component
│       │   ├── sk-grid.css
│       │   ├── sk-grid.stories.ts
│       │   └── index.ts
│       └── blog-card/                     # NEW component (blog-style SkCard)
│           ├── sk-blog-card.css
│           ├── sk-blog-card.stories.ts
│           └── index.ts
├── angular/
│   └── src/lib/button/
│       ├── *.component.{ts,html,css}     # MODIFY — primary/secondary stories carry full styling
│       └── *.stories.ts                  # MODIFY — full Default + variant exports
└── …
apps/
├── demo/
│   └── dashboard-demo.html               # MODIFY — Done-lane semantic colour, drawer toggle import
└── storybook/                            # no config change expected
docs/
└── architecture/assets/
    ├── sk-mermaid-theme.yaml             # NEW — brand-theme source
    ├── *.mmd                              # MODIFY × 8 — replace inline %%{init}%% with %%THEME%%
    ├── *.svg                              # REGENERATE × 8 via render script
    └── README.md                         # NEW or MODIFY — render workflow docs
scripts/
└── render-diagrams.{sh,js}               # NEW — theme injection + mmdc render + drift check
.github/workflows/
└── docs-diagrams.yml                     # NEW (per ADR-PLAN-005 — separate workflow, not extending ci-quality)
docs/contributing/
└── adding-a-token.md                     # MODIFY only if a new token prefix is introduced
```

**Structure decision**: Continue with the existing Nx monorepo + per-component subdirectory layout. Two new components (`grid`, `blog-card`) follow the established `sk-<name>/{css,stories.ts,index.ts}` pattern. The drawer split places the new file alongside `sk-nav-pill.css` (same directory) so consumers can import either or both via `@spec-kitty/html-js`. The diagram-pipeline workflow lives in its own file (`docs-diagrams.yml`) rather than extending `ci-quality.yml` so it can be triggered by path filter on `docs/architecture/**` without coupling to the broader quality gate.

## Phase Plan

### Phase 0 — Research (this command)

Output: [`./research.md`](./research.md). Surfaces five ADR-worthy decisions called out in the spec's Open Decisions section. Each entry follows the **Decision / Rationale / Alternatives considered** format and references its source issue / FR. The decisions:

- **PLAN-001** — Yellow alpha token naming (`--sk-color-yellow-alpha-{15,35,60}` vs `-light/medium/strong` vs single-token-with-`color-mix()`)
- **PLAN-002** — Drawer-CSS file split layout (sibling file vs subdirectory vs CSS layer)
- **PLAN-003** — `skToggleDrawer` JS module shape (named export vs default class vs custom element)
- **PLAN-004** — Diagram render-script implementation (Bash + sed vs Node script vs Python script)
- **PLAN-005** — Diagram pipeline CI topology (extend `ci-quality.yml` vs new `docs-diagrams.yml`)
- **PLAN-006** — Done-lane semantic colour approach (token swap vs CSS layer override vs muted-state utility)
- **PLAN-007** — Net-new components scope bound (grid primitive shape; blog-card composition)

### Phase 1 — Design & Contracts (this command)

Output:

- [`./contracts/nav-pill-drawer-module.md`](./contracts/nav-pill-drawer-module.md) — JS module export contract for `skToggleDrawer(buttonElement)`: signature, side effects, ARIA expectations, idempotency, and "no consumer copy-paste from apps/demo" guarantee (FR-010, FR-011)
- [`./contracts/diagram-pipeline-ci-gate.md`](./contracts/diagram-pipeline-ci-gate.md) — CI gate behavioural contract: trigger paths, source-vs-rendered drift detection, exit codes, diagnostic output (FR-013, FR-014, FR-015, FR-016)
- [`./contracts/brand-theme-source.md`](./contracts/brand-theme-source.md) — Schema for `sk-mermaid-theme.yaml` and the `%%THEME%%` injection contract; explicit listing of theme variables that the source owns (FR-013)
- [`./quickstart.md`](./quickstart.md) — Contributor onboarding for the mission's tracks: how to add a token, regenerate the catalogue, write a populated story, run the diagram render script, debug a drift-rejection in CI

`data-model.md` is intentionally omitted (no persisted data; presentational mission).

## Charter re-check after Phase 1

| Re-checked rule | Result |
|---|---|
| Token-only sourcing remains intact in design artifacts | ✅ Pass — contracts reference only `--sk-*` tokens |
| Module-boundary discipline preserved | ✅ Pass — `skToggleDrawer` lives entirely within `@spec-kitty/html-js`; consumers import from package, not from `apps/demo/` |
| `LightMode` story present on every new component | ✅ Pass — quickstart restates the rule; story-template snippet included |
| Demo-page dual-path | ✅ Pass — drawer JS import in `dashboard-demo.html` follows the relative path (`../../packages/html-js/...`) that the deploy `sed` step rewrites |
| Diagram pipeline gate runs identically locally and in CI | ✅ Pass — `scripts/render-diagrams.*` is invoked the same way in both contexts (no CI-only flags) |
| Findings Log Practice honoured by implementer agents | ⚠️ Behaviour-dependent — implementer agents must write to `tmp/finding/`; until upstream worktree-symlink lands, manual `ln -s ../../../tmp/finding tmp/finding` step is required in each lane (documented in quickstart) |

**Result**: ✅ All hard gates pass. One soft-pass (Findings Log) carries a documented manual workaround until the upstream CLI change lands.

## Complexity Tracking

*Empty — no Charter Check violations to justify.*
