# WP04 Review Cycle 1 — Changes Requested

**Reviewer:** Reviewer Renata (claude-sonnet-4-6)
**Date:** 2026-05-01

---

## Summary

The Storybook 10.x setup is well-structured. The deviation from 8.x is accepted per ADR-006 (Angular 21 incompatibility). The `main.ts`, `preview.ts`, both stub stories, the Getting Started MDX page, and `project.json` all meet the spec. The Storybook build itself (`npx nx run storybook:storybook:build`) exits 0 in well under 3 minutes (NFR-003 met).

However, **one blocking defect** was found: the `html-js` package's production TypeScript build now fails due to the stories file being picked up by the lib compiler.

---

## Issue 1 (BLOCKER): `html-js:build` fails — stories file is included in lib compilation

**Command that fails:**
```
npx nx run-many --target=build --projects=tokens,angular,html-js
```

**Error:**
```
packages/html-js/src/stub/sk-stub-html.stories.ts:1:37 - error TS2307:
Cannot find module '@storybook/html' or its corresponding type declarations.
```

**Root cause:**  
`packages/html-js/tsconfig.lib.json` includes `src/**/*.ts` but does not exclude `*.stories.ts` files. The workspace-level `tsconfig.base.json` uses `moduleResolution: "node"` which cannot resolve `@storybook/html`'s type exports under the current Node16/Bundler-only resolution that Storybook 10 requires. The `html-js` build uses plain `tsc` (not `ng-packagr`), so it processes the stories file directly and fails.

The Angular package passes because `ng-packagr` handles the stories file differently (it is not included in the Angular entrypoint compilation path).

**Fix:**  
Add `src/**/*.stories.ts` to the `exclude` list in `packages/html-js/tsconfig.lib.json`:

```json
{
  "exclude": [
    "src/**/*.spec.ts",
    "src/**/*.test.ts",
    "src/**/*.stories.ts"
  ]
}
```

This is safe — the stories file is already picked up by the Storybook config glob `../../../packages/**/*.stories.@(ts|tsx)` in `apps/storybook/.storybook/main.ts`, which runs under Storybook's own bundler with correct module resolution. Excluding it from the lib tsconfig only prevents it from being compiled into the distributable package (which is the correct behaviour for story files).

**Verification after fix:**  
```bash
npx nx run-many --target=build --projects=tokens,angular,html-js
# All 3 must exit 0

npx nx run storybook:storybook:build
# Must still exit 0 (stories must still render)
```

---

## Passing checks (for the record)

| Check | Result |
|---|---|
| `apps/storybook/.storybook/main.ts` — correct story globs + a11y addon | PASS |
| `apps/storybook/.storybook/preview.ts` — SK dark background + a11y config | PASS |
| Angular stub story `sk-stub.stories.ts` — Default, OnLightBackground, Mobile, Desktop | PASS |
| HTML stub story `sk-stub-html.stories.ts` — Default, Mobile, Desktop | PASS |
| Getting Started MDX page present and correctly structured | PASS |
| `apps/storybook/project.json` present with build target | PASS |
| Storybook build exits 0 (NFR-003) | PASS |
| Storybook 10.x deviation accepted (Angular 21 / ADR-006) | PASS |
| `tokens:build` passes | PASS |
| `angular:build` passes | PASS |
| `html-js:build` | **FAIL** (see Issue 1) |
