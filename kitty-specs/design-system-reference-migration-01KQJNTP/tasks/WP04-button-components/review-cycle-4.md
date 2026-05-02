---
affected_files: []
cycle_number: 4
mission_slug: design-system-reference-migration-01KQJNTP
reproduction_command:
reviewed_at: '2026-05-02T06:33:01Z'
reviewer_agent: claude
verdict: rejected
wp_id: WP04
---

# WP04 Review Cycle 1 — Changes Requested

**Reviewer:** Reviewer Renata
**Date:** 2026-05-01

---

## Summary

WP04 button implementation is of high quality. All CSS uses design tokens exclusively (no
hardcoded colours), both primary and secondary variants are present with correct hover and
disabled states, and exports are wired up correctly in both `packages/html-js/src/index.ts`
and `packages/angular/src/index.ts`. The Angular components are minimal and correct.

**However, the `angular:build` gate fails**, which is a hard requirement for approval.

---

## Issue 1 — `angular:build` fails: `@angular/forms` missing from peer dependencies

**Severity:** Blocking

**Observed error (from `npx nx run-many --target=build --projects=angular,html-js`):**

```
error TS2307: Cannot find module '@angular/forms' or its corresponding type declarations.
  packages/angular/src/lib/form-field/sk-form-input.ts:2:57
  packages/angular/src/lib/form-field/sk-form-textarea.ts:2:57
```

**Root cause:** `packages/angular/package.json` declares only `@angular/core` as a peer
dependency. The form-field components (added in this lane) import `ControlValueAccessor` and
`NG_VALUE_ACCESSOR` from `@angular/forms`, which is not declared and therefore not resolved
by the TypeScript compiler during the Angular library build.

**Note:** The breaking files (`sk-form-input.ts`, `sk-form-textarea.ts`) are form-field
components, not WP04 button code. However, because this lane is shared and all components
compile together under `angular:build`, this breakage blocks WP04's build gate just the same.

**Fix required:** Add `@angular/forms` to `packages/angular/package.json` `peerDependencies`:

```json
{
  "peerDependencies": {
    "@angular/core": ">=21.0.0 <22.0.0",
    "@angular/forms": ">=21.0.0 <22.0.0",
    "@spec-kitty/tokens": "^1.0.0"
  }
}
```

After this change, re-run `npx nx run-many --target=build --projects=angular,html-js` and
confirm it exits 0 before resubmitting for review.

---

## Checks that passed

| Check | Result |
|---|---|
| Files present in both packages | PASS |
| No hardcoded colours (`#`, `rgb(`, `rgba(`) in CSS | PASS |
| `sk-btn--primary` and `sk-btn--secondary` variants exist | PASS |
| Disabled state (`.sk-btn:disabled`, `.sk-btn[disabled]`) | PASS |
| Hover with glow on primary (`--sk-shadow-glow-primary`) | PASS |
| Stylelint (token-only CSS, no hardcoded values) | PASS |
| Exports in `packages/angular/src/index.ts` | PASS |
| Exports in `packages/html-js/src/index.ts` | PASS |
| `angular:build` and `html-js:build` | **FAIL** |
