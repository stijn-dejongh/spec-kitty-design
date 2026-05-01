# Tasks: Design System Monorepo Infrastructure & CI Scaffold

*Path: [kitty-specs/design-system-monorepo-infra-ci-scaffold-01KQHEEJ/tasks.md](tasks.md)*

**Branch**: `main` → `main` | **Mission**: `design-system-monorepo-infra-ci-scaffold-01KQHEEJ`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Init nx 20.x workspace at repo root | WP01 | | [D] |
| T002 | Configure root `package.json` (private, workspaces, quality scripts) | WP01 | | [D] |
| T003 | Configure `nx.json` (cache, targetDefaults, affected base) | WP01 | | [D] |
| T004 | Create `packages/tokens/` skeleton (package.json, project.json, src/) | WP01 | [D] |
| T005 | Create `packages/angular/` skeleton (package.json, project.json, ng-package.json) | WP01 | [D] |
| T006 | Create `packages/html-js/` skeleton (package.json, project.json, src/) | WP01 | [D] |
| T007 | Create `apps/storybook/` skeleton (package.json, project.json) | WP01 | [D] |
| T008 | Configure `.npmrc` for `@spec-kitty` npm scope | WP01 | | [D] |
| T009 | Commit initial lockfile; verify `npm ci --ignore-scripts` clean install | WP01 | | [D] |
| T010 | Write `packages/tokens/src/tokens.css` from reconciled token catalogue | WP02 | |
| T011 | Write `scripts/generate-token-catalogue.js` (tokens.css → token-catalogue.json) | WP02 | |
| T012 | Configure and run nx `catalogue` target; commit `token-catalogue.json` | WP02 | |
| T013 | Configure `stylelint-declaration-strict-value` with catalogue allowlist | WP02 | |
| T014 | Write `packages/tokens/README.md` (FR-030) | WP02 | |
| T015 | Validate token file size < 20 KB uncompressed (NFR-004) | WP02 | |
| T016 | Generate Angular stub component via `@nx/angular` generator | WP03 | |
| T017 | Write stub Angular component (minimal, one `--sk-color-yellow` usage) | WP03 | |
| T018 | Write HTML/JS stub primitive in `packages/html-js/src/stub/` | WP03 | [P] |
| T019 | Export stubs from each package's public API entry point | WP03 | |
| T020 | Verify `nx run-many --target=build --projects=tokens,angular,html-js` succeeds | WP03 | |
| T021 | Install + configure Storybook 8.x with `@nx/storybook` and Angular renderer | WP04 | |
| T022 | Configure `apps/storybook/.storybook/preview.ts` (SK dark background, a11y addon) | WP04 | |
| T023 | Write Angular stub story (default + hover + focus + disabled + responsive) | WP04 | [P] |
| T024 | Write HTML stub story (default + breakpoints) | WP04 | [P] |
| T025 | Write Getting Started MDX page (FR-031: install, import, usage) | WP04 | |
| T026 | Verify Storybook build completes < 3 min (NFR-003) | WP04 | |
| T027 | Configure ESLint 9.x flat config with security plugin + nx boundary rules | WP05 | |
| T028 | Configure Stylelint 16.x with `--sk-*` token enforcement rule | WP05 | [P] |
| T029 | Configure HTMLHint (`.htmlhintrc`) with accessibility-aware ruleset | WP05 | [P] |
| T030 | Configure commitlint with conventional commits + SK scopes | WP05 | [P] |
| T031 | Write `package.json` quality scripts (`quality:lint`, `quality:all`) | WP05 | |
| T032 | Write `.github/security-allowlist.md` (FR-046 postinstall exception registry) | WP05 | |
| T033 | Write `dependabot.yml` — npm + Actions, grouped by framework family (FR-040) | WP06 | |
| T034 | Write `scripts/npm-audit-gate.sh` for `npm audit --audit-level=high` | WP06 | [P] |
| T035 | Configure lockfile drift check (`npm ci` enforcement + diff verification) | WP06 | [P] |
| T036 | Write `scripts/check-action-pins.sh` — scan workflows for mutable `@v*` tags | WP06 | [P] |
| T037 | Write `.npmignore` files for all three publishable packages (dist contents policy, no source maps) | WP06 | [P] |
| T038 | Validate `npm pack --dry-run` for tokens package (no secrets, no source maps) | WP06 | |
| T039 | Write `.github/workflows/ci-quality.yml` — path filter + lint + security jobs | WP07 | |
| T040 | Configure `nx affected` for path-scoped triggering (FR-035) | WP07 | |
| T041 | Add Storybook build job to CI (gate on component + token path changes) | WP07 | |
| T042 | Wire `gate` final job (all hard gates must pass before merge) | WP07 | |
| T043 | Add `lint-feedback` job (PR comments for lint failures) | WP07 | |
| T044 | Configure `@storybook/addon-a11y` + `axe-playwright` WCAG 2.1 AA CI gate (FR-021) | WP08 | |
| T045 | Configure Playwright 1.x cross-browser smoke (Chrome, Firefox, Safari) (FR-023) | WP08 | [P] |
| T046 | Configure Playwright visual regression + baseline snapshots (FR-024) | WP08 | |
| T047 | Configure Lighthouse CI (`@lhci/cli`) advisory thresholds (FR-022) | WP08 | [P] |
| T048 | Configure Storybook interaction tests (`@storybook/test`) for stub stories (FR-025) | WP08 | [P] |
| T049 | Extend `ci-quality.yml` with visual/a11y/browser job block (path-scoped) | WP08 | |
| T050 | Write `storybook-deploy.yml` — GitHub Pages on main merge, SHA-pinned (FR-033) | WP09 | |
| T051 | Write `pr-preview.yml` — surge.sh preview + PR comment URL (NFR-008) | WP09 | [P] |
| T052 | Write `release.yml` — vX.Y.Z tag; build; SBOM; `npm publish --provenance` (FR-044, FR-045) | WP09 | |
| T053 | Validate release pipeline gates (provenance, SBOM format, dist contents) | WP09 | |
| T054 | Author `doctrine/directives/SK-D01-token-authority.directive.yaml` | WP10 | |
| T055 | Author `doctrine/directives/SK-D02-illustration-boundary.directive.yaml` | WP10 | [P] |
| T056 | Author `doctrine/styleguides/sk-brand-voice.styleguide.yaml` | WP10 | [P] |
| T057 | Author `doctrine/styleguides/sk-visual-identity.styleguide.yaml` | WP10 | [P] |
| T058 | Stub `doctrine/graph.yaml` (org-layer DRG entry point, ADR-004) | WP10 | |
| T059 | Validate all doctrine artifacts: `spec-kitty charter synthesize --dry-run` | WP10 | |
| T060 | Write `skills/spec-kitty-design/SKILL.md` (progressive disclosure, governance refs) | WP11 | |
| T061 | Write `skills/spec-kitty-design/rules/brand-voice.md` (anti-patterns + examples) | WP11 | [P] |
| T062 | Write `skills/spec-kitty-design/rules/visual-identity.md` (token rules + code examples) | WP11 | [P] |
| T063 | Write `skills/spec-kitty-design/rules/component-authoring.md` (story structure, stub ref) | WP11 | [P] |
| T064 | Write `docs/contributing/README.md` (FR-028: overview + quick links) | WP12 | |
| T065 | Write `docs/contributing/adding-a-token.md` (step-by-step token addition) | WP12 | [P] |
| T066 | Write `docs/contributing/adding-a-component.md` (component authoring walkthrough) | WP12 | [P] |
| T067 | Write `docs/contributing/running-quality-checks.md` (local check commands) | WP12 | [P] |
| T068 | Write `docs/architecture/decisions/ADR-003-addendum-token-values.md` (FR-034 placeholder) | WP12 | |
| T069 | Write per-package READMEs for `angular` and `html-js` (FR-030) | WP12 | [P] |

---

## Work Packages

### WP01 — nx Workspace Foundation

**Goal**: Bootstrap the nx 20.x monorepo at the repository root with correct package skeletons, workspace config, npm scope, and a verified clean lockfile.
**Priority**: P0 — all other WPs depend on this
**Independent test**: `npm ci --ignore-scripts` from a clean clone produces no errors; `npx nx show projects` lists all four projects.
**Estimated prompt size**: ~380 lines
**Prompt**: [WP01-nx-workspace-foundation.md](tasks/WP01-nx-workspace-foundation.md)

- [x] T001 Init nx 20.x workspace at repo root (WP01)
- [x] T002 Configure root `package.json` (private, workspaces, quality scripts) (WP01)
- [x] T003 Configure `nx.json` (cache, targetDefaults, affected base) (WP01)
- [x] T004 Create `packages/tokens/` skeleton (WP01)
- [x] T005 Create `packages/angular/` skeleton (WP01)
- [x] T006 Create `packages/html-js/` skeleton (WP01)
- [x] T007 Create `apps/storybook/` skeleton (WP01)
- [x] T008 Configure `.npmrc` for `@spec-kitty` npm scope (WP01)
- [x] T009 Commit initial lockfile; verify `npm ci --ignore-scripts` (WP01)

**Dependencies**: none (pre-flight gates must be complete)
**Risks**: nx workspace init may conflict with existing `package.json` at repo root — must be handled carefully; existing `package-lock.json` must be replaced.

---

### WP02 — Token Package

**Goal**: Implement `@spec-kitty/tokens` — the CSS custom property file derived from the reconciled ADR-003 token schema, a generated catalogue for tooling, and the Stylelint enforcement rule.
**Priority**: P1 — blocks WP03
**Independent test**: `npm install @spec-kitty/tokens` in a blank HTML project; `<link>` to `tokens.css`; `--sk-color-yellow` resolves in browser DevTools.
**Estimated prompt size**: ~320 lines
**Prompt**: [WP02-token-package.md](tasks/WP02-token-package.md)

- [ ] T010 Write `packages/tokens/src/tokens.css` from reconciled catalogue (WP02)
- [ ] T011 Write `scripts/generate-token-catalogue.js` (WP02)
- [ ] T012 Configure and run nx `catalogue` target; commit `token-catalogue.json` (WP02)
- [ ] T013 Configure `stylelint-declaration-strict-value` with catalogue allowlist (WP02)
- [ ] T014 Write `packages/tokens/README.md` (WP02)
- [ ] T015 Validate token file size < 20 KB (WP02)

**Dependencies**: WP01, WP05; ADR-003 value reconciliation (FR-034) complete
**Risks**: Token reconciliation may reveal discrepancies requiring ADR-003 addendum before values are finalized.

---

### WP03 — Stub Components

**Goal**: Add a minimal stub component to each framework package to prove the build pipeline works end-to-end before Storybook is configured.
**Priority**: P1 — blocks WP04
**Independent test**: `npx nx run-many --target=build --projects=tokens,angular,html-js` exits 0; `dist/` directories populated.
**Estimated prompt size**: ~260 lines
**Prompt**: [WP03-stub-components.md](tasks/WP03-stub-components.md)

- [ ] T016 Generate Angular stub component via `@nx/angular` generator (WP03)
- [ ] T017 Write stub Angular component (one `--sk-color-yellow` usage) (WP03)
- [ ] T018 Write HTML/JS stub primitive in `packages/html-js/src/stub/` (WP03)
- [ ] T019 Export stubs from each package's public API entry point (WP03)
- [ ] T020 Verify `nx run-many --target=build` succeeds for all packages (WP03)

**Dependencies**: WP02
**Risks**: Angular Ivy partial compilation may require specific `tsconfig` settings in nx; confirm `@nx/angular` version matches Angular 19.x LTS.

---

### WP04 — Storybook Multi-Framework Setup

**Goal**: Configure Storybook 8.x to render Angular components and HTML primitives from a single catalog, deploy-ready, with the Getting Started consumer page.
**Priority**: P1 — blocks WP08, WP09 (deploy), WP12
**Independent test**: `npx nx run storybook:storybook:build` < 3 min; built `storybook-static/` contains stub stories in both Angular and HTML tabs; Getting Started page renders.
**Estimated prompt size**: ~420 lines
**Prompt**: [WP04-storybook-multi-framework.md](tasks/WP04-storybook-multi-framework.md)

- [ ] T021 Install + configure Storybook 8.x with `@nx/storybook` and Angular renderer (WP04)
- [ ] T022 Configure `preview.ts` (SK dark background, a11y addon) (WP04)
- [ ] T023 Write Angular stub story (default + all interactive states + responsive) (WP04)
- [ ] T024 Write HTML stub story (default + breakpoints) (WP04)
- [ ] T025 Write Getting Started MDX page (FR-031) (WP04)
- [ ] T026 Verify Storybook build < 3 min (NFR-003) (WP04)

**Dependencies**: WP03
**Risks**: Storybook 8.x multi-framework rendering (Angular + HTML in one catalog) has known configuration complexity; fallback is separate story files per framework with naming convention.

---

### WP05 — Linting & Code Quality Tools

**Goal**: Configure all code-level quality tools (ESLint, Stylelint, HTMLHint, commitlint) with their config files, nx targets, and quality scripts.
**Priority**: P1 — parallel with WP02; blocks WP07
**Independent test**: `npm run quality:lint` from repo root exits 0 on clean codebase; introducing a hardcoded `color: #F5C518` in a package file causes Stylelint to fail.
**Estimated prompt size**: ~360 lines
**Prompt**: [WP05-linting-quality-tools.md](tasks/WP05-linting-quality-tools.md)

- [ ] T027 Configure ESLint 9.x flat config with security plugin + nx boundary rules (WP05)
- [ ] T028 Configure Stylelint 16.x with `--sk-*` token enforcement (WP05)
- [ ] T029 Configure HTMLHint with accessibility-aware ruleset (WP05)
- [ ] T030 Configure commitlint with conventional commits + SK scopes (WP05)
- [ ] T031 Write `package.json` quality scripts (WP05)
- [ ] T032 Write `.github/security-allowlist.md` (WP05)

**Dependencies**: WP01
**Parallel with**: WP02 (no file overlap)

---

### WP06 — Security Gates & Dependency Hardening

**Goal**: Implement supply chain security controls: Dependabot config, `npm audit` gate script, lockfile drift check, Action SHA pin verification, and dist contents audit.
**Priority**: P1 — parallel with WP02/WP05; blocks WP07
**Independent test**: `bash scripts/check-action-pins.sh` fails when a workflow file contains `uses: actions/checkout@v4` (mutable tag); passes when all `uses:` are SHA-pinned.
**Estimated prompt size**: ~340 lines
**Prompt**: [WP06-security-gates.md](tasks/WP06-security-gates.md)

- [ ] T033 Write `dependabot.yml` — npm + Actions, grouped (WP06)
- [ ] T034 Write `scripts/npm-audit-gate.sh` (WP06)
- [ ] T035 Configure lockfile drift check scripts (WP06)
- [ ] T036 Write `scripts/check-action-pins.sh` — SHA pin verifier (WP06)
- [ ] T037 Configure dist contents policy (`.npmignore` or `package.json` `files`) (WP06)
- [ ] T038 Validate `npm pack --dry-run` for tokens package (WP06)

**Dependencies**: WP01
**Parallel with**: WP02, WP05

---

### WP07 — CI Quality Workflow

**Goal**: Wire all quality gates into `ci-quality.yml` with path-scoped triggering, nx-affected optimization, PR merge gate, and lint failure PR comments.
**Priority**: P2 — blocks WP08, WP09
**Independent test**: Open a PR with a Stylelint violation; CI fails on the `lint-code` job and posts a PR comment naming the file and rule. A clean PR passes all jobs.
**Estimated prompt size**: ~400 lines
**Prompt**: [WP07-ci-quality-workflow.md](tasks/WP07-ci-quality-workflow.md)

- [ ] T039 Write `.github/workflows/ci-quality.yml` (path filter + lint + security jobs) (WP07)
- [ ] T040 Configure `nx affected` for path-scoped triggering (FR-035) (WP07)
- [ ] T041 Add Storybook build job to CI (WP07)
- [ ] T042 Wire `gate` final job (all hard gates must pass) (WP07)
- [ ] T043 Add `lint-feedback` job (PR comment on failure) (WP07)

**Dependencies**: WP05, WP06
**Risks**: GitHub Actions SHA pinning must be applied to every `uses:` in this file as it is written (FR-043 must be enforced here too).

---

### WP08 — Visual, Accessibility & Browser Quality Gates

**Goal**: Add Storybook interaction tests, axe-core WCAG 2.1 AA CI gate, Playwright cross-browser smoke, Lighthouse CI, and visual regression baselines to the CI pipeline.
**Priority**: P2 — parallel with WP09 after WP04+WP07 are done
**Independent test**: A story with `aria-hidden="true"` on interactive content triggers the axe CI gate and blocks merge. Playwright screenshot matches baseline on clean build.
**Estimated prompt size**: ~450 lines
**Prompt**: [WP08-visual-a11y-browser-gates.md](tasks/WP08-visual-a11y-browser-gates.md)

- [ ] T044 Configure `@storybook/addon-a11y` + `axe-playwright` WCAG 2.1 AA gate (WP08)
- [ ] T045 Configure Playwright cross-browser smoke tests (WP08)
- [ ] T046 Configure Playwright visual regression + baseline snapshots (WP08)
- [ ] T047 Configure Lighthouse CI advisory thresholds (WP08)
- [ ] T048 Configure Storybook interaction tests for stub stories (WP08)
- [ ] T049 Extend `ci-quality.yml` with visual/a11y/browser job block (WP08)

**Dependencies**: WP04, WP07

---

### WP09 — Deployment Workflows

**Goal**: Implement all three deployment/release GitHub Actions workflows: GitHub Pages Storybook deploy, surge.sh PR preview, and the versioned npm publish + SBOM release.
**Priority**: P2 — parallel with WP08 after WP04+WP07
**Independent test**: Push a `v0.0.1-test` tag; release workflow publishes packages to npm with `--provenance` and attaches SBOM to the GitHub Release. Merge a PR; Storybook deploys to GitHub Pages within 5 min. Open a PR; surge.sh URL appears as a PR comment.
**Estimated prompt size**: ~400 lines
**Prompt**: [WP09-deployment-workflows.md](tasks/WP09-deployment-workflows.md)

- [ ] T050 Write `storybook-deploy.yml` — GitHub Pages on main merge (WP09)
- [ ] T051 Write `pr-preview.yml` — surge.sh preview + PR comment (WP09)
- [ ] T052 Write `release.yml` — vX.Y.Z tag; build; SBOM; provenance publish (WP09)
- [ ] T053 Validate release pipeline gates (WP09)

**Dependencies**: WP04, WP07

---

### WP10 — Doctrine Bundle

**Goal**: Author and validate the four org-layer doctrine YAML artifacts (SK-D01, SK-D02, sk-brand-voice, sk-visual-identity) and stub the DRG graph.yaml for future `spec-kitty doctrine fetch` compatibility.
**Priority**: P1 — parallel with WP02/WP05/WP06 after WP01
**Independent test**: `spec-kitty charter synthesize --dry-run` reports zero validation errors for all four artifact files.
**Estimated prompt size**: ~380 lines
**Prompt**: [WP10-doctrine-bundle.md](tasks/WP10-doctrine-bundle.md)

- [ ] T054 Author `SK-D01-token-authority.directive.yaml` (WP10)
- [ ] T055 Author `SK-D02-illustration-boundary.directive.yaml` (WP10)
- [ ] T056 Author `sk-brand-voice.styleguide.yaml` (WP10)
- [ ] T057 Author `sk-visual-identity.styleguide.yaml` (WP10)
- [ ] T058 Stub `doctrine/graph.yaml` (WP10)
- [ ] T059 Validate with `spec-kitty charter synthesize --dry-run` (WP10)

**Dependencies**: WP01 (directory structure)
**Parallel with**: WP02, WP05, WP06

---

### WP11 — Enhanced SKILL.md

**Goal**: Produce the progressive-disclosure Claude Code skill following the `deployable-skill-authoring` styleguide: main SKILL.md with three sub-rule files covering brand voice, visual identity, and component authoring.
**Priority**: P1 — parallel with WP10
**Independent test**: A new agent session reads only `SKILL.md` and can correctly identify which sub-rule file to consult for a CSS token usage question, without loading all files upfront.
**Estimated prompt size**: ~340 lines
**Prompt**: [WP11-enhanced-skill.md](tasks/WP11-enhanced-skill.md)

- [ ] T060 Write `skills/spec-kitty-design/SKILL.md` (WP11)
- [ ] T061 Write `skills/spec-kitty-design/rules/brand-voice.md` (WP11)
- [ ] T062 Write `skills/spec-kitty-design/rules/visual-identity.md` (WP11)
- [ ] T063 Write `skills/spec-kitty-design/rules/component-authoring.md` (WP11)

**Dependencies**: WP01
**Parallel with**: WP10

---

### WP12 — Documentation Scaffold

**Goal**: Write the full contributor guide (FR-028), per-package READMEs for angular and html-js (FR-030), and the ADR-003 value reconciliation addendum placeholder (FR-034).
**Priority**: P3 — after WP04 and WP07 (references their outputs)
**Independent test**: A developer following `docs/contributing/adding-a-token.md` can add a new token in < 30 min; `npm run quality:lint` passes after their change.
**Estimated prompt size**: ~360 lines
**Prompt**: [WP12-documentation-scaffold.md](tasks/WP12-documentation-scaffold.md)

- [ ] T064 Write `docs/contributing/README.md` (WP12)
- [ ] T065 Write `docs/contributing/adding-a-token.md` (WP12)
- [ ] T066 Write `docs/contributing/adding-a-component.md` (WP12)
- [ ] T067 Write `docs/contributing/running-quality-checks.md` (WP12)
- [ ] T068 Write ADR-003 addendum placeholder (`docs/architecture/decisions/`) (WP12)
- [ ] T069 Write READMEs for `packages/angular/` and `packages/html-js/` (WP12)

**Dependencies**: WP04, WP07

---

## Dependency Summary

```
pre-flight (manual)
    └── WP01 (nx workspace)
            ├── WP02 (tokens)        ─┐
            │       └── WP03 (stubs)  │ can run in parallel
            │               └── WP04 (Storybook)
            ├── WP05 (linting) ───────┤ parallel with WP02
            ├── WP06 (security) ──────┘ parallel with WP02/WP05
            │
            ├── WP10 (doctrine) ─────── parallel with WP02/WP05/WP06
            └── WP11 (SKILL.md) ─────── parallel with WP10
            
            WP05 + WP06
                └── WP07 (CI workflow)
                        ├── WP08 (visual/a11y/browser) ← also needs WP04
                        └── WP09 (deploy/release)       ← also needs WP04
                        
            WP04 + WP07
                └── WP12 (docs)
```

## MVP Scope

WP01 → WP02 → WP03 → WP04 + WP05 → WP07 delivers the minimum viable infrastructure: a working nx workspace, published token package, Storybook with stub stories, and basic lint gates. All other WPs add quality depth.
