---
work_package_id: WP10
title: Doctrine Bundle
dependencies:
- WP01
requirement_refs:
- FR-036
- FR-037
- FR-038
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T054
- T055
- T056
- T057
- T058
- T059
agent: "claude:claude-sonnet-4-6:curator-carla:curator"
shell_pid: "3022015"
history:
- date: '2026-05-01'
  event: created
agent_profile: curator-carla
authoritative_surface: doctrine/
execution_mode: code_change
owned_files:
- doctrine/**
role: curator
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load curator-carla
```

Curator Carla owns governance artifacts, documentation quality, and terminology consistency. This WP produces doctrine YAML artifacts that follow the spec-kitty shipped schema exactly.

---

## Objective

Author and validate the four org-layer doctrine YAML artifacts (SK-D01, SK-D02, sk-brand-voice, sk-visual-identity) and stub the `doctrine/graph.yaml` DRG entry point. All artifacts must pass `spec-kitty charter synthesize --dry-run`.

## Context

- ADR-004: `doctrine/` directory at repo root; structured for `spec-kitty doctrine fetch` once #832 ships
- Research doc `002-llm-doctrine-bundle-evaluation.md`: brand voice rules source is `tmp/README.md`; visual identity rules source is `tmp/colors_and_type.css`
- DIRECTIVE_037 (Living Documentation Sync): doctrine artifacts must evolve when brand decisions change
- The YAML schema must match spec-kitty shipped directive/styleguide schemas — see examples at `/home/stijnd/Documents/code/forks/spec-kitty/src/doctrine/directives/shipped/031-context-aware-design.directive.yaml` and `/home/stijnd/Documents/code/forks/spec-kitty/src/doctrine/styleguides/shipped/python-conventions.styleguide.yaml`

## Subtask Guidance

### T054 — `SK-D01-token-authority.directive.yaml`

**File**: `doctrine/directives/SK-D01-token-authority.directive.yaml`

```yaml
schema_version: "1.0"
id: SK-DIRECTIVE-D01
title: Token Authority Rule
intent: >
  All CSS output produced for any Spec Kitty or Priivacy-ai surface must use
  --sk-* CSS custom properties exclusively. No hardcoded color, spacing,
  typography, or radius values are permitted outside the token source file
  (packages/tokens/src/tokens.css). This rule applies to component CSS,
  story CSS, documentation styles, and any design system artefact.
enforcement: required
scope: >
  Applies whenever an agent generates, reviews, or modifies CSS, SCSS, or
  inline styles for any Spec Kitty ecosystem surface. Applies during implement
  and review actions.
procedures:
  - Before writing any CSS, identify the appropriate --sk-* token for each
    visual decision. Consult the token catalogue at
    packages/tokens/dist/token-catalogue.json.
  - Never write a hex, rgb, hsl, oklch, or named color value outside
    packages/tokens/src/tokens.css.
  - Never write a hardcoded px or rem spacing value outside tokens.css.
  - When reviewing CSS, flag any property value that is not a var(--sk-*)
    reference as a violation of this directive.
integrity_rules:
  - The Stylelint stylelint-declaration-strict-value rule encodes this
    directive as an automated check. CI enforcement is a proxy for this rule.
  - The token catalogue is the enumerated allowlist of valid --sk-* property
    names. Any --sk-* name not in the catalogue is a typo, not an extension.
```

### T055 — `SK-D02-illustration-boundary.directive.yaml`

**File**: `doctrine/directives/SK-D02-illustration-boundary.directive.yaml`

```yaml
schema_version: "1.0"
id: SK-DIRECTIVE-D02
title: Illustration Content Boundary
intent: >
  The Spec Kitty mascot (the bespectacled cat character) and associated
  watercolour/hand-drawn illustrations are for supporting materials only:
  marketing pages, documentation narrative, slidedecks, and blog posts.
  They must never appear as embedded assets inside software distribution
  packages — npm package dist directories, Angular component bundles,
  CDN bundles, or any installable artefact.
enforcement: required
scope: >
  Applies during implement and review actions whenever an agent is working
  on a distribution package or CI release pipeline.
procedures:
  - When adding image assets to any packages/ or apps/ directory, confirm
    the asset is an icon (SVG line art, Lucide-style) or a photograph —
    not a mascot illustration.
  - When reviewing a PR that adds binary assets (.png, .webp, .jpg, .svg)
    to a package dist directory, check that no mascot illustrations are
    included.
  - If a mascot illustration is needed for documentation (e.g., a Storybook
    "Getting Started" page), link to the published URL on spec-kitty.ai
    rather than bundling the file.
integrity_rules:
  - The npm pack --dry-run CI gate should not list any *.webp or
    illustration-* files in the package contents.
  - The assets/ directory in the Claude Design reference (tmp/assets/)
    contains the official illustrations — they are gitignored and must
    not be committed to the repository.
```

### T056 — `sk-brand-voice.styleguide.yaml`

**File**: `doctrine/styleguides/sk-brand-voice.styleguide.yaml`

```yaml
schema_version: "1.0"
id: sk-brand-voice
title: Spec Kitty Brand Voice Styleguide
scope: docs
applies_to_languages: []

principles:
  - "Sentence case for all headlines and labels — never title case."
  - "No emoji on any surface — none observed across 21 reference screenshots."
  - "No exclamation marks — the brand voice is composed, not exclamatory."
  - "Concrete outcomes over abstract benefits: 'Developers spend time building,
     not being blocked' not 'improved developer productivity'."
  - "POV: Spec Kitty (third-person product) with 'you/your team' for the reader.
     Rarely 'we'. Never 'I'."
  - "Canonical product nouns are always capitalized when referring to SK concepts:
     Specs, Plans, Work Packages, Missions, Decision Moments, Charter, Doctrine.
     Never capitalize when used generically."
  - "Inline code uses monospace with a faint pill background mid-sentence:
     `spec-kitty orchestrator`, `kitty-specs`."
  - "Eyebrow labels and stat captions in ALL-CAPS mono with wide tracking:
     'COMPETITIVE MATRIX', 'BY THE NUMBERS', 'TOTAL COMMITS'."
  - "The arrow convention in CLI flow text uses literal hyphen-plus-greater-than:
     spec -> plan -> tasks -> implement -> review -> merge.
     Never render this as an SVG arrow or Unicode right arrow."
  - "Vibe: quirky-but-serious. The cat mascot sets a friendly mood;
     the typography and density keep it credible for engineering buyers."

patterns:
  - name: CTA copy
    description: "Short, imperative, sentence case. Occasional title case for two-word CTAs."
    bad_example: "GET STARTED NOW!"
    good_example: "Get started"

  - name: Feature benefit statement
    description: "Lead with the concrete outcome, not the mechanism."
    bad_example: "Our AI-powered workflow engine optimises your delivery pipeline."
    good_example: "Developers spend time building, not being blocked on finalized requirements."

  - name: Canonical term usage
    description: "Use SK canonical nouns with initial caps when referring to SK concepts."
    bad_example: "Create a feature spec and break it into tasks."
    good_example: "Create a Spec and break it into Work Packages."

anti_patterns:
  - name: Title Case Headlines
    description: "Title casing headlines is off-brand. Use sentence case."
    bad_example: "Bring Structure To AI-Assisted Delivery"
    good_example: "Bring structure to AI-assisted delivery"

  - name: Emoji in copy
    description: "No emoji anywhere — not in docs, not in UI, not in commit messages."
    bad_example: "✅ All checks passed! 🎉"
    good_example: "All checks passed."

  - name: Abstract benefit claims
    description: "Avoid generic productivity language. Be specific."
    bad_example: "Spec Kitty improves team velocity."
    good_example: "Spec Kitty catches requirement drift before code is written."

quality_test: "Can a new contributor write a UI label or documentation sentence that matches the brand voice without looking at examples? If they naturally reach for title case or an exclamation mark, the training failed."
```

### T057 — `sk-visual-identity.styleguide.yaml`

**File**: `doctrine/styleguides/sk-visual-identity.styleguide.yaml`

```yaml
schema_version: "1.0"
id: sk-visual-identity
title: Spec Kitty Visual Identity Styleguide
scope: code
applies_to_languages:
  - css
  - scss
  - html

principles:
  - "--sk-* CSS custom properties are the single authoritative token source.
     No hardcoded color, spacing, typography, or radius values (see SK-D01)."
  - "Dark mode is the default surface — --sk-surface-page (#0A0A0B) is the base."
  - "Semantic pairing: always use --sk-fg-on-* foreground tokens with their
     paired --sk-surface-* background. Never mix unpaired surface/foreground."
  - "Primary accent is yellow (--sk-color-yellow: #F5C518). Use it sparingly:
     primary CTAs, active indicators, focus rings, the cat's bow tie."
  - "No gradients on body backgrounds. Sections use flat dark surfaces
     differentiated by tint, not gradient."
  - "Card radius is --sk-radius-md (16px). Button radius is --sk-radius-pill (999px).
     Eyebrow chips are --sk-radius-sm (8px)."
  - "Iconography: Lucide-style stroke icons (2px, rounded caps). No emoji."
  - "Mascot illustrations are for supporting materials only (see SK-D02)."
  - "Borders use --sk-border-default (1px hairline) for depth, not drop shadows."

patterns:
  - name: Primary CTA button
    description: "Yellow fill, dark ink text, pill shape, optional yellow glow on hover."
    bad_example: |
      .btn-primary {
        background: #F5C518;
        color: #000;
        border-radius: 999px;
      }
    good_example: |
      .btn-primary {
        background: var(--sk-color-yellow);
        color: var(--sk-fg-on-primary);
        border-radius: var(--sk-radius-pill);
      }
      .btn-primary:hover {
        box-shadow: var(--sk-shadow-glow-primary);
      }

  - name: Card surface
    description: "Card uses --sk-surface-card with a 1px hairline border at --sk-border-default."
    bad_example: |
      .card { background: #161619; border: 1px solid #26262C; border-radius: 16px; }
    good_example: |
      .card {
        background: var(--sk-surface-card);
        border: 1px solid var(--sk-border-default);
        border-radius: var(--sk-radius-md);
      }

  - name: Text on dark surface
    description: "Body text uses --sk-fg-default (~91% white). Muted text uses --sk-fg-muted."
    bad_example: |
      p { color: rgba(255,255,255,0.91); }
    good_example: |
      p { color: var(--sk-fg-default); }

anti_patterns:
  - name: Hardcoded hex values
    description: "Never write hex, rgb, or hsl values in component CSS."
    bad_example: "color: #F5C518;"
    good_example: "color: var(--sk-color-yellow);"

  - name: Unpaired surface/foreground
    description: "Never use a surface token without its paired foreground token."
    bad_example: |
      .hero { background: var(--sk-color-yellow); color: white; }
    good_example: |
      .hero { background: var(--sk-color-yellow); color: var(--sk-fg-on-primary); }

  - name: Gradients on backgrounds
    description: "Section backgrounds are flat — no gradient fills."
    bad_example: "background: linear-gradient(to bottom, #0A0A0B, #161619);"
    good_example: "background: var(--sk-surface-page);"

quality_test: "Can an agent generate a new component's CSS using only this styleguide and the token catalogue, without producing any hardcoded values or contrast violations?"
```

### T058 — `doctrine/graph.yaml` stub

**File**: `doctrine/graph.yaml`

```yaml
# Spec Kitty Design System — org-layer DRG entry point
# This file is the entry point for `spec-kitty doctrine fetch` once issue #832 ships.
# Format: spec-kitty DRG v1 (compatible with shipped graph.yaml schema)
schema_version: "1.0"
graph_id: "spec-kitty-design-org-doctrine"
description: >
  Org-layer doctrine for the Spec Kitty design system and Priivacy-ai ecosystem.
  Provides brand voice, visual identity, and token authority governance for all
  AI agents working on Spec Kitty or adjacent repositories.
source_repo: "https://github.com/stijn-dejongh/spec-kitty-design"
artifacts:
  directives:
    - id: SK-DIRECTIVE-D01
      file: directives/SK-D01-token-authority.directive.yaml
    - id: SK-DIRECTIVE-D02
      file: directives/SK-D02-illustration-boundary.directive.yaml
  styleguides:
    - id: sk-brand-voice
      file: styleguides/sk-brand-voice.styleguide.yaml
    - id: sk-visual-identity
      file: styleguides/sk-visual-identity.styleguide.yaml
```

### T059 — Validate with `spec-kitty charter synthesize --dry-run`

```bash
spec-kitty charter synthesize --dry-run 2>&1
# Expected: "Dry run complete. No errors found."
# If validation fails, fix the schema error reported in the output.
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `doctrine/directives/SK-D01-token-authority.directive.yaml` passes schema validation
- [ ] `doctrine/directives/SK-D02-illustration-boundary.directive.yaml` passes schema validation
- [ ] `doctrine/styleguides/sk-brand-voice.styleguide.yaml` has principles + patterns + anti_patterns
- [ ] `doctrine/styleguides/sk-visual-identity.styleguide.yaml` has bad/good CSS code examples
- [ ] `doctrine/graph.yaml` stub present
- [ ] `spec-kitty charter synthesize --dry-run` exits 0

## Reviewer Guidance

Read each doctrine artifact and verify: principles are actionable (not vague), anti-patterns have concrete bad/good examples, and terminology matches the spec-kitty glossary. Check that all hardcoded values in the styleguide examples reference `--sk-*` in the "good" column.

## Activity Log

- 2026-05-01T18:32:43Z – claude:claude-sonnet-4-6:curator-carla:curator – shell_pid=3022015 – Started implementation via action command
