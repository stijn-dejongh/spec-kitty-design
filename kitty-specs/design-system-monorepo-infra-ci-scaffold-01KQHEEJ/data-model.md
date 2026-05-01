# Data Model & Package Contracts: Design System Monorepo Infrastructure

*Phase 1 output — package shapes, token schema, CI contract boundaries*

---

## 1. Package Identity Contracts

### `@spec-kitty/tokens`

```json
{
  "name": "@spec-kitty/tokens",
  "version": "1.0.0",
  "description": "Spec Kitty design tokens — CSS custom properties (--sk-* namespace)",
  "main": "dist/tokens.css",
  "exports": {
    ".": "./dist/tokens.css",
    "./catalogue": "./dist/token-catalogue.json"
  },
  "files": ["dist/tokens.css", "dist/token-catalogue.json", "README.md"],
  "peerDependencies": {}
}
```

**Invariants:**
- `dist/tokens.css` contains only `:root { --sk-* }` declarations — no selectors, no at-rules beyond `@layer` if used
- `dist/token-catalogue.json` enumerates every valid `--sk-*` property name (used by Stylelint custom rule)
- No `peerDependencies` — this package has no runtime dependencies
- Published with `--provenance` (FR-044)
- Token names follow ADR-003 schema: `--sk-<category>[-<modifier>[-<variant>]]`

---

### `@spec-kitty/angular`

```json
{
  "name": "@spec-kitty/angular",
  "version": "1.0.0",
  "description": "Spec Kitty Angular component library",
  "main": "index.js",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "default": "./index.js"
    }
  },
  "peerDependencies": {
    "@angular/core": ">=19.0.0 <20.0.0",
    "@spec-kitty/tokens": "^1.0.0"
  },
  "files": ["**/*.js", "**/*.d.ts", "**/*.css", "README.md"]
}
```

**Invariants:**
- Peer-depends on `@spec-kitty/tokens` — does not bundle token values
- Peer-depends on Angular LTS range; fails with a clear message outside that range
- No hardcoded color/spacing/type values (enforced by Stylelint CI gate)
- Each component module is a separate entry point for tree-shaking

---

### `@spec-kitty/html-js`

```json
{
  "name": "@spec-kitty/html-js",
  "version": "1.0.0",
  "description": "Spec Kitty framework-agnostic HTML primitives and ES utilities",
  "main": "dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./primitives": "./dist/primitives/index.js"
  },
  "peerDependencies": {
    "@spec-kitty/tokens": "^1.0.0"
  },
  "files": ["dist/**", "README.md"]
}
```

**Invariants:**
- Zero Angular/React/Vue runtime dependencies
- Consumable as a plain `<script type="module">` import or direct `<link>` to token CSS
- No build step required for consumers using the CDN path

---

## 2. Token Schema Shape (ADR-003)

The `token-catalogue.json` contract — generated from `tokens.css` and committed alongside it:

```json
{
  "schema_version": "1.0.0",
  "generated_from": "tokens.css",
  "categories": {
    "color": {
      "prefix": "--sk-color-",
      "tokens": ["--sk-color-yellow", "--sk-color-haygold", "--sk-color-blue",
                 "--sk-color-purple", "--sk-color-green", "--sk-color-red"]
    },
    "surface": {
      "prefix": "--sk-surface-",
      "tokens": ["--sk-surface-page", "--sk-surface-card", "--sk-surface-input"]
    },
    "foreground": {
      "prefix": "--sk-fg-",
      "tokens": ["--sk-fg-default", "--sk-fg-muted", "--sk-fg-on-primary",
                 "--sk-fg-on-card"]
    },
    "border": {
      "prefix": "--sk-border-",
      "tokens": ["--sk-border-default", "--sk-border-strong", "--sk-border-focus"]
    },
    "font": {
      "prefix": "--sk-font-",
      "tokens": ["--sk-font-display", "--sk-font-sans", "--sk-font-mono",
                 "--sk-font-reference", "--sk-font-condensed", "--sk-font-boldplus"]
    },
    "text": {
      "prefix": "--sk-text-",
      "tokens": ["--sk-text-xs", "--sk-text-sm", "--sk-text-base", "--sk-text-lg",
                 "--sk-text-xl", "--sk-text-2xl", "--sk-text-3xl"]
    },
    "weight": {
      "prefix": "--sk-weight-",
      "tokens": ["--sk-weight-normal", "--sk-weight-medium", "--sk-weight-bold",
                 "--sk-weight-extrabold"]
    },
    "space": {
      "prefix": "--sk-space-",
      "tokens": ["--sk-space-1","--sk-space-2","--sk-space-3","--sk-space-4",
                 "--sk-space-5","--sk-space-6","--sk-space-7","--sk-space-8",
                 "--sk-space-9","--sk-space-10","--sk-space-11","--sk-space-12"]
    },
    "radius": {
      "prefix": "--sk-radius-",
      "tokens": ["--sk-radius-sm", "--sk-radius-md", "--sk-radius-lg", "--sk-radius-pill"]
    },
    "shadow": {
      "prefix": "--sk-shadow-",
      "tokens": ["--sk-shadow-card", "--sk-shadow-glow-primary"]
    },
    "motion": {
      "prefix": "--sk-motion-",
      "tokens": ["--sk-motion-duration-fast", "--sk-motion-duration-base",
                 "--sk-motion-ease-out"]
    }
  },
  "pairing_rules": [
    { "surface": "--sk-surface-page", "foreground": "--sk-fg-default" },
    { "surface": "--sk-surface-card", "foreground": "--sk-fg-on-card" },
    { "surface": "--sk-color-yellow", "foreground": "--sk-fg-on-primary" }
  ]
}
```

**Note:** Token values (`#F5C518`, etc.) are intentionally omitted from this contract — they are the output of FR-034 reconciliation and will be present in the final `tokens.css`. The schema shape here is the structural contract; values are set once and frozen until a major version bump.

---

## 3. Storybook Story Contract

Every component story must satisfy:

```typescript
// Minimum story shape for all framework targets
export default {
  title: '<Category>/<ComponentName>',
  parameters: {
    a11y: { disable: false },              // axe-core always enabled
    backgrounds: { default: 'sk-dark' },   // default to dark surface
  },
} satisfies Meta;

// Required named exports
export const Default: Story = { ... };     // default state (MANDATORY)
// Optional but expected for interactive components:
export const Hover: Story = { ... };
export const Focus: Story = { ... };
export const Disabled: Story = { ... };
// Responsive breakpoints tested via viewport parameter
```

**Invariant:** No story may import from `@spec-kitty/angular` inside an `html` story or vice-versa. Framework isolation is enforced at the story file level.

---

## 4. CI Job Dependency Contract

Path-scoped triggering (FR-035) — which jobs run on which file changes:

| Changed paths | Jobs triggered |
|---|---|
| `packages/tokens/**` | lint, npm-audit, lockfile-check, token-schema-validate, storybook-build, a11y, visual-regression |
| `packages/angular/**` or `packages/html-js/**` | lint, npm-audit, lockfile-check, storybook-build, interaction-tests, a11y, playwright, visual-regression, lighthouse |
| `apps/storybook/**` | storybook-build, interaction-tests, a11y, visual-regression, lighthouse |
| `doctrine/**` or `skills/**` | doctrine-schema-validate |
| `.github/workflows/**` | workflow-lint (SHA pin check) |
| `docs/**` | markdownlint |
| everything on push to `main` | storybook-deploy (GitHub Pages) |
| PR opened/updated | pr-preview (surge.sh) |
| `vX.Y.Z` tag push | release (npm publish + SBOM) |

---

## 5. Release Artefact Contract

On `vX.Y.Z` tag push, the release pipeline produces:

| Artefact | Location | Description |
|---|---|---|
| `@spec-kitty/tokens@X.Y.Z` | npm registry | Published with `--provenance` |
| `@spec-kitty/angular@X.Y.Z` | npm registry | Published with `--provenance` |
| `@spec-kitty/html-js@X.Y.Z` | npm registry | Published with `--provenance` |
| `spec-kitty-design-sbom.cdx.json` | GitHub Release | CycloneDX SBOM for all three packages |
| Storybook build | GitHub Pages | Auto-deployed on merge to `main` (separate workflow) |

**Invariant:** No package is published if any hard-gate CI check fails on the tagged commit. The release workflow checks CI status before the publish step.
