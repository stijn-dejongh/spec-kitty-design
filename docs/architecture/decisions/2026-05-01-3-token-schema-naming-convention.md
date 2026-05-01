# ADR 3 (2026-05-01): Token Schema and Naming Convention — Precondition for Implementation

**Date:** 2026-05-01
**Status:** Accepted
**Deciders:** Stijn Dejongh, Architect Alphonso (ad-hoc session)
**Technical Story:** Architectural evaluation `001-design-system-architectural-evaluation.md` §3.3; FR-034

---

## Context and Problem Statement

The charter and spec establish `--sk-*` CSS custom properties as the single authoritative token namespace. However, no schema has been defined for what properties exist, how they are named, or how the Claude Design reference values (`tmp/colors_and_type.css`) reconcile against the live marketing site CSS.

Without a token schema:
- The `@spec-kitty/tokens` package has no specification to implement against
- Consumers cannot predict what properties will be available at any point release
- Visual regression baselines cannot be established (nothing canonical to snapshot against)
- The no-hardcoded-values constraint (C-003) cannot be linted automatically without a known valid property list
- Agents generating SK-branded output cannot validate their token usage without an enumerable schema

This ADR records the schema convention decisions. Actual property values are not decided here — they require reconciliation against the live marketing site CSS before being committed.

## Decision Drivers

* Token names must be stable across the one major version compatibility window in the consumer update policy
* The schema must accommodate the five visual categories present in the Claude Design reference: color surfaces, text/foreground, borders, typography, spacing/layout
* The naming convention must be guessable — a developer should be able to infer the token name from context without looking it up
* The schema must support semantic pairing: surfaces and the foreground content that renders on them are paired tokens
* The schema must be machine-enumerable for linting and agent guidance

## Considered Options

* **Option A**: Flat namespace — `--sk-yellow`, `--sk-blue`, `--sk-body-font-size` (no category prefix)
* **Option B**: Category-prefixed semantic namespace — `--sk-color-*`, `--sk-surface-*`, `--sk-fg-*`, `--sk-type-*`, `--sk-space-*`
* **Option C**: shadcn/ui semantic model — `--background`, `--foreground`, `--primary`, `--primary-foreground` (no product prefix)

## Decision Outcome

**Chosen option: Option B — category-prefixed semantic namespace under the `--sk-` product prefix.**

### Naming Convention

All tokens follow the pattern: `--sk-<category>[-<modifier>[-<variant>]]`

| Category | Prefix | Examples |
|---|---|---|
| Brand color palette | `--sk-color-*` | `--sk-color-yellow`, `--sk-color-purple`, `--sk-color-green` |
| Surface backgrounds | `--sk-surface-*` | `--sk-surface-default`, `--sk-surface-card`, `--sk-surface-input` |
| Foreground / text | `--sk-fg-*` | `--sk-fg-default`, `--sk-fg-muted`, `--sk-fg-on-primary` |
| Border | `--sk-border-*` | `--sk-border-default`, `--sk-border-strong`, `--sk-border-focus` |
| Typography — font family | `--sk-font-*` | `--sk-font-display`, `--sk-font-sans`, `--sk-font-mono`, `--sk-font-reference` |
| Typography — size | `--sk-text-*` | `--sk-text-xs`, `--sk-text-sm`, `--sk-text-base`, `--sk-text-lg` |
| Typography — weight | `--sk-weight-*` | `--sk-weight-normal`, `--sk-weight-medium`, `--sk-weight-bold` |
| Spacing | `--sk-space-*` | `--sk-space-1` through `--sk-space-12` (scale) |
| Radius | `--sk-radius-*` | `--sk-radius-sm`, `--sk-radius-md`, `--sk-radius-pill` |
| Shadow | `--sk-shadow-*` | `--sk-shadow-card`, `--sk-shadow-glow-primary` |
| Motion | `--sk-motion-*` | `--sk-motion-duration-fast`, `--sk-motion-ease-out` |

### Semantic Pairing Rule

Any surface token has a paired foreground token. The surface token controls background/fill color; the foreground token controls text and icon color rendered on that surface.

Pattern: `--sk-surface-<name>` is paired with `--sk-fg-on-<name>`.

Example: `--sk-surface-card` background → text and icons use `--sk-fg-on-card`.

This is the primary constraint that prevents contrast violations in agent-generated output. Agents must use paired tokens together, not mix surface tokens with arbitrary foreground values.

### Value Source

Token values are **not decided in this ADR**. Values must be derived by reconciling:
1. `tmp/colors_and_type.css` — the Claude Design reference (authoritative visual baseline)
2. Live `spec-kitty.ai` marketing site CSS — the deployed token values currently in use

Any discrepancy between the two sources must be resolved explicitly before the first `@spec-kitty/tokens` release. The resolution is recorded as an addendum to this ADR.

This reconciliation is FR-034 in the mission spec and is a pre-implementation gate.

### Consequences

#### Positive

* Predictable: a developer familiar with the category structure can guess token names correctly
* Lint-checkable: the schema is enumerable; the `--sk-*` constraint can be enforced against a known valid list
* Agent-guessable: agents generating SK UI output have a structured namespace to reason about
* Semantic pairing prevents the most common agent mistake (mismatched surface/foreground contrast)

#### Negative

* Longer token names than the existing dashboard's informal vocabulary (`--baby-blue` → `--sk-color-blue-accent` or similar)
* The reconciliation step (FR-034) is a pre-implementation gate that can delay the first token release if the marketing site CSS diverges significantly from the Claude Design reference

#### Neutral

* The existing dashboard custom properties (`--baby-blue`, `--sunny-yellow`, etc.) must be migrated to the `--sk-*` schema when the dashboard adopts the design system. This is a consuming-project migration, not a design system concern

### Confirmation

This decision is validated when:
1. `tmp/colors_and_type.css` has been reconciled against the live marketing site CSS and discrepancies resolved
2. A complete token catalogue exists as a checked-in file listing every valid `--sk-*` property, its category, and its value
3. The Stylelint config enforces that no `--sk-*` alias outside the catalogue is used

## Pros and Cons of the Options

### Option A: Flat namespace

`--sk-yellow`, `--sk-blue-bg`, `--sk-body-font`

**Pros:** Short names, low ceremony

**Cons:** No structure; no guidance on surface/foreground pairing; scales poorly as the number of tokens grows; impossible to lint categorically

**Why rejected:** Flat namespaces become unmaintainable as the token count grows past ~30 properties.

### Option B: Category-prefixed semantic namespace *(chosen)*

`--sk-<category>-<name>` with defined categories.

**Pros:** Predictable, lint-checkable, guessable, supports semantic pairing rule

**Cons:** Longer names

### Option C: shadcn/ui semantic model

`--background`, `--foreground`, `--primary`, `--primary-foreground` — no product prefix.

**Pros:** Industry-recognized convention; compatible with Tailwind mapping

**Cons:** No `--sk-` prefix means tokens cannot be distinguished from a consuming project's own properties or another design system's properties; collisions with shadcn itself are likely in mixed stacks

**Why rejected:** The `--sk-` prefix is a namespace boundary. Without it, the no-hardcoded-values constraint cannot be enforced by linting on `--sk-` membership alone.

## More Information

* FR-034: token schema document is a pre-implementation gate
* Research: `001-design-system-architectural-evaluation.md` §3.3 and §3.5
* Follow-up: once values are reconciled, this ADR should be updated with an addendum recording the final token catalogue path
* Claude Design reference: `tmp/colors_and_type.css` (gitignored; not distributed)
