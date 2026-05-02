---
affected_files: []
cycle_number: 3
mission_slug: design-system-reference-migration-01KQJNTP
reproduction_command:
reviewed_at: '2026-05-02T06:35:16Z'
reviewer_agent: unknown
verdict: rejected
wp_id: WP07
---

## WP07 Review — Cycle 1

**Reviewer:** Reviewer Renata  
**Date:** 2026-05-01  
**Status:** Changes requested

---

### Issue 1 — Stylelint `selector-class-pattern` failures (BLOCKER)

**Files affected:**
- `packages/html-js/src/feature-card/sk-feature-card.css` (6 errors)
- `packages/html-js/src/ribbon-card/sk-ribbon-card.css` (11 errors)

**Symptom:**

Running `npx stylelint --config stylelint.config.mjs 'packages/html-js/src/feature-card/*.css' 'packages/html-js/src/ribbon-card/*.css'` produces 17 `selector-class-pattern` errors. Every class with a BEM element suffix fails, for example:

```
.sk-feature-card__icon-chip  ✖ does not match pattern
.sk-feature-card__title      ✖ does not match pattern
.sk-ribbon-card__ribbon      ✖ does not match pattern
.sk-ribbon-card__content     ✖ does not match pattern
```

**Root cause:**

The `selector-class-pattern` regex in `stylelint.config.mjs` is:

```
^sk-[a-z][a-z0-9]*(__[a-z][a-z0-9]*)?(-{1,2}[a-z][a-z0-9]*)*$
```

This pattern only allows a **single-word** block segment after `sk-`. For multi-word block names (e.g. `sk-feature-card`, `sk-ribbon-card`), the regex consumes only the first word (`feature` / `ribbon`) and parses the remaining part as a modifier word (`-card`). After that, the optional element group `(__[a-z][a-z0-9]*)` has already been skipped, so `__icon-chip`, `__title`, `__ribbon`, etc. do not match.

**Context:** This is a pre-existing systemic bug that also affects WP04 (`sk-check-bullet__icon`), WP05 (`sk-nav-pill__item`), and WP06 (`sk-section-banner__dot`) components. The fix is needed at the config level and/or in the component CSS.

**Required fix:**

Two options — implement whichever is agreed on and document the choice:

**Option A — Fix the stylelint config** (preferred, fixes all components):

Update `stylelint.config.mjs` to use a pattern that handles multi-word block names:

```js
'selector-class-pattern': '^sk-[a-z][a-z0-9-]*(__[a-z][a-z0-9-]*)?(--[a-z][a-z0-9-]*)*$',
```

This allows hyphens within the block, element, and modifier segments while still requiring the `sk-` prefix and BEM double-underscore / double-hyphen separators.

**Option B — Rename element classes to single-word names** (in WP07 CSS only):

Rename BEM element classes to avoid hyphens in the element segment:
- `sk-feature-card__icon-chip` → `sk-feature-card__iconchip` (or `__chip`)
- `sk-ribbon-card__ribbon` → already single-word, should pass if block is parsed differently
- `sk-ribbon-card__content` → single-word, same issue

Note: Option B does not fix the systemic issue in other WPs and requires coordinated HTML/Angular template changes.

---

### Issue 2 — RibbonCard ribbon is not diagonal (SPEC DEVIATION)

**Files affected:**
- `packages/html-js/src/ribbon-card/sk-ribbon-card.css`
- `packages/html-js/src/ribbon-card/sk-ribbon-card.html`
- `packages/angular/src/lib/ribbon-card/sk-ribbon-card.css`

**Symptom:**

The review check `grep "position: absolute\|transform: rotate" packages/html-js/src/ribbon-card/sk-ribbon-card.css` returns only `position: absolute` — there is no `transform: rotate` anywhere in the CSS. The ribbon is implemented as a vertical tab that drops from the top edge of the card, not as a 45° diagonal banner.

**Spec requirement (T033):**

The WP07 spec explicitly provides this CSS:

```css
.sk-ribbon-card__ribbon {
  position: absolute;
  top: 16px; right: -30px;
  width: 120px;
  transform: rotate(45deg);
  /* ... */
}
```

And the reviewer guidance states: "Check the RibbonCard ribbon is positioned at a 45° angle overlapping the top-right corner."

**Acknowledged ambiguity:**

The reference HTML file (`component-ribbon-card.html`) implements the ribbon as a vertical top-edge tab (no rotation), which the implementer followed. This creates a genuine ambiguity between the prose spec and the reference. However, since the WP spec text and CSS snippet are authoritative and the reviewer check explicitly greps for `transform: rotate`, the diagonal implementation is required.

**Required fix:**

Implement the diagonal ribbon as specified in T033:

```css
.sk-ribbon-card {
  position: relative;
  overflow: hidden; /* required to clip the rotated ribbon */
}

.sk-ribbon-card__ribbon {
  position: absolute;
  top: 16px;
  right: -30px;
  width: 120px;
  padding: var(--sk-space-1) 0;
  background: var(--sk-color-yellow);
  color: var(--sk-fg-on-primary);
  font-family: var(--sk-font-mono);
  font-size: var(--sk-text-xs);
  font-weight: var(--sk-weight-bold);
  text-align: center;
  transform: rotate(45deg);
  letter-spacing: 0.05em;
}
```

Note: `overflow: hidden` on the card container is needed to clip the rotated ribbon to the card boundary. The current implementation uses `overflow: visible` which is correct for the tab design but incorrect for the diagonal design.

If the vertical-tab design is intentionally preferred over the diagonal design (because it matches the reference HTML more closely), this must be explicitly documented as a spec deviation and approved by the WP owner before the review can pass.

---

### What Passed

- All four component directories exist with the required files.
- FeatureCard icon chip classes (`__icon-chip--yellow`, `--green`, `--purple`) are present with correct tint backgrounds.
- All CSS values use `--sk-*` tokens exclusively (no raw hardcoded values outside of documented deviations).
- The `rgba()` tint deviation for icon-chip backgrounds is properly documented in the CSS comment per C-103 accepted deviation.
- Yellow token (`var(--sk-color-yellow)`) is used for the ribbon.
- Angular components are present with `.css`, `.html`, `.spec.ts`, and `.stories.ts` files.
- Exports and stories are in place.

---

### Action Required

1. Resolve the `selector-class-pattern` stylelint failures (Issue 1) — agree on Option A or B and implement.
2. Implement the diagonal ribbon with `transform: rotate(45deg)` (Issue 2), or document and get explicit approval for the vertical-tab deviation.
3. Resubmit for review once both issues are resolved.
