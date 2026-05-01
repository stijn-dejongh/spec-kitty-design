# ADR 1 (2026-05-01): Token Distribution Format — CSS Custom Properties over Utility Frameworks

**Date:** 2026-05-01
**Status:** Accepted
**Deciders:** Stijn Dejongh, Architect Alphonso (ad-hoc session)
**Technical Story:** Research doc `003-design-system-architectural-evaluation.md`; community input on issue #650 (Vankerkom)

---

## Context and Problem Statement

The Spec Kitty design system must distribute visual tokens to three distinct consumer environments:

1. **Angular components** — compiled TypeScript, build pipeline required
2. **Plain JavaScript / static HTML** — no build step; may be consumed via `<link>` or CDN
3. **Jekyll / Hugo docsite theme** — static site generator; no runtime JavaScript build

A community contributor (issue #650) recommended evaluating Tailwind CSS as a utility-class token distribution mechanism and shadcn/ui as a copy-paste component model. Both are widely adopted in the industry. The decision on distribution format determines what every downstream consumer must install and how every agent generating SK-branded output reasons about token usage.

## Decision Drivers

* The static HTML / Jekyll / Hugo consumer path requires a zero-build-step token consumption model — a plain `<link>` to a CSS file must be sufficient
* Tokens must be a single authoritative source consumed identically by all framework targets — no per-framework translation layer for values
* Token consumption must be machine-testable: agents generating UI output must be able to reason about valid token names without executing a build
* Brand consistency across surfaces depends on a single namespace that all surfaces read from
* The `@spec-kitty/tokens` package must remain stable across framework lifecycle changes (Angular LTS rotations, Storybook major versions)

## Considered Options

* **Option A**: CSS custom properties (`--sk-*` namespace) as the authoritative token distribution layer
* **Option B**: Tailwind CSS utility classes as the token distribution layer
* **Option C**: shadcn/ui copy-paste component model

## Decision Outcome

**Chosen option: Option A — CSS custom properties (`--sk-*`) as the single authoritative token layer.**

All token values are defined once as CSS custom properties on `:root`. All framework packages consume them by reference. No framework package defines or overrides token values.

### Consequences

#### Positive

* Zero-build-step consumption: any surface can reference the token file via `<link>` or CDN with no tooling dependency
* Framework-agnostic: Angular, Vue, plain HTML, and future framework targets all read the same `:root` properties without translation
* Machine-testable: the complete valid `--sk-*` namespace is enumerable; agent-generated output can be statically validated against it
* Long-lived: CSS custom properties have no LTS cycle; the token file is stable across framework generations
* Composable with Tailwind: a project using Tailwind can map `--sk-*` values into `tailwind.config.js` without forking the token source

#### Negative

* No build-time tree-shaking: consumers receive all tokens, not just the ones they use. Mitigated by the <20 KB uncompressed size constraint (NFR-004)
* No utility class affordance: Angular and Tailwind consumers who prefer utility classes must write their own mapping layer on top of `--sk-*`

#### Neutral

* OKLCH color format (as used by shadcn) is a potential future consideration for the token values themselves; this ADR governs the distribution mechanism, not the color format choice

### Confirmation

This decision is validated when:
1. `@spec-kitty/tokens` publishes a CSS file with only `--sk-*` custom properties
2. A plain HTML document can consume all design tokens with a single `<link>` and no build tool
3. `@spec-kitty/angular` imports token values by CSS custom property reference, not by duplicating values

## Pros and Cons of the Options

### Option A: CSS custom properties

Define all tokens as `--sk-*` CSS custom properties on `:root`. Distribute as a single CSS file.

**Pros:**
* Native browser spec; no tooling required at consumption time
* Single source of truth readable by any CSS consumer
* CDN-compatible; no compilation step
* Values are inspectable at runtime via `getComputedStyle`

**Cons:**
* No compile-time type safety for token names (mitigated by the token schema ADR and linting rules)
* Cannot dead-code-eliminate unused tokens (mitigated by size constraint)

### Option B: Tailwind CSS utility classes

Encode design decisions as Tailwind theme configuration; distribute as utility classes.

**Pros:**
* Excellent DX for Tailwind-native projects
* Build-time tree-shaking eliminates unused styles
* Large ecosystem familiarity

**Cons:**
* Requires a build pipeline at the consumer side — incompatible with the zero-build-step static HTML requirement
* No stable CDN story for a project-specific Tailwind config
* Token values are not directly consumable by Angular templates or static HTML without wrapping
* Tight coupling to Tailwind's versioning and configuration API

**Why rejected:** Fails the zero-build-step static HTML consumer requirement. The Jekyll/Hugo docsite integration (deferred but in scope) cannot consume Tailwind without a build step.

### Option C: shadcn/ui copy-paste model

Consumers own the component source code; no dependency is installed.

**Pros:**
* No dependency management; consumers cannot be broken by upstream changes
* Full consumer control over styling and behavior
* Zero runtime coupling

**Cons:**
* Each consumer owns a divergent copy — brand drift is structurally guaranteed, not prevented
* No single source of truth; updating a token requires updating every copy in every consumer repo
* Antithetical to the design system's core goal of brand consistency across surfaces

**Why rejected:** The copy-paste model is the direct opposite of the consistency goal. It solves the dependency problem by making consistency impossible.

## More Information

* Research: `docs/architecture/research/001-design-system-architectural-evaluation.md` §3.2
* Charter constraint C-003: all CSS/SCSS must use only `--sk-*` properties
* Charter constraint C-009: no hardcoded values
* Follow-up: ADR-003 (token schema and naming convention) defines what properties are in the `--sk-*` namespace
