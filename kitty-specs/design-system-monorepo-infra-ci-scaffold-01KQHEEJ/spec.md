# Feature Specification: Design System Monorepo Infrastructure & CI Scaffold

*Path: [kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/spec.md](kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/spec.md)*

**Mission ID**: 01KQHEEJWTWH6CPPRZ287SPH2G
**Created**: 2026-05-01
**Status**: Draft
**Target Branch**: main

## Overview

Establish the repository structure, multi-framework Storybook configuration, independently publishable distribution packages, contributor documentation scaffold, and automated CI quality pipeline for the Spec Kitty design system — before any visual components are authored.

The outcome is a repository that enforces quality from the first component commit: contributors get fast, automated feedback on accessibility, visual conformance, code style, and cross-browser behavior on every pull request. Consuming developers can import exactly the packages they need without taking unnecessary dependencies.

No visual design components are produced by this mission. A single minimal stub component is added solely to verify the pipeline is wired correctly end to end.

## Domain Language

| Term | Canonical definition | Synonyms to avoid |
|---|---|---|
| **Design token** | A named CSS custom property (`--sk-*`) encoding a single visual decision (color, spacing, type scale, radius, etc.) | variable, css var, theme value |
| **Framework target** | A specific rendering environment for which components are packaged and distributed (Angular; plain JS/HTML) | adapter, platform port |
| **Distribution package** | A publishable npm unit — one per framework target plus one for tokens — each independently versioned | module, artifact, bundle |
| **Primitive** | A design system element (HTML markup + token-only styles) with no JavaScript dependency, usable in static HTML | base component, unstyled element |
| **Story** | A Storybook document entry demonstrating one component in one or more named states | example, demo, showcase |
| **Visual baseline** | The approved set of rendered story snapshots used as the reference state for visual regression checks | golden file, snapshot |
| **CI quality pipeline** | The automated sequence of checks that runs on every pull request and must all pass before merge | build, checks, automation |

## User Scenarios & Testing

### User Story 1 — First-time contributor onboarding (Priority: P1)

As a new design system contributor, I want to clone the repository and have all local tooling installed and passing so that I can start contributing without a lengthy manual setup.

**Why this priority**: If onboarding is painful, contributors will work around quality tools or avoid contributing entirely.

**Independent test**: Clone the repo on a clean machine, follow the contributor guide, run the local quality check command, and confirm all checks pass with no errors against the empty (stub-only) repository state.

**Acceptance scenarios**:

1. **Given** a clean checkout of the repository, **when** a contributor follows the setup steps in the contributor guide, **then** all local quality checks run and pass within 30 minutes.
2. **Given** a contributor adds a change that violates a style rule, **when** they run local checks, **then** the specific violation is reported with the file and line — before they open a pull request.

---

### User Story 2 — Pull request quality gate (Priority: P1)

As a contributor, I want every pull request to receive automated pass/fail feedback across all quality dimensions so that I know whether my change is ready to merge without waiting for manual review.

**Why this priority**: Manual review for mechanical issues wastes reviewer time and slows iteration.

**Independent test**: Open a pull request with a known accessibility violation and confirm that the CI pipeline reports a WCAG failure, blocks merge, and clearly identifies the failing story and criterion.

**Acceptance scenarios**:

1. **Given** a PR that introduces a WCAG 2.1 AA violation in a Storybook story, **when** CI runs, **then** the accessibility check fails, the PR is blocked, and the violation is named in the CI report.
2. **Given** a PR where all quality checks pass, **when** CI runs, **then** the PR receives a green status and is eligible for merge.
3. **Given** a PR where a visual regression is detected, **when** CI runs, **then** the visual check flags the story and diff, and the PR is blocked until a maintainer approves the visual change.
4. **Given** a PR with a non-conventional commit message, **when** CI runs, **then** commit validation fails and the contributor receives instructions for correcting the message.

---

### User Story 3 — Multi-framework Storybook (Priority: P1)

As a consumer developer, I want to browse the design system Storybook and see how each component looks and behaves in my preferred framework target so that I can assess fit before adding a dependency.

**Why this priority**: Consumers must be able to evaluate components without importing them into a project first.

**Independent test**: Open the Storybook, navigate to the stub component, and confirm it renders in Angular and plain HTML tabs within the same story entry.

**Acceptance scenarios**:

1. **Given** the Storybook is running, **when** a consumer opens a component story, **then** they can view the component rendered as an Angular component and as plain HTML from the same page.
2. **Given** the Storybook is running, **when** a consumer resizes the viewport, **then** the component preview responds and the story shows the defined responsive breakpoints.

---

### User Story 4 — Package consumption (Priority: P2)

As a developer building a project that uses the Spec Kitty design language, I want to install only the packages I need so that I do not take on dependencies irrelevant to my stack.

**Why this priority**: Unnecessary dependencies slow builds and increase maintenance surface.

**Independent test**: In a fresh project, install only the token package, reference it via a CDN link, and confirm the `--sk-*` custom properties are available without any build tool.

**Acceptance scenarios**:

1. **Given** a plain HTML project, **when** the developer references the token distribution file, **then** all `--sk-*` custom properties are available with no build step required.
2. **Given** an Angular project, **when** the developer installs the Angular distribution package, **then** they can import an Angular component without also importing the plain HTML package.
3. **Given** a developer who only needs tokens, **when** they install only the token package, **then** no Angular or JavaScript utility code is included.

---

### User Story 5 — Release publishing (Priority: P2)

As a maintainer, I want to publish all updated packages to npm by pushing a version tag so that releases are reproducible and require no manual packaging steps.

**Why this priority**: Manual release steps introduce error risk and slow response to downstream consumers.

**Independent test**: Push a version tag and confirm all changed packages publish to npm with the correct version within 5 minutes, with no manual intervention beyond the tag.

**Acceptance scenarios**:

1. **Given** a new version tag is pushed, **when** the release pipeline runs, **then** all packages with version increments are published to npm automatically.
2. **Given** a token name change that constitutes a breaking change, **when** the release pipeline runs, **then** it blocks publication unless the version increment is a major bump.

---

### Edge Cases

- A contributor runs the quality pipeline in an environment missing a required runtime — the error message must identify the missing dependency and link to setup instructions.
- A PR changes only documentation (README, story prose) with no component code — the pipeline must still pass without false failures on inapplicable checks.
- The visual baseline does not yet exist (first run after a fresh clone) — the pipeline must create the baseline rather than fail with a "no baseline found" error.
- A contributor submits a story for a component that has no interactive states — the Storybook interaction test step must skip gracefully rather than error.
- A package version is tagged that has no changes since the last release — the release pipeline must skip publication for unchanged packages rather than publishing a duplicate.

## Functional Requirements

| ID | Description | Status |
|---|---|---|
| FR-001 | The repository is organized as independently releasable sub-packages: one for design tokens, one per supported framework target (Angular; plain JS/HTML), and one for shared Storybook documentation | Proposed |
| FR-002 | A contributor can build, test, and release one framework target package without affecting the build or test output of other packages | Proposed |
| FR-003 | A new framework target can be added as a new package without restructuring existing packages | Proposed |
| FR-004 | Every distribution package includes its own versioning metadata and publishing configuration | Proposed |
| FR-005 | A single command installs all workspace dependencies and leaves the repository in a state where all quality checks can run | Proposed |
| FR-006 | A single Storybook catalog serves as the authoritative documentation surface for all design system components across framework targets | Proposed |
| FR-007 | The Storybook renders each component under its supported framework targets from a single story entry — Angular and plain HTML at minimum | Proposed |
| FR-008 | Each Storybook story covers: default state, all named interactive states (hover, focus, active, disabled where applicable), and at least two responsive breakpoints | Proposed |
| FR-009 | The Storybook is buildable to a static site suitable for public hosting without additional configuration | Proposed |
| FR-010 | A consumer can import only the design token package with no transitive dependency on component code | Proposed |
| FR-011 | An Angular consumer can install and import the Angular component package independently from the plain HTML package | Proposed |
| FR-012 | A plain HTML or plain JavaScript consumer can use the token distribution file with no build tooling (direct file reference or CDN link) | Proposed |
| FR-013 | All distribution packages are published to npm under a shared scope | Proposed |
| FR-014 | The `--sk-*` CSS custom property namespace is the single authoritative source for all design token values; no package or story may hardcode a visual value outside the token file | Proposed |
| FR-015 | A breaking change to a token name is detectable and blocked from publishing without a corresponding major version increment | Proposed |
| FR-016 | Every pull request automatically triggers the full CI quality pipeline without manual intervention | Proposed |
| FR-017 | The CI quality pipeline validates stylesheet conventions on every changed stylesheet file | Proposed |
| FR-018 | The CI quality pipeline validates script conventions on every changed script file | Proposed |
| FR-019 | The CI quality pipeline validates HTML markup correctness on every changed HTML file | Proposed |
| FR-020 | The CI quality pipeline validates commit message format on every commit in the pull request | Proposed |
| FR-021 | The CI quality pipeline runs automated accessibility checks against all Storybook stories and reports WCAG 2.1 AA violations with the affected story and criterion | Proposed |
| FR-022 | The CI quality pipeline runs automated performance audits against the Storybook build and reports the results | Proposed |
| FR-023 | The CI quality pipeline runs cross-browser automated tests covering a minimum of three major browsers (Chrome, Firefox, Safari latest) | Proposed |
| FR-024 | The CI quality pipeline runs visual regression checks comparing rendered story snapshots against the established visual baseline and flags deviations | Proposed |
| FR-025 | The CI quality pipeline runs Storybook interaction tests for all stories that define interactive behaviors | Proposed |
| FR-026 | Any failing quality gate blocks the pull request from merging until the issue is resolved or explicitly waived by a maintainer | Proposed |
| FR-027 | CI quality results are visible directly on the pull request without requiring access to any external dashboard | Proposed |
| FR-028 | The repository includes a contributor guide covering: local environment setup, adding a design token, adding a component story, running quality checks locally, and submitting a pull request | Proposed |
| FR-029 | The repository includes an architecture decision record (ADR) directory pre-seeded with entries for: the monorepo package topology, and the token authority rule | Proposed |
| FR-030 | Each distribution package includes a README describing: what the package contains, how to install it, and which other packages it depends on | Proposed |
| FR-031 | The Storybook includes a "Getting Started" page for consumers describing how to install and use the token package | Proposed |
| FR-032 | A single minimal stub component is present in each framework target package and has a passing Storybook story, to confirm the full pipeline is wired end to end | Proposed |
| FR-033 | The Storybook static build is automatically deployed to GitHub Pages on every merge to the main branch, making the current catalog publicly accessible at a stable URL without manual steps | Proposed |
| FR-034 | Before the token package is implemented, a token schema document is published that defines all `--sk-*` property categories, naming conventions, and values reconciled against the Claude Design reference and the live marketing site CSS | Proposed |
| FR-035 | The CI pipeline uses path-scoped triggering so that token-only changes, component changes, and documentation-only changes each run only the quality checks relevant to the changed files | Proposed |
| FR-036 | A `doctrine/` directory is established with org-layer-compatible structure and a `graph.yaml` stub, ready for `spec-kitty doctrine fetch` integration when the org-layer DRG feature ships | Proposed |
| FR-037 | Two project doctrine directives are authored and schema-validated: one encoding the `--sk-*` token authority rule and one encoding the illustration content boundary (mascot assets excluded from software packages) | Proposed |
| FR-038 | Two project doctrine styleguides are authored and schema-validated: one covering brand voice and terminology rules, one covering visual identity and token usage rules for agents generating UI | Proposed |
| FR-039 | The `SKILL.md` is enhanced to follow the `deployable-skill-authoring` styleguide: progressive disclosure sub-rules, governance directive references, anti-patterns with code examples, and a live context hint | Proposed |
| FR-040 | A `.github/dependabot.yml` is configured for npm packages and GitHub Actions, grouping framework family updates and excluding major version auto-PRs from automated merges | Proposed |
| FR-041 | The CI pipeline runs an npm CVE audit at `high` severity as a hard gate on every PR; a scheduled nightly audit also runs on the default branch | Proposed |
| FR-042 | A lockfile integrity check blocks PRs where the npm lockfile has drifted from the package manifest, equivalent to the Python `uv lock --check` gate in spec-kitty | Proposed |
| FR-043 | All GitHub Actions referenced in CI workflow files are pinned to immutable commit SHAs rather than mutable version tags | Proposed |
| FR-044 | npm packages are published with the `--provenance` flag in the GitHub Actions release workflow, linking each published package to its source commit and CI build | Proposed |
| FR-045 | A CycloneDX SBOM is generated and published as a GitHub Release artifact alongside each package release, equivalent to spec-kitty's `cyclonedx-py` SBOM step | Proposed |
| FR-046 | The CI install step uses `npm ci` with `--ignore-scripts`; any package requiring a postinstall hook is documented in a security allowlist file with explicit rationale | Proposed |

## Non-Functional Requirements

| ID | Description | Threshold | Status |
|---|---|---|---|
| NFR-001 | Contributor onboarding time | A new contributor completes local environment setup and runs all quality checks within **30 minutes** of a clean clone | Proposed |
| NFR-002 | CI pipeline duration | The full CI quality pipeline completes within **10 minutes** on a standard hosted CI runner for a typical pull request | Proposed |
| NFR-003 | Storybook build time | The Storybook builds successfully within **3 minutes** in CI | Proposed |
| NFR-004 | Token file size | The base CSS token distribution file remains under **20 KB uncompressed** | Proposed |
| NFR-005 | Framework package size | Each framework-specific distribution package remains under **150 KB compressed** when a representative set of components is included | Proposed |
| NFR-006 | Accessibility compliance | Zero WCAG 2.1 AA violations in all CI-verified Storybook story snapshots at the time the pipeline reports a pass | Proposed |
| NFR-007 | CI result legibility | Quality gate results are reported in human-readable format on the pull request; no result requires navigating to an external URL to understand what failed and why | Proposed |
| NFR-008 | PR preview deployments | A preview of the Storybook is accessible for review on every pull request that modifies a component or story; the preview URL is posted to the PR automatically (tooling choice deferred to planning) | Proposed |

## Constraints

| ID | Description | Status |
|---|---|---|
| C-001 | Jekyll/Hugo docsite theme integration is explicitly out of scope for this mission | Confirmed |
| C-002 | No visual design components beyond the single stub are authored in this mission | Confirmed |
| C-003 | All CSS/SCSS produced by this mission must use only `--sk-*` custom properties — no hardcoded color, spacing, or typography values | Confirmed |
| C-004 | The Claude Design reference set in `tmp/` is the authoritative visual baseline; it is gitignored and must not be committed or published as part of any distribution package | Confirmed |
| C-005 | Distribution package outputs must not include build tooling, development dependencies, or source maps in their published artifacts | Confirmed |
| C-006 | The token package must be usable in a plain HTML document with no build tooling, via direct file reference or CDN link | Confirmed |
| C-007 | The Angular package targets the current Angular Long-Term Support (LTS) version | Confirmed |
| C-008 | Cartoon/mascot illustrations (the bespectacled cat) are exclusively for supporting materials (marketing, docs, slidedecks) and must never appear as embedded assets inside any software distribution package | Confirmed |
| C-009 | No `*` or `latest` version specifiers are permitted in any `package.json` file; all dependencies use exact or caret-bounded ranges; the npm lockfile is always committed and never gitignored | Confirmed |

## Key Entities

| Entity | Description |
|---|---|
| **Token package** | The distribution unit containing only the `--sk-*` CSS custom property definitions; consumed by all other packages and directly by HTML consumers |
| **Angular component package** | The distribution unit containing Angular-specific component implementations; depends on the token package |
| **Plain JS/HTML package** | The distribution unit containing framework-agnostic primitives usable in static HTML or plain JavaScript; depends on the token package |
| **Storybook catalog** | The living documentation site; built from story definitions contributed alongside each component; serves as the consumer-facing reference |
| **Visual baseline** | The snapshot archive of approved story renders; created from the Claude Design reference set on first run; updated only via explicit maintainer review |
| **CI quality pipeline** | The ordered sequence of automated checks (style, accessibility, performance, visual, cross-browser) that gates merge eligibility on every pull request |
| **ADR** | Architecture Decision Record; a short document capturing a significant design choice, its rationale, and the constraints it establishes |

## Success Criteria

| # | Criterion | How verified |
|---|---|---|
| SC-001 | A developer unfamiliar with the codebase can install the token package and use `--sk-*` properties in a new project within **15 minutes**, following only the package README | Timed walkthrough from a clean environment |
| SC-002 | Every pull request receives automated pass/fail feedback across all quality dimensions with no contributor setup beyond cloning the repository | CI run on a sample PR; all checks report without manual steps |
| SC-003 | The Storybook renders all stub components in all supported framework targets after a single deploy command | Visual inspection of the deployed Storybook |
| SC-004 | A new package version is published to npm within **5 minutes** of a maintainer pushing a version tag, with zero manual steps beyond the tag | Timed from tag push to registry availability |
| SC-005 | No WCAG 2.1 AA violations exist in any Storybook story at the time the CI pipeline reports a full pass | CI accessibility report shows zero violations |
| SC-006 | The Storybook is publicly accessible at a stable URL within **5 minutes** of a merge to main, with no manual deployment steps | Timed from merge to URL availability; URL is stable across deployments |

## Assumptions

- The repository is hosted on GitHub; CI automation uses the platform's native workflow system.
- The npm registry is public; the `@spec-kitty` scope is available for publishing.
- The visual regression baseline is established from the Claude Design reference screenshots in `tmp/` and committed as part of this mission's implementation.
- The plain JS/HTML package targets modern browsers that support CSS custom properties natively; Internet Explorer 11 is not a supported target.
- Conventional commit format (e.g., `feat:`, `fix:`, `chore:`, `docs:`) is enforced as the commit message standard.
- The stub component used to verify the pipeline is a minimal, unstyled placeholder; it does not need to match the visual reference.
- A single Storybook instance documents all framework targets rather than a separate instance per package.
