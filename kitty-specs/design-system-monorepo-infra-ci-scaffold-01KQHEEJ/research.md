# Research: Design System Monorepo Infrastructure & CI Scaffold

*Phase 0 output — all NEEDS CLARIFICATION items resolved*

---

## nx vs turborepo

**Decision:** nx 20.x

**Rationale:** nx provides a first-class Angular plugin (`@nx/angular`) that handles Angular LTS project generation, executor configuration, and test setup with zero custom scripting. Given `@spec-kitty/angular` is a primary v1 target, the reduced setup cost and maintained integration justify the added configuration surface over turborepo. nx's project graph visualization is also useful for enforcing the one-directional dependency rule (tokens ← angular, tokens ← html-js; no cross-framework deps).

**Alternatives considered:** turborepo — lighter configuration, faster cold-cache builds, but no Angular-specific integration; framework adapter setup would require custom nx executors or manual scripts anyway.

---

## PR preview deployment (NFR-008)

**Decision:** surge.sh via GitHub Actions

**Rationale:** surge.sh is free for open-source projects, requires no account-level configuration beyond a SURGE_TOKEN secret, and publishes a stable preview URL as a PR comment in under 2 minutes. For a design system where visual review is the primary PR feedback mechanism, a fast, free, zero-config preview URL is sufficient. Chromatic would also cover visual regression (FR-024) in one service, but introduces a paid dependency with snapshot limits; the existing axe-core + Playwright visual baseline approach already satisfies FR-024 without a third-party service.

**PR preview URL pattern:** `https://spec-kitty-design-pr-<PR_NUMBER>.surge.sh` — predictable, linkable from the PR description.

**Alternatives considered:**
- Chromatic — purpose-built, excellent UX, but paid; snapshot limits could be hit during active development
- Netlify — more powerful (branch deploys, form handling) but more configuration for a simple Storybook static site

---

## Storybook multi-framework rendering approach

**Decision:** Single Storybook instance with framework-specific story renderers via `@storybook/angular` and `@storybook/html`.

**Rationale:** Storybook 8.x supports composing multiple renderers in a single `.storybook/main.ts` via the `framework` array. Each story file can specify its renderer via the `parameters.framework` metadata or by co-locating `*.stories.ts` (Angular) alongside `*.stories.html.ts` (plain HTML). The Storybook `composeStories` API allows the same story definition to drive both the Angular component test and the HTML primitive test.

**Constraint (FR-007):** Angular and plain HTML tabs in the same story view requires the Storybook "multi-framework" addon or a custom toolbar toggle. This is a known v1 scope item — if a single-story multi-tab view is not achievable in Storybook 8.x, the fallback is separate story entries per framework with a naming convention (`ComponentName (Angular)`, `ComponentName (HTML)`). Stub component WP (WP-STUB-001) must prove this out.

---

## Visual regression tooling

**Decision:** Playwright visual snapshots via `@playwright/test` built-in `toMatchSnapshot()`, committed baselines in `apps/storybook/.visual-baselines/`.

**Rationale:** Playwright is already in the stack for cross-browser testing (FR-023). Using its built-in snapshot API avoids adding a separate visual regression dependency. Baselines are committed to the repo (git LFS not required for SVG/PNG at this scale). A failing visual check produces a diff image attached to the CI job.

**First-run baseline creation:** The `pr-preview.yml` workflow includes a baseline-creation step that runs on the first push to a new story, creating the initial snapshot and committing it back. The CI visual check job (FR-024) then compares subsequent runs against the committed baseline.

**Alternatives considered:** Percy, Applitools — both are paid services; Chromatic (covered above).

---

## Stylelint `--sk-*` token enforcement

**Decision:** Custom Stylelint rule (inline plugin in `stylelint.config.mjs`) that fails when any `color`, `background`, `font-family`, `font-size`, `padding`, `margin`, `border-color`, or `border-radius` property uses a hardcoded value instead of a `var(--sk-*)` reference. Exception: `--sk-*` custom property declarations themselves in `tokens.css`.

**Rationale:** The no-hardcoded-values constraint (C-003) must be machine-enforceable. A custom Stylelint plugin is the standard pattern for this; the `stylelint-declaration-strict-value` npm package provides the scaffolding.

**Package reference:** `stylelint-declaration-strict-value` — actively maintained, 2M+ weekly downloads, no postinstall scripts.

---

## WCAG 2.1 AA — axe-core integration pattern

**Decision:** Storybook `@storybook/addon-a11y` (which wraps axe-core) for in-browser story-level checks, plus a separate `axe-playwright` CI step that runs axe against the Playwright-rendered Storybook for PR gate enforcement (FR-021).

**Rationale:** The Storybook addon provides immediate feedback during development (in the Storybook browser panel). The `axe-playwright` CI step is the hard gate — it runs headlessly against the built Storybook and fails the PR if any story has WCAG 2.1 AA violations.

---

## Token schema reconciliation (FR-034) — approach

**Decision:** Manual audit using browser DevTools on `spec-kitty.ai`, extracting computed `:root` custom properties and comparing against `tmp/colors_and_type.css`. Discrepancies recorded in an ADR-003 addendum file (`docs/architecture/decisions/2026-05-01-3-token-schema-naming-convention-addendum.md`) before WP-TOKEN-001 begins.

**Note:** This is a pre-implementation gate, not a work package. It must be completed by the maintainer before WP-TOKEN-001 is activated.

---

## nx workspace configuration decisions

**Decision summary:**
- nx version: 20.x (current stable)
- Angular plugin: `@nx/angular` (official)
- Package manager: npm (not pnpm or yarn) — consistent with SK's npm-based stack
- Storybook integration: `@nx/storybook` executor for build and serve
- Publishable packages: `publishable: true` in `project.json`; `package.json` `exports` map for each package
- Root `package.json` is workspace root only — not publishable
- `nx affected` used in CI to skip unchanged package jobs (FR-035 path-scoped triggering)

---

## GitHub Actions SHA pinning — reference SHAs

The following Actions are used in this mission's CI. SHAs must be verified against their latest releases at implementation time; the values below are illustrative of the pinning pattern, not pre-committed values.

| Action | Version tag | Where used |
|---|---|---|
| `actions/checkout` | v4 | all workflows |
| `actions/setup-node` | v4 | all workflows |
| `actions/upload-artifact` | v4 | CI quality reports |
| `actions/deploy-pages` | v4 | Storybook GitHub Pages |
| `actions/configure-pages` | v5 | Storybook GitHub Pages |

All `uses:` directives in workflow files must use the full SHA, not the tag. Dependabot for Actions (FR-040) will keep the SHAs current.
