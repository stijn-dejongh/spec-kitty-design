---
name: spec-kitty-design
description: Use this skill to generate well-branded interfaces and assets for Spec Kitty, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick file map
- `README.md` — full brand context, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — every token (`--sk-*`) you'll need for color, type, spacing, radii, motion
- `assets/` — logo, favicon, illustrations
- `ui_kits/marketing-website/` — JSX components for the marketing site (Header, Hero, FeatureCards, Callout, FAQGrid, ComparisonTable, BlogCard, Footer, etc) plus `index.html` showing them composed

## Brand snapshot
- **Product**: Spec Kitty — agent-enhanced software development ecosystem (specs → plans → tasks → implement → review → merge) for teams using Claude Code, Cursor, Codex, Gemini, Copilot.
- **Voice**: Quirky-but-serious. Sentence case, no emoji, no exclamation marks. Concrete outcomes, not abstract benefits.
- **Primary color**: yellow `#F5C518`. Accents: muted haygold, soft icy blue, soft purple. Dark mode is the default surface.
- **Type**: Default body is `ui-sans-serif` (system). Brand display = **Falling Sky** (full 300–900 + Condensed/Extended/Outline/Boldplus/Oblique cuts) via `--sk-font-display`. Editorial / long-form = **Swansea** via `--sk-font-reference`. Mono = JetBrains Mono.
- **Mascot**: a bow-tied, bespectacled cat. Use the existing illustrations in `assets/`; never draw a new one.
- **Iconography**: Lucide-style stroke icons (2px, rounded caps). No emoji.
