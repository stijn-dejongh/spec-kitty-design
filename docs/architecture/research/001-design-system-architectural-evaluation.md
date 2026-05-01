# Architectural Evaluation: Spec Kitty Design System

**Author**: Architect Alphonso (ad-hoc session)
**Date**: 2026-05-01
**Status**: Draft — for review before planning begins
**Scope**: Deployment approach, distribution model, reuse, efficiency, consistency, reusability, adaptability
**Informs**: Charter update, mission planning for `design-system-monorepo-infra-ci-scaffold-01KQHEEJ`

---

## 1. Purpose

This document evaluates the architectural trade-offs in the current spec and charter for the Spec Kitty design system. It is intended to surface risks, name gaps, and recommend architectural constraints before implementation begins. It is not a planning document and does not prescribe work packages.

The analysis draws on:
- GitHub issues #338, #646, #647, #650 (the UI/UX epic and its children)
- The current `spec-kitty-design` charter and mission spec
- Direct inspection of the existing dashboard CSS (`dashboard.css`, 1,392 lines)
- The Claude Design reference set in `tmp/`
- Community input on the issue (Vankerkom, 2026)

---

## 2. Current State: What We Are Replacing

The existing dashboard surface has three concrete problems that this design system must solve:

**Problem 1 — Token namespace fragmentation.** The dashboard CSS defines its own color vocabulary: `--baby-blue`, `--grassy-green`, `--lavender`, `--sunny-yellow`, `--soft-peach`, `--creamy-white`. These tokens have no relationship to the brand palette in the Claude Design reference (`--sk-yellow: #F5C518`, `--sk-fg-1`, `--sk-surface`, etc.). The two token systems are completely disjoint. Any design system that does not _replace_ the dashboard's custom properties — not supplement them — will leave the inconsistency in place.

**Problem 2 — Structural coupling.** Styling is entangled with the Django template shell and the dashboard's Python-owned static file serving. There is no boundary between "visual specification" and "dashboard implementation". A component-level change requires editing a 1,392-line monologue.

**Problem 3 — Surface drift.** As documented in #338, three distinct surfaces (operator dashboard, marketing site, docs site) have diverged visually and terminologically. The dashboard uses informal palette names. The marketing site uses the `--sk-*` namespace. The docs site uses an older light/dark theme. A design system that ships to npm but is not _actively consumed_ by all three surfaces does not solve the drift problem — it just adds a fourth surface.

**Architectural implication:** The design system is not only a publishing problem. It is a _migration_ and _adoption_ problem. The spec and charter currently treat it as the former. Both dimensions must be addressed.

---

## 3. Evaluation of the Proposed Direction

### 3.1 Distribution: Monorepo with Separate Publishable Packages

**Decision**: The repo is structured as a monorepo with independent packages — `@spec-kitty/tokens`, `@spec-kitty/angular`, `@spec-kitty/html-js` — each separately versioned and published to npm.

**Strengths:**
- Consumers take exactly the dependency they need. An Angular team does not carry the HTML primitives.
- Breaking changes in one framework target do not force a major bump in others.
- The `@spec-kitty/tokens` package is consumable with zero build tooling — a plain `<link>` or CDN reference. This is the correct architecture for the static HTML / Jekyll/Hugo path.
- Explicit dependency boundaries expose integration risk early. If the dashboard can't import `@spec-kitty/tokens` cleanly, that surfaces as a package integration problem rather than a file-copy inconsistency.

**Risks:**
- **Three-repo synchronization.** The producer (`spec-kitty-design`), the primary consumer (`spec-kitty` dashboard), and the future docsite are in separate repositories. When the token namespace changes, all consumers must update in coordination. Without a contract stability policy and a deprecation process, breaking changes become silent regressions in consuming repos. The charter currently has the `--sk-*` token authority rule and the major-bump gate, but it does not address the consumer update lifecycle.
- **Version lag.** If the SK dashboard pins `@spec-kitty/tokens` at a specific version and the design system iterates, the dashboard diverges again — defeating the purpose. A governance note on how consuming repos track design system releases is needed.
- **npm scope availability.** The `@spec-kitty` npm scope must be confirmed as available and owned before publication infrastructure is built. This is listed as an assumption, which is appropriate, but it is a high-priority pre-flight check.

**Verdict:** The monorepo topology is the correct choice. The risk is not the topology — it is the absence of a _consumer update policy_. This gap should be addressed in the charter before implementation.

---

### 3.2 The Tailwind/shadcn Alternative (Response to Community Input)

A community contributor (Vankerkom, #650) recommended evaluating Tailwind CSS and shadcn as alternatives to a custom design system. This deserves a formal architectural response.

**Tailwind CSS evaluation:**

Tailwind encodes design tokens as utility classes rather than CSS custom properties. It is excellent for teams that own their entire frontend stack end-to-end and control the build pipeline.

Against this project's requirements, it fails on two counts:

1. **Plain HTML / static site consumers.** The Jekyll/Hugo docsite integration (C-001 deferred, follow-up mission) and any CDN-linked usage require a zero-build-step consumption path. Tailwind's utility class approach requires a build step to purge unused classes and output a final CSS file. There is no stable CDN-link story for a project-specific Tailwind config.

2. **Token authority model.** The `--sk-*` CSS custom property namespace is the intended single source of truth consumed by _all_ framework targets — Angular, plain JS, and static HTML. Tailwind's design token expression (as `tailwind.config.js` values) is not natively consumable by Angular templates or static HTML without wrapping. The CSS custom property approach provides a native, spec-compliant, tooling-agnostic token distribution format.

Tailwind is not wrong; it is _wrong for this problem shape_. A framework-agnostic multi-surface design system with a zero-build-step static HTML consumer path is precisely the scenario where CSS custom properties outperform utility classes.

**shadcn evaluation:**

shadcn is a copy-paste component model: consumers own the component code, not a dependency. This is explicitly antithetical to the design system's consistency goal. When every consumer owns a divergent copy, brand drift is not reduced — it is made structurally permanent. shadcn works well for application development teams who want full control over components. It is the wrong model for a shared brand system where consistency across surfaces is the primary value.

**Verdict:** Neither Tailwind nor shadcn satisfies the multi-surface, zero-build-step, consistency-first requirements. The CSS custom property token approach is architecturally justified. This evaluation should be recorded as an ADR.

---

### 3.3 Token Schema Governance Gap

**Critical finding:** The charter and spec establish the `--sk-*` namespace as authoritative but do not specify the token schema — what categories of tokens exist, their naming convention, or how the Claude Design reference values map to canonical property names.

The Claude Design reference defines a rich token vocabulary (colors, backgrounds, borders, typography scales, spacing, motion, shadows). The current dashboard defines a completely different one. Before implementation begins, the token schema must be defined and documented. Without it:

- The `@spec-kitty/tokens` package has no specification to implement against.
- Consuming teams cannot predict what properties will be available.
- Visual regression baselines cannot be established (there is nothing to snapshot against).
- The "no hardcoded values" charter constraint (C-003) cannot be validated without knowing what the valid `--sk-*` set is.

The token schema is the architectural foundation of the entire system. It must be a pre-implementation artifact — not a by-product of implementation.

**Recommendation:** The ADR directory (FR-029) must include a token schema ADR as a first-class deliverable before any package or component work begins.

---

### 3.4 Deployment Approach

**Current spec (FR-033):** The Storybook static build deploys to GitHub Pages on merge to `main`. This provides a public, stable URL.

**Strengths:**
- Zero hosting cost for an open-source project.
- Native GitHub integration.
- Sufficient for consumer documentation browsing.

**Gaps:**

1. **PR preview deployments are missing.** Visual review on pull requests (FR-024 in the CI quality pipeline) requires reviewers to diff screenshots. Without PR preview deployments, reviewers must either build the Storybook locally or rely solely on CI-attached diff artifacts. For a design system where visual correctness is the primary quality signal, this is a significant reviewer experience gap. Services like Chromatic, Netlify PR previews, or GitHub Actions-based Surge.sh deployments solve this.

2. **Versioned documentation.** GitHub Pages deploys the `HEAD` of `main`. Once consumers are on `@spec-kitty/tokens@1.x`, they may need to reference documentation for that version — not the latest. This is a day-two problem, not a v1 blocker, but it should be noted as a known gap.

3. **Storybook dual role.** The Storybook serves both as consumer documentation (public URL) and as the CI visual regression surface. These two roles have different freshness requirements: the documentation should reflect released content; the regression surface should reflect `HEAD`. If both use the same build, there is no distinction between "what's released" and "what's in flight". This should be explicitly addressed in the deployment configuration.

**Recommendation:** Add a PR preview deployment step to the CI pipeline (can be deferred to a follow-up mission if tooling decision is complex, but the gap should be acknowledged in the spec). Record the Storybook dual-role tension as an ADR.

---

### 3.5 Consistency: The Three-Surface Problem

Issue #338 identified three drifting surfaces: dashboard, marketing website, docs site. The design system addresses the dashboard and provides a docsite token foundation. But the marketing website is a fourth, unconsidered surface.

The Claude Design reference (`tmp/`) is drawn from marketing website screenshots. The `--sk-*` tokens already exist on the marketing site. The design system's job is to make those tokens the canonical source that the other surfaces catch up to — not to invent a new token set that sits alongside the existing marketing site tokens.

**Risk:** If the design system generates its own `--sk-*` token values without reconciling against the live marketing site's CSS, we create a fifth token vocabulary alongside the four that already exist. The charter identifies the Claude Design reference (`tmp/`) as the authoritative baseline, which is correct. The README in `tmp/` explicitly flags this: "When [the GitHub repo] is connected, pull real tokens from the repo's CSS / Tailwind config and reconcile against this file." This reconciliation step is not currently in the spec.

**Recommendation:** Before finalizing the token schema ADR, the actual CSS/token values from the live marketing site should be audited against the Claude Design reference. Any discrepancy must be resolved in the ADR before the first package release.

---

### 3.6 Efficiency: CI Pipeline Completeness vs. Runtime Cost

The CI quality pipeline as specified includes: stylesheet linting, script linting, HTML validation, commit message validation, WCAG 2.1 AA checks, Lighthouse performance audits, cross-browser testing (3 browsers), visual regression, and Storybook interaction tests.

The NFR target is 10 minutes for the full pipeline (NFR-002). This is achievable at the stub-component stage but will become difficult as the component count grows. Key risk points:

- **Lighthouse** runs a full browser render per story/page and is CPU-intensive.
- **Playwright cross-browser** (3 browsers) multiplies test execution time.
- **Visual regression** generates and compares screenshot archives that grow with component count.

Running all of these on every PR unconditionally will create CI bottlenecks as the library matures.

**Recommendation:** The infrastructure mission (this mission) should build the pipeline with path-scoped triggering from the start — the full pipeline runs only when component files change; token-only changes run only the token-level checks; documentation-only changes run only lint. This is not over-engineering; it is a CI architecture decision that is significantly harder to retrofit than to install at founding.

---

### 3.7 Reusability: The Angular-First Risk

The spec prioritizes Angular and plain HTML/JS. This is well-grounded in the primary consumer (SK dashboard uses a Django template shell with vanilla JS today; migration to Angular aligns with the frontend decoupling epic #645).

**Risk:** Angular's LTS lifecycle is finite. When the current LTS version is deprecated, the `@spec-kitty/angular` package must track the upgrade. The charter constraint (C-007) acknowledges this. But the architectural pattern — binding the design system's primary framework package to a specific Angular LTS — creates a maintenance obligation that is not currently surfaced in the spec.

The token package (`@spec-kitty/tokens`) has no framework lifecycle dependency and will remain stable indefinitely. The Angular package inherits Angular's release obligations.

**Recommendation:** The Angular package should be designed to make framework version upgrades as mechanical as possible — no custom lifecycle hooks, no Angular-internal APIs beyond the public component model. This is an implementation constraint (out of scope for specification) but should be noted in the architectural vision.

---

### 3.8 Adaptability: Future Framework Targets

The charter permits adding new framework targets (Vue, Svelte, React) as additive sub-packages. This is the correct policy for an evolving design system. However, the current specification does not define what "a valid framework target package" looks like as a schema — what it must include (token consumption, Storybook story, README, CI integration) and what it must not do (hardcode values, override tokens, bundle the token layer inline).

Without a framework target contract, community-contributed ports will have inconsistent quality and integration depth. The `@experimental` tag in the exception policy is necessary but not sufficient.

**Recommendation:** Define a framework target interface in the contributor guide (FR-028). This is a documentation artifact, not a code constraint, and belongs in the documentation scaffold phase of this mission.

---

## 4. Architectural Risks Summary

| Risk | Severity | Mitigation |
|---|---|---|
| Token namespace never reconciled with live marketing site | High | Reconciliation step before first package release; ADR required |
| Three-repo consumer update lifecycle unspecified | High | Consumer update policy in charter |
| Token schema undefined before implementation | Critical | Token schema ADR as pre-implementation deliverable |
| PR preview deployments absent | Medium | Note gap in spec; defer tooling decision to follow-up if needed |
| CI pipeline unbounded runtime as component count grows | Medium | Path-scoped CI triggering from day one |
| Angular LTS lifecycle creates maintenance obligation | Low-Medium | Minimal Angular API surface in package design |
| Framework target interface undefined | Low | Contributor guide must include target contract |
| `@spec-kitty` npm scope not yet confirmed | Pre-flight | Verify before publishing infrastructure is built |

---

## 5. Recommendations for Charter and Spec

The following changes should be made before planning begins:

### Charter amendments

1. **Add consumer update policy**: The charter should state how consuming repositories are expected to track design system releases — e.g., whether pinned version updates are expected to be managed by consuming teams on a defined cadence, or whether the design system guarantees a compatibility window.

2. **Add token schema governance**: The charter should require that the token schema (categories, naming convention, value sources) be defined in an ADR before any package implementation begins. This is a precondition, not a phase.

3. **Add PR preview deployment expectation**: The charter's deployment constraints should acknowledge that consumer-facing visual review requires PR preview deployments, even if the mechanism is deferred.

4. **Record the Tailwind/shadcn evaluation as doctrine**: The decision to use CSS custom properties over utility-class frameworks should be documented as an ADR so future contributors understand the constraint and its rationale.

### Spec additions

5. **FR-034**: Before the token package is implemented, a token schema document is published that defines all `--sk-*` property categories, their naming convention, and their values reconciled against the Claude Design reference and the live marketing site CSS.

6. **FR-035**: The CI pipeline uses path-scoped triggering so that token-only changes, component changes, and documentation-only changes each run only the checks relevant to the changed files.

7. **NFR-008**: A PR preview deployment of the Storybook is available for review on every pull request that modifies a component or story (tooling choice deferred to planning; gap acknowledged in spec).

---

## 6. Architectural Vision Statement

The Spec Kitty design system is a _token-first, framework-progressive_ design system. The `--sk-*` CSS custom property layer is the architectural foundation: stable, framework-agnostic, consumable with zero build tooling. Framework-specific packages (Angular, and future targets) are strictly consumers of that token layer — they add component ergonomics for a specific rendering environment but carry no visual authority.

This architecture makes the token package the long-lived artifact and the framework packages the short-lived, lifecycle-bound adapters. When Angular is deprecated or a new framework becomes dominant, the `@spec-kitty/tokens` package requires no change — only the framework adapter is replaced.

The design system does not compete with Tailwind or shadcn. It complements them: a project using Tailwind can still consume `@spec-kitty/tokens` by mapping the `--sk-*` properties into their Tailwind config. A project using shadcn components can wrap them in `--sk-*` token values. The token layer is the bridge, not the fence.

---

## 7. Next Steps

This evaluation is input to:

1. **Charter update**: Add consumer update policy, token schema governance precondition, and Tailwind/shadcn evaluation ADR.
2. **Spec update**: Add FR-034 (token schema document), FR-035 (path-scoped CI), NFR-008 (PR preview gap acknowledgement).
3. **ADR authoring** (in `docs/architecture/decisions/`):
   - ADR-001: Token distribution format (CSS custom properties vs. utility frameworks)
   - ADR-002: Monorepo package topology
   - ADR-003: Token schema and naming convention *(precondition for implementation)*
4. **Pre-flight check**: Confirm `@spec-kitty` npm scope ownership before planning the publishing pipeline.
5. **Marketing site CSS audit**: Reconcile Claude Design reference token values against the live `spec-kitty.ai` CSS before finalizing ADR-003.

Handoff from Architect Alphonso to Planner Priti once charter and spec amendments are confirmed.
