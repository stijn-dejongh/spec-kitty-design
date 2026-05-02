---
affected_files: []
cycle_number: 3
mission_slug: design-system-reference-migration-01KQJNTP
reproduction_command:
reviewed_at: '2026-05-02T06:33:55Z'
reviewer_agent: unknown
verdict: rejected
wp_id: WP05
---

# WP05 Review — Cycle 1

**Reviewer:** Reviewer Renata (claude:claude-sonnet-4-6:reviewer-renata)
**Date:** 2026-05-01
**Verdict:** CHANGES REQUESTED

---

## Summary

Most of WP05 is in good shape: all four component directories are present, both index files export the new components, aria accessibility attributes (`aria-current="page"` and `aria-label`) are correctly applied in both HTML and Angular nav-pill templates, and pill-tag / eyebrow-pill CSS uses only `--sk-*` design tokens with no hardcoded values. Stylelint on `packages/html-js/src/pill-tag/` passes without errors.

However, **Stylelint fails on `packages/html-js/src/nav-pill/sk-nav-pill.css`** with 10 `selector-class-pattern` errors, which is a blocking quality gate.

---

## Issue 1 — Stylelint `selector-class-pattern` failures in `sk-nav-pill.css` (BLOCKING)

**Command that fails:**
```
npx stylelint --config stylelint.config.mjs 'packages/html-js/src/nav-pill/*.css'
```

**Errors (10 total):**
```
15:1  ✖  .sk-nav-pill__items   — does not match pattern
21:1  ✖  .sk-nav-pill__item    — does not match pattern
37:1  ✖  .sk-nav-pill__item    — does not match pattern (hover pseudo)
42:1  ✖  .sk-nav-pill__item--active  — does not match pattern
49:1  ✖  .sk-nav-pill__item--active  — does not match pattern (hover pseudo)
53:1  ✖  .sk-nav-pill__item    — does not match pattern (focus-visible pseudo)
58:1  ✖  .sk-nav-pill__cta     — does not match pattern
62:1  ✖  .sk-nav-pill__cta-btn — does not match pattern
80:1  ✖  .sk-nav-pill__cta-btn — does not match pattern (hover pseudo)
84:1  ✖  .sk-nav-pill__cta-btn — does not match pattern (focus-visible pseudo)
```

**Root cause:** The configured pattern is:
```
^sk-[a-z][a-z0-9]*(__[a-z][a-z0-9]*)?(-{1,2}[a-z][a-z0-9]*)*$
```

This pattern allows only **one** optional BEM element segment (`__` followed by a single lowercase-alphanumeric run). It does **not** allow hyphens inside the element segment or multi-word element names. The classes `__items`, `__item`, `__cta`, and `__cta-btn` all contain more than one lowercase-alphanumeric segment (and `__cta-btn` contains a hyphen in the element part), causing all of them to fail.

**How to fix (choose one approach):**

**Option A — Rename the offending classes to comply with the current pattern.** The current pattern permits single-word BEM elements only:
- `.sk-nav-pill__items` → `.sk-nav-pillitems` is awkward; a better fit under this pattern would be to flatten: e.g., `.sk-nav-pill__nav` (single word element)
- `.sk-nav-pill__item` → `.sk-nav-pill__link` or `.sk-navpill__item` won't work either — safest single-word elements: `__nav`, `__link`, `__cta`, `__btn`
- `.sk-nav-pill__cta-btn` → `.sk-nav-pill__ctabtn` (collapse hyphen) or `.sk-nav-pill__btn`

Rename consistently in both `sk-nav-pill.css` and `sk-nav-pill.html` (html-js) and in `packages/angular/src/lib/nav-pill/sk-nav-pill.html` and its accompanying `sk-nav-pill.css`.

**Option B — Update the stylelint pattern to allow BEM element segments with hyphens** (if this is an intentional design decision for multi-word elements). The pattern would become:
```
^sk-[a-z][a-z0-9-]*(__[a-z][a-z0-9-]*)?(-{1,2}[a-z][a-z0-9-]*)*$
```
This change must be made in `stylelint.config.mjs` and agreed upon at project level, since it affects all components. It should only be chosen if multi-word BEM element names are intentional project convention.

**Recommendation:** Option A is the safer change (no project-wide config modification). If the project intends to use multi-word BEM elements consistently (e.g. `__cta-btn`), Option B is appropriate but requires a separate configuration PR/decision.

---

## Checks That Passed

| Check | Result |
|---|---|
| All four component directories present | PASS |
| `packages/html-js/src/pill-tag/*.css` stylelint | PASS |
| `aria-current` on active nav item (HTML + Angular) | PASS |
| `aria-label` on `<nav>` element (HTML + Angular) | PASS |
| PillTag + EyebrowPill CSS uses only `--sk-*` tokens | PASS |
| Exports in `packages/html-js/src/index.ts` | PASS |
| Exports in `packages/angular/src/index.ts` | PASS |

---

## Action Required

Fix the `selector-class-pattern` violations in `packages/html-js/src/nav-pill/sk-nav-pill.css` (and update all corresponding HTML templates to keep class names consistent), then re-submit for review.
