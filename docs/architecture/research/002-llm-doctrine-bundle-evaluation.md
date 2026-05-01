# LLM Doctrine Bundle Evaluation: Design System as Agent Governance Layer

**Author**: Architect Alphonso (ad-hoc session)
**Date**: 2026-05-01
**Status**: Draft — informs charter update and spec additions
**Scope**: LLM/agent artifact evaluation across: `tmp/` Claude Design reference, shadcn-ui/ui skills directory, issue #832 (org-layer DRG)
**Companion to**: `001-design-system-architectural-evaluation.md`

---

## 1. Purpose

The `spec-kitty-design` repository has two distinct outputs. The first — design tokens, Angular components, HTML primitives, Storybook — is addressed in the infrastructure spec and the prior architectural evaluation. The second is less obvious but potentially more durable: **a distributable doctrine bundle that governs how any AI agent working on Spec Kitty or Priivacy-ai projects should reason about brand, visual identity, terminology, and component usage**.

This document evaluates what that bundle should contain, what patterns from the community are worth adopting, and how the bundle should be structured to integrate with spec-kitty's forthcoming org-layer DRG (#832).

---

## 2. What the Claude Design Reference Already Contains

### 2.1 `tmp/SKILL.md` — Current state

The reference ships a Claude Code skill (`user-invocable: true`) with:
- A short description: "generate well-branded interfaces and assets"
- A file map pointing to README, CSS tokens, assets, and UI kit components
- A brand snapshot: voice, color, typography, mascot rules, iconography

**Assessment**: This is a Level 1 skill — a navigation aid and quick reference. It tells an agent where to look, but not how to reason. It has no rules, no anti-patterns, no code examples, no governance scope. It is correct but shallow.

**Relevant doctrine**: The SK shipped styleguide `deployable-skill-authoring` has a pattern called "Trigger-rich description" and warns against "Context dump skill" and "Unsourced operating rule". The current SKILL.md passes the first check but fails the other two — it has no doctrine references and loads all context at once rather than progressively.

### 2.2 `tmp/README.md` — Rich, unstructured brand governance

The README contains sophisticated, opinionated content that has not yet been formalized as doctrine:

**Voice and content governance (directly quotable as styleguide principles):**
- Sentence case for all headlines and labels — not title case
- No emoji across all surfaces (explicitly stated, observed across 21 screenshots)
- Concrete > abstract: "Developers spend time building, not being blocked" — never "improved developer productivity"
- `->` (literal hyphen + greater-than) for CLI flow text; render as plain text in mono, not as SVG
- The `POV` rule: mostly *Spec Kitty* (third-person product) with *you/your team*; rarely *we*
- Eyebrow labels in ALL-CAPS mono with wide tracking ("COMPETITIVE MATRIX", "BY THE NUMBERS")
- Inline code in mid-sentence with faint pill background: `spec-kitty orchestrator`

**Canonical product terminology (potential glossary/terminology directive):**
- *Specs*, *Plans*, *Work Packages*, *Missions*, *Decision Moments*, *Teamspace*, *Charter*, *Doctrine* — always capitalized when referring to SK concepts; never when used generically
- These map directly to the SK glossary and should feed into DIRECTIVE_032 (Conceptual Alignment) at the project level

**Visual identity rules for agents generating UI (directly usable as a styleguide):**
- Dark mode is the default surface, not an option
- No gradients on body backgrounds
- Illustration content boundary: cartoon/mascot illustrations exclusively for supporting materials — never in software packages
- No stock photography; no real-people imagery
- Lucide-style stroke icons (2px, rounded caps) — not emoji
- Pill shapes for CTAs and eyebrow chips; 16px corner radius on cards; 999px border radius on primary buttons

**What is missing from the README that a good doctrine bundle needs:**
- Code examples (good vs. bad)
- Machine-testable rules (not just prose)
- Explicit anti-patterns
- Governance source attribution (which directive or policy does each rule derive from?)
- Progressive disclosure structure (the README is a linear document; doctrine needs to be queryable by action and scope)

---

## 3. What shadcn-ui/ui Ships as LLM Artifacts

shadcn-ui is the most mature example of a component library structured as AI-agent governance. Their `skills/shadcn/` directory reveals a pattern worth studying:

### 3.1 Skill architecture

shadcn's SKILL.md is a Level 3 skill:

| Feature | shadcn | Our current SKILL.md |
|---|---|---|
| Live project context injection | ✅ `npx shadcn@latest info --json` embedded | ❌ static only |
| Opinionated rules with code examples | ✅ Incorrect/Correct pairs per domain | ❌ none |
| Sub-rule files (progressive disclosure) | ✅ `rules/*.md` per concern | ❌ single file |
| Anti-patterns explicitly named | ✅ per rule domain | ❌ none |
| CLI guidance embedded | ✅ `cli.md` | ❌ none |
| MCP server for programmatic access | ✅ `mcp.md` | ❌ none |
| Evaluation fixtures for CI | ✅ `evals/evals.json` | ❌ none |
| OpenAI agent interface definition | ✅ `agents/openai.yml` | ❌ none |
| Multi-editor support (Claude, Cursor, VSCode) | ✅ via `shadcn mcp init` | ❌ single-skill only |

### 3.2 Rule structure that is directly adoptable

shadcn organizes rules by concern (`styling.md`, `forms.md`, `composition.md`, `icons.md`) with:
1. A machine-readable principle statement
2. A `bad_example` / `good_example` code pair
3. A cross-reference to the related rule file

This maps cleanly onto the SK shipped `python-conventions.styleguide.yaml` pattern (`principles`, `patterns`, `anti_patterns`). The YAML styleguide schema is already the right format — it just needs to be populated with design-system-specific content.

### 3.3 Token governance in `customization.md`

shadcn documents the `name` / `name-foreground` CSS variable convention explicitly — every color token has a background form and a foreground (text/icon) form. This is governance that agents need to reason correctly about token usage:

```
--primary: oklch(...)          # background/surface use
--primary-foreground: oklch(…) # text/icon use ON primary backgrounds
```

The `--sk-*` token system should follow an equivalent documented convention. Currently it is implicit in the Claude Design reference. Making it explicit in a doctrine artifact prevents agents from generating `color: var(--sk-yellow)` text on a `background: var(--sk-yellow)` surface — a contrast violation that is visually obvious but requires the convention to be stated to be machine-testable.

### 3.4 The MCP server pattern

shadcn ships `shadcn mcp` — a server that lets any AI agent search, browse, view, and install components programmatically. This is the highest-leverage LLM artifact a component library can ship: it turns the design system from a passive reference into an active tool in the agent's workflow.

For the SK design system, the equivalent would be a server that exposes:
- Available `--sk-*` tokens with their current values
- Available component stories (what's in the published Storybook)
- Brand voice rules as queryable rules
- Component usage examples by category

This is not a v1 deliverable, but it is the natural architectural destination. The infrastructure mission should structure the package layout to make an MCP server addition non-invasive.

### 3.5 Evaluation fixtures

shadcn ships `evals/evals.json` — test cases for AI agent behavior. The pattern: a prompt + expected output (or expected behavior) + scoring criteria. For a design system, this could include:
- "Generate a button component" → must use `--sk-*` tokens, must have a Storybook story, must pass axe-core
- "Add a heading to a page" → must use `--sk-font-display` variable, not hardcode a font family
- "Create a dark mode surface" → must use `--sk-surface` or `--sk-bg-*`, not a hardcoded hex value

This pattern turns brand compliance from a review activity into a CI gate on agent-generated code.

---

## 4. Issue #832: The Org-Layer DRG — What It Means for This Repo

Issue #832 describes extending spec-kitty's doctrine resolution from two layers (`shipped`, `project`) to three (`shipped`, `org`, `project`) with precedence `shipped < org < project`.

**The `spec-kitty-design` repository is, structurally, an org-layer doctrine source.**

The distribution model for #832:
1. `.kittify/config.yaml` in a consuming project declares `org_doctrine_source` (a git URL or path)
2. `spec-kitty doctrine fetch` pulls and snapshots the org doctrine to `.kittify/org-doctrine/`
3. All governance resolution reads from the local snapshot

This means: a project that depends on `@spec-kitty/tokens` can _also_ configure its `.kittify/config.yaml` to point at `spec-kitty-design` as its org doctrine source. The design system's brand voice rules, illustration constraints, and token authority directive would then automatically appear in every agent's governance context for those projects — without any per-project configuration.

**Architecture implication**: The `spec-kitty-design` repo should maintain a `doctrine/` directory structured for org-layer compatibility _now_, even though #832 has not landed. When it does, the integration is trivially a config file change in consuming repos, not a restructuring of the doctrine bundle.

The org-layer artifact types most relevant to the design system:

| Artifact type | What the design system contributes |
|---|---|
| **Directives** | Token authority rule, illustration content boundary, no-hardcoded-values gate |
| **Styleguides** | Brand voice (writing rules), visual identity (token usage rules for agents) |
| **Toolguides** | How to use the Storybook, how to add a component, how to run quality checks |
| **Agent profiles** | A `designer-dagmar` extension pre-loaded with SK brand context |
| **Mission step contracts** | A `design-system-component` custom mission type (deferred to after #832 lands) |

---

## 5. Recommended Doctrine Bundle Contents

### 5.1 Immediate (this mission or follow-up)

**Directive: `SK-DIRECTIVE-D01` — Token Authority Rule**
- Intent: All CSS output in any SK-ecosystem project must use `--sk-*` custom properties exclusively. No hardcoded color, spacing, or type values.
- Severity: `error` (blocks review, not just warns)
- Applies to: `implement`, `review`

**Directive: `SK-DIRECTIVE-D02` — Illustration Content Boundary**
- Intent: Cartoon/mascot illustrations (the bespectacled cat character) are for supporting materials only — marketing, documentation, slidedecks, blog posts. They must never appear as embedded assets in software distribution packages.
- Severity: `error`
- Applies to: `implement`, `review`

**Styleguide: `sk-brand-voice`**
- Scope: `docs`, applies to all text output for SK-ecosystem surfaces
- Principles derived directly from the Claude Design README:
  - Sentence case for headlines and labels
  - No emoji on any surface
  - No exclamation marks
  - Concrete outcomes over abstract benefits
  - Specific POV rules (product-as-subject, reader-as-you)
  - Canonical term capitalization (Specs, Plans, Work Packages, Missions, etc.)
- Anti-patterns: title case headlines, `->` rendered as SVG arrow, stock photography, `we` as default POV

**Styleguide: `sk-visual-identity`**
- Scope: `code`, applies to all CSS/SCSS/HTML output for SK-ecosystem surfaces
- Principles:
  - `--sk-*` namespace is the single token authority
  - Dark mode is the default surface; light mode is an opt-in
  - No hardcoded hex values, spacing values, or font families
  - Illustration boundary (no mascot in software)
  - Token pairing convention: surface tokens and foreground tokens must be used together
- Patterns: correct `--sk-*` usage with good/bad examples
- Anti-patterns: hardcoded values, mixing `--sk-*` with custom properties, emoji for iconography

**Enhanced `SKILL.md`** following the shadcn and `deployable-skill-authoring` patterns:
- Progressive disclosure: `SKILL.md` → `rules/brand-voice.md`, `rules/visual-identity.md`, `rules/component-authoring.md`
- Live project context injection (token count, published components, Storybook URL)
- Governance references: link to directives D01, D02, and relevant charter constraints
- Anti-patterns section per concern domain

### 5.2 Deferred (after #832 lands)

**Toolguide: `sk-design-system-tools`**
- How to install and consume the design system packages
- How to run the Storybook locally and in CI
- How to add a new component following the atomic design hierarchy
- How to validate WCAG compliance and run visual regression locally

**Agent profile: `designer-dagmar-sk`** (extends `designer-dagmar`)
- Pre-loaded with SK brand context
- Governance scope: directives D01, D02 + DIRECTIVE_031 (Context-Aware Design)
- Initialization declaration includes the brand voice snapshot

**MCP server** (further deferred):
- `spec-kitty-design mcp` — query available tokens and components
- Mirrors the shadcn MCP pattern; requires the token package to be published first

**Evaluation fixtures** (`evals/brand-compliance.json`):
- Test cases for agent-generated UI code
- Minimum: token-usage tests (must use `--sk-*`), illustration boundary tests (mascot not in packages)

---

## 6. Structural Recommendation: `doctrine/` Directory

The doctrine bundle should live at the repo root as `doctrine/`, structured for org-layer compatibility:

```
doctrine/
  directives/
    SK-D01-token-authority.directive.yaml
    SK-D02-illustration-boundary.directive.yaml
  styleguides/
    sk-brand-voice.styleguide.yaml
    sk-visual-identity.styleguide.yaml
  toolguides/            # deferred to post-#832
    sk-design-system-tools.toolguide.yaml
  agent_profiles/        # deferred to post-#832
    designer-dagmar-sk.agent.yaml
  graph.yaml             # DRG entry point for org-layer fetch
```

The `graph.yaml` DRG entry point is what `spec-kitty doctrine fetch` will read when #832 ships. It should be authored now as a forward-compatible stub, even though it cannot be consumed yet.

This structure mirrors `src/doctrine/*/shipped/` in the SK repo. When the org layer resolution lands, the consuming project's config changes from:

```yaml
# before #832
org_doctrine_source: null
```

to:

```yaml
# after #832
org_doctrine_source: "https://github.com/Priivacy-ai/spec-kitty-design"
org_doctrine_local_path: ".kittify/org-doctrine/"
```

That single config change makes the token authority directive and brand voice styleguide available to every agent working in that project.

---

## 7. Gap Summary

| Gap | Impact | Recommendation |
|---|---|---|
| SKILL.md is Level 1 (navigation only) — no rules, no examples, no governance refs | Medium | Enhance following shadcn + `deployable-skill-authoring` patterns |
| Brand voice and visual identity rules exist only as prose in README — not machine-queryable | High | Extract into `sk-brand-voice` and `sk-visual-identity` styleguides |
| Token pairing convention (`surface` / `foreground` pairs) undocumented | Medium | Add to `sk-visual-identity` styleguide with code examples |
| No directives encoding the illustration boundary or token authority as enforceable governance | High | Author `SK-D01` and `SK-D02` directives immediately |
| No `doctrine/` directory structured for org-layer compatibility | Medium | Create now as forward-compatible stub; populate with immediate artifacts |
| No MCP server for programmatic component/token access by agents | Low (v1) | Note as architectural direction; structure packages to accommodate |
| No evaluation fixtures for brand compliance testing | Low (v1) | Note shadcn pattern; defer to post-v1 |
| Canonical term list (Specs, Plans, Work Packages, etc.) not linked to DIRECTIVE_032 | Medium | Add to `sk-brand-voice` styleguide with explicit cross-reference |

---

## 8. Spec Additions Warranted

Based on this evaluation, the following should be added to the mission spec:

- **FR-036**: A `doctrine/` directory is established with the org-layer directory structure and a `graph.yaml` stub, ready for `spec-kitty doctrine fetch` integration when #832 ships
- **FR-037**: Two doctrine directives are authored and validated: `SK-D01` (token authority) and `SK-D02` (illustration content boundary)
- **FR-038**: Two doctrine styleguides are authored and validated: `sk-brand-voice` and `sk-visual-identity`
- **FR-039**: The `SKILL.md` is enhanced to follow the `deployable-skill-authoring` styleguide: progressive disclosure structure, governance references, anti-patterns, and live context hint

---

## 9. Next Steps

1. Add FR-036–039 to the mission spec
2. Author the four doctrine artifacts (`SK-D01`, `SK-D02`, `sk-brand-voice`, `sk-visual-identity`) as part of this mission's implementation scope
3. Record the org-layer distribution pattern as ADR-004 in `docs/architecture/decisions/`
4. Enhance the SKILL.md following the shadcn progressive-disclosure pattern (sub-rules in `rules/`)
5. File a cross-reference note on SK issue #832 that `spec-kitty-design` will serve as the primary org-layer doctrine source for Priivacy-ai projects once the feature ships

Handoff from Architect Alphonso: implementation of the doctrine artifacts belongs to the implementer lane. The structural decisions here should be locked before planning begins.
