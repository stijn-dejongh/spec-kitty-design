# Work Packages: Catalog Completeness & Brand Consistency Pass

**Mission ID**: `01KQPDB5J5EK82K39TF1MPQA7H`
**Slug**: `catalog-completeness-and-brand-consistency-01KQPDB5`
**Branch**: `feature/issue-18-catalog-and-diagram-pipeline`
**Spec**: [`./spec.md`](./spec.md) · **Plan**: [`./plan.md`](./plan.md) · **Research**: [`./research.md`](./research.md)
**Origin tracker**: GitHub epic [`#18`](https://github.com/stijn-dejongh/spec-kitty-design/issues/18)

## Overview

Six work packages across four engineering tracks, organized for maximum parallelism. Total: **34 subtasks** (33 original + T034 added during analyze-phase remediation), sized at 4–9 per WP. Two sequential edges only (WP04 → WP03; WP06 → WP05); everything else parallelizable.

## Engineering tracks

| Track | Theme | WPs | Issues closed |
|---|---|---|---|
| **A** | Catalog completeness | WP01, WP02 | #10 |
| **B** | Token-debt cleanup | WP03 | #11 (yellow alpha bucket) |
| **C** | Drawer self-containment + Done-lane fix | WP04 | #12, #13, #14, residual #11 |
| **D** | Diagram branding pipeline | WP05, WP06 | #2 |

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Verify and fix Button primary story full styling (Angular) | WP01 | [P] | [D] |
| T002 | Verify and fix Button secondary story full styling (Angular) | WP01 | [D] |
| T003 | Add FeatureCard colorized-border variant story | WP01 | [D] |
| T004 | Add RibbonCard colorized-border variant story | WP01 | [D] |
| T005 | Verify and populate PillTag HTML story | WP01 | [D] |
| T006 | Verify and populate SectionBanner HTML story | WP01 | [D] |
| T007 | Create sk-grid CSS primitive | WP02 |  |
| T008 | Create sk-grid stories (Default, 2/3/4-col, responsive, LightMode) | WP02 | [P] |
| T009 | Create sk-grid index.ts + register in package barrel | WP02 |  |
| T010 | Create sk-blog-card CSS (composing sk-card) | WP02 |  |
| T011 | Create sk-blog-card stories (Default, with-image, without-image, LightMode) | WP02 | [P] |
| T012 | Create sk-blog-card index.ts + register in package barrel | WP02 |  |
| T013 | Add `--sk-color-yellow-alpha-{15,35,60}` to tokens.css | WP03 |  |
| T014 | Regenerate token catalogue (`npx nx run tokens:catalogue`) | WP03 |  |
| T015 | Verify stylelint accepts new tokens (no consumer references yet) | WP03 |  |
| T016 | Update `docs/contributing/adding-a-token.md` if a new prefix is introduced (likely no-op) | WP03 |  |
| T017 | Verify drawer CSS extraction is complete (no drawer rules in `sk-nav-pill.css`) | WP04 |  | [D] |
| T018 | Verify `skToggleDrawer` module satisfies `contracts/nav-pill-drawer-module.md` | WP04 |  | [D] |
| T019 | Verify `CollapsedHamburger` story is interactive in Storybook | WP04 |  | [D] |
| T020 | Verify dashboard-demo.html imports `skToggleDrawer` from package (FR-010) | WP04 |  | [D] |
| T021 | Audit nav-pill CSS for residual `rgba()`/hex literals; replace with yellow alpha tokens | WP04 |  | [D] |
| T022 | Replace `.dash-card--done { opacity: 0.6 }` cascade with semantic colour tokens | WP04 |  | [D] |
| T023 | Update package README with both import patterns (basic-pill + drawer) | WP04 |  | [D] |
| T024 | Refresh visual baselines for affected stories/demo | WP04 |  | [D] |
| T025 | Create `docs/architecture/assets/sk-mermaid-theme.yaml` from current inline themes | WP05 |  | [D] |
| T026 | Create `scripts/render-diagrams.js` (theme injection + mmdc render + `--check`) | WP05 |  | [D] |
| T027 | Migrate every `*.mmd` file to use `%%THEME%%` placeholder | WP05 | [D] |
| T028 | Regenerate every `*.svg` via the new script and commit | WP05 |  | [D] |
| T029 | Add `docs/architecture/assets/README.md` with workflow instructions | WP05 |  | [D] |
| T030 | Pin `@mermaid-js/mermaid-cli` in `package.json` (devDependencies) | WP06 |  |
| T031 | Update `package-lock.json` | WP06 |  |
| T032 | Add `.github/workflows/docs-diagrams.yml` with path filter | WP06 |  |
| T033 | Smoke-test the gate: deliberately drift a `.mmd` and confirm CI rejection | WP06 |  |
| T034 | Verify and populate NavPill empty HTML story (FR-005) — added by analyze remediation | WP04 |  | [D] |

The `[P]` markers above indicate parallelism, not status. Per-WP tracking checkboxes live below.

---

## WP01 — Catalog: existing-component story coverage

- **Track**: A1 (catalog completeness)
- **Priority**: HIGH (blocks SC-001, SC-003 visible in deployed Storybook)
- **Independent test**: a reviewer browses the deployed Storybook and finds Button (primary + secondary), FeatureCard (with colorized-border variants), RibbonCard (with colorized-border variants), PillTag, and SectionBanner all rendering with full styling and stories present.
- **Estimated prompt size**: ~350 lines
- **Dependencies**: none
- **Risks**: visual baseline refresh needed for any story whose rendered output changes.

### Included subtasks

- [x] T001 [P] Verify and fix Button primary story full styling (Angular) (WP01)
- [x] T002 [P] Verify and fix Button secondary story full styling (Angular) (WP01)
- [x] T003 [P] Add FeatureCard colorized-border variant story (WP01)
- [x] T004 [P] Add RibbonCard colorized-border variant story (WP01)
- [x] T005 [P] Verify and populate PillTag HTML story (WP01)
- [x] T006 [P] Verify and populate SectionBanner HTML story (WP01)

### Implementation sketch

1. Open Storybook locally (`npx nx run storybook:storybook`) and inspect each named story.
2. For any unstyled / empty story, find the canonical reference in `tmp/reference_system/preview/` and produce a story whose render output matches it.
3. For colorized-border variants, extend the existing component CSS (under `WP01`'s owned dirs) with `--has-color-border` modifier classes and add stories that exercise them.
4. Refresh visual baselines for any story whose rendered output changes.

### Prompt

[`./tasks/WP01-catalog-existing-component-stories.md`](./tasks/WP01-catalog-existing-component-stories.md)

---

## WP02 — Catalog: net-new components (grid + blog-card)

- **Track**: A2 (catalog completeness — new components)
- **Priority**: HIGH (blocks SC-007: docsite pilot needs both)
- **Independent test**: a reviewer browses the deployed Storybook and finds an `sk-grid` primitive section under Components/ with 2/3/4-column variants, and an `sk-blog-card` section with at least Default + with-image + without-image variants. Both pass axe-core.
- **Estimated prompt size**: ~400 lines
- **Dependencies**: none
- **Risks**: must compose `sk-blog-card` from existing `sk-card` styles to avoid CSS duplication; package barrel update creates a small file-ownership footprint.

### Included subtasks

- [x] T007 Create sk-grid CSS primitive (WP02)
- [x] T008 [P] Create sk-grid stories (Default, 2/3/4-col, responsive, LightMode) (WP02)
- [x] T009 Create sk-grid index.ts + register in package barrel (WP02)
- [x] T010 Create sk-blog-card CSS (composing sk-card) (WP02)
- [x] T011 [P] Create sk-blog-card stories (Default, with-image, without-image, LightMode) (WP02)
- [x] T012 Create sk-blog-card index.ts + register in package barrel (WP02)

### Implementation sketch

1. Scaffold `packages/html-js/src/grid/` and `packages/html-js/src/blog-card/` directories following the existing per-component layout.
2. Write CSS for both, using only `--sk-*` tokens. The grid primitive is bounded by what `tmp/reference_system/preview/` and `https://spec-kitty.ai/blog` need.
3. Write stories with required `Default` and `LightMode` exports plus the variants listed above.
4. Add re-exports to per-component `index.ts` and to the package barrel `packages/html-js/src/index.ts`.

### Prompt

[`./tasks/WP02-catalog-new-components.md`](./tasks/WP02-catalog-new-components.md)

---

## WP03 — Tokens: yellow alpha bucket

- **Track**: B (token-debt cleanup)
- **Priority**: MEDIUM (prerequisite for WP04 token compliance)
- **Independent test**: a reviewer greps `packages/tokens/src/tokens.css` and finds the three new tokens; runs `npx nx run tokens:catalogue` and verifies the catalogue JSON has matching entries; runs `npm run quality:stylelint` clean.
- **Estimated prompt size**: ~250 lines
- **Dependencies**: none
- **Risks**: token additions are charter-governance-sensitive; must regenerate catalogue in the same commit.

### Included subtasks

- [x] T013 Add `--sk-color-yellow-alpha-{15,35,60}` to tokens.css (WP03)
- [x] T014 Regenerate token catalogue (npx nx run tokens:catalogue) (WP03)
- [x] T015 Verify stylelint accepts new tokens (no consumer references yet) (WP03)
- [x] T016 Update docs/contributing/adding-a-token.md if a new prefix is introduced (WP03)

### Implementation sketch

1. Add three additive tokens to `packages/tokens/src/tokens.css` near the existing `--sk-color-yellow` definition. Naming and rationale: see [`./research.md` PLAN-001](./research.md).
2. Regenerate `packages/tokens/dist/token-catalogue.json` and commit both files in the same commit.
3. Run `npm run quality:stylelint` to confirm the strict-value rule loads the new entries.
4. The new prefix is `--sk-color-yellow-alpha-*` — same `--sk-color-*` family. Adding a new prefix would require updating `docs/contributing/adding-a-token.md`; in this case it's likely no-op.

### Prompt

[`./tasks/WP03-tokens-yellow-alpha.md`](./tasks/WP03-tokens-yellow-alpha.md)

---

## WP04 — Nav-pill verify + Done-lane fix + token compliance

- **Track**: C (drawer self-containment + Done-lane fix + residual token-debt in nav-pill)
- **Priority**: HIGH (closes #12, #13, #14 + completes #11 in nav-pill scope)
- **Independent test**: (1) consumer integrating from `@spec-kitty/html-js` produces a working drawer in ≤ 10 minutes (NFR-007); (2) `CollapsedHamburger` Storybook story toggles open/close interactively; (3) stylelint passes on all nav-pill CSS files; (4) dashboard-demo Done lane reads as muted via tokens, not via opacity cascade.
- **Estimated prompt size**: ~500 lines
- **Dependencies**: WP03 (uses yellow alpha tokens)
- **Risks**: most of the drawer extraction is already in place from prior remediation missions — this WP is heavy on **verification** with targeted fixes only where reality drifts from the spec/contract. Visual-baseline refresh is required for the dashboard-demo Done-lane change.

### Included subtasks

- [x] T017 Verify drawer CSS extraction is complete (no drawer rules in sk-nav-pill.css) (WP04)
- [x] T018 Verify skToggleDrawer module satisfies contracts/nav-pill-drawer-module.md (WP04)
- [x] T019 Verify CollapsedHamburger story is interactive in Storybook (WP04)
- [x] T020 Verify dashboard-demo.html imports skToggleDrawer from package (FR-010) (WP04)
- [x] T021 Audit nav-pill CSS for residual rgba()/hex literals; replace with yellow alpha tokens (WP04)
- [x] T022 Replace .dash-card--done { opacity: 0.6 } cascade with semantic colour tokens (WP04)
- [x] T023 Update package README with both import patterns (basic-pill + drawer) (WP04)
- [x] T024 Refresh visual baselines for affected stories/demo (WP04)
- [x] T034 Verify and populate NavPill empty HTML story (FR-005) — added by analyze remediation (WP04)

### Implementation sketch

1. Verify each drawer-related artifact against its contract; if compliant, mark the subtask done and move on.
2. Audit `sk-nav-pill.css` and `sk-nav-pill-drawer.css` for `rgba()`, hex, or pixel literals; replace with `--sk-color-yellow-alpha-*` from WP03.
3. Apply the Done-lane semantic-colour swap from research [PLAN-006](./research.md) to `apps/demo/dashboard-demo.html`.
4. Refresh Playwright visual baselines for the affected stories (`*-default-chromium-linux.png` files under `apps/storybook/src/tests/visual.spec.ts-snapshots/`).
5. Update README to document both `addEventListener` and `window.skToggleDrawer` patterns.

### Prompt

[`./tasks/WP04-nav-pill-verify-and-done-lane.md`](./tasks/WP04-nav-pill-verify-and-done-lane.md)

---

## WP05 — Diagram pipeline: theme source + render script

- **Track**: D1 (diagram branding pipeline — content)
- **Priority**: MEDIUM (closes #2 part 1)
- **Independent test**: a contributor changes one value in `sk-mermaid-theme.yaml`, runs `node scripts/render-diagrams.js`, and observes all 8 diagrams update; running with `--check` passes when SVGs are committed and fails when they aren't.
- **Estimated prompt size**: ~400 lines
- **Dependencies**: none
- **Risks**: must produce identical output locally and in CI (FR-016) — no CI-only flags.

### Included subtasks

- [x] T025 Create docs/architecture/assets/sk-mermaid-theme.yaml from current inline themes (WP05)
- [x] T026 Create scripts/render-diagrams.js (theme injection + mmdc render + --check) (WP05)
- [x] T027 [P] Migrate every *.mmd file to use %%THEME%% placeholder (WP05)
- [x] T028 Regenerate every *.svg via the new script and commit (WP05)
- [x] T029 Add docs/architecture/assets/README.md with workflow instructions (WP05)

### Implementation sketch

1. Read every existing `.mmd` file's inline `%%{init}%%` block, extract the canonical themeVariables, and write them to `sk-mermaid-theme.yaml` per [`contracts/brand-theme-source.md`](./contracts/brand-theme-source.md).
2. Implement `scripts/render-diagrams.js` to: parse YAML, walk `.mmd` files, replace `%%THEME%%`, write temp file, invoke `mmdc`, byte-compare in `--check` mode.
3. Migrate each `.mmd` file: delete the inline `%%{init}%%` block, prepend a `%%THEME%%` line and a blank line.
4. Run the script in render mode, commit regenerated SVGs.
5. Write `docs/architecture/assets/README.md` documenting the workflow and the `%%THEME%%` source-format invariant.

### Prompt

[`./tasks/WP05-diagram-pipeline-theme-and-script.md`](./tasks/WP05-diagram-pipeline-theme-and-script.md)

---

## WP06 — Diagram pipeline: CI gate

- **Track**: D2 (diagram branding pipeline — enforcement)
- **Priority**: MEDIUM (closes #2 part 2)
- **Independent test**: a deliberately drifted `.mmd` (committed without re-rendering its `.svg`) is rejected by the `docs-diagrams` CI job within ≤ 60 s.
- **Estimated prompt size**: ~250 lines
- **Dependencies**: WP05 (gate exercises the script)
- **Risks**: CI runner caching variance can blow the 60 s budget — pin Mermaid CLI and use `actions/cache`.

### Included subtasks

- [ ] T030 Pin @mermaid-js/mermaid-cli in package.json (devDependencies) (WP06)
- [ ] T031 Update package-lock.json (WP06)
- [ ] T032 Add .github/workflows/docs-diagrams.yml with path filter (WP06)
- [ ] T033 Smoke-test the gate: deliberately drift a .mmd and confirm CI rejection (WP06)

### Implementation sketch

1. Add `@mermaid-js/mermaid-cli` to `devDependencies` at a pinned version; run `npm install` to update lockfile.
2. Author `.github/workflows/docs-diagrams.yml` per [`contracts/diagram-pipeline-ci-gate.md`](./contracts/diagram-pipeline-ci-gate.md): path filter `docs/architecture/assets/**`, Node 20, `npm ci --ignore-scripts`, run script in `--check` mode, cache npm install.
3. Smoke-test by pushing a deliberately desync'd PR (or by running `act` locally if available) and confirming the gate fails with a clear diagnostic.

### Prompt

[`./tasks/WP06-diagram-pipeline-ci-gate.md`](./tasks/WP06-diagram-pipeline-ci-gate.md)

---

## Lane structure (parallelism)

```
Lane A:  WP01 ────────────────────────────►
Lane B:  WP02 ────────────────────────────►
Lane C:  WP03 ──► WP04 ───────────────────►
Lane D:  WP05 ──► WP06 ───────────────────►
```

Four parallel lanes; longest path is two WPs (Lane C or Lane D).

## MVP scope recommendation

If the mission must ship in slices, the natural MVP is **Lane C (WP03 → WP04)** — it closes the most issues per WP (#12, #13, #14, residual #11) and removes the biggest friction for downstream consumers integrating the nav-pill. Lane A (WP01) is the second-best slice; visible wins in Storybook for every catalog browser. Lane D (WP05 → WP06) can ship independently at any time.

## Notes on state vs. spec drift

A pre-tasks state check (recorded in `tmp/finding/2026-05-03-state-vs-spec-drift.md` after this commit) found that:
- Drawer CSS extraction (#12) and `skToggleDrawer` module (#13) are **already in place** in the codebase from prior remediation missions. WP04 is heavily verification-oriented.
- New `rgba()` violations exist in `feature-card`/`card`/`angular feature-card` beyond the spec's nav-pill scope. These are **out of scope** for this mission and should become a follow-up issue. The `/spec-kitty.analyze` step will surface this formally.
- The Done-lane opacity is on `.dash-card--done` (line 338) not `.dash-lane__header--done` as #14 quoted. Same fragile pattern; fix is the same.

WPs are written to be **robust to current state** — implementer agents verify and fix only what's broken.
