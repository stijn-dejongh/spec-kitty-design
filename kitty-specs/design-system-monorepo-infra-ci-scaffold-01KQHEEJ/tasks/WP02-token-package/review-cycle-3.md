---
affected_files: []
cycle_number: 3
mission_slug: design-system-monorepo-infra-ci-scaffold-01KQHEEJ
reproduction_command:
reviewed_at: '2026-05-01T18:24:01Z'
reviewer_agent: unknown
verdict: rejected
wp_id: WP02
---

# WP02 Review Cycle 1 — Reviewer: Renata

**Date:** 2026-05-01  
**Reviewer:** claude:claude-sonnet-4-6:reviewer-renata:reviewer  
**Verdict:** CHANGES REQUESTED

---

## Summary

The implementation delivers all structural artefacts (tokens.css, token-catalogue.json, stylelint.config.mjs update, README, project.json catalogue target) and passes all mechanical checks (file size, stylelint lint, catalogue generation). However, the token naming schema diverges significantly from ADR-003, which is the governance document for this work package. These deviations must be corrected before approval because downstream work packages (WP03 and beyond) will consume these token names, making a later rename a breaking change.

---

## Issues

### Issue 1 (BLOCKER): Surface token category uses `--sk-bg-*` instead of `--sk-surface-*`

**ADR-003 (2026-05-01-3-token-schema-naming-convention.md) explicitly states:**
> Surface backgrounds: `--sk-surface-*` — examples: `--sk-surface-default`, `--sk-surface-card`, `--sk-surface-input`

The implementation uses `--sk-bg-0` through `--sk-bg-3`, `--sk-bg-pill`, `--sk-bg-muted` instead of the ADR-003 mandated `--sk-surface-*` prefix. The review checklist also specifically tests for `--sk-surface-page`, which is absent.

**How to fix:** Rename the surface/background scale to use `--sk-surface-*` prefix per ADR-003. Suggested mapping:
- `--sk-bg-0` → `--sk-surface-page` (deepest page background)
- `--sk-bg-1` → `--sk-surface-section` (hero/section)
- `--sk-bg-2` → `--sk-surface-card`
- `--sk-bg-3` → `--sk-surface-input` (elevated/input fill)
- `--sk-bg-pill` → `--sk-surface-pill`
- `--sk-bg-muted` → `--sk-surface-muted`

The semantic aliases (`--sk-bg`, `--sk-surface`) should also be renamed or replaced with the canonical `--sk-surface-*` names.

---

### Issue 2 (BLOCKER): Foreground paired tokens use `--sk-fg-*` scale instead of `--sk-fg-on-*` pattern

**ADR-003 states the semantic pairing rule:**
> Pattern: `--sk-surface-<name>` is paired with `--sk-fg-on-<name>`.
> Example: `--sk-surface-card` background → text and icons use `--sk-fg-on-card`.

The tint companions correctly use `--sk-on-*` (e.g. `--sk-on-mint`, `--sk-on-butter`) but the primary surface-to-foreground pairing is implemented as a numeric scale (`--sk-fg-0` through `--sk-fg-4`) without explicit on-surface naming. The ADR-003 examples name `--sk-fg-default`, `--sk-fg-muted`, `--sk-fg-on-primary` — not a numeric scale.

**How to fix:** Align with ADR-003 naming. The numeric scale approach (`--sk-fg-0` to `--sk-fg-4`) is an implementation choice not present in the ADR. Either:
(a) Keep the numeric scale but record it as a deliberate extension in an ADR-003 addendum, or
(b) Map numeric scale to semantic names as specified: `--sk-fg-default`, `--sk-fg-muted`, `--sk-fg-on-primary`, `--sk-fg-on-card`.

---

### Issue 3 (BLOCKER): Typography categories diverge from ADR-003 naming

**ADR-003 specifies:**
- Font size: `--sk-text-*` (e.g. `--sk-text-xs`, `--sk-text-sm`, `--sk-text-base`, `--sk-text-lg`)
- Font weight: `--sk-weight-*` (e.g. `--sk-weight-normal`, `--sk-weight-medium`, `--sk-weight-bold`)
- Motion: `--sk-motion-*` (e.g. `--sk-motion-duration-fast`, `--sk-motion-ease-out`)

The implementation uses `--sk-fs-*` (font size), `--sk-fw-*` (font weight), `--sk-dur-*` / `--sk-ease-*` (motion), and `--sk-lh-*` (line height — not specified in ADR-003 at all).

**How to fix:** Rename categories to match ADR-003:
- `--sk-fs-*` → `--sk-text-*`
- `--sk-fw-*` → `--sk-weight-*`
- `--sk-dur-*` and `--sk-ease-*` → `--sk-motion-duration-*` and `--sk-motion-ease-*`
- For `--sk-lh-*` (line heights), add to ADR-003 addendum as a new category or prefix as `--sk-leading-*` — whichever the implementer prefers, document it.

---

### Issue 4 (MINOR): Single-segment tokens violate `--sk-<category>-<name>` schema

The following tokens in `tokens.css` have no second name segment, violating the `--sk-<category>-<name>` pattern:
- `--sk-border` (should be `--sk-border-default`)
- `--sk-fg` (semantic alias — should follow ADR-003 naming or be documented)
- `--sk-bg` (semantic alias — see Issue 1)
- `--sk-surface` (should be a proper surface token per Issue 1)
- `--sk-accent` (should be `--sk-color-accent` or `--sk-accent-default`)
- `--sk-link` (should be `--sk-color-link` or `--sk-fg-link`)

**How to fix:** Give all single-segment tokens a second name segment, or explicitly document them as semantic shorthand aliases in the ADR-003 addendum with rationale.

---

### Issue 5 (MINOR): `ADR-003-addendum-token-values.md` referenced but absent

The `tokens.css` header references `docs/architecture/decisions/ADR-003-addendum-token-values.md` as the authoritative value source. This file does not exist in the repository. The WP spec states this addendum is a **pre-condition** for WP02:
> Pre-condition: ADR-003 value reconciliation (FR-034) must be complete before this WP starts. The maintainer has audited `tmp/colors_and_type.css` against the live `spec-kitty.ai` CSS and recorded resolved values in `docs/architecture/decisions/ADR-003-addendum-token-values.md`.

This is likely a responsibility of the maintainer, not the implementer — however the file is absent, which means either:
(a) The implementer should create a stub addendum recording the values actually used, or
(b) The pre-condition was not met (blocker from outside this WP).

**How to fix:** Create `docs/architecture/decisions/ADR-003-addendum-token-values.md` with at minimum a list of the resolved token values and a note on the reconciliation outcome.

---

## What Passed

- File size: 9267 bytes (well under the 20480-byte NFR-004 limit)
- `npx stylelint --config stylelint.config.mjs packages/tokens/src/tokens.css` passes cleanly
- `packages/tokens/dist/token-catalogue.json` is present and correctly structured with schema_version and categories
- `packages/tokens/README.md` is present with installation, CDN link, usage, token catalogue, and semantic pairing sections
- `packages/tokens/project.json` has the `catalogue` nx target correctly configured
- `scripts/generate-token-catalogue.js` is well-implemented with error handling
- `stylelint.config.mjs` has both BEM pattern (`selector-class-pattern`) and `scale-unlimited/declaration-strict-value` rules
- `packages/tokens/src/tokens.css` is correctly exempted from the strict-value lint rules
- All `--sk-*` token values use the correct two-segment (or longer) naming within their own categories
- Light mode overrides via `[data-theme="light"]` / `.sk-light` are a nice addition beyond the spec

---

## Required Before Re-Review

1. Fix Issues 1–3 (token naming alignment with ADR-003) — these are blockers because downstream WPs depend on token names
2. Address Issues 4–5 (single-segment tokens and missing addendum) — these are minor but should be resolved to keep governance clean
3. After renaming, regenerate `packages/tokens/dist/token-catalogue.json` by running `npx nx run tokens:catalogue`
4. Update `packages/tokens/README.md` token category table and semantic pairing table to reflect renamed tokens
