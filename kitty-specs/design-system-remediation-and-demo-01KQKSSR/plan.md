# Implementation Plan: Design System Remediation + Blog Demo Page

*Path: [kitty-specs/design-system-remediation-and-demo-01KQKSSR/plan.md](plan.md)*

**Branch**: `main` | **Date**: 2026-05-02 | **Spec**: [spec.md](spec.md)

## Summary

Fix three shipping bugs (unstyled Angular buttons, 5 unstyled html-js stories, missing html-js button story), add the generic `sk-card` component, and build a static blog-style demo page using the design system.

## Technical Context

**Language/Version**: TypeScript 5.x; CSS; HTML5; Angular 21.x LTS; Node.js 22 LTS
**Primary Dependencies**: `@spec-kitty/angular` (extend with sk-card + button fix); `@spec-kitty/html-js` (extend with sk-card + CSS imports); Storybook 10.x
**Storage**: N/A — static assets only
**Testing**: Visual inspection in Storybook; axe WCAG 2.1 AA per new story; `file://` load test for demo page
**Project Type**: nx monorepo — existing packages extended
**Performance Goals**: Storybook build < 3 min (NFR-201)
**Constraints**: C-201 no illustrations; C-202 token-only CSS; C-203 sk-card from reference; C-204 demo uses relative font path

## Charter Check

**GATE: PASS** — Bug fixes restore spec compliance. New sk-card and demo page are additive. All ADRs respected.

**Pre-work note:** Verify `tmp/reference_system/ui_kits/marketing-website/kit.css` `.sk-card` token values map correctly to current ADR-003 `--sk-*` names before implementing sk-card CSS.

## Project Structure

```
packages/angular/src/lib/button/       ← MODIFIED: add sk-button.css to styleUrls
packages/angular/src/lib/card/         ← NEW: SkCardComponent
packages/html-js/src/button/           ← NEW: sk-button-html.stories.ts
packages/html-js/src/card/             ← NEW: sk-card component
packages/html-js/src/{check-bullet,    ← MODIFIED: add CSS import to stories
  feature-card,form-field,
  ribbon-card,section-banner}/
apps/demo/blog-demo.html               ← NEW: static demo page
```

## Work Package Outline

### WP-FIX-001 — Bug fixes: Angular buttons + html-js CSS imports
Fix all three bugs in one focused WP. Angular buttons: add `sk-button.css` to `styleUrls`. Html-js stories: add CSS imports. Create html-js button story.

**Gate:** None — bugs are self-contained.
**Parallel with:** WP-CARD-001 (different file ownership)

### WP-CARD-001 — Generic `sk-card` component
Implement `sk-card` HTML primitive and Angular component with Default, Blue, Purple, Inset variants. Map `kit.css` token names to current ADR-003 schema.

**Gate:** None — parallel with WP-FIX-001

### WP-DEMO-001 — Static blog demo page
Create `apps/demo/blog-demo.html` using the design system — navigation, hero, card grid, section banners, feature cards, footer.

**Gate:** WP-CARD-001 must be complete (demo uses sk-card)

## WP Dependency Graph

```
WP-FIX-001 (bug fixes) ──────────────┐
                                      ├── merge
WP-CARD-001 (sk-card) ──┐            │
                         └── WP-DEMO-001 (demo page)
```
