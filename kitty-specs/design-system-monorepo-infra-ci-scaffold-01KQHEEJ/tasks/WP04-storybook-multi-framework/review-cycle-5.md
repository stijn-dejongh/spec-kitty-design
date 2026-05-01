---
affected_files:
  - packages/html-js/tsconfig.lib.json
  - packages/angular/tsconfig.lib.json
cycle_number: 5
mission_slug: design-system-monorepo-infra-ci-scaffold-01KQHEEJ
reproduction_command: npx nx run-many --target=build --projects=tokens,angular,html-js && npx nx run storybook:storybook:build
reviewed_at: '2026-05-01T19:26:19Z'
reviewer_agent: claude:claude-sonnet-4-6:reviewer-renata:reviewer
verdict: approved
wp_id: WP04
---

# WP04 Review Cycle 2 — Approved

**Reviewer:** Reviewer Renata (claude-sonnet-4-6)
**Date:** 2026-05-01

---

## Summary

Cycle 2 fix verified. Both `packages/html-js/tsconfig.lib.json` and
`packages/angular/tsconfig.lib.json` now contain `"src/**/*.stories.ts"` in
their `exclude` arrays. All three checks pass:

| Check | Result |
|---|---|
| `grep "stories" packages/html-js/tsconfig.lib.json` — `*.stories.ts` in exclude | PASS |
| `grep "stories" packages/angular/tsconfig.lib.json` — `*.stories.ts` in exclude | PASS |
| `npx nx run-many --target=build --projects=tokens,angular,html-js` exits 0 | PASS |
| `npx nx run storybook:storybook:build` exits 0 in < 3 min (NFR-003) | PASS |

Stories are still picked up by Storybook's own bundler via the
`packages/**/*.stories.@(ts|tsx)` glob in `main.ts`; excluding them from the
lib tsconfigs only prevents them from being compiled into the distributable
packages, which is the correct behaviour.

All Definition of Done items from cycle 1 remain satisfied. WP04 is approved.
