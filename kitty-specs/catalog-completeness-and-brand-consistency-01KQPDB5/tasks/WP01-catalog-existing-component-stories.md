---
work_package_id: WP01
title: 'Catalog: existing-component story coverage'
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-006
- FR-007
planning_base_branch: feature/issue-18-catalog-and-diagram-pipeline
merge_target_branch: feature/issue-18-catalog-and-diagram-pipeline
branch_strategy: Planning artifacts for this feature were generated on feature/issue-18-catalog-and-diagram-pipeline. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/issue-18-catalog-and-diagram-pipeline unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-catalog-completeness-and-brand-consistency-01KQPDB5
base_commit: 9fd60cd389a77b5a5af50f7e113444aca158996c
created_at: '2026-05-03T08:57:15.559610+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
agent: "claude:opus-4-7:frontend-freddy:reviewer"
shell_pid: "1404891"
history:
- timestamp: '2026-05-03T08:00:00Z'
  actor: spec-kitty.tasks
  action: created
agent_profile: frontend-freddy
authoritative_surface: packages/
execution_mode: code_change
model: claude-sonnet-4-6
owned_files:
- packages/html-js/src/feature-card/**
- packages/html-js/src/ribbon-card/**
- packages/html-js/src/pill-tag/**
- packages/html-js/src/section-banner/**
- packages/angular/src/lib/button/**
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else in this prompt, load your assigned agent profile:

```
/ad-hoc-profile-load frontend-freddy
```

Internalize the profile's identity, specialization (primary focus, secondary awareness, avoidance boundary), and collaboration contract before touching code. If the profile cannot be loaded via the documented mechanism, fall back to reading the profile YAML/markdown directly and log the gap to `tmp/finding/`.

## Objective

Close **issue #10** for the existing components: ensure Button (Angular), FeatureCard, RibbonCard, PillTag, and SectionBanner each have fully styled Storybook stories with the variants the issue calls out (Button styling, FeatureCard/RibbonCard colorized borders, populated HTML stories for PillTag/SectionBanner).

In scope for this WP:
- `packages/html-js/src/{feature-card,ribbon-card,pill-tag,section-banner}/`
- `packages/angular/src/lib/button/`

NOT in scope (other WPs / other missions):
- nav-pill (owned by WP04)
- card (residual `rgba()` debt is **out of mission scope** — surface to analyze)
- New components grid + blog-card (owned by WP02)
- Token additions (owned by WP03)

## Branch Strategy

- **Planning/base branch**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Final merge target**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Lane worktree**: created automatically by `spec-kitty next --agent <name>` under `.worktrees/<slug>-<mid8>-lane-<id>/`. Do not create worktrees manually.
- **Findings symlink** (manual workaround until upstream auto-symlink lands):
  ```bash
  cd .worktrees/<your-lane>/
  mkdir -p tmp
  ln -sfn ../../../tmp/finding tmp/finding
  ```

## Context

Read these before starting:

- [`../spec.md`](../spec.md) — FRs FR-001..FR-007 and the User Scenarios section
- [`../plan.md`](../plan.md) — project structure and the `LightMode` story rule
- [`../research.md` PLAN-007](../research.md) — scope discipline for new variants (use existing solid colour tokens for borders, NOT new alpha tokens)
- [`../quickstart.md`](../quickstart.md) — story template snippet and visual-baseline workflow
- The reference visual baseline: `tmp/reference_system/preview/` (and `https://spec-kitty.ai/blog`) — these define what "complete" looks like

## Subtasks

### T001 [P] — Verify and fix Button primary story full styling (Angular)

**Purpose**: per #10, the Button primary stories are reported as "unstyled" in deployed Storybook. Verify current state and fix if broken.

**Steps**:
1. Open Storybook locally (`npx nx run storybook:storybook`) and navigate to the Button primary stories.
2. If the rendered output is fully styled (matches the reference visual baseline), mark the subtask done.
3. If unstyled or partially styled, inspect `packages/angular/src/lib/button/sk-button-primary.component.css` and `sk-button-primary.stories.ts`. Likely failure modes:
   - Story is using a bare `<button>` instead of the SkButtonPrimary component selector
   - Component CSS isn't being loaded into the story (missing `styleUrls` import)
   - Token variables missing because the story isn't wrapped in `data-theme` / token loader
4. Cross-check against the reference: `tmp/reference_system/preview/buttons-primary.html` (or equivalent).
5. Apply the minimal fix; ensure `Default` and `LightMode` variants both render correctly.

**Files**: `packages/angular/src/lib/button/sk-button-primary.{component.ts,component.css,stories.ts}`

**Validation**:
- [ ] Default story renders fully styled in Storybook
- [ ] LightMode story is present and renders correctly
- [ ] axe-core scan reports zero violations on both variants
- [ ] Visual baseline refreshed if rendered output changed

### T002 [P] — Verify and fix Button secondary story full styling (Angular)

**Purpose**: same as T001 but for the secondary Button.

**Steps**: identical pattern to T001 against `sk-button-secondary.*`. Likely root cause for both T001 and T002 is the same missing-import or missing-styleUrls bug — fix once, applies to both.

**Files**: `packages/angular/src/lib/button/sk-button-secondary.{component.ts,component.css,stories.ts}`

**Validation**:
- [ ] Default and LightMode variants render correctly
- [ ] Visual parity with reference baseline confirmed
- [ ] axe-core clean

### T003 [P] — Add FeatureCard colorized-border variant story

**Purpose**: per #10, FeatureCard needs a colorized-border variant story. The current `sk-feature-card.css` already has yellow/green/purple variants for the *interior fill* (using `rgba()` literals — those are out-of-scope debt for this mission). The colorized **border** is a distinct treatment.

**Steps**:
1. Inspect `packages/html-js/src/feature-card/sk-feature-card.css` and the current stories (`sk-feature-card-html.stories.ts`).
2. Decide if the colorized border is a new modifier (`sk-feature-card--border-yellow`, `--border-green`, `--border-purple`) or a parameter on the existing yellow/green/purple variants. Recommended: add modifiers, keep the existing fill variants untouched.
3. Add CSS modifiers using existing solid colour tokens for `border-color` (e.g., `border-color: var(--sk-color-yellow);`). Do NOT introduce new tokens; do NOT touch the existing `rgba()` fill rules (those are out-of-scope debt).
4. Add a `ColorizedBorders` story that renders three side-by-side cards demonstrating yellow/green/purple borders.
5. Add a `LightMode` variant of the new story.
6. Update `packages/html-js/src/feature-card/index.ts` if you exposed a new HTML constant.

**Files**: `packages/html-js/src/feature-card/{sk-feature-card.css, sk-feature-card-html.stories.ts, index.ts}`

**Validation**:
- [ ] ColorizedBorders story renders three distinct border colours
- [ ] LightMode variant present
- [ ] axe-core clean (sufficient contrast for border colours)
- [ ] Stylelint passes (no new `rgba()`/hex literals introduced)

### T004 [P] — Add RibbonCard colorized-border variant story

**Purpose**: same pattern as T003 but for RibbonCard.

**Steps**:
1. Inspect `packages/html-js/src/ribbon-card/sk-ribbon-card.css` and current stories (`sk-ribbon-card-html.stories.ts`).
2. Add `--border-<color>` modifiers using existing solid colour tokens for borders.
3. Add a `ColorizedBorders` story plus a `LightMode` variant.
4. Update `index.ts` if you exposed a new HTML constant.

**Files**: `packages/html-js/src/ribbon-card/{sk-ribbon-card.css, sk-ribbon-card-html.stories.ts, index.ts}`

**Validation**: same as T003 (ColorizedBorders + LightMode + axe + stylelint).

### T005 [P] — Verify and populate PillTag HTML story

**Purpose**: #10 reports PillTag has an "empty HTML version". Verify and populate.

**Steps**:
1. Open `packages/html-js/src/pill-tag/sk-pill-tag.stories.ts` and inspect each exported story. If any returns empty/blank HTML, replace its `render()` with a real, styled HTML example using the `SkPillTagHTML` (or relevant) constant from `index.ts`.
2. Cross-check against the reference: `tmp/reference_system/preview/` for what a populated PillTag looks like.
3. Ensure Default + LightMode + at least one variant (e.g., colour or size) export.

**Files**: `packages/html-js/src/pill-tag/sk-pill-tag.stories.ts` (and `index.ts` if a new constant is needed)

**Validation**:
- [ ] No story renders blank or unstyled
- [ ] Default + LightMode present
- [ ] axe-core clean

### T006 [P] — Verify and populate SectionBanner HTML story

**Purpose**: same pattern as T005 for SectionBanner.

**Steps**: inspect `packages/html-js/src/section-banner/sk-section-banner-html.stories.ts`; populate empty stories. The existing `index.ts` already exports `SkSectionBannerNeutralHTML`, `SkSectionBannerPurpleHTML`, `SkSectionBannerGreenHTML` — the stories should exercise all three plus a `LightMode` variant.

**Files**: `packages/html-js/src/section-banner/sk-section-banner-html.stories.ts`

**Validation**: Default + LightMode + the three colour variants render correctly; axe-clean.

## Definition of Done

- [ ] All six subtasks pass their per-subtask validation checklists
- [ ] `npm run quality:all` passes
- [ ] `npx nx run storybook:storybook:build` succeeds
- [ ] All affected component stories include `LightMode` variants per C-004
- [ ] **Per charter Testing Standards**: every component touched here has Storybook stories covering `Hover`, `Focus`, `Active`, `Disabled` interactive states (in addition to `Default` and `LightMode`). For components that don't have inherently interactive states (e.g. a static SectionBanner), document the absence in the story file's `parameters.docs.description.story`.
- [ ] Visual baselines refreshed for any story whose rendered output changed
- [ ] Commit messages follow conventional commits (scopes: `html-js`, `angular`, `storybook`)
- [ ] No files outside `owned_files` were modified
- [ ] Findings symlink workaround applied — `tmp/finding/` in this lane is symlinked to the repo root before lane teardown (charter Findings Log Practice; per-lane manual workaround documented in [`../quickstart.md`](../quickstart.md))

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Adding a colorized-border variant nudges the existing variants' visual baseline | Refresh baseline only for the **changed** stories; verify untouched stories' baselines stay green |
| FeatureCard `rgba()` debt is visible in the file but out of mission scope | Do NOT touch the existing fill rules. Surface as a finding in `tmp/finding/` and let analyze flag it |
| Reference visuals not matching latest brand | Confirm against `tmp/reference_system/preview/` AND `https://spec-kitty.ai/blog`; flag any contradiction |

## Reviewer guidance

Reviewer should:
1. Open deployed Storybook and visually confirm every story listed in #10 now renders fully styled.
2. Confirm axe-core CI step passes for all touched stories.
3. Confirm stylelint passes (no new rgba/hex/pixel literals introduced — even outside the changed files, since stylelint runs on the whole package).
4. Confirm no nav-pill or new-component (grid/blog-card) files were touched.
5. Confirm visual baselines were refreshed for changed stories AND untouched stories' baselines are unchanged.

## Activity Log

- 2026-05-03T08:57:17Z – claude:sonnet-4-6:frontend-freddy:implementer – shell_pid=1294561 – Assigned agent via action command
- 2026-05-03T14:18:37Z – claude:sonnet-4-6:frontend-freddy:implementer – shell_pid=1294561 – Moved to planned
- 2026-05-03T14:19:02Z – claude:opus-4-7:frontend-freddy:implementer – shell_pid=1372415 – Started implementation via action command
- 2026-05-03T14:28:57Z – claude:opus-4-7:frontend-freddy:implementer – shell_pid=1372415 – Ready for review: WP01 button + feature-card + ribbon-card + pill-tag + section-banner stories — colorized borders + interactive states + LightMode variants; lint/stylelint/storybook build green.
- 2026-05-03T14:30:08Z – claude:opus-4-7:frontend-freddy:reviewer – shell_pid=1404891 – Started review via action command
- 2026-05-03T14:33:14Z – claude:opus-4-7:frontend-freddy:reviewer – shell_pid=1404891 – Review passed: button Hover/Focus/Active play stories, feature-card and ribbon-card --border-{yellow,green,purple} variants using existing colour tokens, pill-tag and section-banner stories annotated with docs and Default added; LightMode present in all touched files; stylelint, html-js/angular lint, and storybook build all green.
