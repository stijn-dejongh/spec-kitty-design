# Research: Catalog Completeness & Brand Consistency Pass

**Mission**: `catalog-completeness-and-brand-consistency-01KQPDB5`
**Plan**: [`./plan.md`](./plan.md)

This document captures the ADR-worthy decisions surfaced during planning. Each decision follows the **Decision / Rationale / Alternatives considered** format. Decisions identified as `PLAN-###` should be promoted to formal ADRs under `docs/architecture/decisions/` during the implementation work packages that adopt them.

---

## PLAN-001 — Yellow alpha token naming and scale

**Source**: spec FR/Constraint mapping for issue #11; option A in the issue body.

**Decision**: Add three additive tokens to `packages/tokens/src/tokens.css`:

```css
--sk-color-yellow-alpha-15: rgba(245, 197, 24, 0.14);  /* hover surface fill */
--sk-color-yellow-alpha-35: rgba(245, 197, 24, 0.35);  /* hairline ring */
--sk-color-yellow-alpha-60: rgba(245, 197, 24, 0.60);  /* glow / drop shadow tint */
```

Naming pattern: `--sk-color-yellow-alpha-<NN>` where `<NN>` is the rounded percent of the alpha channel (15, 35, 60). The integer suffix is the alpha bucket, not the literal `0.14` — buckets are intentionally sparse so the catalog stays small and consumers reach for semantic spacing of values rather than free-floating opacities.

**Rationale**:
- Closes the C-202 violation in `sk-nav-pill.css` lines 118–122 with a one-pass replacement — no behavioural change in the rendered hover/focus state.
- Sparse bucket scheme (15/35/60) keeps the token surface small and matches the three actual usages today; new buckets are added only when a fourth use case appears, preventing a long tail of `-12`, `-13`, `-14` near-duplicates.
- Names are token-bucket semantic ("alpha-15") rather than slot-semantic ("hover-surface-fill") because the same alpha channel could plausibly serve multiple slots. Slot-semantic names get added on top, in a future mission, only when consumers complain.
- All three values are co-located in `tokens.css`; if `--sk-color-yellow` ever changes, the channels in these tokens move in lockstep — provided the source of truth (the channels themselves) is updated centrally. PLAN-001's known limitation: these tokens still hold raw channels. Migrating them to derive from `--sk-color-yellow` via `color-mix()` or `oklch(from …)` is **out of scope** for this mission (per spec Out of Scope section, deferring #11 Option B).

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| `--sk-color-yellow-alpha-light`, `-medium`, `-strong` | Subjective names age badly. "medium" relative to what? Numeric buckets are observable from the value. |
| Single derived token: `--sk-color-yellow-alpha: color-mix(in srgb, var(--sk-color-yellow) 14%, transparent)` and a CSS-var-driven percentage | Still leaves raw `14%` literals at every call site (just shifted from rgba to color-mix percentage); doesn't solve the cascade problem. |
| `--sk-color-yellow-alpha-glow` etc. (slot-semantic) | Locks the token to one usage; the existing palette uses bucket names for similar cases. |
| Defer to issue #11 Option B (CSS relative-color syntax) and skip #11 in this mission | Browser baseline confirmation work was explicitly out of scope; mission is closing existing debt, not optimizing future syntax. |

**Promotion to ADR**: Yes — this becomes an addendum to ADR-003 (token schema). The work package that adds the tokens MUST update ADR-003's "additive token rules" subsection if one exists, otherwise drop a new ADR (`ADR-009-token-alpha-buckets.md`) with a one-paragraph rationale.

---

## PLAN-002 — Drawer-CSS file split layout

**Source**: spec FR-012; issue #12.

**Decision**: Add a sibling file `packages/html-js/src/nav-pill/sk-nav-pill-drawer.css` to the existing `sk-nav-pill.css`. The basic-pill file owns: pill layout, item styles, active/hover, CTA slot. The drawer file owns: `__hamburger`, `__drawer`, `--has-drawer`, `--responsive`, every `@media` rule guarding the 720 px breakpoint. Both are exposed via `index.ts` as named exports (`navPillCss`, `navPillDrawerCss`); the package's existing CSS export pattern is unchanged.

The Storybook story for `CollapsedHamburger` documents in `parameters.docs.description` that **two** CSS imports are required for the drawer: the basic pill plus the drawer file. The Default story imports only the basic pill.

**Rationale**:
- Smallest possible surface change — same directory, same naming convention as the existing CSS file. No new package, no new sub-export, no new build step.
- Honours NFR-006 (combined size ≤ +5 % of current single-file size). Splitting the file per se costs nothing; the +5 % bound covers selector duplication that the split may introduce (e.g., the `--has-drawer` modifier needs to live in both files if it conditions both basic and drawer styles, which is a minor cost).
- Works with the existing demo-page dual-path constraint (C-005). Demo HTML loads both files via separate `<link rel="stylesheet">` tags; the deploy `sed` rewrite handles the path translation generically.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Move drawer into a sub-component `nav-pill-drawer/` directory | Implies the drawer is a composable component on its own. It is not — it is a modifier of the pill. Sibling file is more honest. |
| Use CSS `@layer` to defer drawer styles inside the same file | Doesn't reduce shipped bytes for consumers who don't use the drawer; the layer is still loaded. Defeats the point of FR-012. |
| Bundle drawer into the basic file, add a `data-no-drawer` attribute consumers can opt out via CSS | Pseudo-tree-shaking via attribute selectors is fragile and still ships the bytes. |

**Promotion to ADR**: Optional — the decision is small enough to live in `research.md` as the canonical record. If a consumer later asks "why two CSS files?", point them here.

---

## PLAN-003 — `skToggleDrawer` JS module shape

**Source**: spec FR-010, FR-011, NFR-007; issue #13.

**Decision**: Export a named function `skToggleDrawer(buttonElement)` from `packages/html-js/src/nav-pill/sk-nav-pill.js`, with this signature and behaviour:

```js
/**
 * Toggle the nav-pill drawer open/closed and synchronize the hamburger
 * button's ARIA state.
 *
 * @param {HTMLElement} buttonElement - the hamburger button element.
 *   The drawer it controls MUST have id="sk-nav-drawer" (consumer-side
 *   contract; documented in the story and the package README).
 * @returns {boolean} the new open state (true if drawer is now open)
 */
export function skToggleDrawer(buttonElement) { /* ... */ }
```

Side effects: toggles `is-open` class on `#sk-nav-drawer`, sets the button's `aria-expanded` and `aria-label`. Idempotent — calling with `null` or with a button whose drawer is missing returns `false` and no-ops without throwing.

Storybook integration: a story decorator in `sk-nav-pill.stories.ts` imports `skToggleDrawer` and assigns it to `window.skToggleDrawer` so the inline `onclick` attribute in the rendered HTML can invoke it. Consumers in their own pages do the same in their JS bundle, OR attach via `addEventListener` per the README example.

**Rationale**:
- Minimal API surface — one function, one argument, one return value. No class, no event bus, no custom-element registration.
- Custom elements considered and rejected (see alternatives): the existing pattern across `packages/html-js` is "static HTML structure + optional toggle function", and this consistency is more valuable than the encapsulation a `<sk-nav-pill>` element would add.
- The window-attached pattern for Storybook is ugly but matches how the demo page works today (the sk-toggle-drawer call site uses `onclick="skToggleDrawer(this)"`). It allows the same HTML to render correctly in both Storybook and the consumer's page without forking the markup. The README documents the cleaner `addEventListener` pattern as the preferred consumer integration.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Default class export `class NavPillDrawer { constructor(btn) {…} toggle() {…} }` | More code for the same outcome; consumers have to remember to instantiate. The function API is closer to the existing demo-page mental model. |
| Custom element `<sk-nav-pill drawer></sk-nav-pill>` with attached `connectedCallback` | Cleaner encapsulation, but introduces a custom-element registration concern that no other component in the package has — inconsistent. |
| Auto-attach to `document` on import (side-effecting module) | Side-effecting modules break tree-shaking and surprise consumers. |
| Pass the drawer element as a second argument | The current consumer pattern always uses `id="sk-nav-drawer"`; adding the second arg now without a use case violates "don't design for hypothetical future requirements." |

**Promotion to ADR**: No — local design choice, captured here.

---

## PLAN-004 — Diagram render-script implementation language

**Source**: spec FR-013 .. FR-016; issue #2.

**Decision**: Implement the diagram render script as a Node script (`scripts/render-diagrams.js`) invoked via `node scripts/render-diagrams.js`. It reads `docs/architecture/assets/sk-mermaid-theme.yaml`, walks every `*.mmd` file under `docs/architecture/assets/`, replaces `%%THEME%%` with the inline `%%{init}%%` block built from the YAML, writes a `.compiled.mmd` temp file, invokes `mmdc` (already a Node tool) on the temp file to produce the SVG, and removes the temp file. A `--check` flag re-renders to a temp directory and diffs against the committed SVGs, exiting non-zero on drift (this is the CI mode).

**Rationale**:
- Mermaid's CLI (`mmdc` from `@mermaid-js/mermaid-cli`) is already a Node package; using Node for the orchestration script avoids a runtime cross-boundary call (Bash → Node) and keeps everything in one toolchain that the monorepo already manages via npm.
- YAML parsing is trivial in Node (use a small dependency like `js-yaml` already transitively present, or `yaml`); doing the same in Bash is awkward and brittle.
- The repo already has Node 20+ as the base runtime (Storybook, Nx, ESLint). No new runtime introduced. Bash would be acceptable but introduces a "script lives somewhere weird" vibe; Python would add a runtime dependency the project doesn't otherwise have.
- A single `--check` flag means CI calls the same script as a contributor — honours C-016 (no CI-only render path).

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Bash script that does sed-based theme injection and shells out to `mmdc` | Sed-based YAML interpretation is a known footgun; YAML's quoting rules are not regex-amenable. |
| Python script | Adds a Python runtime dependency the project doesn't otherwise need. Setup-doctor and CI would need Python provisioning. |
| `mmdc -p puppeteer-config.json -t base` with theme passed as flags | Mermaid CLI's CLI-flag theme interface doesn't accept the full `themeVariables` block — only `--theme base` and a few preset overrides. We need full themeVariables, which requires inline `%%{init}%%`. |
| Nx custom executor | Overkill for one script; the `npx` invocation is simpler. |

**Promotion to ADR**: Optional — capture as a footnote in ADR-008 (multi-framework rendering) or as a small `ADR-010-diagram-pipeline.md` if reviewers prefer a standalone record.

---

## PLAN-005 — Diagram pipeline CI topology

**Source**: spec FR-014, FR-015, NFR-002; issue #2.

**Decision**: Add a new GitHub Actions workflow `.github/workflows/docs-diagrams.yml` rather than extending `ci-quality.yml`. It triggers only on PRs that change `docs/architecture/assets/**` (and on pushes to `main` for the same path filter). Job: install Node 20 + `@mermaid-js/mermaid-cli`, run `node scripts/render-diagrams.js --check`, surface any drift as the failure message.

**Rationale**:
- Path-filtered triggers mean PRs that don't touch architecture diagrams pay zero CI cost — honours NFR-002 (≤ 60 s added only when triggered) by simply not running.
- Keeping it isolated from `ci-quality.yml` prevents one slow `mmdc` install from blocking the entire quality lane.
- The job is independently re-runnable; if Mermaid CLI's npm dependency has a flake, contributors can rerun without retriggering the full quality pipeline.
- Naming: `docs-diagrams.yml` matches the existing `docs-pages.yml` naming pattern across this monorepo and the upstream spec-kitty repo.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Extend `ci-quality.yml` with a `diagrams` job | Couples diagram-pipeline failures to the broader quality gate's life cycle. Ranks low on NFR-002 if diagrams trigger on every PR (even non-doc PRs) due to unconditional triggers. |
| Run diagram check locally only (pre-commit hook) | Bypassable, easy to forget, not enforced. |
| Make the diagram script part of the `tokens:catalogue` build chain | Conflates two unrelated build outputs — token catalogue and architecture diagrams. |

**Promotion to ADR**: No — operational decision, captured here. The workflow file itself is the canonical record.

---

## PLAN-006 — Done-lane semantic colour approach (issue #14)

**Source**: spec FR-017; issue #14.

**Decision**: Replace the `opacity: 0.6` cascade on `.dash-lane__header--done` with explicit semantic foreground tokens, following the pattern the Planned lane already uses:

```css
.dash-lane__header--done {
  background: var(--sk-surface-card);
  color: var(--sk-fg-muted);
}
.dash-lane__header--done .dash-lane__dot {
  background: var(--sk-fg-subtle);
}
```

The opacity-restore on `.dash-lane__count` is removed (it was only needed because the parent's opacity cascaded). Visual outcome: the Done lane reads as muted to roughly the same degree, but every child element's colour comes from a token, so adding a new child no longer requires an opacity override.

**Rationale**:
- Matches the Planned lane's existing pattern → internal consistency.
- Deletes the fragile-by-design pattern (opacity cascade + manual restore) cited in #14.
- Uses tokens that already exist in `packages/tokens/src/tokens.css` (`--sk-fg-muted`, `--sk-fg-subtle`); no new token addition needed.
- Visual diff is small enough to refresh the dashboard-demo baseline in the same WP.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Add a semantic `--sk-state-muted` token and a `--muted-state` modifier utility | Generalises one site of fragility into a project-wide concept; out of scope for this targeted fix and the spec doesn't ask for it. |
| Use `color-mix()` to lighten the existing on-card colour | Doesn't communicate intent ("this is the muted lane state"); just shifts where the magic number lives. |
| Keep opacity but document the restore-pattern in CONTRIBUTING | Codifies the fragility instead of removing it. |

**Promotion to ADR**: No — local CSS fix, captured here.

---

## PLAN-007 — Net-new components (grid primitive + blog-style SkCard)

**Source**: spec FR-008, FR-009; issue #10.

**Decision**:

- **Grid layout primitive** (`sk-grid`): a responsive CSS Grid wrapper with two configurable axes (column count and gap size), driven by tokens (`--sk-space-*` for gap, integer column counts via a `--sk-grid-columns` custom property). It is presentational only — no JS. Stories cover: 2-column, 3-column, 4-column, responsive single-column-at-mobile.
- **Blog-style SkCard** (`sk-blog-card`): a card variant tuned for blog-post listing/preview, composed from the existing `sk-card` primitives where possible. Slots: thumbnail/image, eyebrow (category/tag), title, excerpt, metadata (author/date), read-more link. Stories cover: with image, without image, no eyebrow, long-title truncation behaviour.

Scope discipline: the grid primitive is bounded by what `tmp/reference_system/` and `https://spec-kitty.ai/blog` need; it is **not** a general-purpose CSS Grid wrapper. The blog-card is bounded by the blog-listing composition; it does not try to replace the existing `sk-card`.

**Rationale**:
- Both components are explicitly named in #10's "Missing elements" list; both are unblocking the docsite pilot's blog/index compositions (epic #17, SC-007 in spec).
- Composition over invention: the blog-card reuses `sk-card` styles where possible (cuts new CSS bytes and keeps brand language consistent).
- The grid primitive is pure CSS; the blog-card is pure markup + CSS. Neither adds JS or runtime dependencies. NFR-001 (Storybook build budget) holds easily.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Skip the grid primitive; document grid-css usage inline in the blog-card story | Keeps the gap open for future blog/listing pages; the spec explicitly lists the grid primitive as required (FR-008). |
| Build a more powerful grid system (variable column widths, named template areas) | Out of scope per Assumption #2 in spec — bounded by reference-set needs. |
| Build the blog-card as a standalone component without composing `sk-card` | Duplicates card-frame styles; harder to keep visually consistent on future card refreshes. |

**Promotion to ADR**: No — additive components following the established pattern.

---

## Cross-cutting research notes

### Visual-baseline strategy

Every WP that visually changes a story or demo-page (PLAN-002, PLAN-003 nav-pill split; PLAN-006 dashboard-demo; PLAN-007 new components) must refresh the visual baseline in the same WP and commit the new baseline image alongside the code change. This honours NFR-003 (no regression beyond 2 % drift on **untouched** stories) by explicitly distinguishing "intended change" from "unintended drift".

### Findings Log Practice operational note

Per charter and spec C-012, implementer agents should `mkdir -p tmp/finding/` in each lane and write findings during work. Until the upstream worktree-symlink lands (see `tmp/finding/2026-05-03-worktree-tmp-finding-symlink-not-automated.md`), each lane's `tmp/finding/` is currently isolated and gets cleaned up with the worktree. Manual workaround: implementer agents write findings to a local file in the lane, then **before lane teardown** copy them up to the root checkout's `tmp/finding/`. The mission-review pass collects them.

### Token-catalogue regeneration as a WP step

Any WP that adds a token MUST run `npx nx run tokens:catalogue` and commit the regenerated `packages/tokens/dist/token-catalogue.json` in the same commit. Otherwise stylelint's strict-value rule will fail on subsequent WPs that try to use the new token. This is restated in `quickstart.md` under "Adding a token".

### What is NOT being researched

- Browser support for `oklch(from …)` and `color-mix()` — out of scope (issue #11 Option B was explicitly deferred).
- Migration away from Mermaid (e.g. to PlantUML or draw.io) — out of scope per C-010.
- Broader Storybook category restructuring — out of scope per C-009.
- A general-purpose CSS Grid system — out of scope per PLAN-007 scope discipline.
