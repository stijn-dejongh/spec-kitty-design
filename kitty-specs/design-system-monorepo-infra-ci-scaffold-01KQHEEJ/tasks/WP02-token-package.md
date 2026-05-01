---
work_package_id: WP02
title: Token Package
dependencies:
- WP01
- WP05
requirement_refs:
- FR-010
- FR-012
- FR-013
- FR-014
- FR-015
- FR-034
- NFR-004
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T010
- T011
- T012
- T013
- T014
- T015
agent: "claude:claude-sonnet-4-6:frontend-freddy:implementer"
shell_pid: "2915056"
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: packages/tokens/src/tokens.css
execution_mode: code_change
owned_files:
- packages/tokens/src/tokens.css
- packages/tokens/dist/token-catalogue.json
- packages/tokens/README.md
- packages/tokens/project.json
- scripts/generate-token-catalogue.js
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

Frontend Freddy owns CSS, tokens, and design system implementation. Apply frontend expertise throughout.

---

## Objective

> **Sequencing note:** This WP depends on WP05 (Linting & Code Quality Tools) because WP05 creates `stylelint.config.mjs`. WP02:T013 extends that file to add the `--sk-*` token enforcement rule. WP02 must not run until WP05 has committed its `stylelint.config.mjs` baseline.

Implement `@spec-kitty/tokens`: write `tokens.css` with the full `--sk-*` custom property namespace from the reconciled ADR-003 token catalogue, generate `token-catalogue.json` for tooling, and wire the Stylelint enforcement rule that blocks hardcoded values.

## Context

- **Pre-condition**: ADR-003 value reconciliation (FR-034) must be complete before this WP starts. The maintainer has audited `tmp/colors_and_type.css` against the live `spec-kitty.ai` CSS and recorded resolved values in `docs/architecture/decisions/ADR-003-addendum-token-values.md`.
- ADR-001: CSS custom properties are the token distribution format — no Tailwind config, no JS token objects
- ADR-003: Category-prefixed `--sk-<category>-<name>` schema with semantic pairing rule (surface + foreground-on-surface)
- C-003: All CSS output must use `--sk-*` only — no hardcoded hex/rgb/hsl values anywhere except inside `tokens.css` itself
- The token catalogue is the source of truth for the Stylelint rule — it lists every valid `--sk-*` property

## Subtask Guidance

### T010 — Write `packages/tokens/src/tokens.css`

**Purpose**: Single `:root` block defining all `--sk-*` custom properties per the ADR-003 schema.

**Structure** (use values from ADR-003 addendum — the values below are illustrative from the Claude Design reference):
```css
/* @spec-kitty/tokens — DO NOT edit values directly. See docs/architecture/decisions/ADR-003-addendum-token-values.md */
:root {
  /* ── Brand Colors ─────────────────────────────────── */
  --sk-color-yellow:    #F5C518;
  --sk-color-haygold:   #D9B36A;
  --sk-color-blue:      #A9C7E8;
  --sk-color-purple:    #B8A9E0;
  --sk-color-green:     #8FCB8F;
  --sk-color-red:       #E97373;

  /* ── Dark Surfaces ────────────────────────────────── */
  --sk-surface-page:    #0A0A0B;
  --sk-surface-card:    #161619;
  --sk-surface-input:   #1C1C20;

  /* ── Foreground / Text ────────────────────────────── */
  --sk-fg-default:      rgba(255,255,255,0.91);
  --sk-fg-muted:        rgba(255,255,255,0.55);
  --sk-fg-on-primary:   #0A0A0B;
  --sk-fg-on-card:      rgba(255,255,255,0.91);

  /* ── Borders ──────────────────────────────────────── */
  --sk-border-default:  #26262C;
  --sk-border-strong:   #3a3a42;
  --sk-border-focus:    #F5C518;

  /* ── Typography — Families ────────────────────────── */
  --sk-font-display:    "Falling Sky", ui-sans-serif, system-ui, sans-serif;
  --sk-font-sans:       ui-sans-serif, system-ui, sans-serif;
  --sk-font-mono:       "JetBrains Mono", ui-monospace, monospace;
  --sk-font-reference:  "Swansea", Georgia, serif;

  /* ── Typography — Scale ───────────────────────────── */
  --sk-text-xs:   0.75rem;
  --sk-text-sm:   0.875rem;
  --sk-text-base: 1rem;
  --sk-text-lg:   1.125rem;
  --sk-text-xl:   1.25rem;
  --sk-text-2xl:  1.5rem;
  --sk-text-3xl:  1.875rem;

  /* ── Typography — Weights ─────────────────────────── */
  --sk-weight-normal:    400;
  --sk-weight-medium:    500;
  --sk-weight-bold:      700;
  --sk-weight-extrabold: 800;

  /* ── Spacing Scale ────────────────────────────────── */
  --sk-space-1:  0.25rem;   /* 4px  */
  --sk-space-2:  0.5rem;    /* 8px  */
  --sk-space-3:  0.75rem;   /* 12px */
  --sk-space-4:  1rem;      /* 16px */
  --sk-space-5:  1.25rem;   /* 20px */
  --sk-space-6:  1.5rem;    /* 24px */
  --sk-space-7:  2rem;      /* 32px */
  --sk-space-8:  2.5rem;    /* 40px */
  --sk-space-9:  3rem;      /* 48px */
  --sk-space-10: 4rem;      /* 64px */
  --sk-space-11: 6rem;      /* 96px */
  --sk-space-12: 8rem;      /* 128px */

  /* ── Radius ───────────────────────────────────────── */
  --sk-radius-sm:   0.5rem;    /* 8px  */
  --sk-radius-md:   1rem;      /* 16px */
  --sk-radius-lg:   1.5rem;    /* 24px */
  --sk-radius-pill: 999px;

  /* ── Shadows ──────────────────────────────────────── */
  --sk-shadow-card:          0 1px 3px rgba(0,0,0,0.5);
  --sk-shadow-glow-primary:  0 0 12px rgba(245,197,24,0.4);

  /* ── Motion ───────────────────────────────────────── */
  --sk-motion-duration-fast: 120ms;
  --sk-motion-duration-base: 200ms;
  --sk-motion-ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Important**: Replace all values above with those from `docs/architecture/decisions/ADR-003-addendum-token-values.md` if they differ. The ADR-003 addendum is the authoritative source.

**Validation**: File must be < 20 KB uncompressed (NFR-004). Count bytes: `wc -c packages/tokens/src/tokens.css`.

### T011 — `scripts/generate-token-catalogue.js`

**Purpose**: Parse `tokens.css` and emit `packages/tokens/dist/token-catalogue.json` for Stylelint and agent governance.

```javascript
#!/usr/bin/env node
// Parses --sk-* custom properties from tokens.css and writes token-catalogue.json
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('packages/tokens/src/tokens.css', 'utf8');
const categories = {};

for (const match of css.matchAll(/--sk-([a-z]+)-([a-z0-9-]+)\s*:/g)) {
  const [, cat] = match;
  const propName = `--sk-${match[1]}-${match[2]}`;
  if (!categories[cat]) categories[cat] = { prefix: `--sk-${cat}-`, tokens: [] };
  if (!categories[cat].tokens.includes(propName)) categories[cat].tokens.push(propName);
}

const catalogue = { schema_version: '1.0.0', generated_from: 'tokens.css', categories };
fs.mkdirSync('packages/tokens/dist', { recursive: true });
fs.writeFileSync('packages/tokens/dist/token-catalogue.json', JSON.stringify(catalogue, null, 2));
console.log(`Generated catalogue: ${Object.values(categories).reduce((s,c)=>s+c.tokens.length,0)} tokens`);
```

### T012 — Configure nx `catalogue` target and run

Update `packages/tokens/project.json` to add:
```json
"catalogue": {
  "executor": "nx:run-commands",
  "options": { "command": "node scripts/generate-token-catalogue.js" },
  "dependsOn": []
}
```

Run `npx nx run tokens:catalogue` and commit the generated `packages/tokens/dist/token-catalogue.json`.

**FR-015 — Breaking change detection:** The catalogue diff between releases is the mechanism for detecting removed or renamed tokens. When a token name changes, the old name will be absent from the new catalogue. A future CI script (`scripts/check-token-breaking-changes.sh`) should compare the current catalogue against the previous release tag's catalogue and fail if any property name has been removed without a major version bump. For v1, this check is manual: reviewers must verify that no existing `--sk-*` property names are removed or renamed without a semver major increment.

### T013 — Stylelint `--sk-*` enforcement rule

Install: `npm install --save-dev stylelint-declaration-strict-value --ignore-scripts`

**`stylelint.config.mjs`** (root):
```javascript
import strictValue from 'stylelint-declaration-strict-value';
import tokenCatalogue from './packages/tokens/dist/token-catalogue.json' assert { type: 'json' };

const allTokens = Object.values(tokenCatalogue.categories)
  .flatMap(c => c.tokens);

export default {
  plugins: [strictValue],
  rules: {
    'declaration-strict-value': [
      ['/color/', 'background', 'background-color', 'border-color',
       'font-family', 'font-size', 'padding', 'margin',
       'border-radius', 'box-shadow'],
      {
        ignoreValues: { '': ['/^var\\(--sk-/'] },
        message: 'Use --sk-* custom properties from @spec-kitty/tokens, not hardcoded values.',
      }
    ]
  }
};
```

**Exception**: `packages/tokens/src/tokens.css` itself is excluded from this rule (it defines the values).

Add to `stylelint.config.mjs`:
```javascript
ignoreFiles: ['packages/tokens/src/tokens.css']
```

### T014 — `packages/tokens/README.md`

Write a concise README covering:
1. Installation: `npm install @spec-kitty/tokens`
2. CDN link: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@spec-kitty/tokens/dist/tokens.css">`
3. Usage: reference `--sk-color-yellow` etc. in CSS
4. Token catalogue: link to `dist/token-catalogue.json` for the full property list
5. Semantic pairing rule: always pair `--sk-surface-*` with its `--sk-fg-on-*` counterpart

### T015 — Validate token file size

```bash
wc -c packages/tokens/src/tokens.css
# Must be < 20480 bytes (20 KB)
```

If > 20 KB, identify the largest categories and consider whether comments can be trimmed.

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `packages/tokens/src/tokens.css` exists with all `--sk-*` categories per ADR-003 schema
- [ ] Values match `docs/architecture/decisions/ADR-003-addendum-token-values.md`
- [ ] `packages/tokens/dist/token-catalogue.json` committed
- [ ] `stylelint.config.mjs` blocks hardcoded values; allows `var(--sk-*)` references
- [ ] `packages/tokens/README.md` present
- [ ] `wc -c packages/tokens/src/tokens.css` < 20480 (NFR-004)
- [ ] `npx nx run tokens:catalogue` exits 0

## Risks

- Token values may differ from the Claude Design reference if the ADR-003 reconciliation revealed discrepancies — always use the addendum as the authoritative source
- `stylelint-declaration-strict-value` version must be compatible with Stylelint 16.x — check peer dependencies

## Reviewer Guidance

Spot-check 5 random token names for ADR-003 naming convention compliance (`--sk-<category>-<name>`). Verify the Stylelint rule rejects `color: #F5C518` and accepts `color: var(--sk-color-yellow)`. Check token file size.

## Activity Log

- 2026-05-01T18:05:34Z – claude:claude-sonnet-4-6:frontend-freddy:implementer – shell_pid=2915056 – Started implementation via action command
