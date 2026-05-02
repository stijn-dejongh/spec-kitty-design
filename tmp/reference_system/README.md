# Spec Kitty Design System

> The missing workflow layer that keeps AI coding aligned with product intent.
> — Spec Kitty footer copy

## What Spec Kitty is

**Spec Kitty** is an agent-enhanced software-development ecosystem for
serious developers. It turns rough requests into reviewable specs, plans,
and work packages **before** code generation begins, then keeps those
artifacts in sync with the work as AI agents (Claude Code, Cursor, Codex,
Gemini CLI, Copilot) ship code.

The pitch from the dark hero: *"Bring structure to AI-assisted delivery."*
The footer line: *"The missing workflow layer that keeps AI coding aligned
with product intent."*

### Surfaces represented in the references

The uploaded screenshots are all from the **marketing website** in dark
mode. Within that site, we see:

- **Home / dark hero** — `Bring Structure to AI-assisted delivery` with the
  bow-tied glasses-cat mascot on the right
- **Getting Started** — open-source CLI quickstart
- **About / The Team** — founder cards with `HIGHLIGHTS` panels
- **Blog index + post** — three illustrated cards, then a long-form post
  with `Quick Answer` lead
- **Training / Workshop** — `Request the workshop` form, `Full-day rollout
  workshop` pricing card with "PRIMARY WORKSHOP" ribbon
- **Comparison Matrix** — Spec Kitty vs GitHub Spec Kit vs Kiro vs GSD table
- **Ecosystem grid** — Mission Types + "BY THE NUMBERS" stat cards
- **Changelog / Technical Evolution** — sidebar-driven timeline of versions
- **CTA blocks**, **footer**, **muted info / FAQ** sections

There is also a CLI product (`spec-kitty`, `kitty-specs`) referenced in
the comparison matrix and "Open-source CLI quickstart" page — but no
terminal UI screenshots were provided, so we don't model the CLI surface
here.

### Sources received

- **Uploaded screenshots** — see `uploads/` and the asset table at the
  bottom of this README. All are **dark-mode** captures of the marketing
  site.
- **GitHub repo** — `Priivacy-ai/spec-kitty` was attached but not connected
  during this build pass. When it is, pull real tokens from the repo's
  CSS / Tailwind config and reconcile against this file.
- **Logo / favicon** — `uploads/logo_small.webp`, `uploads/favicon.png`
  (the bespectacled cat head, 128×128 with transparency).

---

## Index

```
README.md                 ← this file
SKILL.md                  ← Agent Skill manifest (use this skill from Claude Code etc)
colors_and_type.css       ← brand tokens — colors, type, spacing, radii, shadows, motion
assets/                   ← logos, illustrations, favicon
fonts/                    ← (placeholder — see "Fonts & substitutions" below)
ui_kits/
  marketing-website/      ← React JSX recreation of the marketing surface
    index.html              click-thru landing → blog → workshop → comparison
    Header.jsx, Hero.jsx, FeatureCards.jsx, FAQGrid.jsx, …
preview/                  ← Design System tab cards (registered via the manifest)
uploads/                  ← original references (kept for traceability)
```

---

## CONTENT FUNDAMENTALS

**Voice.** Clear, declarative, lightly technical. The reader is a serious
software person — a tech lead, staff engineer, or product manager
adopting AI tools. Spec Kitty addresses them as adults: no exclamation
marks, no marketing froth, no emoji. The tone is closer to a thoughtful
engineering blog than a SaaS landing page.

**POV.** Mostly *Spec Kitty* (third-person product) with *you* / *your
team* for the reader. Rarely *we*. Examples from the references:

- "Spec Kitty turns rough requests into reviewable specs…"
- "It helps software teams use Claude Code, Cursor, Codex, Gemini, and
  similar tools inside the delivery process they already trust."
- "Tell us who should be involved, how large the team is, and what you
  want the session to unlock."

**Casing.** Sentence case for headlines and labels — *not* title case.
"Bring Structure to AI-assisted delivery" capitalizes the proper noun
"AI" only. Buttons are sentence case ("Get Started", "Read the Docs",
"Book Demo" — note the brand allows the occasional Title Case for
short two-word CTAs). Eyebrow labels and stat captions are
**ALL-CAPS** in mono with wide tracking ("COMPETITIVE MATRIX",
"BY THE NUMBERS", "TOTAL COMMITS", "v1.x — STABLE RELEASE").

**Names of things.** The product has small, memorable nouns it owns:
*Specs*, *Plans*, *Work Packages*, *Missions*, *Decision Moments*,
*Teamspace*, *Charter*, *Doctrine*. These are always capitalized when
referring to the Spec Kitty concept; never when used in a generic sense.

**Code in copy.** Inline code (`spec-kitty orchestrator`,
`kitty-specs`, `meta.json`) appears mid-sentence in the mono face with
a faint pill background. Common in changelog entries and the comparison
table. Comfortable for a technical audience.

**Concrete > abstract.** Lists prefer specific outcomes: "Developers
spend time building, not being blocked on finalized requirements" —
*not* "improved developer productivity". The hero bullets always start
with a checkmark and a concrete benefit.

**No emoji.** None observed across 21 screenshots. Iconography is
strokey rounded line-icons in the brand yellow/purple/green/blue.

**Vibe summary.** "Quirky-but-serious." The hand-drawn cat with bow
tie + round glasses sets a friendly mood; the typography, copy, and
information density keep it credible for engineering buyers.

---

## VISUAL FOUNDATIONS

### Color

- **Primary: yellow** (`#F5C518`). Reserved for the most important
  actions: hero CTA, "Book Demo" pill, the cat's bow tie, the active
  timeline node, the "PRIMARY WORKSHOP" ribbon, link color in body
  copy, and the vertical accent line on highlighted timeline cards.
- **Muted haygold** (`#D9B36A`) is the *resting* warm tone — used for
  bullet dots in feature lists, "Creator of Spec Kitty" subtitle text,
  and version eyebrow labels.
- **Soft icy blue** (`#A9C7E8`) lives mostly in *blog illustration
  skies* and the muted-info panel background (`#14202E`). It
  represents calm context surfaces.
- **Soft purple** (`#B8A9E0`) marks the **v2.x — Event Architecture**
  section in the changelog (banners, timeline nodes). Mood: cerebral,
  architectural.
- **Soft green** (`#8FCB8F`) is success — the row of green checkmarks
  in the hero bullets and "by the numbers" banner.
- **Mood red** (`#E97373`) is validation errors only.

The dark theme is **almost-black**, not pure `#000` — `#0A0A0B` page,
`#161619` cards, `#1C1C20` form fills. Differentiation between layers
comes from a 1px hairline border (`#26262C`) plus a tiny lift, not
from drop shadows.

### Typography

- The `.sk-h1`, `.sk-h2`, `.sk-h3`, `.sk-h4` utility classes set
  `font-family: var(--sk-font-display)` (Falling Sky). The default
  `body` style uses `--sk-font-sans` (system UI) so plain text in
  forms, tables, and small labels stays in `ui-sans-serif`.
- **Mono:** JetBrains Mono for code, version chips (`v1.0.0`), and the
  ALL-CAPS eyebrow labels.
- **Headlines** are heavy (800–900 weight), tightly tracked, balanced
  with `text-wrap: balance`, and 1.1 line-height. Body is 16px / 1.55
  with `--sk-fg-1` at ~91% white over the dark canvas.

### Backgrounds & textures

- **No gradients on body backgrounds.** Sections are flat dark surfaces
  with one of three tints: neutral charcoal (default), `--sk-blue-bg`
  for muted info, `--sk-purple-bg` for v2.x, `--sk-green-bg` for "by
  the numbers".
- **Hand-drawn cat illustrations** carry the brand mood. The "v2.1.2
  Skills" reference image uses a **soft icy-blue painted background**
  with a visible paper grain — this is the closest thing to a
  "texture" in the system. Use sparingly, for hero/marketing moments.
- The dark hero has a very subtle **vignette** in the lower right
  corner (almost invisible) but no explicit pattern.
- Blog cards crop full-bleed illustrated thumbnails (warm watercolor
  style) at the top of each card.

### Borders, cards, radii

- **Cards** = `1px solid var(--sk-border-strong)` on `var(--sk-surface)`
  with **16px** corner radius. No drop shadow on dark.
- **Form inputs** are pill-ish: `12px` radius (almost capsule on short
  inputs), 1px border, transparent fill with a slightly elevated
  surface when filled.
- **Buttons** primary: full pill (`999px`), 12–14px vertical padding,
  yellow fill, dark ink text, optional yellow soft glow on hover.
  Secondary: pill outline with white text on dark.
- **Eyebrow chips** ("Open-source CLI quickstart", "For software teams
  adopting agentic coding") are 8px radius pills on `--sk-bg-pill`.
- **Section banners** in the changelog (e.g. "● VERSION 1.X — FIRST
  STABLE PYPI RELEASE") use the section's accent color tinted
  background, a leading colored dot, and mono-uppercase type.

### Shadows & elevation

- Dark mode: **shadows ≈ none**. Depth via layered backgrounds and
  borders. The one exception is `--sk-shadow-glow-yellow` under primary
  CTAs on hover.
- Light mode: a soft 12-32 elevation shadow with low opacity (warm
  ink tone, not pure black).

### Layout rules

- **Container width** ~1200px max, centered.
- **Top nav**: floating pill containing Platform / Getting Started /
  About / Blog / Training, with active item filled in dark pill. Right
  cluster: theme toggle (moon glyph), GitHub pill, **Book Demo**
  primary CTA.
- **Section rhythm:** big H2 headline → 1-line muted lead → the
  content (cards, table, form, etc). Generous vertical spacing
  (`--sk-space-9` = 96px between sections).
- **Hero pattern:** eyebrow pill → H1 → 2–3 sentence lead in muted
  body → checkmark bullets → primary + secondary buttons + ghost link.
  Cat illustration on the right at large breakpoints.

### Animation & interaction

- The site reads as restrained — no implied bounces or playful
  micro-interactions in the references. Recommended motion:
  - **Hover**: 120ms ease-out brightness lift on primary, 1px
    border-color shift on secondary.
  - **Press**: 96% scale, no color change.
  - **Page transitions**: simple fade + 8px translate-y, 200ms.
  - Avoid spring/bounce animations — the brand voice is composed.

### Use of transparency / blur

- Minimal. The nav pill could use a `backdrop-filter: blur(12px)` on
  scroll over hero imagery, but the references show it on a flat
  background. Don't introduce glassy panels elsewhere — it's
  off-brand.

### Imagery vibe

- **Hand-drawn watercolor illustrations** of the cat mascot in scenes:
  founders' meeting, walking toward "FUTURE" sign, holding a bag of
  "2.1.2 Skills". Warm sunset palettes, soft icy-blue skies, painterly
  but readable. Always feature the cat with bow tie + round glasses.
- **No stock photography.** No real-people imagery anywhere observed.

---

## ICONOGRAPHY

Spec Kitty uses **stroke icons in a Lucide-style line set** —
2px-ish stroke, rounded line caps, no fills. We see them in the
**three feature-cards row** (clock, document, users), **callout
columns** (link/chain, users), the form/checkout (chevron-down on
selects), the **arrow-right glyph** in CTA buttons, the **moon**
in the theme toggle, and the **GitHub** glyph in the GitHub pill.

Without the codebase to confirm the exact set, we **substitute
[Lucide](https://lucide.dev)** via CDN — it's a near-perfect
visual match (rounded line caps, 24×24 grid, 2px stroke).
**⚠️ Substitution flag**: confirm against the production set when
GitHub access is available.

**Icon color rules (observed):**
- Bullet checkmarks → soft green (`--sk-green`)
- Hero feature card icons → on a tinted square chip (yellow/green/
  purple) with the glyph in the matching deeper hue
- Eyebrow / list bullets → small filled circles in haygold
- Inline arrows in primary buttons → black ink (matches button text)

**Logo treatment.** The cat-head mark is used at 2 scales: small
(28×28 in the nav) and large for branded illustrations. Always paired
with the wordmark "Spec Kitty" in the display sans, weight 700.

**Emoji?** Not used. Don't introduce them.

**Unicode glyphs?** The arrow-style `->` (literal hyphen + greater
than) appears in CLI flow text: *"spec -> plan -> tasks -> implement
-> review -> merge"*. This is intentional; render as plain text in
mono, not as an SVG.

---

## Fonts

| Role          | Family                                         | Status                  |
| ------------- | ---------------------------------------------- | ----------------------- |
| Default UI    | `ui-sans-serif` (system)                       | ✅ default               |
| Display       | **Falling Sky** (300–900 + Oblique)            | ✅ official, brand       |
| Display alt   | Falling Sky Condensed / Extended / Outline     | ✅ official, display only|
| Display heavy | Falling Sky Boldplus                           | ✅ official              |
| Reference     | **Swansea** (Regular, Bold, Italic, BoldItalic)| ✅ official, editorial   |
| Mono          | **JetBrains Mono** (Google)                    | ✅ likely match (confirm)|

Files live in `/fonts/`. The full set is wired up via `@font-face`
in `colors_and_type.css`. **`--sk-font-sans` is system UI** so plain
body copy stays in the OS face. Reach for the brand explicitly:

- `var(--sk-font-display)` — Falling Sky, for hero & section headlines
- `var(--sk-font-reference)` — Swansea, for editorial / long-form prose
- `var(--sk-font-condensed)` / `--sk-font-extended` / `--sk-font-outline`
  / `--sk-font-boldplus` — display cuts for special moments

---

## Asset traceability

Every preview / kit asset traces back to one of the 21 uploaded
references. The mapping is:

| Asset                              | Source upload(s)                                |
| ---------------------------------- | ----------------------------------------------- |
| Header / nav / theme toggle        | `kitty_dark-hero.png`                           |
| Hero block & primary CTA           | `kitty_dark-hero.png`, `kitty-buttons.png`      |
| Feature cards (3-up)               | `kitty_cards.png`, `kitty_alt-card.png`         |
| Callout (Why teams use / Who for)  | `kitty-callout.png`                             |
| FAQ grid                           | `kitty_info.png`                                |
| Muted info banner                  | `kitty-muted_info.png`                          |
| Comparison table                   | `kitty_table.png`                               |
| Form + validation                  | `kitty-form.png`                                |
| Pricing card / workshop ribbon     | `kitty-highlight.png`                           |
| The Team / founder card            | `kitty-callout.png` (Robert Douglass)           |
| Blog index                         | `kitty_blog.png`                                |
| Blog post                          | `kitty_blog-post.png`                           |
| Ecosystem stat grid                | `kitty_ecosystem.png`                           |
| Changelog timeline                 | `changelog.png`, `kitty-timeline_alt.png`       |
| Bottom CTA                         | `Kitty-CTA.png`                                 |
| Footer                             | `kitty_footer.png`                              |
| Skills illustration                | `kitty_ref.png`                                 |
| Logo, favicon                      | `logo_small.webp`, `favicon.png`                |

---

## How to use this design system

1. Link `colors_and_type.css` from any HTML artifact.
2. Use the `--sk-*` custom properties as your only color/type source.
3. Pull components from `ui_kits/marketing-website/*.jsx` for whole
   sections or individual atoms.
4. For Agent-Skill workflows in Claude Code, see `SKILL.md`.
