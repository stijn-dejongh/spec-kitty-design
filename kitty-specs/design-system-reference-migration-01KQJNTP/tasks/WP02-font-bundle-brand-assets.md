---
work_package_id: WP02
title: Font Bundle + Brand Assets
dependencies:
- WP01
requirement_refs:
- FR-102
- FR-103
- FR-105
- FR-106
- FR-123
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T005
- T006
- T007
- T008
- T009
- T010
agent: "claude:claude-sonnet-4-6:frontend-freddy:implementer"
shell_pid: "1560894"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/tokens/fonts/
execution_mode: code_change
owned_files:
- packages/tokens/fonts/**
- packages/tokens/assets/**
- packages/tokens/package.json
- packages/tokens/.npmignore
- apps/storybook/.storybook/preview.ts
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Bundle 30 brand font OTF files into `@spec-kitty/tokens`, add `@font-face` declarations to `tokens.css`, copy brand assets (logo, favicon), and validate the published package self-contains everything needed for brand-correct rendering.

## Context

- **Font source**: `tmp/Spec Kitty Design System(1)/fonts/` — 30 OTF files (Falling Sky family with all weights/cuts, Swansea as TTF)
- **Asset source**: `tmp/Spec Kitty Design System(1)/assets/` — `logo.png`, `logo.webp`, `favicon.png` (NOT the `illustration-*.webp` files — those are excluded by C-101)
- **Current `tokens.css`**: After WP01, it has canonical values but no `@font-face` rules
- **Font distribution decision**: Option B (bundled in `@spec-kitty/tokens`) — fonts live in `packages/tokens/fonts/` and are referenced via relative `./fonts/` paths in the CSS
- **C-105**: JetBrains Mono is served via Google Fonts CDN, not bundled
- **C-106**: Font licence verification is a manual gate for the maintainer before publishing — this WP implements the bundling; publishing is gated

## Subtask Guidance

### T005 — Copy font files

```bash
# From the worktree root
mkdir -p packages/tokens/fonts
cp "tmp/Spec Kitty Design System(1)/fonts/"*.otf packages/tokens/fonts/
cp "tmp/Spec Kitty Design System(1)/fonts/"*.ttf packages/tokens/fonts/
ls packages/tokens/fonts/ | wc -l  # should be 30
```

Verify no illustration files accidentally copied. Font files should only be `.otf` and `.ttf` files.

**Note on the OTF/TTF mix**: Swansea comes as TTF (`Swansea-*.ttf`). The `@font-face` `format()` hint must match: use `format('truetype')` for TTF files and `format('opentype')` for OTF files.

### T006 — Add `@font-face` declarations to `tokens.css`

**Append to the bottom of `packages/tokens/src/tokens.css`** (after all custom property declarations):

```css
/* ── Brand fonts — bundled in @spec-kitty/tokens ─────────────────────────
   Falling Sky: primary display typeface (full family)
   Swansea: editorial / long-form prose
   JetBrains Mono: code, version numbers, ALL-CAPS labels (Google Fonts CDN)
   ─────────────────────────────────────────────────────────────────────── */

/* JetBrains Mono via Google Fonts CDN (not bundled — open source, universally cached) */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

/* Falling Sky — upright weights (300–900) */
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSkyLight-K2EX.otf') format('opentype');        font-weight: 300; font-style: normal;  font-display: swap; }
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSky-JKwK.otf') format('opentype');             font-weight: 400; font-style: normal;  font-display: swap; }
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSkyMedium-ved9.otf') format('opentype');       font-weight: 500; font-style: normal;  font-display: swap; }
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSkySemibold-Bn7B.otf') format('opentype');     font-weight: 600; font-style: normal;  font-display: swap; }
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSkyBold-zemL.otf') format('opentype');         font-weight: 700; font-style: normal;  font-display: swap; }
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSkyExtrabold-redB.otf') format('opentype');    font-weight: 800; font-style: normal;  font-display: swap; }
@font-face { font-family: 'Falling Sky'; src: url('./fonts/FallingSkyBlack-GYXA.otf') format('opentype');        font-weight: 900; font-style: normal;  font-display: swap; }
/* (add oblique variants and speciality cuts following the same pattern from colors_and_type.css) */
```

**Copy ALL `@font-face` rules from `tmp/Spec Kitty Design System(1)/colors_and_type.css`** for the complete set — change the `url('fonts/...')` paths to `url('./fonts/...')` (add the leading `./`).

After updating, also ensure `--sk-font-*` variables reference the correct family names:
```css
--sk-font-display:    "Falling Sky", ui-sans-serif, system-ui, sans-serif;
--sk-font-reference:  "Swansea", Georgia, serif;
--sk-font-mono:       "JetBrains Mono", ui-monospace, monospace;
--sk-font-condensed:  "Falling Sky Condensed", ui-sans-serif, sans-serif;
--sk-font-boldplus:   "Falling Sky Boldplus", ui-sans-serif, sans-serif;
```

### T007 — Copy brand assets

```bash
mkdir -p packages/tokens/assets
cp "tmp/Spec Kitty Design System(1)/assets/logo.png" packages/tokens/assets/
cp "tmp/Spec Kitty Design System(1)/assets/logo.webp" packages/tokens/assets/
cp "tmp/Spec Kitty Design System(1)/assets/favicon.png" packages/tokens/assets/
ls packages/tokens/assets/
# Should show ONLY: logo.png, logo.webp, favicon.png
# Do NOT copy illustration-*.webp or blog-illustrations.png (C-101)
```

### T008 — Update `packages/tokens/package.json` and `.npmignore`

**`packages/tokens/package.json`** — update `files` array:
```json
{
  "files": ["dist/tokens.css", "dist/token-catalogue.json", "fonts/**", "assets/**", "README.md"]
}
```

**`packages/tokens/.npmignore`** — ensure `fonts/` and `assets/` are NOT excluded:
Remove any lines that would exclude `fonts/` or `assets/`. The `.npmignore` should only exclude `src/` and source map files.

### T009 — Update Storybook `preview.ts`

The Storybook `preview.ts` currently imports `@spec-kitty/tokens`. After WP02, `tokens.css` includes `@font-face` rules, so fonts should auto-load. However, the CSS is loaded as a built artifact.

In `apps/storybook/.storybook/preview.ts`, verify or add:
```typescript
// Ensure tokens CSS (including @font-face) is loaded for all stories
import '../../../packages/tokens/src/tokens.css';
```

If the above import causes a build error (CSS import in TS), use the Storybook `staticDirs` + HTML `<link>` approach instead — document whichever path you take in a code comment.

### T010 — Validate package contents and size

```bash
# Check pack would include fonts and assets
cd packages/tokens && npm pack --dry-run 2>&1 | grep -E "fonts/|assets/"
# Should list font files

# Check compressed size estimate
cd packages/tokens && npm pack --dry-run 2>&1 | grep "total files"
# NFR-101: must be < 5 MB when compressed
```

If fonts push the package over 5 MB, selectively exclude less-used cuts (Outline, Extended) from the bundled set and document the decision.

Also run `npm run tokens:catalogue` to verify the catalogue is still current after adding `@font-face` rules (they should not affect the catalogue since they're not `--sk-*` custom properties).

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `packages/tokens/fonts/` contains all 30 font files
- [ ] `tokens.css` includes complete `@font-face` block with `./fonts/` relative paths
- [ ] `packages/tokens/assets/` contains `logo.png`, `logo.webp`, `favicon.png` ONLY (no illustrations)
- [ ] `packages/tokens/package.json` `files` includes `fonts/**` and `assets/**`
- [ ] `.npmignore` does not exclude `fonts/` or `assets/`
- [ ] `npm pack --dry-run` lists font files and assets
- [ ] Compressed package size < 5 MB (NFR-101)
- [ ] Storybook renders brand fonts in story previews (visually verify Falling Sky appears)

## Risks

- The `@import url(...)` for Google Fonts will fail in offline environments or when Storybook is run with `file://` protocol — acceptable trade-off; document it
- Swansea comes as TTF not OTF — use `format('truetype')` in `@font-face` for those files
- Token catalogue regeneration after adding `@font-face` rules should produce no changes (catalogue only tracks `--sk-*` properties) — verify this

## Reviewer Guidance

Open the Storybook `getting-started.mdx` page and visually confirm that a heading using `--sk-font-display` renders in Falling Sky (not a system fallback font). Run `npm pack --dry-run` and confirm fonts appear in the file list. Check that no illustration assets (`illustration-*.webp`) ended up in `assets/`.

## Activity Log

- 2026-05-02T06:06:59Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1560894 – Started implementation via action command
