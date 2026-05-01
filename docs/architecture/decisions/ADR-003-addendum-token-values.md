# ADR-003 addendum: Token value reconciliation results

**Date**: [To be completed — required before WP-TOKEN-001 starts]
**Status**: Pending (pre-implementation gate, FR-034)
**Requires**: Audit of `tmp/Spec Kitty Design System(1)/colors_and_type.css` against live `spec-kitty.ai` CSS

---

## Purpose

This addendum records the results of the token value reconciliation required by
ADR-003 before `packages/tokens/src/tokens.css` is authorised for production.

**WP-TOKEN-001 must not start until this document is complete.**

The current `packages/tokens/src/tokens.css` was bootstrapped from the Claude Design
reference file (`tmp/Spec Kitty Design System(1)/colors_and_type.css`) as a starting
point. The values have not yet been formally reconciled against the live `spec-kitty.ai`
marketing site CSS. This reconciliation is required by FR-034.

---

## Reconciliation checklist

- [ ] Audit `tmp/Spec Kitty Design System(1)/colors_and_type.css` (Claude Design reference)
- [ ] Extract current `:root` custom properties from live `spec-kitty.ai` using browser DevTools
- [ ] Compare category by category: color, surface, foreground, border, typography, spacing, radius, shadow, motion
- [ ] Record discrepancies in the table below
- [ ] Select the authoritative value for each discrepancy
- [ ] Update this document with final resolved values
- [ ] Confirm the completed catalogue is checked in to `packages/tokens/dist/token-catalogue.json`
- [ ] Confirm the Stylelint allowlist reflects the final canonical token list

---

## Naming schema note

The Claude Design reference uses a flat namespace (`--sk-yellow`, `--sk-bg-2`, `--sk-fs-body`,
`--sk-dur-fast`). ADR-003 adopted a category-prefixed schema (`--sk-color-yellow`,
`--sk-surface-page`, `--sk-text-base`, `--sk-motion-duration-fast`). The implemented
`tokens.css` uses the ADR-003 schema, not the reference file's naming.

Any reconciliation work must map reference values to ADR-003 names, not copy reference
names verbatim.

---

## Sample value comparison (partial — bootstrap only)

The table below compares a sample of the values currently in
`packages/tokens/src/tokens.css` against the corresponding entries in the
Claude Design reference. This is not a complete audit.

### Brand colors

| ADR-003 token name | Implemented value | Claude Design reference name | Reference value | Match |
|---|---|---|---|---|
| `--sk-color-yellow` | `#F5C518` | `--sk-yellow` | `#F5C518` | Yes |
| `--sk-color-haygold` | `#D9B36A` | `--sk-haygold` | `#D9B36A` | Yes |
| `--sk-color-blue` | `#A9C7E8` | `--sk-blue` | `#A9C7E8` | Yes |
| `--sk-color-purple` | `#B8A9E0` | `--sk-purple` | `#B8A9E0` | Yes |
| `--sk-color-green` | `#8FCB8F` | `--sk-green` | `#8FCB8F` | Yes |
| `--sk-color-red` | `#E97373` | `--sk-red` | `#E97373` | Yes |

### Surfaces

| ADR-003 token name | Implemented value | Claude Design reference name | Reference value | Match |
|---|---|---|---|---|
| `--sk-surface-page` | `#0A0A0B` | `--sk-bg-0` | `#0D0E11` | **No — delta** |
| `--sk-surface-card` | `#161619` | `--sk-bg-2` | `#181A1F` | **No — delta** |
| `--sk-surface-input` | `#1C1C20` | `--sk-bg-3` | `#1C1F25` | **No — delta** |

### Foreground

| ADR-003 token name | Implemented value | Claude Design reference name | Reference value | Match |
|---|---|---|---|---|
| `--sk-fg-default` | `rgba(255,255,255,0.91)` | `--sk-fg-1` | `#D6D6DA` | **No — format differs** |
| `--sk-fg-muted` | `rgba(255,255,255,0.55)` | `--sk-fg-2` | `#A9A9B0` | **No — format differs** |
| `--sk-fg-on-primary` | `#0A0A0B` | `--sk-accent-fg` | `#1A1408` | **No — delta** |
| `--sk-fg-on-card` | `rgba(255,255,255,0.91)` | `--sk-fg-1` | `#D6D6DA` | **No — format differs** |

### Borders

| ADR-003 token name | Implemented value | Claude Design reference name | Reference value | Match |
|---|---|---|---|---|
| `--sk-border-default` | `#26262C` | `--sk-border` | `#2B313B` | **No — delta** |
| `--sk-border-strong` | `#3a3a42` | `--sk-border-strong` | `#353C48` | **No — delta** |
| `--sk-border-focus` | `#F5C518` | `--sk-border-focus` | `var(--sk-yellow)` = `#F5C518` | Yes |

### Spacing

| ADR-003 token name | Implemented value | Claude Design reference | Reference value | Match |
|---|---|---|---|---|
| `--sk-space-1` | `0.25rem` (4px) | `--sk-space-1` | `4px` | Yes (unit differs) |
| `--sk-space-4` | `1rem` (16px) | `--sk-space-4` | `16px` | Yes (unit differs) |
| `--sk-space-7` | `2rem` (32px) | `--sk-space-6` | `32px` | **No — step offset** |
| `--sk-space-9` | `3rem` (48px) | `--sk-space-7` | `48px` | **No — step offset** |

Note: the reference defines a 9-step spacing scale (1–9) with pixel values.
The implemented tokens use a 12-step rem-based scale. The step numbering does
not align 1:1 after step 6.

### Radius

| ADR-003 token name | Implemented value | Claude Design reference name | Reference value | Match |
|---|---|---|---|---|
| `--sk-radius-sm` | `0.5rem` (8px) | `--sk-radius-sm` | `8px` | Yes |
| `--sk-radius-md` | `1rem` (16px) | `--sk-radius-md` | `12px` | **No — delta** |
| `--sk-radius-lg` | `1.5rem` (24px) | `--sk-radius-lg` | `16px` | **No — delta** |
| `--sk-radius-pill` | `999px` | `--sk-radius-pill` | `999px` | Yes |

### Motion

| ADR-003 token name | Implemented value | Claude Design reference name | Reference value | Match |
|---|---|---|---|---|
| `--sk-motion-duration-fast` | `120ms` | `--sk-dur-fast` | `120ms` | Yes |
| `--sk-motion-duration-base` | `200ms` | `--sk-dur-base` | `200ms` | Yes |
| `--sk-motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | `--sk-ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **No — delta** |

---

## Discrepancies requiring resolution

The following categories of discrepancy were found in the bootstrap sample above.
Each must be resolved with an explicit decision before the token package ships.

| Category | Discrepancy type | Count | Resolution required |
|---|---|---|---|
| Surfaces | Value delta (dark hex differs) | 3 | Choose reference or live site value |
| Foreground | Format difference (rgba vs hex) | 2 | Decide color format — see open question below |
| Foreground | Value delta (on-primary ink) | 1 | Verify against live button rendering |
| Borders | Value delta (all three tokens) | 2 | Choose reference or live site value |
| Spacing | Step-offset after scale-6 | Multiple | Decide whether to align step numbering |
| Radius | Value delta at md and lg | 2 | Choose reference or live site value |
| Motion | Easing function differs | 1 | Verify intended feel against reference |

---

## Open questions

1. **OKLCH vs hex**: The reference file and current implementation both use sRGB hex. Should the
   canonical format be hex, `rgba()`, or OKLCH for future color tokens? See
   `docs/architecture/quality-attribute-assessment.md` open questions.

2. **Rem vs px for spacing and radius**: The current implementation uses `rem`-based values;
   the reference uses `px`. Rem is preferred for user-scaling accessibility. Confirm this
   decision before locking the scale.

3. **Coverage gaps**: The reference defines tint surfaces (`--sk-tint-mint`, `--sk-tint-butter`,
   `--sk-tint-lilac`, `--sk-tint-sky`) and their on-tint foreground pairs. These are not yet
   in `packages/tokens/src/tokens.css`. Confirm scope before the first minor release.

---

## Final canonical values

[Paste the complete `:root` block here once reconciliation is complete]
