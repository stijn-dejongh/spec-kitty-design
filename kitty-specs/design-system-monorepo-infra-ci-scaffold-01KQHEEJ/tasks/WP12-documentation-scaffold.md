---
work_package_id: WP12
title: Documentation Scaffold
dependencies:
- WP04
- WP07
requirement_refs:
- FR-028
- FR-029
- FR-030
- FR-034
- NFR-001
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T064
- T065
- T066
- T067
- T068
- T069
agent: "claude:claude-sonnet-4-6:curator-carla:curator"
shell_pid: "3481688"
history:
- date: '2026-05-01'
  event: created
agent_profile: curator-carla
authoritative_surface: docs/contributing/
execution_mode: code_change
owned_files:
- docs/contributing/**
- packages/angular/README.md
- packages/html-js/README.md
- docs/architecture/decisions/ADR-003-addendum-token-values.md
role: curator
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load curator-carla
```

---

## Objective

Write the contributor guide (FR-028), per-package READMEs for angular and html-js (FR-030), and the ADR-003 token value reconciliation addendum placeholder (FR-034). All documentation must follow the SK brand voice styleguide.

## Context

- FR-028: contributor guide must cover local setup, adding a token, adding a component, running checks, submitting a PR
- FR-030: each package needs a README with install instructions, usage, and dependencies
- FR-034 pre-implementation gate: the ADR-003 addendum records the results of token reconciliation before WP-TOKEN-001 starts
- `packages/tokens/README.md` was written in WP02 — this WP covers angular and html-js
- NFR-001: a new contributor completes setup and runs all checks within 30 minutes

## Subtask Guidance

### T064 — `docs/contributing/README.md`

> **FR-029 status:** This requirement ("ADR directory pre-seeded with monorepo topology and token authority entries") is already satisfied by the existing `docs/architecture/decisions/` directory, which contains ADR-001 (token distribution format, covering the token authority rule) and ADR-002 (monorepo package topology). No new ADR files are required for FR-029 compliance. T068 (ADR-003 addendum placeholder) is additive documentation, not FR-029 fulfillment.



```markdown
# Contributing to the Spec Kitty Design System

Welcome. This guide helps you get oriented quickly.

## What's here

| Guide | For |
|---|---|
| [Adding a token](adding-a-token.md) | Extending the `--sk-*` token namespace |
| [Adding a component](adding-a-component.md) | New Angular and HTML primitive components |
| [Running quality checks](running-quality-checks.md) | Local CI parity |

## Quick start

```bash
git clone https://github.com/stijn-dejongh/spec-kitty-design.git
cd spec-kitty-design
npm ci --ignore-scripts
npx nx show projects   # should list: tokens, angular, html-js, storybook
npx nx run storybook:storybook   # opens at http://localhost:6006
```

## Before you submit a PR

- Run `npm run quality:all` — must exit 0
- Add a screenshot or visual diff for any component change
- Follow conventional commit format: `feat(scope): description`

## Architecture

See [docs/architecture/sad-lite.md](../architecture/sad-lite.md) for the system context,
package topology, and bounded context map. All architectural decisions are documented
as ADRs in [docs/architecture/decisions/](../architecture/decisions/).

**Charter requirement**: all mission specs must be checked against the ADRs before
planning begins. The charter's `architectural_review_requirement` enforces this.
```

### T065 — `docs/contributing/adding-a-token.md`

```markdown
# Adding a Design Token

Design tokens are CSS custom properties in `packages/tokens/src/tokens.css`.
The token catalogue (`packages/tokens/dist/token-catalogue.json`) is the
machine-readable source of truth for tooling and agents.

## When to add a token

Add a token when a new visual decision needs to be reusable across surfaces.
Do not add tokens for one-off values that are local to a single component.

## Naming convention (ADR-003)

Pattern: `--sk-<category>-<name>`

| Category | Prefix | Examples |
|---|---|---|
| Brand color | `--sk-color-` | `--sk-color-teal` |
| Surface | `--sk-surface-` | `--sk-surface-sidebar` |
| Foreground | `--sk-fg-` | `--sk-fg-on-sidebar` |
| Spacing | `--sk-space-` | `--sk-space-13` |
| Radius | `--sk-radius-` | `--sk-radius-xs` |

## Steps

1. **Add to `packages/tokens/src/tokens.css`** in the correct category block:
   ```css
   /* ── Brand Colors ── */
   --sk-color-teal: #4ECDC4;  /* add after existing colors */
   ```

2. **Regenerate the catalogue**:
   ```bash
   npm run tokens:catalogue
   ```

3. **Verify Stylelint passes** (the new token is now in the allowlist):
   ```bash
   npm run quality:stylelint
   ```

4. **Commit**:
   ```bash
   git commit -m "feat(tokens): add --sk-color-teal"
   ```

5. **Check file size** stays under 20 KB:
   ```bash
   wc -c packages/tokens/src/tokens.css  # < 20480
   ```

## Semantic pairing rule

If you add a surface token, also add its foreground counterpart.
`--sk-surface-sidebar` must have a paired `--sk-fg-on-sidebar`.
```

### T066 — `docs/contributing/adding-a-component.md`

```markdown
# Adding a Component

Components live in two packages: `packages/angular/` (Angular LTS) and
`packages/html-js/` (framework-agnostic HTML). Most components should exist
in both — start with the HTML primitive, then add the Angular wrapper.

## Steps

### 1. Generate the Angular component

```bash
npx nx g @nx/angular:component <name> \
  --project=angular \
  --path=packages/angular/src/lib/<name> \
  --export \
  --standalone
```

### 2. Write the HTML primitive

Create `packages/html-js/src/<name>/index.ts` and `<name>.css`.

### 3. Add Storybook stories

- Angular story: `packages/angular/src/lib/<name>/<name>.stories.ts`
- HTML story: `packages/html-js/src/<name>/<name>.html.stories.ts`

Required story exports: `Default`, `Mobile`, `Desktop`.
For interactive components, add `Hover`, `Focus`, `Disabled`.

### 4. Document token dependencies

In the story `meta.parameters.docs.description.component`:
```typescript
'Uses: `--sk-color-yellow`, `--sk-fg-on-primary`, `--sk-radius-pill`'
```

### 5. Export from package index

Add to `packages/angular/src/index.ts`:
```typescript
export { MyComponent } from './lib/<name>/<name>.component';
```

### 6. Run checks

```bash
npx nx run-many --target=build --projects=tokens,angular,html-js
npx nx run storybook:storybook:build
node scripts/run-axe-storybook.js
```

### 7. Establish visual baseline

```bash
npx playwright test apps/storybook/src/tests/visual.spec.ts --update-snapshots
git add apps/storybook/src/tests/visual.spec.ts-snapshots/
git commit -m "test(visual): add baseline for <name>"
```

## Rules

- No hardcoded values — only `--sk-*` tokens (checked by Stylelint)
- a11y addon must be enabled (`a11y: { disable: false }` in story parameters)
- Never embed mascot illustrations in component files
```

### T067 — `docs/contributing/running-quality-checks.md`

```markdown
# Running Quality Checks Locally

Match CI behavior locally before pushing. All checks below run in CI on every PR.

## Full check suite

```bash
npm run quality:all    # ESLint + Stylelint + HTMLHint
```

## Individual checks

| Check | Command | What it catches |
|---|---|---|
| ESLint | `npx nx run-many --target=lint --all` | TS errors, module boundary violations, security issues |
| Stylelint | `npm run quality:stylelint` | Hardcoded CSS values (must use `--sk-*`) |
| HTMLHint | `npm run quality:htmlhint` | HTML validity, missing `alt` attributes |
| commitlint | `npx commitlint --from=HEAD~1` | Conventional commit format |
| npm audit | `bash scripts/npm-audit-gate.sh` | Known CVEs in dependencies |
| Lockfile | `npm ci --dry-run --ignore-scripts` | Lockfile drift detection |
| Action SHA pins | `bash scripts/check-action-pins.sh` | Mutable `@v*` tags in workflows |

## Storybook-specific

```bash
npx nx run storybook:storybook:build    # build to storybook-static/
node scripts/run-axe-storybook.js       # WCAG 2.1 AA check
npx playwright test                     # cross-browser + visual regression
```

## Visual regression

On a clean run: `npx playwright test apps/storybook/src/tests/visual.spec.ts`

To update baselines after an intentional visual change:
```bash
npx playwright test --update-snapshots
git add apps/storybook/src/tests/visual.spec.ts-snapshots/
```

## CI parity note

CI uses `npm ci --ignore-scripts` (never `npm install`). Run locally with:
```bash
npm ci --ignore-scripts
```
If `npm install` is needed for a new dependency, commit the updated lockfile.
```

### T068 — ADR-003 addendum placeholder

**File**: `docs/architecture/decisions/ADR-003-addendum-token-values.md`

```markdown
# ADR-003 Addendum: Token Value Reconciliation Results

**Date**: [TO BE FILLED — complete before WP-TOKEN-001 starts]
**Status**: Pending (pre-implementation gate, FR-034)
**Requires**: Audit of `tmp/colors_and_type.css` against live `spec-kitty.ai` CSS

---

## Purpose

This addendum records the results of the token value reconciliation required by
ADR-003 before `packages/tokens/src/tokens.css` is authored.

**WP-TOKEN-001 must not start until this document is complete.**

## Reconciliation checklist

- [ ] Audit `tmp/colors_and_type.css` (Claude Design reference)
- [ ] Extract current `:root` custom properties from live `spec-kitty.ai` using browser DevTools
- [ ] Compare category by category: color, surface, foreground, border, typography, spacing, radius, shadow, motion
- [ ] Record discrepancies in the table below
- [ ] Select authoritative value for each discrepancy
- [ ] Update this document with final resolved values

## Discrepancy table

| Token name | Claude Design ref value | Live site value | Resolution |
|---|---|---|---|
| (fill after audit) | | | |

## Final canonical values

[Paste the complete `:root` block here once reconciliation is complete]

## OKLCH vs hex decision

[Record the chosen color format here — see quality-attribute-assessment.md open questions]
```

### T069 — Per-package READMEs for `angular` and `html-js`

**`packages/angular/README.md`**:
```markdown
# @spec-kitty/angular

Angular LTS component library for the Spec Kitty design system.

## Installation

```bash
npm install @spec-kitty/angular @spec-kitty/tokens
```

## Usage

1. Load the token CSS in your global styles or `angular.json`:
   ```json
   "styles": ["node_modules/@spec-kitty/tokens/dist/tokens.css"]
   ```

2. Import components:
   ```typescript
   import { SkStubComponent } from '@spec-kitty/angular';
   ```

## Peer dependencies

- `@angular/core`: `>=19.0.0 <20.0.0`
- `@spec-kitty/tokens`: `^1.0.0`

## Token dependency

This package consumes `--sk-*` CSS custom properties from `@spec-kitty/tokens`.
All components reference tokens by name — no values are hardcoded in this package.

## See also

- [Token package](../tokens/README.md)
- [Component catalog](https://stijn-dejongh.github.io/spec-kitty-design/) (Storybook)
- [Contributing guide](../../docs/contributing/adding-a-component.md)
```

**`packages/html-js/README.md`**:
```markdown
# @spec-kitty/html-js

Framework-agnostic HTML primitives and ES utilities for the Spec Kitty design system.
No Angular, no React, no Vue required.

## Installation

**npm**:
```bash
npm install @spec-kitty/html-js @spec-kitty/tokens
```

**CDN (zero build step)**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
<script type="module" src="https://cdn.jsdelivr.net/npm/@spec-kitty/html-js/dist/index.js"></script>
```

## Usage

```typescript
import { SkStubHTML } from '@spec-kitty/html-js';
document.querySelector('#app').innerHTML = SkStubHTML;
```

## Peer dependencies

- `@spec-kitty/tokens`: `^1.0.0` (or load via CDN)

## See also

- [Token package](../tokens/README.md)
- [Component catalog](https://stijn-dejongh.github.io/spec-kitty-design/) (Storybook)
- [Contributing guide](../../docs/contributing/adding-a-component.md)
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `docs/contributing/README.md` present with quick start commands
- [ ] `docs/contributing/adding-a-token.md` covers naming convention + 5-step process
- [ ] `docs/contributing/adding-a-component.md` covers Angular + HTML + story + baseline
- [ ] `docs/contributing/running-quality-checks.md` covers all CI checks with commands
- [ ] `docs/architecture/decisions/ADR-003-addendum-token-values.md` placeholder present
- [ ] `packages/angular/README.md` and `packages/html-js/README.md` present

## Reviewer Guidance

Follow `docs/contributing/adding-a-token.md` step-by-step. If you get stuck or need information not in the guide, the guide needs improvement. Check that the brand voice is consistent (sentence case, no emoji, SK canonical nouns).

## Activity Log

- 2026-05-01T20:24:24Z – claude:claude-sonnet-4-6:curator-carla:curator – shell_pid=3481688 – Started implementation via action command
- 2026-05-01T20:27:42Z – claude:claude-sonnet-4-6:curator-carla:curator – shell_pid=3481688 – Contributor guide, 4 sub-guides, angular/html-js READMEs, ADR-003 token value addendum placeholder
