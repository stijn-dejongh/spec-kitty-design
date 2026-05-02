# Tasks: Design System Remediation + Blog Demo Page

*Path: [kitty-specs/design-system-remediation-and-demo-01KQKSSR/tasks.md](tasks.md)*

**Branch**: `main` → `main` | **Mission**: `design-system-remediation-and-demo-01KQKSSR`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Subtask Index

| ID | Description | WP | Parallel |
|---|---|---|---|
| T001 | Add `sk-button.css` to `styleUrls` of all three Angular button components | WP01 | |
| T002 | Add `import './sk-check-bullet.css'` to `sk-check-bullet-html.stories.ts` | WP01 | [P] |
| T003 | Add `import './sk-feature-card.css'` to `sk-feature-card-html.stories.ts` | WP01 | [P] |
| T004 | Add `import './sk-form-field.css'` (or `sk-form-field-html.stories.ts` CSS import) | WP01 | [P] |
| T005 | Add `import './sk-ribbon-card.css'` to `sk-ribbon-card-html.stories.ts` | WP01 | [P] |
| T006 | Add `import './sk-section-banner.css'` to `sk-section-banner-html.stories.ts` | WP01 | [P] |
| T007 | Create `packages/html-js/src/button/sk-button-html.stories.ts` with Default, Secondary, Ghost, Small, Disabled exports | WP01 | |
| T008 | Verify `npx nx run storybook:storybook:build` still exits 0 after all CSS changes | WP01 | |
| T009 | Implement `packages/html-js/src/card/sk-card.css` — Default, Blue, Purple, Inset variants using `--sk-*` tokens | WP02 | |
| T010 | Implement `packages/html-js/src/card/sk-card.html` template and `index.ts` exports | WP02 | |
| T011 | Implement `packages/angular/src/lib/card/sk-card.component.*` with `variant` input | WP02 | [P] |
| T012 | Write Storybook stories: Default, Blue, Purple, Inset, BlogCardExample (card with heading + tag + muted text) | WP02 | |
| T013 | Export sk-card from both package entry points; verify axe passes | WP02 | |
| T014 | Create `apps/demo/` directory; write `blog-demo.html` — self-contained static page loading `tokens.css` | WP03 | |
| T015 | Add navigation section using `sk-nav-pill` classes | WP03 | |
| T016 | Add hero section using `--sk-font-display` heading, muted subtext, and primary CTA button | WP03 | |
| T017 | Add 3-up card grid using `sk-card` (at least one `sk-card--blue`, one default) with post title, date, pill tags, and muted excerpt | WP03 | |
| T018 | Add `SectionBanner` + `FeatureCard` grid row + footer using design system classes | WP03 | |
| T019 | Verify demo page renders correctly at 375px and 1280px via browser check | WP03 | |

| T020 | Study existing SK dashboard template; plan layout for mockup | WP04 | |
| T021 | Create `apps/demo/dashboard-demo.html` base structure with CSS | WP04 | |
| T022 | Add header bar with logo, mission name, progress bar | WP04 | |
| T023 | Add 5-column Kanban board with realistic WP card data | WP04 | |
| T024 | Verify rendering; create `apps/demo/index.html` index page | WP04 | |

---

## Work Packages

### WP01 — Bug Fixes

**Goal**: Fix all three shipping bugs: wire `sk-button.css` into Angular, add CSS imports to 5 html-js stories, create html-js button story.
**Priority**: P0 — visible regressions from prior mission
**Independent test**: Open Storybook — all html-js stories (CheckBullet, FeatureCard, FormField, RibbonCard, SectionBanner, Button) render styled, not as bare HTML. Angular ButtonPrimary story shows yellow fill.
**Estimated prompt size**: ~340 lines
**Prompt**: [WP01-bug-fixes.md](tasks/WP01-bug-fixes.md)

- [ ] T001 Add `sk-button.css` to Angular button `styleUrls` (WP01)
- [ ] T002 CSS import to check-bullet story (WP01)
- [ ] T003 CSS import to feature-card story (WP01)
- [ ] T004 CSS import to form-field story (WP01)
- [ ] T005 CSS import to ribbon-card story (WP01)
- [ ] T006 CSS import to section-banner story (WP01)
- [ ] T007 Create html-js button story file (WP01)
- [ ] T008 Verify Storybook build still passes (WP01)

**Dependencies**: none
**Parallel with**: WP02

---

### WP02 — Generic SkCard Component

**Goal**: Implement the generic `sk-card` component with Default, Blue, Purple, and Inset variants in both packages, with Storybook stories.
**Priority**: P1
**Independent test**: Storybook shows Cards/SkCard with 5 story variants; `sk-card--blue` renders with blue-tinted background and coloured border; axe passes.
**Estimated prompt size**: ~360 lines
**Prompt**: [WP02-sk-card-component.md](tasks/WP02-sk-card-component.md)

- [ ] T009 `sk-card.css` with all variants (WP02)
- [ ] T010 `sk-card.html` + `index.ts` exports (WP02)
- [ ] T011 Angular `SkCardComponent` (WP02)
- [ ] T012 Storybook stories including BlogCardExample (WP02)
- [ ] T013 Entry point exports + axe verification (WP02)

**Dependencies**: none
**Parallel with**: WP01

---

### WP03 — Static Blog Demo Page

**Goal**: Create `apps/demo/blog-demo.html` — a self-contained, build-step-free static page demonstrating the design system in a real blog-like context.
**Priority**: P1
**Independent test**: Open `apps/demo/blog-demo.html` via `file://` URL in Chrome/Firefox. The page loads, fonts render in Falling Sky, cards show styled with blue/default variants, nav pill renders, all text is readable and correctly sized at 375px and 1280px.
**Estimated prompt size**: ~420 lines
**Prompt**: [WP03-blog-demo-page.md](tasks/WP03-blog-demo-page.md)

- [ ] T014 Create `apps/demo/blog-demo.html` base structure (WP03)
- [ ] T015 Navigation section (WP03)
- [ ] T016 Hero section with typography + CTA (WP03)
- [ ] T017 3-up card grid with sk-card variants + content (WP03)
- [ ] T018 SectionBanner + FeatureCard row + footer (WP03)
- [ ] T019 Responsive check at 375px and 1280px (WP03)

**Dependencies**: WP02 (sk-card needed for demo)

---


### WP04 — Static Dashboard Demo Page

**Goal**: Create `apps/demo/dashboard-demo.html` — a static Kanban-style task board mockup showing what the SK Tasks dashboard looks like restyled with the design system.
**Priority**: P1
**Independent test**: Open via `file://` in Chrome. The Kanban board shows 5 columns with WP cards, coloured left-border status indicators, and a header with Falling Sky logo and progress bar.
**Estimated prompt size**: ~380 lines
**Prompt**: [WP04-dashboard-demo-page.md](tasks/WP04-dashboard-demo-page.md)

- [ ] T020 Study existing SK dashboard; plan layout (WP04)
- [ ] T021 Create dashboard-demo.html base structure (WP04)
- [ ] T022 Header bar with logo and progress (WP04)
- [ ] T023 Kanban board with 5 lanes and WP cards (WP04)
- [ ] T024 Verify + index.html (WP04)

**Dependencies**: WP01 (button CSS fix), WP02 (sk-card + pill-tag for cards)

---

## Dependency Summary

```
WP01 (bug fixes)        ──────────────────────────┐
                                                   ├── merge
WP02 (sk-card)   ──────┐                           │
                        └── WP03 (blog demo page) ─┘
```

## MVP Scope

WP01 alone restores spec compliance from the previous mission. WP02 and WP03 are new value additions.
