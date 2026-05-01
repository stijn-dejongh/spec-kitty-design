# ADR 7 (2026-05-01): Storybook 10.x Adoption — Angular 21 Compatibility

**Date:** 2026-05-01
**Status:** Accepted
**Deciders:** Stijn Dejongh, Frontend Freddy (WP04 implementer), Reviewer Renata
**Technical Story:** WP04 review cycle 1; ADR-006 (Storybook multi-framework rendering strategy)

---

## Context and Problem Statement

The implementation plan (`plan.md` Technical Context) specified Storybook 8.x as the primary dependency. During WP04 implementation, `@storybook/angular` 8.x was found to be incompatible with the installed Angular 21.2.11 workspace. Angular 21 requires `@storybook/angular` 10.x. ADR-006 pre-authorised adapting the Storybook approach when multi-framework rendering was not achievable with the specified version; this ADR records the specific version adaptation.

## Decision Drivers

* The workspace installed Angular 21.2.11 (the current release at implementation time)
* `@storybook/angular@8.x` peer-requires `@angular/core ^19.0.0` — incompatible with Angular 21
* `@storybook/angular@10.x` is compatible with Angular 21 and passed all WP04 acceptance criteria
* NFR-003 (Storybook build < 3 min) was satisfied by Storybook 10.x (~10 seconds)
* The WP04 cycle-1 review acceptance verified build correctness

## Decision Outcome

**Use Storybook 10.x** (`^10.3.6` at adoption time) in place of the plan-specified 8.x.

### Known differences from Storybook 8.x

| Area | 8.x behaviour | 10.x behaviour |
|---|---|---|
| `@storybook/addon-essentials` | Separate addon | Merged into Storybook core |
| `docs.autodocs` option | Present in `StorybookConfig` | Removed in 10.x |
| `@storybook/blocks` import | Present | Changed to `@storybook/addon-docs/blocks` |
| nx executor | `@nx/storybook:storybook` | Compatible but required manual `nx:run-commands` wrapper |
| Angular integration | Required `angular.json` for Angular 19 | Requires `angular.json` for Angular 21 |

### Consequences

#### Positive

* Full compatibility with Angular 21.x workspace
* Build time under 10 seconds (significantly exceeds NFR-003)
* Storybook 10.x is the current stable Storybook release

#### Negative

* `plan.md` Technical Context references "Storybook 8.x" — remains stale until updated
* Dependency on Storybook 10.x LTS lifecycle rather than 8.x LTS lifecycle
* Future contributors must consult Storybook 10.x docs, not 8.x docs

### Confirmation

This decision is confirmed by WP04 cycle-2 approval: Storybook build exits 0 in < 3 min, Angular and HTML stub stories render in the built catalog, Getting Started MDX page is accessible.

## More Information

* ADR-006: Storybook Multi-Framework Rendering Strategy
* WP04 review cycle 1: `kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/tasks/WP04-storybook-multi-framework/review-cycle-1.md`
* Mission review finding DRIFT-2: `docs/architecture/validation/mission-review-01KQHEEJWTWH6CPPRZ287SPH2G.md`
