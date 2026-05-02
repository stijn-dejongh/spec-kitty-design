# Tasks: Post-Review Remediation and Demo Deploy

**Mission:** post-review-remediation-and-demo-deploy-01KQM7XS
**Branch:** feature/post-review-remediation-and-demo-deploy
**Date:** 2026-05-02

---

## Subtask Index

| ID | Description | WP | Parallel |
|----|-----------|----|---------|
| T001 | Add `--sk-color-yellow-alpha-15/35/60` tokens to `tokens.css` | WP01 | No | [D] |
| T002 | Update `sk-nav-pill.css` hover rule to use new alpha tokens | WP01 | No | [D] |
| T003 | Verify tokens + html-js builds pass after changes | WP01 | No | [D] |
| T004 | Create `sk-nav-pill-drawer.css` with extracted hamburger/drawer CSS | WP02 | No | [D] |
| T005 | Remove extracted block from `sk-nav-pill.css` | WP02 | No | [D] |
| T006 | Update `CollapsedHamburger` story: import drawer CSS + update docs | WP02 | No | [D] |
| T007 | Create `sk-nav-pill.js` with exported `skToggleDrawer` function | WP03 | No | [D] |
| T008 | Re-export `skToggleDrawer` from `packages/html-js/src/nav-pill/index.ts` | WP03 | No | [D] |
| T009 | Update `CollapsedHamburger` story to import and invoke `skToggleDrawer` | WP03 | No | [D] |
| T010 | Replace inline `skToggleDrawer` in `dashboard-demo.html` with module import | WP03 | No | [D] |
| T011 | Replace inline `skToggleDrawer` in `blog-demo.html` with module import | WP03 | No | [D] |
| T012 | Replace `opacity: 0.6` on Done-lane header with colour tokens | WP04 | No | [D] |
| T013 | Remove `.dash-lane__count { opacity: 1 }` child override | WP04 | No | [D] |
| T014 | Change blog-demo `[data-theme="light"] header` bg to `--sk-surface-card` | WP04 | No | [D] |
| T015 | Add `LightMode` story to `sk-button-html.stories.ts` | WP05 | Yes | [D] |
| T016 | Add/upgrade `LightMode` story to `sk-card-html.stories.ts` | WP05 | Yes | [D] |
| T017 | Add `LightMode` story to `sk-check-bullet-html.stories.ts` | WP05 | Yes | [D] |
| T018 | Upgrade `OnLightBackground` → `LightMode` in `sk-feature-card-html.stories.ts` | WP05 | Yes | [D] |
| T019 | Add `LightMode` story to `sk-form-field-html.stories.ts` | WP05 | Yes | [D] |
| T020 | Add `LightMode` story to `sk-nav-pill.stories.ts` (html-js) | WP05 | Yes |
| T021 | Add `LightMode` story to `sk-pill-tag.stories.ts` | WP05 | Yes | [D] |
| T022 | Upgrade `OnLightBackground` → `LightMode` in `sk-ribbon-card-html.stories.ts` | WP05 | Yes | [D] |
| T023 | Add `LightMode` story to `sk-section-banner-html.stories.ts` | WP05 | Yes | [D] |
| T024 | Upgrade `LightBackground` → `LightMode` in `sk-site-footer.stories.ts` | WP05 | Yes | [D] |
| T025 | Add `LightMode` story to `sk-button-primary.stories.ts` (Angular) | WP06 | Yes | [D] |
| T026 | Add `LightMode` story to `sk-button-secondary.stories.ts` (Angular) | WP06 | Yes | [D] |
| T027 | Add `LightMode` story to `sk-feature-card.stories.ts` (Angular) | WP06 | Yes | [D] |
| T028 | Add `LightMode` story to `sk-nav-pill.stories.ts` (Angular) | WP06 | Yes | [D] |
| T029 | Add `LightMode` story to `sk-pill-tag.stories.ts` (Angular) | WP06 | Yes | [D] |
| T030 | Add `LightMode` story to `sk-ribbon-card.stories.ts` (Angular) | WP06 | Yes | [D] |
| T031 | Update `storybook-deploy.yml` to copy demo pages + fix asset paths | WP07 | No | [D] |
| T032 | Update `getting-started.mdx` with links to deployed demo pages | WP07 | No | [D] |
| T033 | Rewrite `README.md` with vision, usage guide, and live site links | WP07 | No | [D] |

---

## FR Coverage Map

| FR | WP |
|----|----|
| FR-001 | WP01 |
| FR-002 | WP01 |
| FR-003 | WP02 |
| FR-004 | WP02 |
| FR-005 | WP03 |
| FR-006 | WP03 |
| FR-007 | WP03 |
| FR-008 | WP04 |
| FR-009 | WP07 |
| FR-010 | WP07 |
| FR-011 | WP05 |
| FR-012 | WP06 |
| FR-013 | WP04 |
| FR-014 | WP07 |

---

## Phase 1 — Token Foundation

### WP01 — Alpha Token Addition
**Priority:** Critical (unblocks all LightMode story work)
**Prompt:** [WP01-alpha-token-addition.md](tasks/WP01-alpha-token-addition.md)
**Dependencies:** none
**Estimated prompt size:** ~250 lines

**Goal:** Add three yellow alpha-channel tokens to `packages/tokens/src/tokens.css` and update the `sk-nav-pill.css` hover rule to reference them instead of hardcoded `rgba()` channel literals. Resolves the C-202 violation (DEF-01 from Renata review).

- [x] T001 Add `--sk-color-yellow-alpha-15/35/60` tokens to `tokens.css` (WP01)
- [x] T002 Update `sk-nav-pill.css` hover rule to use new alpha tokens (WP01)
- [x] T003 Verify tokens + html-js builds pass (WP01)

---

## Phase 2 — Component Refactor (parallel after WP01)

### WP02 — CSS Component Boundary Split
**Priority:** High (blocks 1.0 publish)
**Prompt:** [WP02-css-component-boundary-split.md](tasks/WP02-css-component-boundary-split.md)
**Dependencies:** WP01
**Estimated prompt size:** ~280 lines

**Goal:** Extract the hamburger button and drawer CSS block (lines 89–175 of `sk-nav-pill.css`) into a new `sk-nav-pill-drawer.css` file. Update the `CollapsedHamburger` story to import both files and document the split.

- [x] T004 Create `sk-nav-pill-drawer.css` with extracted hamburger/drawer CSS (WP02)
- [x] T005 Remove extracted block from `sk-nav-pill.css` (WP02)
- [x] T006 Update `CollapsedHamburger` story: import drawer CSS + update docs description (WP02)

### WP03 — JS Module + Story Update + Demo Page Fixes
**Priority:** High
**Prompt:** [WP03-js-module-extraction.md](tasks/WP03-js-module-extraction.md)
**Dependencies:** WP01, WP02
**Estimated prompt size:** ~420 lines

**Goal:** Create the `skToggleDrawer` JS module, update the `CollapsedHamburger` story (CSS imports + JS import + docs), wire both demo pages to use the module, and apply two demo CSS fixes.

- [x] T007 Create `sk-nav-pill.js` with exported `skToggleDrawer` (WP03)
- [x] T008 Re-export `skToggleDrawer` from `index.ts` (WP03)
- [x] T009 Update `CollapsedHamburger` story: CSS imports, JS import, docs, LightMode (WP03)
- [x] T010 Replace inline `skToggleDrawer` in `dashboard-demo.html` with module import (WP03)
- [x] T011 Replace inline `skToggleDrawer` in `blog-demo.html` with module import (WP03)
- [x] T012 Replace `opacity: 0.6` on Done-lane header with colour tokens in `dashboard-demo.html` (WP03)
- [x] T013 Remove `.dash-lane__count { opacity: 1 }` child override (WP03)
- [x] T014 Change `[data-theme="light"] header` bg to `--sk-surface-card` in `blog-demo.html` (WP03)

---

## Phase 3 — Storybook and Deployment (after Phase 1+2)

### WP05 — html-js LightMode Stories (9 non-nav-pill components)
**Priority:** High
**Prompt:** [WP05-html-js-lightmode-stories.md](tasks/WP05-html-js-lightmode-stories.md)
**Dependencies:** WP01, WP02, WP03
**Estimated prompt size:** ~380 lines

**Goal:** Add a `LightMode` story export to all 10 non-stub html-js component stories. The story must wrap its render output in `<div data-theme="light">` so components receive correct light-mode token values. Upgrade existing background-only light variants.

- [x] T015 Add `LightMode` to `sk-button-html.stories.ts` (WP05)
- [x] T016 Add/upgrade `LightMode` to `sk-card-html.stories.ts` (WP05)
- [x] T017 Add `LightMode` to `sk-check-bullet-html.stories.ts` (WP05)
- [x] T018 Upgrade `OnLightBackground` → `LightMode` in `sk-feature-card-html.stories.ts` (WP05)
- [x] T019 Add `LightMode` to `sk-form-field-html.stories.ts` (WP05)
- [x] T021 Add `LightMode` to `sk-pill-tag.stories.ts` (WP05)
- [x] T022 Upgrade `OnLightBackground` → `LightMode` in `sk-ribbon-card-html.stories.ts` (WP05)
- [x] T023 Add `LightMode` to `sk-section-banner-html.stories.ts` (WP05)
- [x] T024 Upgrade `LightBackground` → `LightMode` in `sk-site-footer.stories.ts` (WP05)

### WP06 — Angular LightMode Stories
**Priority:** High
**Prompt:** [WP06-angular-lightmode-stories.md](tasks/WP06-angular-lightmode-stories.md)
**Dependencies:** WP01
**Estimated prompt size:** ~340 lines

**Goal:** Add a `LightMode` story export to all 6 non-stub Angular component stories. Use a story-level decorator that wraps the component template in `<div data-theme="light">`.

- [x] T025 Add `LightMode` to `sk-button-primary.stories.ts` (WP06)
- [x] T026 Add `LightMode` to `sk-button-secondary.stories.ts` (WP06)
- [x] T027 Add `LightMode` to `sk-feature-card.stories.ts` (WP06)
- [x] T028 Add `LightMode` to `sk-nav-pill.stories.ts` Angular (WP06)
- [x] T029 Add `LightMode` to `sk-pill-tag.stories.ts` Angular (WP06)
- [x] T030 Add `LightMode` to `sk-ribbon-card.stories.ts` Angular (WP06)

### WP07 — Storybook Deploy, Intro Links, and README
**Priority:** Medium
**Prompt:** [WP07-storybook-deploy-and-readme.md](tasks/WP07-storybook-deploy-and-readme.md)
**Dependencies:** WP03, WP05, WP06
**Estimated prompt size:** ~320 lines

**Goal:** Update the GitHub Actions deploy workflow to copy both demo pages into the Storybook static output with fixed asset paths. Add navigation links from the Storybook introduction page. Rewrite README.md with vision, usage guide, and live site links.

- [x] T031 Update `storybook-deploy.yml` to copy demo pages + fix asset paths (WP07)
- [x] T032 Update `getting-started.mdx` with links to deployed demo pages (WP07)
- [x] T033 Rewrite `README.md` with vision, usage guide, and live site links (WP07)
