# ADR-003 addendum: Token value reconciliation results

**Date**: 2026-05-01
**Status**: Complete (pre-implementation gate FR-034 satisfied — WP01 delivered)
**Reconciled by**: WP01 Token Value Reconciliation

---

## Purpose

This addendum records the results of the token value reconciliation required by
ADR-003 before `packages/tokens/src/tokens.css` is authorised for production.

The current `packages/tokens/src/tokens.css` has been reconciled against the
Claude Design reference file (`tmp/Spec Kitty Design System(1)/colors_and_type.css`).
All authoritative hex values have been applied, missing token categories have been
added, and the ADR-003 naming schema is maintained throughout.

---

## Reconciliation checklist

- [x] Audit `tmp/Spec Kitty Design System(1)/colors_and_type.css` (Claude Design reference)
- [x] Compare category by category: color, surface, foreground, border, typography, spacing, radius, shadow, motion
- [x] Record discrepancies in the table below
- [x] Select the authoritative value for each discrepancy
- [x] Update this document with final resolved values
- [x] Confirm the completed catalogue is checked in to `packages/tokens/dist/token-catalogue.json`
- [x] Confirm the Stylelint allowlist reflects the final canonical token list

---

## Naming schema note

The Claude Design reference uses a flat namespace (`--sk-yellow`, `--sk-bg-2`, `--sk-fs-body`,
`--sk-dur-fast`). ADR-003 adopted a category-prefixed schema (`--sk-color-yellow`,
`--sk-surface-page`, `--sk-text-base`, `--sk-motion-duration-fast`). The implemented
`tokens.css` uses the ADR-003 schema, not the reference file's naming.

All reconciliation maps reference values to ADR-003 names.

---

## Color format decision

**Decision: hex is the canonical format.**

Rationale:
- The authoritative reference file (`colors_and_type.css`) exclusively uses sRGB hex values.
- Hex is universally supported across all browsers without any compatibility caveats.
- Hex is the simplest, most readable format for contributors unfamiliar with OKLCH or `oklch()`.
- The bootstrap approximations used `rgba()` for foreground shades; these have been replaced
  with the canonical hex values from the reference (`#FFFFFF`, `#D6D6DA`, etc.) for consistency.
- OKLCH is not adopted for this release. If perceptual-uniform color interpolation is needed
  in the future, an ADR amendment should be filed.

---

## Full reconciliation table

### Brand colors

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-color-yellow` | `--sk-yellow` | `#F5C518` | Match — no change |
| `--sk-color-yellow-soft` | `--sk-yellow-soft` | `#FFD84D` | **Added** (was missing) |
| `--sk-color-yellow-deep` | `--sk-yellow-deep` | `#C99A0E` | **Added** (was missing) |
| `--sk-color-haygold` | `--sk-haygold` | `#D9B36A` | Match — no change |
| `--sk-color-haygold-soft` | `--sk-haygold-soft` | `#E8C988` | **Added** (was missing) |
| `--sk-color-blue` | `--sk-blue` | `#A9C7E8` | Match — no change |
| `--sk-color-blue-deep` | `--sk-blue-deep` | `#6B8FB8` | **Added** (was missing) |
| `--sk-color-blue-bg` | `--sk-blue-bg` | `#14202E` | **Added** (was missing) |
| `--sk-color-purple` | `--sk-purple` | `#B8A9E0` | Match — no change |
| `--sk-color-purple-deep` | `--sk-purple-deep` | `#8C7AC2` | **Added** (was missing) |
| `--sk-color-purple-bg` | `--sk-purple-bg` | `#1E1A2E` | **Added** (was missing) |
| `--sk-color-green` | `--sk-green` | `#8FCB8F` | Match — no change |
| `--sk-color-green-bg` | `--sk-green-bg` | `#15241A` | **Added** (was missing) |
| `--sk-color-red` | `--sk-red` | `#E97373` | Match — no change |
| `--sk-color-red-soft` | `--sk-red-soft` | `#F0A0A0` | **Added** (was missing) |
| `--sk-color-sage` | `--sk-sage` | `#4F8F4F` | **Added** (was missing) |
| `--sk-color-sage-deep` | `--sk-sage-deep` | `#3D7A3D` | **Added** (was missing) |
| `--sk-color-sage-soft` | `--sk-sage-soft` | `#7CAE7C` | **Added** (was missing) |

### Accent colors

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-color-accent` | `--sk-accent` | `var(--sk-yellow)` = `#F5C518` | **Added** (was missing) |
| `--sk-color-accent-fg` | `--sk-accent-fg` | `#1A1408` | **Updated** (was `#0A0A0B`) |

Note: `--sk-fg-on-primary` was also corrected from `#0A0A0B` to `#1A1408` to match the reference.

### Surfaces (dark mode default)

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-surface-page` | `--sk-bg-0` | `#0D0E11` | **Updated** (was `#0A0A0B`) |
| `--sk-surface-hero` | `--sk-bg-1` | `#121317` | **Added** (was missing) |
| `--sk-surface-card` | `--sk-bg-2` | `#181A1F` | **Updated** (was `#161619`) |
| `--sk-surface-input` | `--sk-bg-3` | `#1C1F25` | **Updated** (was `#1C1C20`) |
| `--sk-surface-pill` | `--sk-bg-pill` | `#212830` | **Added** (was missing) |
| `--sk-surface-muted` | `--sk-bg-muted` | `#262C36` | **Added** (was missing) |

### Section tint surfaces (dark mode)

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-surface-tint-mint` | `--sk-tint-mint` | `#15241A` | **Added** (was missing) |
| `--sk-surface-tint-butter` | `--sk-tint-butter` | `#2A2410` | **Added** (was missing) |
| `--sk-surface-tint-lilac` | `--sk-tint-lilac` | `#1E1A2E` | **Added** (was missing) |
| `--sk-surface-tint-sky` | `--sk-tint-sky` | `#14202E` | **Added** (was missing) |

### On-tint foregrounds

| ADR-003 token | Reference name | Notes | Status |
|---|---|---|---|
| `--sk-on-tint-mint` | `--sk-on-mint` | `var(--sk-color-green)` | **Added** (was missing) |
| `--sk-on-tint-butter` | `--sk-on-butter` | `var(--sk-color-yellow-soft)` | **Added** (was missing) |
| `--sk-on-tint-lilac` | `--sk-on-lilac` | `var(--sk-color-purple)` | **Added** (was missing) |
| `--sk-on-tint-sky` | `--sk-on-sky` | `var(--sk-color-blue)` | **Added** (was missing) |

### Pill/chip background

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-bg-pill` | `--sk-bg-pill` | `#212830` | **Added** (was missing) |

Note: `--sk-bg-pill` uses the single-segment `bg` category by design — the reference uses a single-
segment token and there is no multi-token `bg-*` family to namespace under `surface`.

### Foreground shades

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-fg-default` | `--sk-fg-0` | `#FFFFFF` | **Updated** (was `rgba(255,255,255,0.91)`) |
| `--sk-fg-body` | `--sk-fg-1` | `#D6D6DA` | **Added** (was missing; `--sk-fg-muted` was approximating this) |
| `--sk-fg-muted` | `--sk-fg-2` | `#A9A9B0` | **Updated** (was `rgba(255,255,255,0.55)`) |
| `--sk-fg-subtle` | `--sk-fg-3` | `#6E6E78` | **Added** (was missing) |
| `--sk-fg-placeholder` | `--sk-fg-4` | `#4A4A52` | **Added** (was missing) |
| `--sk-fg-on-primary` | `--sk-accent-fg` | `#1A1408` | **Updated** (was `#0A0A0B`) |
| `--sk-fg-on-card` | `--sk-fg-1` | `#D6D6DA` | **Updated** (was `rgba(255,255,255,0.91)`) |

### Borders

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-border-default` | `--sk-border` | `#2B313B` | **Updated** (was `#26262C`) |
| `--sk-border-strong` | `--sk-border-strong` | `#353C48` | **Updated** (was `#3a3a42`) |
| `--sk-border-focus` | `--sk-border-focus` | `#F5C518` | Match — no change |
| `--sk-border-width-1` | `--sk-bw-1` | `1px` | **Added** (was missing) |
| `--sk-border-width-2` | `--sk-bw-2` | `2px` | **Added** (was missing) |

### Typography — families

| ADR-003 token | Reference name | Status |
|---|---|---|
| `--sk-font-sans` | `--sk-font-sans` | **Updated** — expanded fallback stack to match reference |
| `--sk-font-display` | `--sk-font-display` | Match — no change |
| `--sk-font-reference` | `--sk-font-reference` | **Updated** — fallback stack corrected |
| `--sk-font-condensed` | `--sk-font-condensed` | **Added** (was missing) |
| `--sk-font-extended` | `--sk-font-extended` | **Added** (was missing) |
| `--sk-font-outline` | `--sk-font-outline` | **Added** (was missing) |
| `--sk-font-boldplus` | `--sk-font-boldplus` | **Added** (was missing) |
| `--sk-font-mono` | `--sk-font-mono` | **Updated** — expanded fallback stack to match reference |

Note: `@font-face` declarations are intentionally absent from `tokens.css`. They are loaded in
WP02 (Font Loading). The font-family tokens here reference the same family names that WP02 will
register.

### Typography — scale

| ADR-003 token | Reference name | Status |
|---|---|---|
| `--sk-text-xs` | `--sk-fs-eyebrow` (12px) | Match — no value change |
| `--sk-text-sm` | `--sk-fs-small` (14px) | Match — no value change |
| `--sk-text-base` | `--sk-fs-body` (16px) | Match — no value change |
| `--sk-text-lg` | `--sk-fs-lead`/`--sk-fs-h4` (18px) | Match — no value change |
| `--sk-text-xl`–`--sk-text-3xl` | (no direct reference name) | Retained — extended scale |

### Typography — weights

| ADR-003 token | Reference name | Status |
|---|---|---|
| `--sk-weight-normal` | `--sk-fw-regular` (400) | Match |
| `--sk-weight-medium` | `--sk-fw-medium` (500) | Match |
| `--sk-weight-semibold` | `--sk-fw-semibold` (600) | **Added** (was missing) |
| `--sk-weight-bold` | `--sk-fw-bold` (700) | Match |
| `--sk-weight-extrabold` | `--sk-fw-black` (800) | Match (reference calls it "black") |

### Spacing

No values changed. The ADR-003 rem-based 12-step scale is retained. The reference uses a
9-step pixel scale; the step offsets noted in the bootstrap addendum are an intentional
schema difference, not a bug.

| Decision | Outcome |
|---|---|
| rem vs px | rem retained — user-scaling accessibility preferred |
| Step count | 12-step scale retained — reference 9-step is a subset |

### Radius

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-radius-sm` | `--sk-radius-sm` | `8px` → `0.5rem` | Match (rem equivalent) |
| `--sk-radius-md` | `--sk-radius-md` | `12px` → `0.75rem` | **Updated** (was `1rem`) |
| `--sk-radius-lg` | `--sk-radius-lg` | `16px` → `1rem` | **Updated** (was `1.5rem`) |
| `--sk-radius-xl` | `--sk-radius-xl` | `20px` → `1.25rem` | **Added** (was missing) |
| `--sk-radius-pill` | `--sk-radius-pill` | `999px` | Match — no change |

### Shadows

| ADR-003 token | Reference name | Status |
|---|---|---|
| `--sk-shadow-card` | `--sk-shadow-card` | **Updated** to match reference (was simplified) |
| `--sk-shadow-elev` | `--sk-shadow-elev` | **Added** (was missing) |
| `--sk-shadow-glow-primary` | `--sk-shadow-glow-yellow` | **Updated** to match reference value |
| `--sk-shadow-focus` | `--sk-shadow-focus` | **Added** (was missing) |

### Motion

| ADR-003 token | Reference name | Reference value | Status |
|---|---|---|---|
| `--sk-motion-duration-fast` | `--sk-dur-fast` | `120ms` | Match — no change |
| `--sk-motion-duration-base` | `--sk-dur-base` | `200ms` | Match — no change |
| `--sk-motion-duration-slow` | `--sk-dur-slow` | `320ms` | **Added** (was missing) |
| `--sk-motion-ease-out` | `--sk-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **Updated** (was `cubic-bezier(0.16, 1, 0.3, 1)`) |
| `--sk-motion-ease-in-out` | `--sk-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | **Added** (was missing) |

---

## Intentional exclusions

The following reference tokens were intentionally excluded from `tokens.css`:

| Reference token | Reason for exclusion |
|---|---|
| `@font-face` declarations | Belongs in WP02 (Font Loading) — not in the token layer |
| `.sk-h1`, `.sk-body`, etc. utility classes | Component-layer CSS — not design tokens |
| `--sk-fs-*` (font-size scale) | Covered by `--sk-text-*` in ADR-003 schema |
| `--sk-lh-*` (line-height) | Not yet added to token catalogue; scoped for a future WP |
| `--sk-tracking-eyebrow` | Not yet added; scoped for a future WP |
| `--sk-fg` / `--sk-bg` / `--sk-surface` / `--sk-surface-elev` (semantic aliases in reference) | The ADR-003 schema uses the semantic names directly (`--sk-fg-default`, etc.) rather than aliases pointing to numbered scale |
| `--sk-link` | Component-scoped semantic alias; not a primitive token |

---

## Final canonical values

The complete `:root` token set is in `packages/tokens/src/tokens.css` (9568 bytes).
The generated catalogue is in `packages/tokens/dist/token-catalogue.json` (93 tokens, 13 categories).
