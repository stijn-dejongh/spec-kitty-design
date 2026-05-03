# Quickstart: Catalog Completeness & Brand Consistency Pass

**Mission**: `catalog-completeness-and-brand-consistency-01KQPDB5`

This document is the contributor onboarding for working in this mission. If you are an implementer agent or a human developer picking up a work package, read this before touching code.

## Prerequisites

| Tool | Version | How to confirm |
|---|---|---|
| Node | ≥ 20 | `node --version` |
| npm | ≥ 10 | `npm --version` |
| `mmdc` (Mermaid CLI) | Pinned in `package.json` after PLAN-004 lands | `npx mmdc --version` once installed |
| Repo cloned, deps installed | — | `npm ci --ignore-scripts && npx nx run tokens:catalogue` |

## Mission map at a glance

The mission has four engineering tracks. They are independent and can be sequenced in parallel lanes.

| Track | Issues closed | Where the work lives |
|---|---|---|
| **A — Catalog completeness** | #10 | `packages/html-js/src/{button,feature-card,ribbon-card,nav-pill,pill-tag,section-banner,grid,blog-card}/`, `packages/angular/src/lib/button/` |
| **B — Token-debt cleanup** | #11, #14 | `packages/tokens/src/tokens.css`, `packages/html-js/src/nav-pill/sk-nav-pill.css`, `apps/demo/dashboard-demo.html` |
| **C — Drawer self-containment** | #12, #13 | `packages/html-js/src/nav-pill/{sk-nav-pill.css,sk-nav-pill-drawer.css,sk-nav-pill.js,sk-nav-pill.d.ts,sk-nav-pill.stories.ts,index.ts}`, `apps/demo/dashboard-demo.html` |
| **D — Diagram branding pipeline** | #2 | `docs/architecture/assets/{sk-mermaid-theme.yaml,*.mmd,*.svg}`, `scripts/render-diagrams.js`, `.github/workflows/docs-diagrams.yml` |

## How to add a token (Track B)

1. Edit `packages/tokens/src/tokens.css` — add the new `--sk-*` custom property in the appropriate section.
2. Regenerate the catalogue:
   ```bash
   npx nx run tokens:catalogue
   ```
3. Verify stylelint loads the regenerated catalogue:
   ```bash
   npm run quality:stylelint
   ```
4. Commit `tokens.css` AND `packages/tokens/dist/token-catalogue.json` in the **same commit**. Stylelint fails on consumers that reference the new token until the catalogue ships.

Reference: PLAN-001 (yellow alpha bucket scheme).

## How to write a populated story (Track A)

Required exports per story file:

```ts
// sk-<name>.stories.ts
import type { Meta, StoryObj } from '@storybook/html-js';

const meta: Meta = {
  title: 'Components/Sk<Name>',  // pick the closest existing root taxonomy
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => `<!-- fully styled HTML, NOT empty -->`,
};

export const LightMode: Story = {  // MANDATORY — enforced by review
  render: () => `
    <div data-theme="light"
         style="background: var(--sk-surface-page);
                padding: var(--sk-space-6);
                display: inline-block;">
      <!-- same HTML as Default -->
    </div>
  `,
  parameters: { backgrounds: { default: 'sk-light' } },
};

// Add additional variants per FR-### (e.g., Primary, Secondary, ColorizedBorder, …)
```

Empty / placeholder render functions are a **catalog-completeness violation** under FR-001 — the WP review will reject them.

## How to refresh a visual baseline

If your WP changes a story's rendered output (NavPill split, dashboard-demo Done lane, new components), refresh the baseline in the **same WP**:

```bash
# (exact command depends on the existing visual-baseline tooling — check apps/storybook/)
npx nx run storybook:test:update-snapshots
```

Commit the regenerated snapshot images alongside your code change. NFR-003 (≤ 2 % drift on **untouched** stories) only applies to stories you didn't intend to change.

## How to run the diagram render flow (Track D)

Once PLAN-004's render script lands:

```bash
# Render mode — produces SVGs alongside the .mmd sources
node scripts/render-diagrams.js

# Check mode — same as CI; exits non-zero on source/SVG drift
node scripts/render-diagrams.js --check
```

If `--check` rejects your PR locally:

1. Run the script in render mode (no flag).
2. Inspect the regenerated SVGs under `docs/architecture/assets/`.
3. Commit them alongside your `.mmd` or `sk-mermaid-theme.yaml` change.

## Findings Log Practice (charter rule, per spec C-012)

When you hit a reasoning-loop failure or a `spec-kitty` skill-invocation error during your WP work, write a finding to `tmp/finding/<YYYY-MM-DD>-<short-slug>.md`. Each entry: what was attempted, what failed (verbatim error if available), the workaround, root-cause hypothesis, suggested remediation.

**Manual workaround for the worktree symlink gap** (until upstream `spec-kitty-cli` lands the auto-symlink — see `tmp/finding/2026-05-03-worktree-tmp-finding-symlink-not-automated.md`):

When you start a WP in a lane worktree (`.worktrees/<slug>-<mid8>-lane-*/`), run:

```bash
mkdir -p tmp
ln -sfn ../../../tmp/finding tmp/finding
```

This links the lane's `tmp/finding/` to the root checkout's directory so findings survive lane teardown.

## Acceptance signals per WP

Every WP MUST satisfy these before submitting for review:

- [ ] `npm run quality:all` passes (eslint + stylelint + htmlhint, zero violations).
- [ ] `npx nx run storybook:storybook:build` succeeds.
- [ ] If the WP added/changed a token: `packages/tokens/dist/token-catalogue.json` was regenerated and committed in the same commit.
- [ ] If the WP added/changed a component story: Default + LightMode + any required variants are present and render correctly.
- [ ] If the WP added/changed a `.mmd` or the brand-theme source: `node scripts/render-diagrams.js --check` passes locally.
- [ ] If the WP changed visible output: visual baseline was refreshed and the new image committed.
- [ ] axe-core scan reports zero WCAG 2.1 AA violations on touched stories.
- [ ] Commit messages follow conventional commits with the existing scope vocabulary (`tokens`, `html-js`, `angular`, `storybook`, `ci`, `docs`).

## Cross-track integration points

- **Track B precedes Track C**: the yellow alpha tokens (Track B) are needed before the nav-pill CSS rewrite (Track C) can replace the rgba() literals.
- **Track A is independent of Tracks B/C/D**: the missing-stories work doesn't touch tokens, drawer, or diagrams.
- **Track D is fully independent**: nothing else depends on it; it can ship in parallel.

## What to do when stuck

1. Re-read [`./spec.md`](./spec.md) — most "what should I do here?" questions have answers in the FR/NFR/C tables.
2. Re-read [`./plan.md`](./plan.md) and [`./research.md`](./research.md) — the technical-shape decisions are recorded there with rationale.
3. Re-read the contract for the area you're touching — `./contracts/{nav-pill-drawer-module,diagram-pipeline-ci-gate,brand-theme-source}.md`.
4. If still stuck, log a finding to `tmp/finding/` describing the ambiguity, and surface it to the orchestrator.
