# Catalog Completeness & Brand Consistency Pass

**Mission ID**: `01KQPDB5J5EK82K39TF1MPQA7H`
**Slug**: `catalog-completeness-and-brand-consistency-01KQPDB5`
**Mission type**: `software-dev`
**Origin tracker**: GitHub epic [`stijn-dejongh/spec-kitty-design#18`](https://github.com/stijn-dejongh/spec-kitty-design/issues/18) — *Epic: Catalog completeness, token-debt cleanup, and diagram branding pipeline*
**Rolls up**: issues `#2`, `#10`, `#11`, `#12`, `#13`, `#14`
**Sibling mission (do not block on)**: epic `#17` — Design-system docsite pilot

## Mission Overview

The post-review remediation mission left a backlog of catalog gaps, token-compliance debt, drawer-extraction work, and an unfinished diagram-branding chore. Each item is small in isolation; together they keep the design system from reaching a credible **1.0-ready state** and they will be visibly broken the moment the docsite pilot (epic #17) ships against the same catalog.

This mission closes that backlog so that:

- a downstream consumer of `@spec-kitty/html-js` or `@spec-kitty/angular` sees a **complete, consistently styled** catalog in Storybook with no placeholder/empty stories
- every CSS value in shipped component code is **token-driven** (no `rgba()` channel literals, no `opacity` cascades expressing colour intent)
- the nav-pill **collapsed/drawer pattern is self-contained** in the published package — consumers do not need to copy script or CSS from `apps/demo/`
- architecture diagrams render from a **single shared brand-theme source** with CI guarding drift between source and rendered output

The mission is the prerequisite catalog-completeness pass that unblocks the docsite pilot and any 1.0 publish to npm.

## Domain Language

| Term | Canonical meaning |
|---|---|
| **Catalog** | The set of components published in `@spec-kitty/html-js` and `@spec-kitty/angular` and visible in the deployed Storybook. |
| **Variant** | A named `Story` export beyond `Default` that captures one specific state, size, modifier, or theme of a component. |
| **LightMode story** | The mandatory story export per component that wraps the component in the `data-theme="light"` surface block (existing convention). |
| **Drawer** | The slide-out side navigation panel that the nav-pill exposes at narrow viewports via the hamburger button. |
| **Drawer-CSS** | The subset of nav-pill styles that exist solely to support the drawer/hamburger collapsed mode (animation, breakpoint, hamburger button). |
| **Brand-theme source** | A single canonical file holding the theme variables (colours, fonts, backgrounds, edge labels) used by every architecture diagram. |
| **Token-compliance debt** | CSS values in shipped component code that bypass `var(--sk-*)` by using `rgba()`, hex literals, pixel literals, or opacity-as-colour cascades. |
| **C-202 violation** | A specific class of token-compliance debt — a hardcoded brand-colour channel literal — flagged by code-review heuristic C-202 against ADR-001. |

Synonyms to avoid (pick the canonical term): "story" vs "variant" (use *story* for the file, *variant* for non-default exports); "guides" vs "docs" (in this mission's scope, use *Storybook stories* — guides belong to the sibling docsite mission); "diagram theme" vs "brand-theme source" (use *brand-theme source*).

## User Scenarios

### Scenario 1 — Browsing a complete catalog (primary)

**Actor**: a developer evaluating the design system for adoption in their downstream product.
**Trigger**: opens the deployed Storybook URL.
**Happy path**:

1. They land on the catalog index and click through every component listed under Components / Form / Navigation / Primitives / Tags.
2. Every component's `Default` story renders with full styling — no element appears as raw unstyled HTML.
3. Every component referenced by name in epic-rollup issue #10 (Buttons, FeatureCard, RibbonCard, NavPill, PillTag, SectionBanner) has visible styled output and the variants the issue calls out (e.g. colorized borders for FeatureCard / RibbonCard).
4. The catalog includes a **grid layout primitive** and a **blog-style SkCard** that the docsite pilot will reuse.

**Failure mode being prevented**: the consumer sees blank/unstyled previews, concludes the catalog is unfinished, and rejects adoption.

### Scenario 2 — Adopting the nav-pill drawer in a downstream page

**Actor**: a developer integrating the nav-pill collapsed/drawer pattern into their own page.
**Trigger**: reads the nav-pill README and Storybook docs.
**Happy path**:

1. They install `@spec-kitty/html-js` and import only from package paths — no copy-paste from `apps/demo/`.
2. The drawer toggles correctly via the hamburger button on first try (interactive in their page **and** in Storybook's `CollapsedHamburger` story).
3. If they don't need the drawer (only the basic horizontal pill), they can opt out of the drawer-specific CSS without losing the basic pill styling — the drawer styles are not bundled into the basic pill consumer.

**Failure mode being prevented**: consumer adopts the pill, never sees the drawer working in Storybook, manually reverse-engineers the demo HTML, ships an inconsistent copy.

### Scenario 3 — Updating the brand yellow

**Actor**: a maintainer responding to a brand refresh or accessibility audit.
**Trigger**: edits one value in `packages/tokens/src/tokens.css` (`--sk-color-yellow` or related).
**Happy path**:

1. After regenerating the token catalogue and rebuilding component CSS, every previously hardcoded yellow channel in shipped CSS picks up the new value automatically — no further file edits required.
2. Stylelint's strict-value rule passes; no `rgba(245, 197, 24, …)` literal remains anywhere under `packages/html-js/` or `packages/angular/`.
3. The Done-lane styling in `dashboard-demo.html` reflects the new colour through a semantic muted-colour token rather than via an `opacity:0.6` cascade.

**Failure mode being prevented**: brand drift — the token changes, but visually-yellow areas of components silently keep the old colour.

### Scenario 4 — Updating an architecture diagram's brand line colour

**Actor**: a maintainer aligning architecture diagrams with a token change.
**Trigger**: edits one value in the shared brand-theme source file.
**Happy path**:

1. They run the diagram-render script locally; every architecture diagram under `docs/architecture/assets/` re-renders with the new colour.
2. They commit the rendered SVGs alongside the theme change.
3. CI passes. If they had committed the theme change without re-rendering, CI would have rejected the PR with a clear diagnostic.

**Failure mode being prevented**: brand drift in long-form documentation — diagrams silently diverge from token values across multiple files.

### Edge cases

- A consumer wants the basic nav-pill but **not** the drawer → drawer-CSS is independently importable so they don't ship 70+ unused lines.
- A new component is added later (after this mission) → the catalog-completeness pattern (Default + state variants + LightMode + tokens-only + axe-clean) is documented for that flow.
- The diagram-render script fails locally because Mermaid CLI is not installed → contributor sees a clear error pointing to install instructions, not a stack trace.
- A token added by this mission collides with a pre-existing name → mission halts and renames before merge (no silent override).
- A reviewer touches a `.mmd` source for stylistic reasons and forgets to re-render → CI blocks the PR with the source-vs-rendered diagnostic.

## Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| **FR-001** | Every component currently published in `packages/html-js/src/` and `packages/angular/src/lib/` MUST have a Storybook `Default` story that renders with full styling — no element appears as raw unstyled HTML. | Required |
| **FR-002** | The Button component MUST expose a fully styled primary variant story and a fully styled secondary variant story (closes #10 "ButtonPrimary unstyled" / "ButtonSecondary raw HTML"). | Required |
| **FR-003** | The FeatureCard component MUST expose at least one variant story demonstrating the colorized-border treatment (closes #10). | Required |
| **FR-004** | The RibbonCard component MUST expose at least one variant story demonstrating the colorized-border treatment (closes #10). | Required |
| **FR-005** | The NavPill component MUST have a populated, fully styled HTML story (no empty HTML version) (closes #10). | Required |
| **FR-006** | The PillTag component MUST have a populated, fully styled HTML story (no empty HTML version) (closes #10). | Required |
| **FR-007** | The SectionBanner component MUST have a populated, fully styled HTML story (no empty HTML version) (closes #10). | Required |
| **FR-008** | The catalog MUST include a grid layout primitive — a reusable component or Storybook example demonstrating the grid structure used across the reference compositions (closes #10). | Required |
| **FR-009** | The catalog MUST include a blog-style SkCard suitable for the blog-post listing/preview composition (closes #10). | Required |
| **FR-010** | A consumer of `@spec-kitty/html-js` MUST be able to adopt the nav-pill collapsed/drawer pattern by importing only from the published package — no copy-paste of script or markup from `apps/demo/` is required (closes #13). | Required |
| **FR-011** | The Storybook story for the nav-pill collapsed/hamburger mode MUST be interactive — clicking the hamburger MUST open and close the drawer inside Storybook (closes #13). | Required |
| **FR-012** | A consumer that uses only the basic horizontal nav-pill MUST be able to opt out of drawer-specific styling — the drawer-CSS MUST be independently importable from the basic pill CSS (closes #12). | Required |
| **FR-013** | A maintainer changing one value in the shared brand-theme source file MUST cause all architecture diagrams under `docs/architecture/assets/` to pick up that change on the next render run, with no per-`.mmd`-file edits (closes #2). | Required |
| **FR-014** | CI MUST reject any pull request that modifies a `.mmd` source file without committing a regenerated rendered output for that source (closes #2). | Required |
| **FR-015** | CI MUST reject any pull request that modifies the shared brand-theme source file without committing regenerated rendered output for every diagram dependent on that theme (closes #2). | Required |
| **FR-016** | A contributor MUST be able to run the same diagram-render flow locally as CI — no CI-only render path. | Required |
| **FR-017** | The Done-lane styling in `apps/demo/dashboard-demo.html` MUST express its muted-state intent via semantic colour tokens rather than via an `opacity` cascade on a parent element (closes #14). | Required |

## Non-Functional Requirements

| ID | Requirement | Threshold | Status |
|---|---|---|---|
| **NFR-001** | Storybook build time MUST stay within the existing CI envelope. | ≤ 3 minutes total Storybook build time on the standard CI runner (charter performance budget). | Required |
| **NFR-002** | The diagram-render CI step (when triggered) MUST add bounded latency to PR feedback. | ≤ 60 seconds added to total CI duration on a PR that touches diagram sources, on the standard CI runner. | Required |
| **NFR-003** | Visual baselines for components NOT touched by this mission MUST NOT regress. | Zero new pixel-diff failures beyond the existing 2% pixel-count drift tolerance on untouched stories. | Required |
| **NFR-004** | Every new or modified component story MUST pass automated WCAG 2.1 AA scans. | Zero axe-core violations on Default and on the `LightMode` variant. | Required |
| **NFR-005** | Stylelint strict-value compliance MUST be 100% across `packages/html-js/` and `packages/angular/` shipped CSS. | Zero strict-value rule violations after this mission ships. | Required |
| **NFR-006** | The nav-pill CSS payload split MUST not increase the total CSS weight a consumer who imports both basic pill and drawer pays vs. today. | Combined byte size of basic-pill CSS + drawer-CSS ≤ current `sk-nav-pill.css` byte size + 5%. | Required |
| **NFR-007** | A consumer integrating the nav-pill drawer pattern MUST be able to do so quickly using only public package documentation. | A first-time integrator can produce a working drawer in ≤ 10 minutes using only the package README + Storybook docs (no `apps/demo/` source reading required). | Required |

## Constraints

| ID | Constraint | Status |
|---|---|---|
| **C-001** | All design values in shipped component CSS MUST reference `var(--sk-*)` tokens defined in `packages/tokens/src/tokens.css`. No raw `rgba()`, `#hex`, or `Npx` literals are permitted in shipped component CSS (charter rule, restated). | Active |
| **C-002** | Token-only dependency boundary MUST remain enforced — `packages/html-js` and `packages/angular` import only from `packages/tokens` (existing rule, not relaxed). | Active |
| **C-003** | BEM naming MUST remain in force — `sk-block__element--modifier` with the `sk-` block prefix. | Active |
| **C-004** | Every component story file MUST continue to export a `LightMode` variant. | Active |
| **C-005** | The two demo pages (`apps/demo/blog-demo.html` and `apps/demo/dashboard-demo.html`) MUST continue to work in **both** modes: (a) loaded via local file:// from the working directory using relative `../../packages/...` paths, AND (b) served from the deploy root after the workflow's `sed` rewrite step. Any new component added by this mission MUST be reachable via both paths. | Active |
| **C-006** | This mission MUST NOT regress any existing Storybook story or `apps/demo/*.html` page. | Active |
| **C-007** | Conventional commits with the existing scope vocabulary MUST be used (`tokens`, `html-js`, `angular`, `storybook`, `ci`, `docs`, etc.). | Active |
| **C-008** | Token additions or renames MUST regenerate `packages/tokens/dist/token-catalogue.json` and commit it in the same change. | Active |
| **C-009** | This mission MUST NOT introduce a new top-level Storybook category (Components / Form / Navigation / Primitives / Tags / Tokens) without explicit justification recorded in the plan phase. | Active |
| **C-010** | The diagram-render flow MUST keep using Mermaid as the rendering engine (no migration to PlantUML or other engines as part of this mission). | Active |
| **C-011** | New tokens introduced to retire `rgba()` literals MUST follow the existing `--sk-color-*` naming convention; if a new prefix is introduced, `docs/contributing/adding-a-token.md` MUST be updated in the same change. | Active |
| **C-012** | Reasoning-loop and `spec-kitty` skill-invocation errors encountered during this mission's work MUST be logged to `tmp/finding/` per the charter Findings Log Practice. | Active |

## Success Criteria

| ID | Outcome | How to verify (technology-agnostic) |
|---|---|---|
| **SC-001** | Catalog completeness — a manual catalog walk finds zero stories rendering with empty/unstyled HTML. | Reviewer opens deployed Storybook, clicks every story under Components / Form / Navigation / Primitives / Tags; every preview is styled. |
| **SC-002** | Token compliance — zero hardcoded colour or opacity-as-colour values remain in shipped component CSS. | Stylelint passes cleanly across `packages/html-js/` and `packages/angular/`; targeted greps for `rgba(`, `#` colour literals, and `opacity:` in shipped CSS return either zero matches or only token-bound usages. |
| **SC-003** | Variant coverage — every component named in epic-rollup issue #10 has the variants the issue calls out (Button primary/secondary styling, FeatureCard/RibbonCard colorized borders, NavPill/PillTag/SectionBanner populated HTML stories). | Reviewer cross-checks each named component's stories list against #10 acceptance bullets. |
| **SC-004** | Drawer self-containment — a first-time consumer integrates the nav-pill drawer in ≤ 10 minutes using only published package docs and Storybook. | Time-boxed integration walkthrough by someone who has not seen the demo pages; success is a working open/close drawer with no `apps/demo/` source consulted. |
| **SC-005** | Diagram brand consistency — updating one value in the shared brand-theme source changes all 8 architecture diagrams' rendered output on next build, and CI fails any PR that desyncs a `.mmd` from its rendered output. | Maintainer changes one theme variable, runs the render flow, observes change in all dependent SVGs; a deliberately desync'd PR is rejected by CI. |
| **SC-006** | No regression — Storybook deploys on every push to `main` without manual intervention; build time stays within the existing envelope. | CI pipeline reports green on the merge commit; build duration ≤ baseline + tolerance. |
| **SC-007** | Catalog inclusivity — the docsite pilot mission (epic #17) can be planned against this catalog without surfacing additional "missing component" gaps. | Epic #17 specification step does not need to add net-new components beyond what this mission delivers. |

## Assumptions

- The reference set under `tmp/reference_system/` and the public site at `https://spec-kitty.ai/blog` together remain the authoritative visual baseline for what "complete" looks like for the components called out in #10. (User explicitly named both as cross-check sources.)
- The grid layout primitive and the blog-style SkCard are bounded by what the reference set + `https://spec-kitty.ai/blog` need; this mission is not scoping a general-purpose CSS Grid wrapper.
- New tokens introduced to replace `rgba()` channel literals will follow the existing `--sk-color-*` naming pattern (see C-011); the architectural decision on exactly which token names to introduce is deferred to the plan phase.
- The "block on 1.0" items (#12, #13) are in scope because the mission is explicitly aiming at a 1.0-ready state.
- The CI scaffold mission (`design-system-monorepo-infra-ci-scaffold-01KQHEEJ`) shipped earlier — its CI infrastructure is the host for the new diagram-pipeline CI step. This dependency is met as of the mission start date.
- Visual diff tooling and axe-core scans currently in CI continue to be the primary quality signal (no new test framework introduced).
- Path discrepancy noted in #10 (`/home/stijnd/Documents/code/forks/spec-kitty-design/tmp/reference_system/preview` vs the actual local path `/home/stijn/Documents/_code/SDD/fork/spec-kitty-design/tmp/reference_system/`) is treated as a typo in the issue text — the local working path is authoritative.

## Out of Scope

- The docsite pilot itself (epic #17 — sibling mission). This mission does not deliver Storybook MDX guides integration or a static-site generator.
- Migrating to CSS relative-colour syntax (`oklch(from var(--sk-color-yellow) l c h / 0.14)`) in place of explicit alpha tokens — explicitly deferred per #11 Option B note.
- Adding net-new components beyond those identified by the cross-check in #10.
- Adding Vue, Svelte, or other framework wrappers beyond html-js + Angular.
- Refactoring components that are already complete and token-compliant.
- Restructuring the existing Storybook category taxonomy.
- Migrating away from Mermaid for architecture diagram rendering.
- Decisions about specific token names, file splits, JS module shape, render-script implementation, or CI job topology — these are deliberately deferred to the architectural / planning phase.

## Dependencies

| Dependency | Type | Status |
|---|---|---|
| `design-system-monorepo-infra-ci-scaffold-01KQHEEJ` | Prior mission (CI infrastructure host for diagram-pipeline CI step) | Met |
| `packages/tokens/src/tokens.css` as single token authority | Existing project rule (charter) | Stable; new tokens added here must regenerate the catalogue |
| Existing axe-core / stylelint / commitlint CI gates | Existing project quality gates | Stable; reused |
| `tmp/reference_system/` and `https://spec-kitty.ai/blog` as visual baselines | External reference | Stable |
| Mermaid CLI (`mmdc`) availability locally and in CI | Tool dependency | To be confirmed during plan phase; reasonable assumption is "available, may need install step in CI" |

## Open Decisions

None at the spec phase. The user explicitly deferred all technical-shape decisions (specific token names, file splits, JS module shape, render-script implementation, CI job topology) to the architectural / planning phase. The plan phase MUST surface these decisions and record them per `DIRECTIVE_003` and the `adr-drafting-workflow` tactic.

## Traceability

| Source | Mapping |
|---|---|
| Issue #10 (catalog gaps) | FR-001 .. FR-009; SC-001, SC-003 |
| Issue #11 (yellow alpha tokens / C-202 violation) | C-001, C-011; SC-002 |
| Issue #12 (drawer-CSS extraction) | FR-012; NFR-006 |
| Issue #13 (skToggleDrawer in package) | FR-010, FR-011; NFR-007; SC-004 |
| Issue #14 (Done-lane opacity) | FR-017; SC-002 |
| Issue #2 (diagram branding pipeline) | FR-013, FR-014, FR-015, FR-016; SC-005 |
| Charter — token-only rule | C-001, C-002, C-008 |
| Charter — Findings Log Practice | C-012 |
| Sibling epic #17 (docsite pilot) | SC-007 (catalog must be complete enough that #17 doesn't need to add components) |
