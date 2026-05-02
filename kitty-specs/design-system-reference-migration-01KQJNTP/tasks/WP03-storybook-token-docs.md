---
work_package_id: WP03
title: Storybook Token Documentation Pages
dependencies:
- WP02
requirement_refs:
- FR-106
- FR-107
- FR-108
- FR-109
- FR-110
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T011
- T012
- T013
- T014
- T015
agent: "claude:claude-sonnet-4-6:frontend-freddy:implementer"
shell_pid: "1625658"
history:
- date: '2026-05-01'
  event: created
agent_profile: curator-carla
authoritative_surface: apps/storybook/src/stories/tokens/
execution_mode: code_change
owned_files:
- apps/storybook/src/stories/tokens/**
- apps/storybook/src/stories/getting-started.mdx
role: curator
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load curator-carla
```

---

## Objective

Create 4 MDX documentation pages (Colours, Typography, Spacing, Brand) as the canonical Storybook design token reference, and update Getting Started with the font loading pattern for consumers.

## Context

- **Brand voice (sk-brand-voice styleguide)**: Sentence case, no emoji, concrete > abstract
- **Reference**: `tmp/preview/` HTML pages show exactly how tokens should be displayed; use them as visual references for what to produce in Storybook
- **C-101**: No mascot illustrations on any page — logo and favicon are permitted
- **Fonts are live** (WP02): Typography page can render actual Falling Sky after WP02 completes

## Subtask Guidance

### T011 — `colours.mdx`

Create `apps/storybook/src/stories/tokens/colours.mdx` as a Storybook docs page.

Structure:
1. **Brand colours** — swatches for `--sk-color-yellow`, `--sk-color-yellow-soft`, `--sk-color-yellow-deep`, `--sk-color-haygold`, `--sk-color-blue`, `--sk-color-purple`, `--sk-color-green`, `--sk-color-red`
2. **Dark surfaces** — swatches for `--sk-surface-page`, `--sk-surface-card`, `--sk-surface-input`; show the 1px `--sk-border-default` hairline separation
3. **Section tints** — `--sk-surface-blue-tint`, `--sk-surface-purple-tint`, `--sk-surface-green-tint` with their pairing foreground
4. **Foreground/text** — `--sk-fg-default`, `--sk-fg-muted`, `--sk-fg-subtle`, `--sk-fg-on-primary`, `--sk-fg-on-card`; show each on its paired surface
5. **Borders** — `--sk-border-default`, `--sk-border-strong`, `--sk-border-focus`

For each swatch, show: a colour square, the `--sk-*` variable name, and its hex value.

**Inline style pattern for swatches** (no hardcoded values in component CSS):
```mdx
<div style={{
  background: 'var(--sk-color-yellow)',
  width: '80px', height: '80px',
  borderRadius: 'var(--sk-radius-sm)'
}} />
```

### T012 — `typography.mdx`

Create `apps/storybook/src/stories/tokens/typography.mdx`.

Structure:
1. **Display families** — show "Falling Sky" at weights 300–900, the Boldplus cut, Condensed cut; render a representative headline at each weight
2. **Reference/editorial** — show "Swansea" regular, bold, italic, bold italic with sample editorial prose
3. **Monospace** — show JetBrains Mono for code samples; include `spec -> plan -> tasks -> implement -> review -> merge` in mono
4. **Type scale** — `--sk-text-xs` through `--sk-text-3xl`; show each with its rem value and a sample word
5. **Weights** — `--sk-weight-normal` through `--sk-weight-extrabold`
6. **Eyebrow convention** — show ALL-CAPS mono with wide tracking (`COMPETITIVE MATRIX`, `BY THE NUMBERS`)

### T013 — `spacing.mdx`

Create `apps/storybook/src/stories/tokens/spacing.mdx`.

Structure:
1. **Spacing scale** — `--sk-space-1` through `--sk-space-12`; show each as a horizontal ruler bar with rem value and pixel equivalent
2. **Border radius** — `--sk-radius-sm` (8px), `--sk-radius-md` (16px), `--sk-radius-lg` (24px), `--sk-radius-pill` (999px); show as rounded squares
3. **Shadows** — `--sk-shadow-card`, `--sk-shadow-glow-primary`; show on a card surface
4. **Motion** — `--sk-motion-duration-fast`, `--sk-motion-duration-base`, `--sk-motion-ease-out`; show values in a table (no animated demos needed — this is a reference page)

### T014 — `brand.mdx`

Create `apps/storybook/src/stories/tokens/brand.mdx`.

Structure:
1. **Logo** — show `logo.webp` at standard and small sizes with usage notes; no mascot illustrations (C-101)
2. **Favicon** — show `favicon.png` at 32×32 and 128×128 with usage notes
3. **Iconography** — describe Lucide-style stroke icons (2px, rounded caps); show 3–4 example Lucide icons rendered with `--sk-color-yellow`, `--sk-color-green`, `--sk-fg-muted`; note that emoji are never used
4. **Brand voice** — a concise table of the key rules (sentence case, no emoji, concrete outcomes, canonical SK nouns)

**For logo images**, reference the bundled assets:
```mdx
import logo from '@spec-kitty/tokens/assets/logo.webp';
<img src={logo} alt="Spec Kitty logo" style={{height: '48px'}} />
```

Or if the import doesn't resolve in Storybook, use a relative path from the worktree root.

### T015 — Update `getting-started.mdx`

Add a "Loading fonts" section after the current installation instructions:

```mdx
## Loading brand fonts

When you link `tokens.css`, the Falling Sky and Swansea fonts load automatically
from the bundled `fonts/` directory. JetBrains Mono loads from Google Fonts CDN.

**CDN link (no build step):**
\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
\`\`\`

**npm install:**
After `npm install @spec-kitty/tokens`, import in your CSS:
\`\`\`css
@import '@spec-kitty/tokens/dist/tokens.css';
\`\`\`
The `fonts/` directory ships alongside `tokens.css` in the package; the relative
`@font-face` paths resolve automatically.

**Angular project:**
\`\`\`json
// angular.json → projects → yourApp → architect → build → options
"styles": ["node_modules/@spec-kitty/tokens/dist/tokens.css"]
\`\`\`
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `apps/storybook/src/stories/tokens/colours.mdx` renders live colour swatches for all categories
- [ ] `apps/storybook/src/stories/tokens/typography.mdx` renders Falling Sky, Swansea, and JetBrains Mono specimens
- [ ] `apps/storybook/src/stories/tokens/spacing.mdx` shows scale, radius, shadow, motion tokens
- [ ] `apps/storybook/src/stories/tokens/brand.mdx` shows logo, favicon, iconography, brand voice
- [ ] `getting-started.mdx` includes font loading instructions
- [ ] Storybook build completes < 3 min (NFR-102)
- [ ] No emoji on any page; all headings are sentence case

## Risks

- The `@import url(...)` for Google Fonts inside `tokens.css` may not work when Storybook serves from `file://` — if fonts do not load, use a Storybook `staticDirs` workaround and note it
- Inline style swatches are not validated by Stylelint (they don't go through the CSS linter) — this is intentional and acceptable for documentation pages

## Reviewer Guidance

Open each page in the running Storybook and verify: (1) all colour swatches show their `--sk-*` variable name, (2) Typography page renders text in Falling Sky (not system font), (3) Brand page shows logo but no mascot illustrations. Run the Storybook build and confirm it stays under 3 minutes.

## Activity Log

- 2026-05-02T06:23:24Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – Started implementation via action command
- 2026-05-02T06:39:08Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=1625658 – 4 token doc pages committed (colours, typography, spacing, brand) + getting-started font section
