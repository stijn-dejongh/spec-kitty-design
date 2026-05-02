# Mission Review Report: post-review-remediation-and-demo-deploy-01KQM7XS

**Reviewer**: claude-sonnet-4-6 (mission-review skill)
**Date**: 2026-05-02
**Mission**: `post-review-remediation-and-demo-deploy-01KQM7XS` — Post-Review Remediation and Demo Deploy
**Mission squash-merge commit**: `d78382c8a0d39b5b8dab84884f791a55a9936af5`
**Pre-mission baseline (parent)**: `f357a1c27afd004aa8ccdd669b2b71bef097f74a`
**HEAD at review**: `6a43380` (one post-merge `docs(llm): …` commit + spec-kitty bookkeeping)
**Target branch**: `feature/post-review-remediation-and-demo-deploy`
**WPs reviewed**: WP01, WP02, WP03 (absorbed WP04), WP05, WP06, WP07
**Rejection cycles**: 0 across all WPs (clean event log; no `force: true`, no arbiter overrides)

---

## Gate Results

This is a frontend design-system repo, not the spec-kitty internal codebase that the
mission-review skill's hard-gate template was written for. The skill's gates 1–4 (contract
tests in `tests/contract/`, architectural tests in `tests/architectural/`, cross-repo e2e
in `spec-kitty-end-to-end-testing`, and `issue-matrix.md`) are **N/A** here — no such
artefacts exist in this repo. The closest equivalents are documented below; results were
captured during the post-merge LLM-facilitation work earlier today.

### Gate 1 — Contract tests
- N/A. No `tests/contract/` directory in this repo. The functional contract is encoded in
  Storybook stories (visual contract) and component CSS/JS modules. Closest equivalent
  is the visual-regression Playwright suite under `apps/storybook/src/tests/` — not run
  locally for this review.

### Gate 2 — Architectural tests
- Substituted by ESLint `@nx/enforce-module-boundaries` (ADR-002 boundary enforcement)
  + Stylelint `--sk-*` token-only enforcement.
- Command: `npm run quality:all`
- Exit code: 0 (eslint clean, stylelint clean, htmlhint reports 9 pre-existing
  Angular-template warnings tolerated by `|| true`; not introduced by this mission)
- Result: PASS

### Gate 3 — Cross-repo E2E
- N/A. No cross-repo dependency for this mission.

### Gate 4 — Issue Matrix
- N/A. No `issue-matrix.md` was authored. Mission instead used:
  - Per-WP `requirement_refs` frontmatter (FR coverage)
  - The `tasks.md` FR Coverage Map table
- Both are read in this review and used as the FR matrix below. No empty/`unknown`
  verdicts because the schema doesn't apply.

### Other quality signals captured
- `npx nx run tokens:build && npx nx run tokens:catalogue`: PASS
- `npx nx run storybook:storybook:build`: PASS (zero TS errors; satisfies NFR-002)
- `bash scripts/npm-audit-gate.sh`: PASS (no high/critical CVEs)
- `npm run security:lockfile-check`: PASS

---

## FR Coverage Matrix

| FR ID  | Description (brief)                                                  | WP Owner    | Evidence (file)                                          | Adequacy   | Finding   |
|--------|----------------------------------------------------------------------|-------------|----------------------------------------------------------|------------|-----------|
| FR-001 | Three `--sk-color-yellow-alpha-*` tokens in `tokens.css`              | WP01        | `packages/tokens/src/tokens.css` lines added             | ADEQUATE   | —         |
| FR-002 | `sk-nav-pill.css` hover rule uses tokens, not `rgba()` literals       | WP01        | `packages/html-js/src/nav-pill/sk-nav-pill.css`           | ADEQUATE   | —         |
| FR-003 | Drawer/hamburger CSS extracted to `sk-nav-pill-drawer.css`            | WP02        | new file 90 lines; `sk-nav-pill.css` zero drawer hits    | ADEQUATE   | —         |
| FR-004 | `CollapsedHamburger` story imports both CSS files + docs              | WP02        | `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts`   | ADEQUATE   | —         |
| FR-005 | `skToggleDrawer` exported with correct contract                       | WP03        | `packages/html-js/src/nav-pill/sk-nav-pill.js` lines 8–14 | ADEQUATE   | —         |
| FR-006 | Story uses `skToggleDrawer` as hamburger `onclick`                    | WP03        | story decorator wires `window.__skToggleDrawer`          | ADEQUATE   | —         |
| FR-007 | Both demo pages import `skToggleDrawer` from the module               | WP03        | `dashboard-demo.html` ✓; `blog-demo.html` vacuous (no drawer) | ADEQUATE | —         |
| **FR-008** | **Done-lane header uses tokens, replacing `opacity: 0.6` cascade** | **WP03** (absorbed from WP04) | **NOT DELIVERED — see DRIFT-1**           | **MISSING** | **DRIFT-1** |
| FR-009 | `storybook-deploy.yml` copies demos with rewritten asset paths        | WP07        | `.github/workflows/storybook-deploy.yml` lines 41–69     | ADEQUATE   | —         |
| FR-010 | Storybook intro page links to demos                                  | WP07        | `apps/storybook/src/stories/getting-started.mdx` line 61–69 | ADEQUATE | —         |
| FR-011 | All 10 non-stub html-js stories export `LightMode`                    | WP05        | grep across `packages/html-js/src/*/sk-*.stories.ts`     | ADEQUATE   | —         |
| FR-012 | All 6 non-stub Angular stories export `LightMode`                     | WP06        | grep across `packages/angular/src/lib/*/sk-*.stories.ts` | ADEQUATE   | —         |
| **FR-013** | **`blog-demo.html` `[data-theme="light"]` header → `--sk-surface-card`** | **WP03** (absorbed from WP04) | **NOT DELIVERED — see DRIFT-2** | **MISSING** | **DRIFT-2** |
| FR-014 | README rewritten with vision, usage, live links                       | WP07        | `README.md` 114 lines                                    | ADEQUATE   | —         |

**Legend**: ADEQUATE = code in the merge satisfies the FR; PARTIAL = test exists but uses
synthetic fixture; MISSING = no implementation found despite the FR being mapped to a WP
in `requirement_refs` and `tasks.md`.

**Coverage**: 12/14 FRs delivered. **2 FR delivery gaps** (FR-008, FR-013) — both
critical because they were explicitly accepted in `requirement_refs` and marked
done in `tasks.md` (T012, T013, T014 all carry the `[x]` marker).

---

## Drift Findings

### DRIFT-1: FR-008 not delivered — Done-lane header opacity cascade still present

**Type**: PUNTED-FR (passed acceptance gates without implementation)
**Severity**: HIGH
**Spec reference**: FR-008
**Evidence**:
- Spec `spec.md` line 71: "The Done-lane header in `apps/demo/dashboard-demo.html`
  must apply `color: var(--sk-fg-muted)` and `background: var(--sk-surface-card)`
  directly to the header element and its dot, replacing the `opacity: 0.6` /
  `opacity: 1` cascade."
- WP03 `requirement_refs:` frontmatter explicitly lists `FR-008`.
- `tasks.md` lines 24–25 mark T012, T013 as `[x]` (done) under WP03.
- Current `apps/demo/dashboard-demo.html` lines 291–309:
  ```css
  /* Done: card surface at 60% opacity, muted dot */
  .dash-lane.is-done .dash-lane__header {
    background: var(--sk-surface-card);
    opacity: 0.6;                          ← NOT REMOVED
    color: var(--sk-fg-muted);
  }
  .dash-lane.is-done .dash-lane__title {
    color: var(--sk-fg-muted);
  }
  .dash-lane.is-done .dash-lane__count {
    background: var(--sk-surface-card);
    ...
    color: var(--sk-fg-muted);
    opacity: 1; /* ensure count stays visible inside faded Done header */ ← NOT REMOVED
  }
  ```
- Mission squash-merge `d78382c` for `apps/demo/dashboard-demo.html` shows ONLY
  the WP03 `skToggleDrawer` extraction; no opacity changes are present in the diff.

**Analysis**: The acceptance review of WP03 (which owned this FR after WP04 was
absorbed per WP03 frontmatter line 33: "Merged WP04 (demo CSS fixes) and absorbed
T006 story update from WP02 into this WP to resolve file ownership conflicts")
verified only the JS-module extraction subset of WP03 (T007–T011). The reviewer's
approval note quoted the JS-module work in detail and did not assert the
opacity-cascade replacement. Subtasks T012 and T013 were silently marked done.
Implementer's WP03 closing summary explicitly stated only T007–T011 were
implemented; T012–T014 were marked done as part of the subtask batch despite no
code changes. The reviewer did not catch this because the review prompt didn't
enumerate FR-008 as a separate check.

**User-visible impact**: The Done-lane header on the dashboard demo continues to
use the `opacity: 0.6` cascade. The original Renata code-quality audit flagged
this as DEF-06 (stale fragile pattern). The defect is not resolved on the live
deployment.

---

### DRIFT-2: FR-013 not delivered — blog-demo light-mode header surface unchanged

**Type**: PUNTED-FR (passed acceptance gates without implementation)
**Severity**: HIGH
**Spec reference**: FR-013
**Evidence**:
- Spec `spec.md` line 76: "The `[data-theme="light"] header` background in
  `apps/demo/blog-demo.html` must be changed from `var(--sk-surface-hero)` to
  `var(--sk-surface-card)` to align with the dashboard demo header surface."
- WP03 `requirement_refs:` frontmatter explicitly lists `FR-013`.
- `tasks.md` line 26 marks T014 as `[x]` (done) under WP03.
- WP03's `owned_files` includes `apps/demo/blog-demo.html`.
- `git show --stat d78382c -- apps/demo/blog-demo.html` returns **empty**.
  The mission squash-merge made zero changes to `apps/demo/blog-demo.html`.
- Current `apps/demo/blog-demo.html` lines 165–168:
  ```css
  [data-theme="light"] header,
  [data-theme="light"] .demo-hero-section,
  [data-theme="light"] .demo-posts-section {
    background: var(--sk-surface-hero);   ← STILL --sk-surface-hero, not --sk-surface-card
  }
  ```

**Analysis**: Same root cause as DRIFT-1. WP03 reviewer's approval note explicitly
said "blog-demo.html confirmed no-op" — but that statement was about FR-007 (the
inline `skToggleDrawer` definition, which blog-demo never had). The reviewer used
that vacuous-pass observation to justify zero changes to the file, but FR-013
required a separate token swap on the header surface that is unrelated to the
drawer module. Both implementer and reviewer collapsed two distinct FRs (FR-007
and FR-013) into a single "no-op" because both share the same file.

**User-visible impact**: The blog-demo light-mode header continues to use the
brighter `--sk-surface-hero` surface, while the dashboard-demo uses
`--sk-surface-card`. The user-reported visual inconsistency that motivated this
mission is not resolved.

---

### DRIFT-3: tasks.md WP-ownership table contradicts the per-WP bullet list

**Type**: DOCUMENTATION-DRIFT
**Severity**: MEDIUM (precondition for DRIFT-1/2 escaping review)
**Spec reference**: N/A (process artefact)
**Evidence**:
- `tasks.md` Subtask Index table (lines 24–26) attributes T012, T013, T014 to **WP04**.
- `tasks.md` Phase 2 bullet list (lines 113–115) attributes the same subtasks to **WP03**.
- WP04 is otherwise absent from the document (no Phase, no prompt file in
  `tasks/`); the WP03 frontmatter line 33 confirms WP04 was absorbed into WP03.
- Three subtasks are marked `[x]` (complete) under WP03 (lines 113–115) despite
  zero corresponding code changes in the squash-merge.

**Analysis**: The merge-of-WP4-into-WP3 was a structural change made during task
finalization. The Subtask Index table at the top of `tasks.md` was not updated;
the WP03 bullet list was. This left two contradictory representations of
ownership in the same document. The implementer who claimed WP03 read the bullet
list (which correctly listed all 8 subtasks under WP03) but only delivered T007–T011.
The `[x]` marks on T012–T014 came from a `mark-status T012 T013 T014 --status done`
batch command issued without verifying the underlying work — and the reviewer
relied on those marks as part of approval signal.

**User-visible impact**: None directly; this finding is the procedural enabler
for DRIFT-1 and DRIFT-2.

---

## Risk Findings

### RISK-1: Cross-WP integration gap — dashboard-demo hamburger and drawer unstyled on live deployment

**Type**: CROSS-WP-INTEGRATION (NFR-005 violation)
**Severity**: HIGH
**Location**: `apps/demo/dashboard-demo.html:32` (the `<link>` tag)
**Trigger condition**: A user opens
`https://stijn-dejongh.github.io/spec-kitty-design/dashboard-demo.html` and looks
at the hamburger button or opens the drawer.

**Analysis**:

WP02 (FR-003) extracted all hamburger button styles, drawer panel styles,
`--has-drawer` modifier, `--responsive` modifier, and the 720px media query out
of `sk-nav-pill.css` and into a new `sk-nav-pill-drawer.css`. The split is
correct in isolation. WP02's reviewer verified:
- `sk-nav-pill.css` has zero drawer/hamburger references (✓)
- `sk-nav-pill-drawer.css` exists with the extracted block (✓)
- `CollapsedHamburger` Storybook story imports both files (✓ FR-004)

Neither the spec, the plan, nor any WP review cross-checked the *demo pages*
that load `sk-nav-pill.css` directly. `apps/demo/dashboard-demo.html` line 32
loads only `sk-nav-pill.css` (it has not been updated to also load
`sk-nav-pill-drawer.css`), but the same file at lines 521 and 555 uses
`sk-nav-pill__hamburger` (button) and `sk-nav-pill__drawer` (panel) classes.

After the FR-003 split, those two classes have **no rules in any CSS file the
demo loads.** The hamburger button renders unstyled (no padding, no border,
no hover/focus states); the drawer panel renders without its slide-down
transition or background.

The deploy workflow's per-component copy step (`storybook-deploy.yml` lines
93–101) does upload `sk-nav-pill-drawer.css` to the deploy artifact at
`./nav-pill/sk-nav-pill-drawer.css`. The fix is a one-line `<link>` addition
to `dashboard-demo.html`. The fix is NOT in scope for this review (per Key
Rule #1).

**Storybook is unaffected**: the `CollapsedHamburger` story imports both CSS
files via FR-004, so the Storybook view of the nav-pill renders correctly.
The defect is isolated to the demo page deployment.

**blog-demo.html is unaffected**: it uses only the horizontal nav-pill, no
hamburger or drawer markup (verified by grep — zero hits for
`sk-nav-pill__hamburger` / `sk-nav-pill__drawer` / `skToggleDrawer`).

**NFR-005 verdict**: Violated. The NFR text reads:
> The sk-nav-pill-drawer.css split must not change any rendered visual output —
> dark-mode and light-mode rendering of the nav pill with drawer must be
> pixel-equivalent before and after the split.

In Storybook: pixel-equivalent ✓. On the live demo: visibly broken (no
button styling, no drawer transition).

**Why per-WP review missed it**: WP02 reviewed CSS-file-internal correctness
without verifying consumer-side load. WP03 reviewed JS-module extraction and
demo-page integration only for the JS hook, not the CSS load chain. No WP
declared owned_files including the consumer `<link>` tags as part of the
split's contract.

This is the canonical "passing tests, failing system" pattern: each WP's
isolated review passed; the system-level integration broke.

---

## Silent Failure Candidates

| Location                                                | Condition                              | Silent result                  | Spec impact                                         |
|---------------------------------------------------------|----------------------------------------|--------------------------------|-----------------------------------------------------|
| `packages/html-js/src/nav-pill/sk-nav-pill.js:10`        | `document.getElementById('sk-nav-drawer')` returns null | `return;` (no log, no throw)   | If the demo markup ever drops `id="sk-nav-drawer"`, the hamburger does nothing and there is no error message. Acceptable for a UI toggle (early-return is conventional) but worth noting. |

No other silent-failure patterns introduced by this mission. The mission did
not modify any code path involving HTTP, subprocess, file locking, or
credentials — those security categories are N/A.

---

## Security Notes

| Finding                                              | Location                                            | Risk class       | Recommendation                                                                                |
|------------------------------------------------------|-----------------------------------------------------|------------------|-----------------------------------------------------------------------------------------------|
| `sed -i` substitutions on copied demo HTMLs in CI    | `.github/workflows/storybook-deploy.yml` lines 58–63 | None (low risk)  | Inputs are repo-controlled HTML files with bounded path patterns. No user input. No injection vector. |
| New `<script type="module">` in dashboard-demo.html  | `apps/demo/dashboard-demo.html:482-484`              | None             | Module path is repo-relative, not user-supplied. Module export does no eval, no innerHTML.    |

No subprocess execution introduced. No new HTTP calls. No file locking. No
authentication or credential handling. C-002 (no new `window.*` globals) is
satisfied because the only `window.skToggleDrawer` assignment replaces the
removed inline definition — same global, different source.

---

## Final Verdict

**FAIL**

### Verdict rationale

Two FRs that were explicitly accepted into the delivery contract and marked
complete on the WP board (`[x]` in `tasks.md`) were never implemented in the
merged code: FR-008 (Done-lane opacity → tokens replacement in dashboard-demo)
and FR-013 (blog-demo light-mode header surface alignment). Both were the
defects this mission was specifically commissioned to resolve (DEF-06 from the
Renata code-quality audit and the user-reported visual inconsistency,
respectively). They are now still present on the live deployment, fully
unaddressed, despite the mission having merged with green review checks.

In addition, RISK-1 demonstrates that the WP02 component-boundary split
introduced a regression in `apps/demo/dashboard-demo.html`: after the CSS
extraction, the demo's hamburger button and drawer panel render with no
component styling on the live deploy because the demo's `<link>` tag was not
updated to load `sk-nav-pill-drawer.css`. This violates NFR-005's pixel-
equivalence requirement on the deployed artifact (Storybook itself is
unaffected because the story imports both files per FR-004).

The combined effect is that two of the eight defects this mission was scoped
to fix are not fixed, and one defect was newly introduced. The mission cannot
be considered an acceptance of its stated goals.

### Open items (non-blocking)

These do not change the verdict but should be tracked for follow-up:

- **DRIFT-3** — `tasks.md` Subtask Index table contradicts the WP03 bullet
  list on T012/T013/T014 ownership. Update the table to reflect WP04's
  absorption into WP03, or remove the WP04 column entirely.

- **README cosmetic** — em-dashes were rendered as plain hyphens (e.g.
  "Live Storybook -" instead of "Live Storybook —"). The WP07 reviewer
  flagged this as non-blocking.

- **htmlhint Angular template warnings** (9 in 4 files) are pre-existing,
  tolerated by `|| true`, and not introduced by this mission. Worth a
  separate cleanup PR that either suppresses `attr-lowercase` for
  `*.component.html` or moves to an Angular-aware HTML linter.

### Suggested remediation scope

A small follow-up mission (or a single targeted PR — this is small enough
not to need full mission ceremony) should:

1. Add the missing `apps/demo/dashboard-demo.html` Done-lane CSS changes
   per FR-008.
2. Add the missing `apps/demo/blog-demo.html` `[data-theme="light"] header`
   surface change per FR-013.
3. Add `<link rel="stylesheet" href="../../packages/html-js/src/nav-pill/sk-nav-pill-drawer.css" />`
   to `apps/demo/dashboard-demo.html` (and verify the deploy workflow's
   sed rewrite handles the new path the same way as existing CSS imports).
4. Update `tasks.md` Subtask Index table to remove WP04 or note its
   absorption into WP03.

All four are mechanical and isolated. They do not require new tokens,
new components, or any restructuring.
