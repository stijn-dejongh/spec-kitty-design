---
work_package_id: WP03
title: Static Blog Demo Page
dependencies:
- WP02
requirement_refs:
- FR-208
- FR-209
- FR-210
- FR-211
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T014
- T015
- T016
- T017
- T018
- T019
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "2047213"
history:
- date: '2026-05-02'
  event: created
agent_profile: frontend-freddy
authoritative_surface: apps/demo/
execution_mode: code_change
owned_files:
- apps/demo/blog-demo.html
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Create `apps/demo/blog-demo.html` — a self-contained static HTML page that demonstrates the Spec Kitty design system in a real blog-like layout matching the aesthetic of https://spec-kitty.ai/blog. The page must load via `file://` URL with no build step, referencing only the token CSS file.

## Context

- **Reference**: `tmp/reference_system/ui_kits/marketing-website/BlogIndex.jsx` and the spec-kitty.ai blog page structure
- **Token CSS path** (relative from `apps/demo/` to tokens dist): `../../packages/tokens/dist/tokens.css`
- **Font loading**: Fonts load automatically via `@font-face` in `tokens.css` using `./fonts/` relative paths — this works because `tokens.css` is served from alongside the `fonts/` directory in `packages/tokens/dist/`
- **sk-* classes**: Use the component CSS classes implemented in the previous WPs — the demo page must load each component CSS it uses
- **Brand voice** (from sk-brand-voice styleguide): Sentence case, no emoji, concrete outcomes, SK canonical nouns capitalised

## Subtask Guidance

### T014 — Base structure

Create `apps/demo/blog-demo.html`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Spec Kitty — Blog</title>

  <!-- Design system tokens (includes @font-face for Falling Sky, Swansea, JetBrains Mono) -->
  <link rel="stylesheet" href="../../packages/tokens/dist/tokens.css" />

  <!-- Component CSS files — loaded explicitly since this is plain HTML -->
  <link rel="stylesheet" href="../../packages/html-js/src/button/sk-button.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/nav-pill/sk-nav-pill.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/card/sk-card.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/pill-tag/sk-pill-tag.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/section-banner/sk-section-banner.css" />
  <link rel="stylesheet" href="../../packages/html-js/src/feature-card/sk-feature-card.css" />

  <style>
    /* Page-level layout — token values only */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--sk-surface-page);
      color: var(--sk-fg-default);
      font-family: var(--sk-font-sans);
      font-size: var(--sk-text-base);
      line-height: 1.55;
    }

    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--sk-space-6);
    }

    .demo-section {
      padding: var(--sk-space-11) 0;
    }

    /* Responsive grid */
    .demo-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--sk-space-6);
    }

    .demo-feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--sk-space-5);
    }

    @media (max-width: 600px) {
      .demo-card-grid,
      .demo-feature-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- Navigation, hero, cards, banners, footer go here (T015–T018) -->
</body>
</html>
```

### T015 — Navigation section

```html
<header style="padding: var(--sk-space-4) 0; position: sticky; top: 0; z-index: 100; background: var(--sk-surface-page);">
  <div class="demo-container">
    <nav class="sk-nav-pill" aria-label="Primary navigation">
      <div class="sk-nav-pill__items">
        <a href="#" class="sk-nav-pill__item">Platform</a>
        <a href="#" class="sk-nav-pill__item">Getting started</a>
        <a href="#" class="sk-nav-pill__item">About</a>
        <a href="#" class="sk-nav-pill__item sk-nav-pill__item--active" aria-current="page">Blog</a>
        <a href="#" class="sk-nav-pill__item">Training</a>
      </div>
      <div class="sk-nav-pill__cta">
        <a href="#" class="sk-btn sk-btn--primary sk-btn--sm">Book Demo</a>
      </div>
    </nav>
  </div>
</header>
```

### T016 — Hero section

```html
<section class="demo-section">
  <div class="demo-container">
    <span class="sk-eyebrow-pill" style="margin-bottom: var(--sk-space-5); display: inline-block;">
      Spec Kitty blog
    </span>
    <h1 style="
      font-family: var(--sk-font-display);
      font-size: var(--sk-text-3xl);
      font-weight: var(--sk-weight-extrabold);
      line-height: 1.1;
      color: var(--sk-fg-default);
      margin-bottom: var(--sk-space-5);
      max-width: 640px;
    ">
      Spec-driven development in the age of AI agents
    </h1>
    <p style="
      font-size: var(--sk-text-lg);
      color: var(--sk-fg-muted);
      max-width: 560px;
      margin-bottom: var(--sk-space-7);
    ">
      Practical guides, release notes, and architecture thinking for teams
      using Spec Kitty to bring structure to AI-assisted delivery.
    </p>
    <div style="display: flex; gap: var(--sk-space-4); flex-wrap: wrap;">
      <a href="#posts" class="sk-btn sk-btn--primary">Browse all posts</a>
      <a href="#" class="sk-btn sk-btn--secondary">Subscribe</a>
    </div>
  </div>
</section>
```

### T017 — 3-up card grid with post cards

```html
<section class="demo-section" id="posts">
  <div class="demo-container">
    <div class="sk-section-banner sk-section-banner--neutral" style="margin-bottom: var(--sk-space-7);">
      <span class="sk-section-banner__dot" aria-hidden="true">●</span>
      <span class="sk-section-banner__label">Latest posts</span>
    </div>

    <div class="demo-card-grid">

      <!-- Featured post — blue card -->
      <article class="sk-card sk-card--blue">
        <div style="display:flex;gap:var(--sk-space-2);margin-bottom:var(--sk-space-5)">
          <span class="sk-tag sk-tag--green">Release</span>
          <span class="sk-tag">v3.2.0</span>
        </div>
        <h2 style="font-family:var(--sk-font-display);font-size:var(--sk-text-xl);font-weight:var(--sk-weight-bold);color:var(--sk-fg-default);margin-bottom:var(--sk-space-3);line-height:1.2">
          Spec Kitty 3.2 ships org-layer doctrine
        </h2>
        <p style="font-size:var(--sk-text-sm);color:var(--sk-fg-muted);line-height:1.55;margin-bottom:var(--sk-space-5)">
          Teams can now publish proprietary governance artefacts — directives, styleguides,
          agent profiles — without forking the CLI.
        </p>
        <a href="#" style="font-size:var(--sk-text-sm);color:var(--sk-color-yellow);text-decoration:none;font-weight:var(--sk-weight-medium)">
          Read the post →
        </a>
      </article>

      <!-- Standard post -->
      <article class="sk-card">
        <div style="display:flex;gap:var(--sk-space-2);margin-bottom:var(--sk-space-5)">
          <span class="sk-tag">Architecture</span>
        </div>
        <h2 style="font-family:var(--sk-font-display);font-size:var(--sk-text-xl);font-weight:var(--sk-weight-bold);color:var(--sk-fg-default);margin-bottom:var(--sk-space-3);line-height:1.2">
          Why spec-first beats prompt-first for AI delivery
        </h2>
        <p style="font-size:var(--sk-text-sm);color:var(--sk-fg-muted);line-height:1.55;margin-bottom:var(--sk-space-5)">
          Jumping straight to implementation with AI agents produces working code for the
          wrong problem. Here is how the specify phase changes that.
        </p>
        <a href="#" style="font-size:var(--sk-text-sm);color:var(--sk-color-yellow);text-decoration:none;font-weight:var(--sk-weight-medium)">
          Read the post →
        </a>
      </article>

      <!-- Purple post -->
      <article class="sk-card sk-card--purple">
        <div style="display:flex;gap:var(--sk-space-2);margin-bottom:var(--sk-space-5)">
          <span class="sk-tag sk-tag--purple">Deep dive</span>
        </div>
        <h2 style="font-family:var(--sk-font-display);font-size:var(--sk-text-xl);font-weight:var(--sk-weight-bold);color:var(--sk-fg-default);margin-bottom:var(--sk-space-3);line-height:1.2">
          Charter-driven governance for multi-agent systems
        </h2>
        <p style="font-size:var(--sk-text-sm);color:var(--sk-fg-muted);line-height:1.55;margin-bottom:var(--sk-space-5)">
          How the charter and doctrine layer prevent agent behaviour drift across large,
          long-running missions.
        </p>
        <a href="#" style="font-size:var(--sk-text-sm);color:var(--sk-color-yellow);text-decoration:none;font-weight:var(--sk-weight-medium)">
          Read the post →
        </a>
      </article>

    </div>
  </div>
</section>
```

### T018 — SectionBanner + FeatureCard row + Footer

```html
<!-- Feature card section -->
<section class="demo-section" style="background: var(--sk-surface-card); border-top: 1px solid var(--sk-border-default); border-bottom: 1px solid var(--sk-border-default);">
  <div class="demo-container">
    <h2 style="font-family:var(--sk-font-display);font-size:var(--sk-text-2xl);font-weight:var(--sk-weight-extrabold);color:var(--sk-fg-default);margin-bottom:var(--sk-space-7)">
      Why teams use Spec Kitty
    </h2>
    <div class="demo-feature-grid">
      <div class="sk-feature-card">
        <div class="sk-feature-card__icon-chip sk-feature-card__icon-chip--yellow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
        </div>
        <h3 class="sk-feature-card__title">Stay in flow</h3>
        <p class="sk-feature-card__body">Requirements are captured before code generation begins — not after the first review cycle.</p>
      </div>
      <div class="sk-feature-card">
        <div class="sk-feature-card__icon-chip sk-feature-card__icon-chip--green">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></svg>
        </div>
        <h3 class="sk-feature-card__title">Context stays put</h3>
        <p class="sk-feature-card__body">Decisions, alternatives, and rationale live alongside the feature — not scattered across meeting notes.</p>
      </div>
      <div class="sk-feature-card">
        <div class="sk-feature-card__icon-chip sk-feature-card__icon-chip--purple">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3 class="sk-feature-card__title">Parallel by default</h3>
        <p class="sk-feature-card__body">Lane-based worktrees let multiple agents implement independent work packages without coordination overhead.</p>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer style="padding: var(--sk-space-9) 0; border-top: 1px solid var(--sk-border-default);">
  <div class="demo-container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--sk-space-4)">
    <span style="font-family:var(--sk-font-display);font-weight:var(--sk-weight-bold);color:var(--sk-fg-default);font-size:var(--sk-text-lg)">
      Spec Kitty
    </span>
    <span style="font-size:var(--sk-text-sm);color:var(--sk-fg-muted)">
      The missing workflow layer that keeps AI coding aligned with product intent.
    </span>
    <a href="https://github.com/Priivacy-ai/spec-kitty" style="font-size:var(--sk-text-sm);color:var(--sk-fg-muted);text-decoration:none">
      GitHub
    </a>
  </div>
</footer>
```

### T019 — Responsive check

Open `apps/demo/blog-demo.html` in Chrome:

1. **Desktop (1280px)**: The 3-up card grid shows 3 columns side by side; NavPill is visible; hero heading renders in Falling Sky.
2. **Mobile (375px)**: Cards stack single-column; NavPill CTA wraps below items; hero text is readable.

Use Chrome DevTools device toolbar to switch. If the page has layout issues at narrow widths, adjust the `grid-template-columns` `minmax()` value in the inline `<style>` block.

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `apps/demo/blog-demo.html` opens via `file://` and renders a styled blog page
- [ ] Page displays: navigation pill, hero section with Falling Sky heading, 3-up card grid (blue + default + purple cards), FeatureCard row, SectionBanner, footer
- [ ] All text and components are styled (no bare unstyled HTML)
- [ ] Responsive at 375px (single column) and 1280px (3 columns)
- [ ] No hardcoded colour values — only `--sk-*` tokens in `<style>` block

## Risks

- Font loading via `file://` may be blocked by browser CORS policies for `@font-face` if the browser treats local fonts differently. Test in both Chrome and Firefox. If fonts fail to load, add the Google Fonts CDN `<link>` for JetBrains Mono as a fallback.
- Component CSS files loaded via `<link>` relative paths (`../../packages/html-js/src/`) assume the demo is opened from the `apps/demo/` directory. Document this in a comment at the top of the HTML file.

## Reviewer Guidance

Open the file in Chrome at default zoom. Verify: (1) Falling Sky renders in the hero heading — not a system sans-serif; (2) the blue and purple card variants have visually distinct tinted backgrounds; (3) the feature cards show icon chips in correct accent colours. Check mobile at 375px using DevTools.

## Activity Log

- 2026-05-02T07:53:13Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=2014096 – Started implementation via action command
- 2026-05-02T07:55:20Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=2014096 – blog-demo.html: nav pill, hero, 3-up card grid (blue/default/purple), section banner, feature cards, footer; responsive at 375px+1280px
- 2026-05-02T08:00:51Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=2047213 – Started review via action command
- 2026-05-02T08:01:37Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=2047213 – Review passed: blog demo loads tokens, uses sk-card variants + component classes, responsive grid, no hardcoded colours
