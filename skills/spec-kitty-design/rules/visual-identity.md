# Visual Identity Rules

Source: `tmp/README.md` (VISUAL FOUNDATIONS section) + ADR-001, ADR-003

## Token authority

**All CSS values must use `--sk-*` custom properties.** No exceptions outside
`packages/tokens/src/tokens.css`.

```css
/* Wrong */
.btn { background: #F5C518; color: #000; border-radius: 999px; }

/* Correct */
.btn { background: var(--sk-color-yellow); color: var(--sk-fg-on-primary); border-radius: var(--sk-radius-pill); }
```

## Semantic pairing rule

Every surface token has a paired foreground token. Always use them together.

| Surface (background) | Paired foreground |
|---|---|
| `--sk-surface-page` | `--sk-fg-default` |
| `--sk-surface-card` | `--sk-fg-on-card` |
| `--sk-color-yellow` (CTA) | `--sk-fg-on-primary` |

**Violation example:**
```css
/* Unpaired — may fail contrast */
.hero { background: var(--sk-color-yellow); color: white; }

/* Paired */
.hero { background: var(--sk-color-yellow); color: var(--sk-fg-on-primary); }
```

## Dark mode default

Dark mode is the default. `--sk-surface-page: #0A0A0B` is the page background.
Sections differentiate via tint (card surface, input surface) — never via gradients.

## Color usage

- **Yellow** (`--sk-color-yellow`): Primary CTAs, active states, focus rings, accent. Use sparingly.
- **Haygold** (`--sk-color-haygold`): Resting warm tone, bullet dots, subtitle text.
- **Blue** (`--sk-color-blue`): Calm context surfaces, muted info backgrounds.
- **Purple** (`--sk-color-purple`): Architectural/cerebral sections (e.g., v2.x changelog).
- **Green** (`--sk-color-green`): Success, checkmarks, "by the numbers" banners.
- **Red** (`--sk-color-red`): Validation errors **only**.

## Iconography

Lucide-style stroke icons (2px stroke, rounded caps). No emoji.
Icon color follows the surface context — use the appropriate foreground token.

## Common patterns

```css
/* Card */
.card {
  background: var(--sk-surface-card);
  border: 1px solid var(--sk-border-default);
  border-radius: var(--sk-radius-md);        /* 16px */
}

/* Primary CTA */
.btn-primary {
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  border-radius: var(--sk-radius-pill);       /* 999px */
  padding: var(--sk-space-3) var(--sk-space-7);
}

/* Pill tag / eyebrow chip */
.eyebrow {
  border-radius: var(--sk-radius-sm);         /* 8px */
  font-family: var(--sk-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```
