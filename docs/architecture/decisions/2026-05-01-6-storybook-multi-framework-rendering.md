# ADR 6 (2026-05-01): Storybook Multi-Framework Rendering Strategy

**Date:** 2026-05-01
**Status:** Accepted
**Deciders:** Stijn Dejongh, Architect Alphonso (ad-hoc review)
**Technical Story:** FR-007 — Storybook renders each component under its supported framework targets from a single story entry; spec mission `design-system-monorepo-infra-ci-scaffold-01KQHEEJ`

---

## Context and Problem Statement

FR-007 requires the Storybook catalog to display Angular components and plain HTML primitives from a single story entry. Storybook 8.x introduced significant changes to its renderer and framework model. The feasibility of rendering two frameworks (Angular and HTML) within a single Storybook configuration — and ideally within a single story file — is uncertain and depends on Storybook 8.x internals that may change.

The implementation risk is material: if same-story multi-framework tabs are not achievable, FR-007's "single story entry" requirement must be interpreted as "single catalog with consistent naming convention across separate story files," and that interpretation must be recorded to avoid spec drift.

## Decision Drivers

* FR-007 compliance: consumers must be able to see both Angular and HTML renderings without navigating to separate catalogs
* Storybook 8.x supports `@storybook/angular` and `@storybook/html` in the same config via separate story glob patterns; whether both render in the same UI panel is an implementation question
* WP04:T026 requires the Storybook build to complete in < 3 minutes (NFR-003); a dual-renderer config may increase build time
* DIRECTIVE_003 requires this uncertain technical choice to be documented before WP04 implementation begins

## Considered Options

* **Option A**: Same-story multi-framework — Angular and HTML rendered as tabs in a single Storybook story entry via Storybook's `composeStories` API or a custom toolbar parameter
* **Option B**: Named story file convention — separate story files per framework target (`SkStub.stories.ts` for Angular, `SkStub-html.stories.ts` for HTML) with consistent title naming convention (`Primitives/SkStub (Angular)` / `Primitives/SkStub (HTML)`)

## Decision Outcome

**Primary attempt: Option A.** WP04 implementer must attempt same-story multi-framework rendering first.

**Fallback trigger:** If Option A is not achievable within Storybook 8.x without custom plugin development, Option B is automatically adopted. The fallback requires no further approval — this ADR pre-authorizes it.

**Fallback implementation (Option B):**
- Angular story files: `packages/angular/src/**/*.stories.ts`
- HTML story files: `packages/html-js/src/**/*.stories.html.ts` (or `*.stories.ts` with `@storybook/html` as renderer)
- Naming convention: `<Category>/<ComponentName> (Angular)` and `<Category>/<ComponentName> (HTML)`
- The Storybook sidebar shows both entries side-by-side under the same category, giving consumers easy comparison

**FR-007 interpretation under Option B:** "Single story entry" is interpreted as "single Storybook catalog with consistent naming" — not "a single `.stories.ts` file rendering both frameworks." This interpretation is acceptable given the technical constraint.

### Consequences

#### Positive

* Option A, if achievable, provides the cleanest consumer experience — one entry, multiple framework views
* Option B is universally achievable and adds no risk to the WP04 timeline
* Pre-authorizing the fallback prevents WP04 from being blocked by a Storybook API limitation

#### Negative

* Option B increases story file count (two files per component instead of one), adding contributor overhead
* Neither option has been prototyped yet — Option A's feasibility is the key WP04 validation risk

#### Neutral

* The stub component (WP04) is the proof-of-concept for this decision. If the stub's multi-framework story renders correctly under Option A, the pattern scales to all future components.

### Confirmation

This decision is validated when WP04:T026 (Storybook build < 3 min) passes AND at least one story renders in both Angular and HTML form in the built Storybook, regardless of which option was used. The WP04 reviewer must note in the PR which option was implemented.

## More Information

* FR-007: `spec.md` line 128
* WP04: `kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/tasks/WP04-storybook-multi-framework.md`
* Storybook 8.x multi-framework docs: https://storybook.js.org/docs/configure/integration/frameworks
* DIRECTIVE_003: material technical decisions must be documented before implementation
