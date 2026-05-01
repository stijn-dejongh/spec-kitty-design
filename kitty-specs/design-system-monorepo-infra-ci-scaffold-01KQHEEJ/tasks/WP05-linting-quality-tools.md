---
work_package_id: WP05
title: Linting & Code Quality Tools
dependencies:
- WP01
requirement_refs:
- FR-017
- FR-018
- FR-019
- FR-020
- FR-046
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T027
- T028
- T029
- T030
- T031
- T032
agent: "claude:claude-sonnet-4-6:reviewer-renata:reviewer"
shell_pid: "2851895"
history:
- date: '2026-05-01'
  event: created
agent_profile: node-norris
authoritative_surface: eslint.config.mjs
execution_mode: code_change
owned_files:
- eslint.config.mjs
- stylelint.config.mjs
- .htmlhintrc
- commitlint.config.cjs
- .github/security-allowlist.md
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load node-norris
```

---

## Objective

Configure ESLint, Stylelint, HTMLHint, and commitlint with their root config files, quality scripts, and the security allowlist. These tools form the code-quality layer of the CI pipeline and must pass on a clean codebase before WP07 wires them into GitHub Actions.

Note: Stylelint `--sk-*` token enforcement was configured in WP02 — this WP focuses on the other quality tools.

## Subtask Guidance

### T027 — ESLint 9.x flat config

Install:
```bash
npm install --save-dev \
  eslint@9 \
  @nx/eslint-plugin \
  eslint-plugin-security \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  --ignore-scripts
```

**`eslint.config.mjs`** (root workspace flat config):
```javascript
import nx from '@nx/eslint-plugin';
import security from 'eslint-plugin-security';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // nx module boundary enforcement (ADR-002: token-first dependency rule)
  ...nx.configs['flat/base'],
  {
    files: ['packages/**/*.ts', 'apps/**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin, security },
    languageOptions: { parser: tsParser },
    rules: {
      // Enforce package boundaries per project tags
      '@nx/enforce-module-boundaries': ['error', {
        depConstraints: [
          { sourceTag: 'scope:angular',  onlyDependOnLibsWithTags: ['scope:tokens'] },
          { sourceTag: 'scope:html-js',  onlyDependOnLibsWithTags: ['scope:tokens'] },
          { sourceTag: 'scope:docs',     onlyDependOnLibsWithTags: ['scope:tokens', 'scope:angular', 'scope:html-js'] },
          { sourceTag: 'type:publishable', notDependOnLibsWithTags: ['type:internal'] },
        ],
      }],
      // Security plugin — catch common vulnerabilities
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-unsafe-regex': 'error',
    },
  },
  // Ignore build outputs and generated files
  { ignores: ['**/dist/**', '**/storybook-static/**', '**/*.js.map'] },
];
```

**Validation**: `npx nx run-many --target=lint --all` exits 0 on clean codebase.

### T028 — Stylelint update: add root config

WP02 created the core Stylelint rule. This task adds the remaining rules for the workspace:

Update **`stylelint.config.mjs`** to also include:
```javascript
// Add after the declaration-strict-value rule:
rules: {
  ...existingRules,
  'selector-class-pattern': '^sk-[a-z][a-z0-9]*(__[a-z][a-z0-9]*)?(-{1,2}[a-z][a-z0-9]*)*$',
  // All SK component class names must follow BEM with sk- prefix
  'color-no-invalid-hex': true,
  'unit-no-unknown': true,
  'property-no-unknown': true,
}
```

### T029 — HTMLHint config

Install: `npm install --save-dev htmlhint --ignore-scripts`

**`.htmlhintrc`**:
```json
{
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "doctype-first": false,
  "tag-pair": true,
  "spec-char-escape": true,
  "id-unique": true,
  "src-not-empty": true,
  "attr-no-duplication": true,
  "title-require": false,
  "alt-require": true,
  "input-requires-label": true
}
```

Add to `apps/storybook/project.json` lint target:
```json
"htmlhint": {
  "executor": "nx:run-commands",
  "options": { "command": "npx htmlhint 'apps/storybook/src/**/*.html' 'packages/**/*.html'" }
}
```

### T030 — commitlint config

Install: `npm install --save-dev @commitlint/cli @commitlint/config-conventional --ignore-scripts`

**`commitlint.config.cjs`**:
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'tokens', 'angular', 'html-js', 'storybook',
      'doctrine', 'ci', 'docs', 'release', 'deps', 'security',
    ]],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
  },
};
```

### T031 — Quality scripts in root `package.json`

Update the `scripts` section:
```json
{
  "scripts": {
    "quality:lint": "nx run-many --target=lint --all",
    "quality:stylelint": "stylelint 'packages/**/*.css' 'packages/**/*.scss'",
    "quality:htmlhint": "htmlhint 'packages/**/*.html' 'apps/storybook/src/**/*.html'",
    "quality:commitlint": "commitlint --from=HEAD~1",
    "quality:all": "npm run quality:lint && npm run quality:stylelint && npm run quality:htmlhint"
  }
}
```

### T032 — `.github/security-allowlist.md`

Create `.github/security-allowlist.md`:
```markdown
# Security Allowlist — Postinstall Script Exceptions

This file documents every npm package that has been explicitly reviewed
and approved to run postinstall/install/prepare lifecycle scripts.
CI enforces `npm ci --ignore-scripts`; any package that requires a
postinstall hook must be listed here with rationale.

## Approved exceptions

| Package | Script purpose | Reviewed by | Date | Expiry review |
|---|---|---|---|---|
| (none at v1.0.0) | | | | |

## Adding an exception

1. Review the postinstall script source on the package's GitHub repo
2. Confirm it only performs legitimate setup (native module compilation, font download, etc.)
3. Add a row to the table above with your name and the date
4. Add the package to `npm install --ignore-scripts` exception in `ci-quality.yml`
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `eslint.config.mjs` present; `npx nx run-many --target=lint --all` exits 0
- [ ] `stylelint.config.mjs` rejects hardcoded values and enforces `sk-` BEM class naming
- [ ] `.htmlhintrc` present with accessibility-aware rules
- [ ] `commitlint.config.cjs` present with SK scopes
- [ ] `npm run quality:all` exits 0 on clean codebase
- [ ] `.github/security-allowlist.md` present

## Reviewer Guidance

Test the ESLint boundary rule by adding a direct import from `packages/angular` into `packages/html-js` — it must fail. Test Stylelint by adding `color: red` to any package CSS file — it must fail.

## Activity Log

- 2026-05-01T17:39:10Z – claude:claude-sonnet-4-6:node-norris:implementer – shell_pid=2807698 – Started implementation via action command
- 2026-05-01T17:49:28Z – claude:claude-sonnet-4-6:node-norris:implementer – shell_pid=2807698 – ESLint/Stylelint/HTMLHint/commitlint configured; security allowlist template created; npm run quality:all exits 0
- 2026-05-01T17:50:09Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=2851895 – Started review via action command
- 2026-05-01T17:51:41Z – claude:claude-sonnet-4-6:reviewer-renata:reviewer – shell_pid=2851895 – Review passed: all linting tools configured correctly
