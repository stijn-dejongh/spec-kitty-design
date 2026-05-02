---
work_package_id: WP07
title: Storybook Deploy, Introduction Links, and README
dependencies:
- WP03
- WP05
- WP06
requirement_refs:
- FR-009
- FR-010
- FR-014
planning_base_branch: feature/post-review-remediation-and-demo-deploy
merge_target_branch: feature/post-review-remediation-and-demo-deploy
branch_strategy: Planning artifacts for this feature were generated on feature/post-review-remediation-and-demo-deploy. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/post-review-remediation-and-demo-deploy unless the human explicitly redirects the landing branch.
subtasks:
- T031
- T032
- T033
agent: "claude:sonnet-4-6:reviewer:reviewer"
shell_pid: "931376"
history:
- date: '2026-05-02'
  event: created
  note: Initial WP generation
agent_profile: implementer-ivan
authoritative_surface: .github/workflows/
execution_mode: code_change
owned_files:
- .github/workflows/storybook-deploy.yml
- apps/storybook/src/stories/getting-started.mdx
- README.md
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load implementer-ivan
```

---

## Objective

Three independent improvements to the project's public-facing surfaces:
1. Update the GitHub Actions Storybook deploy workflow to copy both demo pages into the build output and fix their asset paths for static hosting.
2. Add links to the deployed demo pages from the Storybook introduction MDX page.
3. Rewrite `README.md` with the project vision, a usage quick-start, and a link to the live site.

---

## Context

**Demo pages in deploy (FR-009, FR-010):** The Storybook deploy workflow builds `storybook-static/` and publishes it to GitHub Pages. The demo pages (`apps/demo/*.html`) are not included. They need to be copied into `storybook-static/` post-build, but their `../../packages/` relative asset paths will be broken in that context — they need to be adjusted for the static hosting root.

**Asset path strategy (C-005):** The local dev paths (`../../packages/tokens/dist/tokens.css` etc.) must be preserved for `http://localhost:7778` development. The fix applies only in the CI copy step: use `sed` to rewrite paths in the *copied* files. The originals in `apps/demo/` are not modified.

**README (FR-014):** Current README is 4 lines with no vision, no quick-start, and no live site link.

**Live site URL:** `https://stijn-dejongh.github.io/spec-kitty-design/`

---

## Branch Strategy

Planning branch: `feature/post-review-remediation-and-demo-deploy`
Depends on: WP03 (demo JS imports), WP05 (html-js stories exist), WP06 (Angular stories exist)
Your worktree is allocated by `spec-kitty agent action implement WP07`.

---

## Subtask Guidance

### T031 — Update `storybook-deploy.yml`

**File:** `.github/workflows/storybook-deploy.yml`

**Read the file first** to understand the current build and deploy steps.

**Add a new step after the Storybook build step** (the step that runs `npx nx run storybook:build` or equivalent):

```yaml
- name: Copy demo pages into Storybook dist
  run: |
    # Copy demo HTML files into storybook output
    cp apps/demo/blog-demo.html storybook-static/blog-demo.html
    cp apps/demo/dashboard-demo.html storybook-static/dashboard-demo.html

    # Fix asset paths: replace monorepo-relative paths with Storybook-root-relative paths
    # tokens.css: ../../packages/tokens/dist/tokens.css → ./tokens.css
    # component CSS: ../../packages/html-js/src/<comp>/<file>.css → ./<comp>/<file>.css
    # JS module: ../../packages/html-js/src/nav-pill/sk-nav-pill.js → ./nav-pill/sk-nav-pill.js
    sed -i \
      's|../../packages/tokens/dist/tokens.css|./tokens.css|g; \
       s|../../packages/html-js/src/|./|g' \
      storybook-static/blog-demo.html \
      storybook-static/dashboard-demo.html
```

**Also add a step to copy token and component assets** needed by the demo pages:

```yaml
- name: Copy token and component assets into Storybook dist
  run: |
    # Tokens CSS (already built by storybook build step via nx)
    cp packages/tokens/dist/tokens.css storybook-static/tokens.css || \
      cp packages/tokens/src/tokens.css storybook-static/tokens.css

    # Component CSS files referenced by demo pages
    mkdir -p storybook-static/button storybook-static/nav-pill \
             storybook-static/pill-tag storybook-static/section-banner \
             storybook-static/site-footer storybook-static/card

    for comp in button nav-pill pill-tag section-banner site-footer card; do
      find packages/html-js/src/$comp -name "*.css" -exec cp {} storybook-static/$comp/ \;
    done

    # JS module
    mkdir -p storybook-static/nav-pill
    cp packages/html-js/src/nav-pill/sk-nav-pill.js storybook-static/nav-pill/sk-nav-pill.js
```

**Important:** Verify the actual Storybook output directory name. It may be `storybook-static` or a different path. Check the existing workflow steps to confirm. Also check that the `nx run storybook:build` step runs before these copy steps.

**Validate by dry-run:** Check the sed substitution locally:
```bash
sed 's|../../packages/tokens/dist/tokens.css|./tokens.css|g; s|../../packages/html-js/src/|./|g' \
  apps/demo/blog-demo.html | grep -E "href=|src=" | head -20
```
Confirm asset paths look correct for a root-relative static site.

---

### T032 — Update `getting-started.mdx`

**File:** `apps/storybook/src/stories/getting-started.mdx`

Read the existing file first. It already contains usage guidance for tokens and components.

**Add a "Live Demos" section** at a logical position in the file (after the Usage section, before or after the Token Catalogue section):

```mdx
## Live Demos

See the design system in action with fully styled demo applications:

- **[Blog Demo](./blog-demo.html)** — marketing/blog layout using sk-card, sk-nav-pill, sk-feature-card, sk-ribbon-card, and site-footer components
- **[Dashboard Demo](./dashboard-demo.html)** — Kanban board layout demonstrating sk-nav-pill (responsive with hamburger), sk-section-banner lane headers, and card border states

Both demos support light/dark mode toggle. Hosted at:  
[https://stijn-dejongh.github.io/spec-kitty-design/](https://stijn-dejongh.github.io/spec-kitty-design/)
```

The links use relative paths (`./blog-demo.html`) which will resolve correctly when served from the GitHub Pages Storybook root after the T031 copy step.

---

### T033 — Rewrite `README.md`

**File:** `README.md` (repository root)

**Current content (4 lines):**
```markdown
# spec-kitty-design
Design system and branding assets for [Spec-Kitty](https://github.com/Priivacy-ai) projects and websites.
This repository is intended to facilitate the branding, sharing of visual assets, UI components, images, slidedecks, and more. Its artefacts are pluggable into the other Spec-Kitty Open Core repositories to ensure a consistent ecosystem and platform feel.
```

**Replace the entire file** with a well-structured README. Use the following structure and tone — concise, contributor-facing, not marketing copy:

```markdown
# Spec Kitty Design System

A token-first, framework-progressive design system for the [Spec Kitty](https://github.com/Priivacy-ai) ecosystem.

**Live Storybook →** https://stijn-dejongh.github.io/spec-kitty-design/

---

## What this is

Spec Kitty Design provides:
- **Design tokens** (`@spec-kitty/tokens`) — CSS custom properties for colour, typography, spacing, motion, and radius. The single authoritative source for all visual values across the ecosystem.
- **HTML/JS components** (`@spec-kitty/html-js`) — framework-agnostic CSS and lightweight JS for core UI patterns (navigation, cards, tags, forms, banners, footer).
- **Angular components** (`@spec-kitty/angular`) — Angular component wrappers for the same patterns.
- **Brand assets** — fonts (Falling Sky, Swansea), logo, and visual identity artefacts.

The design language targets the AI-tooling and spec-driven development context: dark-first, yellow-accented, technical-professional tone.

---

## Quick Start

### Use tokens (zero build step)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
```

Then use `--sk-*` CSS custom properties anywhere in your styles:

```css
.my-element {
  background: var(--sk-surface-card);
  color: var(--sk-fg-default);
  border-radius: var(--sk-radius-lg);
  padding: var(--sk-space-6);
}
```

### Use HTML/JS components

```html
<!-- After loading tokens.css, add the component stylesheet: -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/html-js/dist/nav-pill/sk-nav-pill.css">

<nav class="sk-nav-pill" aria-label="Primary navigation">
  <div class="sk-nav-pill__items">
    <a href="/" class="sk-nav-pill__item sk-nav-pill__item--active" aria-current="page">Home</a>
    <a href="/about" class="sk-nav-pill__item">About</a>
  </div>
</nav>
```

### Use Angular components

```bash
npm install @spec-kitty/angular @spec-kitty/tokens
```

```ts
import { SkButtonPrimaryModule } from '@spec-kitty/angular';
```

### Light / dark theme

Add `data-theme="light"` or `data-theme="dark"` to your `<html>` element. The token system defaults to dark.

---

## Explore

- **[Component Storybook](https://stijn-dejongh.github.io/spec-kitty-design/)** — interactive component browser with light/dark variants
- **[Blog Demo](https://stijn-dejongh.github.io/spec-kitty-design/blog-demo.html)** — full-page marketing/blog layout
- **[Dashboard Demo](https://stijn-dejongh.github.io/spec-kitty-design/dashboard-demo.html)** — Kanban board layout

---

## Development

```bash
# Install dependencies
npm ci

# Run Storybook locally
npx nx run storybook:storybook

# Build all packages
npx nx run-many --target=build --all

# View demo pages (served via Storybook dev server)
# http://localhost:6006  (or configured port)
```

---

## Repository structure

```
packages/
  tokens/       — CSS custom properties + brand fonts
  html-js/      — Framework-agnostic CSS + JS components
  angular/      — Angular component wrappers
apps/
  storybook/    — Storybook application
  demo/         — Static demo pages (blog, dashboard)
doctrine/       — Brand voice and visual identity guidelines
kitty-specs/    — Mission specifications (spec-kitty workflow)
```

---

## Governance

This repository is governed by the [Spec Kitty](https://github.com/Priivacy-ai/spec-kitty) charter and ADR framework. All visual values must use `--sk-*` tokens (ADR-001). Package topology follows a one-directional dependency graph (ADR-002). See `doctrine/` for brand and identity guidelines.
```

Keep the README under ~80 lines of rendered markdown. The tone is technical and concise — no marketing superlatives.

---

## Definition of Done

- [ ] `storybook-deploy.yml` includes steps that copy both demo pages into `storybook-static/` with corrected asset paths
- [ ] `getting-started.mdx` includes a "Live Demos" section with links to both demo pages
- [ ] `README.md` contains a vision section, quick-start guide, and live site link
- [ ] README is under 120 lines
- [ ] Storybook build passes

---

## Reviewer Guidance

- Dry-run the `sed` substitution locally and verify asset paths are correct for a root-relative deployment
- Confirm the `getting-started.mdx` links use relative paths (`./blog-demo.html`) not absolute URLs
- Read the README cold — does a new contributor understand the project purpose and know how to get started within 60 seconds?
- `grep "../../" storybook-static/blog-demo.html` after the CI copy step simulation — must return zero (all relative paths rewritten)

## Activity Log

- 2026-05-02T13:41:56Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=928367 – Started implementation via action command
- 2026-05-02T13:48:49Z – claude:sonnet-4-6:implementer-ivan:implementer – shell_pid=928367 – Ready for review
- 2026-05-02T13:49:19Z – claude:sonnet-4-6:reviewer:reviewer – shell_pid=931376 – Started review via action command
- 2026-05-02T14:29:08Z – claude:sonnet-4-6:reviewer:reviewer – shell_pid=931376 – Review passed: workflow copy + sed rewrites verified, mdx Live Demos relative, README 114 lines
