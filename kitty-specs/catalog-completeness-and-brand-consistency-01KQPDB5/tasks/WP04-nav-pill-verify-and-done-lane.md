---
work_package_id: WP04
title: Nav-pill verify + Done-lane fix + token compliance
dependencies:
- WP03
requirement_refs:
- FR-001
- FR-005
- FR-010
- FR-011
- FR-012
- FR-017
planning_base_branch: feature/issue-18-catalog-and-diagram-pipeline
merge_target_branch: feature/issue-18-catalog-and-diagram-pipeline
branch_strategy: Planning artifacts for this feature were generated on feature/issue-18-catalog-and-diagram-pipeline. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into feature/issue-18-catalog-and-diagram-pipeline unless the human explicitly redirects the landing branch.
subtasks:
- T017
- T018
- T019
- T020
- T021
- T022
- T023
- T024
agent: claude
history:
- timestamp: '2026-05-03T08:00:00Z'
  actor: spec-kitty.tasks
  action: created
agent_profile: frontend-freddy
authoritative_surface: packages/html-js/src/nav-pill/
execution_mode: code_change
model: claude-sonnet-4-6
owned_files:
- packages/html-js/src/nav-pill/**
- apps/demo/dashboard-demo.html
- packages/html-js/README.md
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading anything else in this prompt, load your assigned agent profile:

```
/ad-hoc-profile-load frontend-freddy
```

Internalize the profile's identity, specialization, and collaboration contract. If the profile cannot be loaded, fall back to reading the YAML directly and log the gap to `tmp/finding/`.

## Objective

Close issues #12 (drawer CSS extraction), #13 (skToggleDrawer in package), #14 (Done-lane opacity), and the residual nav-pill `rgba()` debt from #11 — all with a single coherent pass over the nav-pill area + the dashboard-demo Done-lane fix.

**Important state-vs-spec note**: a pre-tasks state check found that drawer CSS extraction and the `skToggleDrawer` module are **already in place** from prior remediation missions. This WP is **heavily verification-oriented** for issues #12 and #13 — confirm against contracts, fix only where reality drifts. Issues #11 (in nav-pill scope only) and #14 are still real work.

In scope:
- `packages/html-js/src/nav-pill/**` (full directory)
- `apps/demo/dashboard-demo.html`
- `packages/html-js/README.md` (or the equivalent package documentation file)

NOT in scope:
- New rgba violations in feature-card / card / angular feature-card (out of mission scope; analyze finding)
- Net-new components (WP02)
- Token additions (WP03)

## Branch Strategy

- **Planning/base branch**: `feature/issue-18-catalog-and-diagram-pipeline`
- **Final merge target**: same
- **Sequencing**: this WP depends on WP03 (uses the new yellow alpha tokens). Lane worktree is allocated after WP03 merges.
- **Findings symlink**: standard manual workaround per [`../quickstart.md`](../quickstart.md).

## Context

Read first:

- [`../spec.md`](../spec.md) — FR-005, FR-010, FR-011, FR-012, FR-017; NFR-006, NFR-007; SC-002, SC-004
- [`../research.md`](../research.md) — PLAN-002, PLAN-003, PLAN-006
- [`../contracts/nav-pill-drawer-module.md`](../contracts/nav-pill-drawer-module.md) — the `skToggleDrawer` contract used by T018
- Token names from WP03 (in research PLAN-001): `--sk-color-yellow-alpha-{15,35,60}`

## Subtasks

### T017 — Verify drawer CSS extraction is complete

**Purpose**: confirm that all drawer-specific CSS lives in `sk-nav-pill-drawer.css` and none remains in `sk-nav-pill.css`.

**Steps**:
1. Read `packages/html-js/src/nav-pill/sk-nav-pill.css` end-to-end. Look for any rule referencing `__hamburger`, `__drawer`, `--has-drawer`, `--responsive`, or any `@media` rule guarding the 720 px breakpoint.
2. If found, move them to `sk-nav-pill-drawer.css`.
3. Confirm `sk-nav-pill-drawer.css` includes the file-header comment documenting that it must be loaded in addition to `sk-nav-pill.css`.
4. Verify `packages/html-js/src/nav-pill/index.ts` re-exports both CSS files (or makes them importable separately per PLAN-002).

**Files**: `packages/html-js/src/nav-pill/{sk-nav-pill.css,sk-nav-pill-drawer.css,index.ts}`

**Validation**:
- [ ] `sk-nav-pill.css` has zero drawer-specific rules
- [ ] `sk-nav-pill-drawer.css` exists and is self-documenting in its header
- [ ] Combined byte size is within NFR-006 budget (≤ existing `sk-nav-pill.css` size + 5 % over the pre-extraction baseline)

### T018 — Verify `skToggleDrawer` module satisfies the contract

**Purpose**: confirm the JS module behaves per [`../contracts/nav-pill-drawer-module.md`](../contracts/nav-pill-drawer-module.md).

**Steps**:
1. Read `packages/html-js/src/nav-pill/sk-nav-pill.js`. Confirm:
   - Single named export `skToggleDrawer(buttonElement)`
   - Returns `boolean` (currently it returns `void` per the existing `.d.ts` — **fix this** to match the contract: return the new open state, default `false` on no-op)
   - Idempotent / no-op on `null` button or missing drawer
   - Side effects limited to: drawer `is-open` class toggle, button `aria-expanded`, button `aria-label`
2. Read `sk-nav-pill.d.ts`. Update to:
   ```ts
   export declare function skToggleDrawer(buttonElement: HTMLElement | null): boolean;
   ```
3. Read `packages/html-js/src/nav-pill/index.ts`. Confirm `skToggleDrawer` is re-exported.

**Files**: `packages/html-js/src/nav-pill/{sk-nav-pill.js, sk-nav-pill.d.ts, index.ts}`

**Validation**:
- [ ] Module signature matches contract
- [ ] Return type is `boolean` (was `void`)
- [ ] Null/missing-drawer cases return `false`, no throw
- [ ] `index.ts` re-export present

### T019 — Verify `CollapsedHamburger` story is interactive

**Purpose**: confirm the Storybook story actually toggles the drawer when clicked (FR-011).

**Steps**:
1. Read `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts` end-to-end.
2. Confirm the `CollapsedHamburger` story:
   - Imports `skToggleDrawer` from `./index`
   - Attaches it to `window.__skToggleDrawer` (or a similarly namespaced global) inside a story decorator BEFORE the HTML renders
   - Renders a hamburger button whose `onclick` invokes that global function
   - Documents in `parameters.docs.description.story` that BOTH `sk-nav-pill.css` AND `sk-nav-pill-drawer.css` are required imports for the drawer pattern
3. Run Storybook locally (`npx nx run storybook:storybook`), open the `CollapsedHamburger` story, click the hamburger, and verify the drawer toggles.
4. If the existing global is `__skToggleDrawer` (note: double-underscore prefix), keep it as-is — it's a reasonable namespace choice. Just ensure the inline `onclick` matches.

**Files**: `packages/html-js/src/nav-pill/sk-nav-pill.stories.ts`

**Validation**:
- [ ] Story renders in Storybook
- [ ] Hamburger click toggles drawer open/close
- [ ] axe-core passes (`aria-expanded` toggles correctly)

### T020 — Verify `dashboard-demo.html` imports `skToggleDrawer` from the package

**Purpose**: confirm FR-010 — the demo page proves a consumer can integrate the drawer using only the package (not by copy-pasting script).

**Steps**:
1. Read `apps/demo/dashboard-demo.html`. Look for the `<script type="module">` block near the bottom.
2. Confirm it has:
   ```js
   import { skToggleDrawer } from '../../packages/html-js/src/nav-pill/sk-nav-pill.js';
   window.skToggleDrawer = skToggleDrawer;
   ```
3. Confirm the hamburger button's `onclick="skToggleDrawer(this)"` matches.
4. Confirm the deploy `sed` rewrite in `.github/workflows/storybook-deploy.yml` covers this relative path translation. (Read the workflow file to verify; do not modify it unless the path mapping is missing.)

**Files**: `apps/demo/dashboard-demo.html` (verify only)

**Validation**:
- [ ] Demo imports from package, not from inline script
- [ ] Deploy workflow's `sed` step covers the path rewrite (else surface a finding)
- [ ] Drawer functions correctly when the demo is opened via `file://` (local dev)

### T021 — Audit nav-pill CSS for residual `rgba()`/hex literals

**Purpose**: replace any remaining hardcoded colour channels in nav-pill CSS with the `--sk-color-yellow-alpha-*` tokens delivered by WP03 (or equivalent semantic tokens).

**Steps**:
1. Run from repo root:
   ```bash
   grep -nE "rgba\(|#[0-9a-fA-F]{3,6}|[0-9]+px" packages/html-js/src/nav-pill/*.css
   ```
2. For each match, decide:
   - If it's a colour literal: replace with the appropriate `--sk-color-yellow-alpha-15/-35/-60` token (or another existing token if more semantic).
   - If it's a pixel literal in a media query (e.g. `@media (max-width: 720px)`): leave it; document inline why if stylelint complains.
   - If it's `opacity: 0` or `opacity: 1` for animation enter/exit: leave it (animation control, not colour intent).
3. Run `npm run quality:stylelint`. Should pass cleanly on all nav-pill CSS files.

**Files**: `packages/html-js/src/nav-pill/sk-nav-pill.css`, `sk-nav-pill-drawer.css`

**Validation**:
- [ ] Zero `rgba()` colour literals (animation `opacity` allowed)
- [ ] Zero hex colour literals
- [ ] Stylelint clean across nav-pill CSS files

### T022 — Replace `.dash-card--done { opacity: 0.6 }` cascade with semantic colour tokens

**Purpose**: close issue #14 (FR-017). Apply the [PLAN-006](../research.md) approach.

**Steps**:
1. Open `apps/demo/dashboard-demo.html`. Locate the `.dash-card--done` rule (around line 338 — note: the issue body said `.dash-lane__header--done`, but the actual class is `.dash-card--done`; same fragile pattern).
2. Replace:
   ```css
   .dash-card--done { opacity: 0.6; }
   ```
   with:
   ```css
   .dash-card--done {
     background: var(--sk-surface-card);
     color: var(--sk-fg-muted);
   }
   .dash-card--done .dash-lane__dot { background: var(--sk-fg-subtle); }
   ```
3. Remove any `opacity: 1` overrides on child elements that were only there to escape the parent cascade.
4. Visual-check the dashboard demo locally — Done lane reads as muted but no longer has a fading effect on child elements.

**Files**: `apps/demo/dashboard-demo.html`

**Validation**:
- [ ] No `opacity` declaration remains on `.dash-card--done` or its descendants for muting purposes
- [ ] Done lane visually reads as muted via colour, not opacity
- [ ] No new `rgba()` or hex literals introduced
- [ ] htmlhint passes

### T023 — Update package README with both import patterns

**Purpose**: NFR-007 — first-time consumer integrates drawer in ≤ 10 min using only public docs.

**Steps**:
1. Open or create `packages/html-js/README.md`.
2. Add (or expand) a "Nav-pill drawer" section showing both consumer-side patterns:
   - **Preferred** — `addEventListener` on the hamburger:
     ```html
     <button id="hamburger" class="sk-nav-pill__hamburger" aria-expanded="false" aria-label="Open navigation">…</button>
     <script type="module">
       import { skToggleDrawer } from '@spec-kitty/html-js';
       document.getElementById('hamburger').addEventListener('click', e => skToggleDrawer(e.currentTarget));
     </script>
     ```
   - **Inline-onclick** — for environments where `addEventListener` isn't ergonomic:
     ```html
     <button class="sk-nav-pill__hamburger" onclick="skToggleDrawer(this)">…</button>
     <script type="module">
       import { skToggleDrawer } from '@spec-kitty/html-js';
       window.skToggleDrawer = skToggleDrawer;
     </script>
     ```
3. Document the drawer ID contract: drawer element MUST have `id="sk-nav-drawer"`.
4. Document the two CSS imports required: `sk-nav-pill.css` AND `sk-nav-pill-drawer.css`.

**Files**: `packages/html-js/README.md`

**Validation**:
- [ ] Both patterns present
- [ ] Drawer ID contract documented
- [ ] Both CSS file imports documented
- [ ] axe-attributes (`aria-expanded`, `aria-label`) shown in examples

### T024 — Refresh visual baselines for affected stories/demo

**Purpose**: NFR-003 — explicit refresh for stories whose rendered output changed; untouched stories remain green.

**Steps**:
1. Run the visual-baseline update for affected stories (Playwright snapshot tooling under `apps/storybook/src/tests/visual.spec.ts`):
   ```bash
   # exact command depends on the existing tooling — check the existing test:visual or storybook:test scripts
   npx playwright test apps/storybook/src/tests/visual.spec.ts --update-snapshots --grep "nav-pill|dashboard-demo"
   ```
2. Inspect the regenerated PNGs under `apps/storybook/src/tests/visual.spec.ts-snapshots/` — confirm only nav-pill / dashboard-demo baselines changed.
3. If stories you didn't intend to change show diffs, investigate the cascade — likely a cross-rule effect.
4. Commit the refreshed baselines in the same WP commit set.

**Files**: `apps/storybook/src/tests/visual.spec.ts-snapshots/*.png` (only the affected ones — but those files are NOT in `owned_files`; this is a known cross-cut. Coordinate with reviewer or expand `owned_files` via the orchestrator if the validation fails.)

**Validation**:
- [ ] Only nav-pill / dashboard-demo baselines refreshed
- [ ] Other components' baselines unchanged
- [ ] Visual diff CI step passes after baseline refresh

> **Ownership note for T024**: visual-baseline PNGs live outside this WP's `owned_files`. If the finalize-tasks validation flags this as a violation, escalate to the orchestrator to broaden ownership for this WP, or split T024 into a follow-up tiny WP. Do NOT touch baselines for components outside `nav-pill` / `dashboard-demo`.

## Definition of Done

- [ ] All 8 subtasks pass per-subtask validation
- [ ] `npm run quality:all` passes (stylelint, eslint, htmlhint)
- [ ] `npx nx run storybook:storybook:build` succeeds
- [ ] `CollapsedHamburger` story is interactive
- [ ] Done-lane visual reads as muted via tokens, not opacity
- [ ] Package README documents both consumer integration patterns
- [ ] Visual baselines refreshed for affected stories only
- [ ] Conventional-commit messages with scopes (`html-js`, `storybook`, `docs`)

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Drawer extraction "verification" turns into discovery of other latent issues (e.g., the `skToggleDrawer` `void` vs `boolean` return type mismatch) | Treat each contract gap as a tiny T-subtask fix; do NOT scope-creep into refactors |
| Visual baseline refresh disturbs stories outside this WP | Use Playwright's `--grep` to limit baseline update; manually inspect the PNG diff list |
| `apps/demo/dashboard-demo.html` is shared with future drawer + Done-lane work | This WP owns the file end-to-end; coordinate with orchestrator if a parallel WP needs to touch it |
| Out-of-scope `rgba()` debt in feature-card / card tempts in-scope expansion | Resist. Surface as analyze finding. This WP fixes ONLY nav-pill `rgba` |

## Reviewer guidance

Reviewer should:
1. Open Storybook and confirm `CollapsedHamburger` toggles the drawer interactively.
2. Open `apps/demo/dashboard-demo.html` in a browser; confirm the Done lane reads as muted via colour, not via opacity.
3. Verify `skToggleDrawer` module export contract matches the documented signature.
4. Confirm package README has both patterns documented.
5. Review the visual-baseline PNG diff; only nav-pill / dashboard-demo baselines should appear.
6. Confirm no out-of-scope rgba/hex changes were made (e.g., feature-card, card files unchanged).
