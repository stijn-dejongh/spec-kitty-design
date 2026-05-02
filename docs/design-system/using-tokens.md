# Using tokens

The `@spec-kitty/tokens` package publishes a single CSS file (`tokens.css`) containing all `--sk-*` custom properties. Load it once, then reference tokens anywhere in your stylesheets.

## Installation

### Plain HTML (CDN — no build step required)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">
<style>
  .my-heading {
    font-family: var(--sk-font-display);
    color: var(--sk-fg-default);
  }
</style>
```

### npm

```bash
npm install @spec-kitty/tokens
```

### Angular project setup

After installing via npm, register `tokens.css` in your `angular.json` build options so it is bundled with your application:

```json
// angular.json -> projects -> yourApp -> architect -> build -> options
"styles": ["node_modules/@spec-kitty/tokens/dist/tokens.css"]
```

### SCSS global stylesheet

```scss
// Import in your global stylesheet
@import '@spec-kitty/tokens/dist/tokens.css';

.hero-title {
  font-family: var(--sk-font-display);
  font-weight: var(--sk-weight-extrabold);
  color: var(--sk-fg-default);
}
```

## Using `--sk-*` properties

Every token is a CSS custom property prefixed with `--sk-`. Reference tokens directly in any CSS rule:

```css
.card {
  background: var(--sk-surface-card);
  border: var(--sk-border-width-1) solid var(--sk-border-default);
  border-radius: var(--sk-radius-md);
  color: var(--sk-fg-on-card);
}

.cta-button {
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  border-radius: var(--sk-radius-pill);
}
```

Never use hardcoded hex, rgb, or hsl values — the token layer is the single authoritative colour, spacing, and typography source.

## Semantic pairing rule

Every surface token has a paired foreground token. Always use them together to ensure sufficient colour contrast:

| Surface | Use with |
|---|---|
| `--sk-surface-page` | `--sk-fg-default` |
| `--sk-surface-card` | `--sk-fg-on-card` |
| `--sk-color-yellow` (CTAs) | `--sk-fg-on-primary` |
| `--sk-surface-tint-mint` | `--sk-on-tint-mint` |
| `--sk-surface-tint-butter` | `--sk-on-tint-butter` |
| `--sk-surface-tint-lilac` | `--sk-on-tint-lilac` |
| `--sk-surface-tint-sky` | `--sk-on-tint-sky` |

Mixing an unpaired surface and foreground token is a visual identity violation — it will fail the design review quality gate.

## Token catalogue reference

The full list of tokens across all 13 categories (colour, surface, foreground, border, spacing, radius, typography, shadow, and more) is available in two places:

- **Machine-readable catalogue**: `packages/tokens/dist/token-catalogue.json` in the repository
- **Interactive reference**: [Storybook — Design Tokens](https://stijn-dejongh.github.io/spec-kitty-design/?path=/docs/design-tokens--docs) — browse tokens by category with live swatches
