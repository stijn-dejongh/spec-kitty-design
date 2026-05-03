---
work_package_id: WP02
title: 'Catalog: net-new components (grid + blog-card)'
dependencies: []
requirement_refs:
- FR-001
- FR-008
- FR-009
planning_base_branch: feature/issue-18-catalog-and-diagram-pipeline
merge_target_branch: feature/issue-18-catalog-and-diagram-pipeline
branch_strategy: Lane worktree under .worktrees/<slug>-<mid8>-lane-<id>/, branched from planning_base_branch, merging back to merge_target_branch.
subtasks:
- T007
- T008
- T009
- T010
- T011
- T012
agent: claude
history:
- timestamp: '2026-05-03T08:00:00Z'
  actor: spec-kitty.tasks
  action: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/
execution_mode: code_change
model: claude-sonnet-4-6
owned_files:
- packages/html-js/src/grid/**
- packages/html-js/src/blog-card/**
- packages/html-js/src/index.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else in this prompt, load your assigned agent profile:

```
/ad-hoc-profile-load frontend-freddy
```

Internalize the profile's identity, specialization, and collaboration contract before touching code. If the profile cannot be loaded, fall back to reading the profile YAML directly and log the gap to `tmp/finding/`.

## Objective

Close **issue #10's "Missing elements" list** by introducing two new components in `@spec-kitty/html-js`:

- **`sk-grid`** — a responsive CSS Grid layout primitive (presentational, no JS) bounded by what `tmp/reference_system/preview/` and `https://spec-kitty.ai/blog` need.
- **`sk-blog-card`** — a card variant tuned for blog-post listing/preview, composed from existing `sk-card` styles where possible.

Both unblock the docsite pilot mission (epic #17, SC-007).

In scope: `packages/html-js/src/{grid,blog-card}/` and the package barrel `packages/html-js/src/index.ts`.

NOT in scope: existing-component fixes (WP01), nav-pill (WP04), Angular wrappers (deferred to a follow-up mission), CSS Grid features beyond what the reference set needs.

## Branch Strategy

- **Planning/base branch**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Final merge target**: same
- **Lane worktree**: created automatically by `spec-kitty next --agent <name>`. Findings symlink workaround as documented in [`../quickstart.md`](../quickstart.md).

## Context

Read first:

- [`../spec.md`](../spec.md) — FR-008, FR-009, plus Scenario 1 (catalog browsing)
- [`../research.md` PLAN-007](../research.md) — scope discipline (grid bounded by reference; blog-card composes sk-card)
- [`../quickstart.md`](../quickstart.md) — story template snippet
- Existing patterns to mimic: `packages/html-js/src/card/` (the closest precedent for blog-card composition); `packages/html-js/src/feature-card/` (closest precedent for the new-component layout)

## Subtasks

### T007 — Create sk-grid CSS primitive

**Purpose**: a responsive CSS Grid wrapper with two configurable axes — column count and gap size — both driven by tokens.

**Steps**:
1. Create directory `packages/html-js/src/grid/`.
2. Create `sk-grid.css` with a base `.sk-grid` class and modifiers:
   - `.sk-grid--cols-2`, `.sk-grid--cols-3`, `.sk-grid--cols-4` (CSS Grid `grid-template-columns: repeat(N, 1fr)`)
   - `.sk-grid--gap-3`, `.sk-grid--gap-4`, `.sk-grid--gap-6` (gap from `--sk-space-3/4/6` tokens)
   - Default modifier-less `.sk-grid` is single-column with `--sk-space-4` gap
3. Add a `@media (max-width: 720px)` rule that collapses all multi-column variants to a single column for the responsive behaviour.
4. Use ONLY `--sk-*` tokens — no raw `Npx` literals. The 720 px breakpoint is the established mobile breakpoint used by nav-pill (acceptable to use as a literal in the media query since it matches the existing convention; document inline if challenged by stylelint).

**Files**: `packages/html-js/src/grid/sk-grid.css` (new, ~50 lines)

**Validation**:
- [ ] All design values reference tokens
- [ ] Stylelint passes
- [ ] Visual check: `<div class="sk-grid sk-grid--cols-3"><div>1</div><div>2</div><div>3</div></div>` renders three equal columns

### T008 [P] — Create sk-grid stories

**Purpose**: surface the grid primitive in Storybook with the variants `tmp/reference_system/preview/` calls for.

**Steps**:
1. Create `packages/html-js/src/grid/sk-grid.stories.ts`.
2. Required exports:
   - `Default` — single-column with default gap; render 3 placeholder cards
   - `TwoColumn`, `ThreeColumn`, `FourColumn` — render same placeholder content
   - `Responsive` — render the 3-column variant; story doc note explains it collapses at 720 px
   - `LightMode` — wrap the 3-column variant in the `data-theme="light"` block per [`../quickstart.md`](../quickstart.md)
3. Use the standard story file structure (Meta + StoryObj). Title: `Components/SkGrid` (no new top-level category — honours C-009).

**Files**: `packages/html-js/src/grid/sk-grid.stories.ts` (new, ~80 lines)

**Validation**:
- [ ] All five required exports present
- [ ] Default + LightMode pass axe-core
- [ ] Stories load without console errors in Storybook

### T009 — Create sk-grid index.ts + register in package barrel

**Purpose**: make the grid primitive reachable via the public package export.

**Steps**:
1. Create `packages/html-js/src/grid/index.ts` exporting an HTML constant (e.g., `SkGridDefaultHTML` returning the default-grid markup) — follow the existing pattern in `feature-card/index.ts`.
2. Update `packages/html-js/src/index.ts` to add a single line: `export { SkGridDefaultHTML } from './grid/index';`. Place it adjacent to other "layout" exports if any, otherwise near the bottom.

**Files**: `packages/html-js/src/grid/index.ts` (new), `packages/html-js/src/index.ts` (one-line addition)

**Validation**:
- [ ] Barrel export reachable: `import { SkGridDefaultHTML } from '@spec-kitty/html-js'` resolves
- [ ] No other barrel exports affected

### T010 — Create sk-blog-card CSS

**Purpose**: a blog-listing card variant. Composes `sk-card`'s frame styles where possible; adds blog-specific slots (thumbnail, eyebrow/category, title, excerpt, metadata, read-more link).

**Steps**:
1. Create directory `packages/html-js/src/blog-card/`.
2. Create `sk-blog-card.css`. Strategy:
   - Use `.sk-blog-card` as the root, with `@extend`-style reuse via `composes`-like pattern OR (since this is plain CSS, not CSS Modules) document that the consumer should apply both `class="sk-card sk-blog-card"` to compose styles.
   - Add slot classes: `.sk-blog-card__thumbnail`, `__eyebrow`, `__title`, `__excerpt`, `__meta`, `__read-more`.
   - Spacing/colour from tokens. Eyebrow uses muted foreground; read-more uses primary accent.
3. Cross-check against `https://spec-kitty.ai/blog` — match thumbnail aspect ratio, type scale, hover affordance.

**Files**: `packages/html-js/src/blog-card/sk-blog-card.css` (new, ~80 lines)

**Validation**:
- [ ] Composition with sk-card documented in CSS file header comment
- [ ] All values use tokens
- [ ] Stylelint passes

### T011 [P] — Create sk-blog-card stories

**Purpose**: surface blog-card variants in Storybook.

**Steps**:
1. Create `packages/html-js/src/blog-card/sk-blog-card.stories.ts`.
2. Required exports:
   - `Default` — full card with thumbnail, eyebrow, title, excerpt, meta, read-more
   - `WithoutImage` — no thumbnail slot rendered
   - `WithoutEyebrow` — no eyebrow slot
   - `LongTitle` — exercises title truncation behaviour (3-line clamp)
   - `LightMode` — Default wrapped in light surface
3. Title: `Components/SkBlogCard`.

**Files**: `packages/html-js/src/blog-card/sk-blog-card.stories.ts` (new, ~120 lines)

**Validation**:
- [ ] All five required exports present
- [ ] Image-less variants render gracefully (no broken image icon)
- [ ] LongTitle exercises truncation (3-line clamp visible)
- [ ] axe-core clean

### T012 — Create sk-blog-card index.ts + register in package barrel

**Purpose**: expose the blog-card via the public package export.

**Steps**:
1. Create `packages/html-js/src/blog-card/index.ts` exporting at least one HTML constant per variant (e.g., `SkBlogCardDefaultHTML`, `SkBlogCardWithoutImageHTML`).
2. Update `packages/html-js/src/index.ts` with a single export line.

**Files**: `packages/html-js/src/blog-card/index.ts` (new), `packages/html-js/src/index.ts` (one-line addition)

**Validation**:
- [ ] Barrel export reachable
- [ ] No other barrel exports affected

## Definition of Done

- [ ] All six subtasks pass per-subtask validation
- [ ] `npm run quality:all` passes
- [ ] `npx nx run storybook:storybook:build` succeeds
- [ ] Both new components have `Default` + `LightMode` exports
- [ ] Both new components reachable from the package barrel
- [ ] No files outside `owned_files` were modified
- [ ] Visual baselines for the new stories committed alongside the code
- [ ] axe-core scan reports zero violations on every new story

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Grid primitive scope-creeps into a general-purpose CSS Grid system | Treat PLAN-007 scope discipline as binding — only deliver what reference + blog need |
| Blog-card duplicates sk-card styles | Document composition in CSS header; consumers apply both classes |
| Adding to `packages/html-js/src/index.ts` collides with another in-flight WP | This WP owns the file per `owned_files`; any other WP that needs to add an export must coordinate via the orchestrator |

## Reviewer guidance

Reviewer should:
1. Open deployed Storybook and confirm `Components/SkGrid` and `Components/SkBlogCard` sections appear with all required variants.
2. Confirm `import { SkGridDefaultHTML, SkBlogCardDefaultHTML } from '@spec-kitty/html-js'` resolves at the barrel.
3. Cross-check blog-card visual against `https://spec-kitty.ai/blog`.
4. Confirm no other component dirs were touched.
