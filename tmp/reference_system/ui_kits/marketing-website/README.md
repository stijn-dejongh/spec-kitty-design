# Marketing Website UI Kit

Recreation of the Spec Kitty marketing site (dark mode default).

## Components

| File                 | What it is                                                         |
|----------------------|--------------------------------------------------------------------|
| `Icons.jsx`          | Lucide-style stroke icon set (clock, doc, users, link, arrow, github, moon, sun, chevrons, network, check) |
| `Header.jsx`         | Top nav: logo, pill nav, theme toggle, GitHub pill, Book Demo CTA  |
| `Hero.jsx`           | Dark hero block with eyebrow, H1, lead, checkmark bullets, CTAs    |
| `MutedInfo.jsx`      | "Open-source CLI quickstart" / Getting Started hero variant        |
| `FeatureCards.jsx`   | 3-up tinted-icon-chip feature cards                                |
| `Callout.jsx`        | Two-up "Why teams use it / Who it's for" cards with bullet lists   |
| `FAQGrid.jsx`        | "Frequently asked questions" 3-up                                  |
| `ComparisonTable.jsx`| Spec-driven AI development comparison matrix                       |
| `WorkshopForm.jsx`   | Request-the-workshop form with validation                          |
| `PricingCard.jsx`    | Workshop pricing card with "PRIMARY WORKSHOP" ribbon               |
| `BlogIndex.jsx`      | Blog listing with watercolor-tile cards                            |
| `Changelog.jsx`      | Vertical timeline with section banners and version cards           |
| `CTAFooter.jsx`      | Bottom CTA block + footer                                          |

## How to run

Open `index.html` directly. Click the top nav (Platform / Getting Started / About / Blog / Training) to navigate. Theme toggle in the top-right flips between dark and light.

## Caveats

- The cat **mascot** is rendered using `assets/logo.png` everywhere (1024×1024 canonical master). The real site uses hand-drawn watercolor scenes — replace with the production illustrations when available.
- Iconography is drawn from a **substituted Lucide-like set** inlined in `Icons.jsx`. Swap to `lucide-react` (or whatever the production set is) when codebase access is available.
- Fonts are substituted (Nunito) — see root README "Fonts & substitutions".
