# Post-delivery findings — Mission 3 (design-system-remediation-and-demo)

**Date**: 2026-05-02
**Mission**: `design-system-remediation-and-demo-01KQKSSR`
**Discovered by**: Lighthouse review + visual inspection of demo pages
**Source review file**: `tmp/storybook-and-demo-review-2026-05-02.md`

---

## Failures and remediations

### F-01 — Fonts 404 from `dist/tokens.css` (HIGH)

**What failed**: After running Lighthouse against the demo pages, `packages/tokens/dist/fonts/*.otf` returned 404. The `tokens.css` `@font-face` declarations use `./fonts/` relative paths, but the build target only copied `tokens.css` to `dist/` — not the font files.

**Root cause**: The `packages/tokens/project.json` build command was:
```bash
cp packages/tokens/src/tokens.css packages/tokens/dist/tokens.css
```
This only copies the CSS. No fonts or assets were included in `dist/`.

**Impact**: Brand fonts (Falling Sky) failed to load from any `dist/tokens.css` consumer — CDN links, npm installs, and the demo pages. Storybook was unaffected because it imports from `src/tokens.css` (source).

**Remediation**: Updated the build command to also copy `fonts/` and `assets/` into `dist/`:
```bash
cp packages/tokens/src/tokens.css packages/tokens/dist/tokens.css && \
mkdir -p packages/tokens/dist/fonts && \
cp packages/tokens/fonts/* packages/tokens/dist/fonts/ && \
cp -r packages/tokens/assets packages/tokens/dist/assets
```
Commit: `763e5cd`

**Process note**: This went undetected through mission #2 (reference migration) because no CI test loaded `dist/tokens.css` against actual font files. The Storybook story tests use `src/tokens.css` and passed. The gap is a missing integration test for the published artefact. A post-publish smoke test (`<link href="@spec-kitty/tokens/dist/tokens.css">` in a blank HTML page, verify font resolves) should be added before first npm release.

---

### F-02 — Logo missing from demo page navigation (MEDIUM)

**What failed**: Both `apps/demo/blog-demo.html` and `apps/demo/dashboard-demo.html` used text-only "Spec Kitty" in the nav bar. The brand logo image (`packages/tokens/assets/logo.webp`) was not included.

**Root cause**: The WP03 and WP04 implementation prompts specified nav components and CTAs but did not explicitly require the logo image. The implementers used text as the default. Reviewers accepted this without raising it.

**Remediation**:
1. Added `<img src="../../packages/tokens/assets/logo.webp">` + wordmark to both demo page navs (matching `Header.jsx` reference pattern).
2. Updated `doctrine/styleguides/sk-visual-identity.styleguide.yaml` with an explicit principle: the Spec Kitty logo MUST appear in the top nav of every branded surface, always as `<img>` + wordmark, never text alone.

Commit: `48090eb`

**Process note**: The doctrine gap (no written rule requiring the logo) was the underlying cause. Now codified.

---

### F-03 — Light/dark toggle absent from demo pages (MEDIUM)

**What failed**: Both demo pages had `data-theme="dark"` hardcoded with no UI toggle. The reference design (`Header.jsx`, preview pages with `__sk-theme-param__`) explicitly includes a sun/moon theme toggle button.

**Root cause**: FR-210 only specified responsive breakpoints. The light/dark toggle was not listed as a functional requirement in WP03/WP04. Reviewers did not flag its absence.

**Remediation**: Added to both pages:
- A 38×32px circular pill button with inline SVG sun/moon icons (matching reference)
- `onclick="skToggleTheme()"` — flips `data-theme` on `<html>`
- `?theme=light|dark` URL param support on load (matching reference `__sk-theme-param__`)
- CSS rules `[data-theme="dark"] .sk-icon-sun { display:block }` for correct icon state

Commit: `48090eb`

**Process note**: The WP prompts should have included "light/dark toggle matching the reference nav" as an explicit deliverable. Add to the WP template for future component/demo WPs: "include theme toggle if the surface has a navigation bar."

---

### F-04 — Footer not using the sk-site-footer component (LOW)

**What failed**: `apps/demo/blog-demo.html` had a minimal one-line footer (brand name + tagline + GitHub link) instead of the structured two-column footer from the reference (`CTAFooter.jsx`).

**Root cause**: The WP03 prompt listed footer as T018 but only described "a footer using design system classes." The reference footer (`CTAFooter.jsx`) has a grid layout with brand, Product links, and Connect links columns. The implementer wrote a minimal version.

**Remediation**:
1. Created `packages/html-js/src/site-footer/` component: `sk-site-footer.css`, `index.ts`, `sk-site-footer.stories.ts`
2. Exported from `packages/html-js/src/index.ts`
3. Replaced the minimal footer in `blog-demo.html` with the full `sk-site-footer` markup matching the reference

Commit: (see below)

---

### F-05 — Missing meta descriptions and favicons on demo pages (LOW)

**What failed**: Lighthouse flagged 0/1 meta description and favicon 404 on both pages. SEO score was 90/100 instead of 100/100. Best Practices was 96/100 instead of 100/100.

**Remediation**: Added `<meta name="description">` and `<link rel="icon">` to both pages. Scores corrected to 100/100.

Commit: `763e5cd`

---

## Lighthouse scores before/after

| Page | Metric | Before | After |
|---|---|---|---|
| blog-demo | Performance | 100 | 87 (font load — expected) |
| blog-demo | Accessibility | 100 | 100 |
| blog-demo | Best Practices | 96 | **100** |
| blog-demo | SEO | 90 | **100** |
| dashboard-demo | Performance | 100 | 97 |
| dashboard-demo | Accessibility | 100 | 100 |
| dashboard-demo | Best Practices | 96 | **100** |
| dashboard-demo | SEO | 90 | **100** |

Performance drop on blog-demo (87) is from loading 30 brand font files — expected for a full-fidelity demo.

---

## Systemic recommendations

1. **Add a post-publish integration test**: Load `dist/tokens.css` in a plain HTML page via `file://` and assert `--sk-color-yellow` and `--sk-font-display` both resolve before tagging any npm release.

2. **Demo WP template addition**: Any WP creating a demo page should explicitly list: logo image in nav, light/dark toggle, full footer component, meta description, favicon.

3. **Mission review checklist**: Add "do demo pages load fonts?" and "is the logo present?" to the standard post-merge checklist.
