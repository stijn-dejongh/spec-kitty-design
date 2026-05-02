---
work_package_id: WP04
title: Static Dashboard Demo Page
dependencies:
- WP01
- WP02
requirement_refs:
- FR-213
- FR-214
- FR-215
planning_base_branch: main
merge_target_branch: main
branch_strategy: Work in lane worktree; merge to main on approval.
subtasks:
- T020
- T021
- T022
- T023
- T024
agent: claude
history:
- date: '2026-05-02'
  event: created
agent_profile: frontend-freddy
authoritative_surface: apps/demo/
execution_mode: code_change
owned_files:
- apps/demo/dashboard-demo.html
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Create `apps/demo/dashboard-demo.html` — a static HTML mockup of the SK Tasks dashboard (the operator workflow surface in spec-kitty) restyled using the Spec Kitty design system. The goal is to show what the dashboard could look like after the UI overhaul described in spec-kitty issue #650.

## Context

- **Reference**: The existing SK dashboard lives at `/home/stijnd/Documents/code/forks/spec-kitty/src/specify_cli/dashboard/templates/index.html` and `static/dashboard/dashboard.css`. Study this for layout and information architecture.
- **Current dashboard classes**: `--baby-blue`, `--sunny-yellow`, etc. — the old informal palette. The mockup should replace all of these with `--sk-*` tokens.
- **Key dashboard sections** (from the live dashboard):
  - Header: logo + project name + navigation links + profile indicator
  - Kanban board: columns (Planned, Doing, For Review, Approved, Done) with WP cards
  - WP card: title, status badge, assignee (agent profile name), subtask progress
  - Sidebar or top bar: mission selector, progress bar
- **Brand alignment**: The dashboard is an operator tool — dark mode default, structured, no marketing flair. "Quirky-but-serious" voice.
- This is a **visual mockup only** — no JavaScript functionality required, static HTML with realistic-looking data.

## Subtask Guidance

### T020 — Study existing dashboard and plan layout

Read the existing dashboard template to understand the information architecture:
```bash
cat /home/stijnd/Documents/code/forks/spec-kitty/src/specify_cli/dashboard/templates/index.html | head -100
```

Key sections to replicate in the mockup:
1. **Header bar**: Logo (`Spec Kitty`), mission name, progress indicator
2. **Kanban columns**: 5 lanes (Planned, Doing, For Review, Approved, Done)
3. **Work Package cards**: Each card shows: WP ID, title, status pill, agent profile name, subtask count
4. **Mission summary bar**: Mission name, total WPs, completion percentage, progress bar

### T021 — Create `apps/demo/dashboard-demo.html` base

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Spec Kitty — Task Dashboard</title>
  <link rel="stylesheet" href="../../packages/tokens/dist/tokens.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/pill-tag/sk-pill-tag.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/button/sk-button.css" />
  <style>
    /* Dashboard layout — token values only */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--sk-surface-page);
      color: var(--sk-fg-default);
      font-family: var(--sk-font-sans);
      font-size: var(--sk-text-sm);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    .dash-header {
      background: var(--sk-surface-card);
      border-bottom: 1px solid var(--sk-border-default);
      padding: var(--sk-space-3) var(--sk-space-6);
      display: flex;
      align-items: center;
      gap: var(--sk-space-5);
      flex-shrink: 0;
    }

    .dash-logo {
      font-family: var(--sk-font-display);
      font-weight: var(--sk-weight-bold);
      font-size: var(--sk-text-base);
      color: var(--sk-fg-default);
    }

    .dash-logo span {
      color: var(--sk-color-yellow);
    }

    .dash-mission {
      font-size: var(--sk-text-xs);
      color: var(--sk-fg-muted);
      font-family: var(--sk-font-mono);
    }

    .dash-progress-bar {
      flex: 1;
      max-width: 200px;
      height: 4px;
      background: var(--sk-surface-input);
      border-radius: var(--sk-radius-pill);
      overflow: hidden;
    }

    .dash-progress-fill {
      height: 100%;
      background: var(--sk-color-yellow);
      border-radius: var(--sk-radius-pill);
    }

    .dash-progress-label {
      font-size: var(--sk-text-xs);
      color: var(--sk-fg-muted);
      font-family: var(--sk-font-mono);
      white-space: nowrap;
    }

    /* Kanban board */
    .dash-board {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--sk-space-3);
      padding: var(--sk-space-4);
      overflow-x: auto;
      overflow-y: hidden;
      min-height: 0;
    }

    /* Lane column */
    .dash-lane {
      background: var(--sk-surface-input);
      border-radius: var(--sk-radius-md);
      padding: var(--sk-space-3);
      display: flex;
      flex-direction: column;
      gap: var(--sk-space-2);
      min-width: 200px;
      overflow-y: auto;
    }

    .dash-lane__header {
      font-size: var(--sk-text-xs);
      font-family: var(--sk-font-mono);
      font-weight: var(--sk-weight-bold);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--sk-fg-muted);
      padding-bottom: var(--sk-space-2);
      border-bottom: 1px solid var(--sk-border-default);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dash-lane__count {
      background: var(--sk-surface-card);
      border-radius: var(--sk-radius-pill);
      padding: 2px var(--sk-space-2);
      font-size: 10px;
    }

    /* WP card */
    .dash-card {
      background: var(--sk-surface-card);
      border: 1px solid var(--sk-border-default);
      border-radius: var(--sk-radius-sm);
      padding: var(--sk-space-3);
      display: flex;
      flex-direction: column;
      gap: var(--sk-space-2);
      cursor: default;
    }

    .dash-card:hover {
      border-color: var(--sk-border-strong);
    }

    .dash-card--approved {
      border-left: 3px solid var(--sk-color-green);
    }

    .dash-card--review {
      border-left: 3px solid var(--sk-color-yellow);
    }

    .dash-card--doing {
      border-left: 3px solid var(--sk-color-blue);
    }

    .dash-card__id {
      font-family: var(--sk-font-mono);
      font-size: 10px;
      color: var(--sk-fg-muted);
    }

    .dash-card__title {
      font-size: var(--sk-text-xs);
      font-weight: var(--sk-weight-medium);
      color: var(--sk-fg-default);
      line-height: 1.4;
    }

    .dash-card__meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: var(--sk-space-1);
    }

    .dash-card__agent {
      font-size: 10px;
      color: var(--sk-fg-muted);
      font-family: var(--sk-font-mono);
    }

    .dash-card__subtasks {
      font-size: 10px;
      color: var(--sk-fg-muted);
    }
  </style>
</head>
<body>
  <!-- Header, board, footer go here (T022–T023) -->
</body>
</html>
```

### T022 — Header bar

```html
<header class="dash-header">
  <div class="dash-logo">Spec <span>Kitty</span></div>
  <span style="color:var(--sk-border-strong)">|</span>
  <span class="dash-mission">design-system-remediation-and-demo</span>
  <div class="dash-progress-bar">
    <div class="dash-progress-fill" style="width: 67%"></div>
  </div>
  <span class="dash-progress-label">6 / 9 done · 67%</span>
  <div style="margin-left:auto;display:flex;gap:var(--sk-space-3);align-items:center">
    <span class="sk-tag">Mission #3</span>
    <a href="blog-demo.html" class="sk-btn sk-btn--ghost" style="font-size:var(--sk-text-xs)">← Blog demo</a>
  </div>
</header>
```

### T023 — Kanban board with realistic WP data

Use the 9 WPs from the current mission as realistic data. Distribute across lanes to show a realistic mid-sprint state:

```html
<main class="dash-board">

  <!-- Planned -->
  <div class="dash-lane">
    <div class="dash-lane__header">
      Planned <span class="dash-lane__count">2</span>
    </div>
    <div class="dash-card">
      <span class="dash-card__id">WP03</span>
      <span class="dash-card__title">Storybook token documentation pages</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">curator-carla</span>
        <span class="dash-card__subtasks">5 tasks</span>
      </div>
    </div>
    <div class="dash-card">
      <span class="dash-card__id">WP04</span>
      <span class="dash-card__title">Blog demo page</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">frontend-freddy</span>
        <span class="dash-card__subtasks">6 tasks</span>
      </div>
    </div>
  </div>

  <!-- Doing -->
  <div class="dash-lane">
    <div class="dash-lane__header">
      Doing <span class="dash-lane__count">1</span>
    </div>
    <div class="dash-card dash-card--doing">
      <span class="dash-card__id">WP02</span>
      <span class="dash-card__title">Generic SkCard component</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">frontend-freddy</span>
        <span class="dash-card__subtasks">5 tasks · 3 done</span>
      </div>
    </div>
  </div>

  <!-- For Review -->
  <div class="dash-lane">
    <div class="dash-lane__header">
      For Review <span class="dash-lane__count">1</span>
    </div>
    <div class="dash-card dash-card--review">
      <span class="dash-card__id">WP01</span>
      <span class="dash-card__title">Bug fixes — Angular buttons + html-js CSS imports</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">reviewer-renata</span>
        <span class="dash-card__subtasks">8 tasks · 8 done</span>
      </div>
    </div>
  </div>

  <!-- Approved -->
  <div class="dash-lane">
    <div class="dash-lane__header">
      Approved <span class="dash-lane__count">3</span>
    </div>
    <div class="dash-card dash-card--approved">
      <span class="dash-card__id">WP05</span>
      <span class="dash-card__title">Navigation + tag components</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">frontend-freddy</span>
        <span class="dash-card__subtasks">6 tasks · 6 done</span>
      </div>
    </div>
    <div class="dash-card dash-card--approved">
      <span class="dash-card__id">WP06</span>
      <span class="dash-card__title">Content marker components</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">frontend-freddy</span>
        <span class="dash-card__subtasks">5 tasks · 5 done</span>
      </div>
    </div>
    <div class="dash-card dash-card--approved">
      <span class="dash-card__id">WP08</span>
      <span class="dash-card__title">Form field components</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">frontend-freddy</span>
        <span class="dash-card__subtasks">6 tasks · 6 done</span>
      </div>
    </div>
  </div>

  <!-- Done -->
  <div class="dash-lane">
    <div class="dash-lane__header">
      Done <span class="dash-lane__count">2</span>
    </div>
    <div class="dash-card" style="opacity: 0.6">
      <span class="dash-card__id">WP07</span>
      <span class="dash-card__title">Card components</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">frontend-freddy</span>
        <span class="dash-card__subtasks">6 tasks · 6 done</span>
      </div>
    </div>
    <div class="dash-card" style="opacity: 0.6">
      <span class="dash-card__id">WP09</span>
      <span class="dash-card__title">User guide documentation</span>
      <div class="dash-card__meta">
        <span class="dash-card__agent">curator-carla</span>
        <span class="dash-card__subtasks">5 tasks · 5 done</span>
      </div>
    </div>
  </div>

</main>
```

### T024 — Verify and polish

1. Open `apps/demo/dashboard-demo.html` via `file://` in Chrome
2. Verify: dark background (`--sk-surface-page`), distinct lane columns, WP cards with coloured left borders per status, header with progress bar
3. Check that fonts load (header logo should render in Falling Sky)
4. Add `apps/demo/index.html` as a simple index linking to both demo pages:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <title>Spec Kitty Design System — Demos</title>
  <link rel="stylesheet" href="../../packages/tokens/dist/tokens.css" />
  <style>
    body { background: var(--sk-surface-page); color: var(--sk-fg-default); font-family: var(--sk-font-sans); padding: 48px; }
    h1 { font-family: var(--sk-font-display); font-weight: 800; color: var(--sk-fg-default); margin-bottom: 32px; }
    a { display: block; color: var(--sk-color-yellow); font-size: 1.1rem; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>Design system demos</h1>
  <a href="blog-demo.html">→ Blog demo page</a>
  <a href="dashboard-demo.html">→ Dashboard demo page</a>
</body>
</html>
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `apps/demo/dashboard-demo.html` opens via `file://` showing a Kanban-style task board
- [ ] Header shows logo (Falling Sky font), mission name, progress bar
- [ ] 5 Kanban columns visible with realistic WP card data
- [ ] WP cards use coloured left-border status indicators (yellow = review, green = approved, blue = doing)
- [ ] `apps/demo/index.html` links to both demo pages
- [ ] No hardcoded colour values in `<style>` block

## Reviewer Guidance

Open the dashboard in Chrome. Verify: (1) the Spec Kitty logo renders in Falling Sky; (2) the coloured left borders on cards are visible; (3) the progress bar shows yellow fill. Compare the information density to the existing dashboard at `/home/stijnd/Documents/code/forks/spec-kitty/src/specify_cli/dashboard/templates/index.html` — the mockup should feel cleaner but cover the same information.
