---
work_package_id: WP01
title: nx Workspace Foundation
dependencies: []
requirement_refs:
- FR-001
- FR-002
- FR-003
- FR-004
- FR-005
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
base_branch: kitty/mission-design-system-monorepo-infra-ci-scaffold-01KQHEEJ
base_commit: 69140997ae6d431b9b4b6c829007849fd52f890c
created_at: '2026-05-01T15:49:49.018498+00:00'
subtasks:
- T001
- T002
- T003
- T004
- T005
- T006
- T007
- T008
- T009
agent: claude
shell_pid: '2391053'
history:
- date: '2026-05-01'
  event: created
agent_profile: node-norris
authoritative_surface: nx.json
execution_mode: code_change
owned_files:
- nx.json
- package.json
- package-lock.json
- .npmrc
- packages/tokens/package.json
- packages/angular/package.json
- packages/angular/project.json
- packages/html-js/package.json
- packages/html-js/project.json
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

Before reading further, load the **Node Norris** implementer profile for this session:

```
/ad-hoc-profile-load node-norris
```

This profile governs Node.js/npm monorepo work. Apply its boundaries throughout this WP.

---

## Objective

Bootstrap the nx 20.x monorepo at the repository root (`/home/stijnd/Documents/code/forks/spec-kitty-design/`). By the end of this WP, `npx nx show projects` lists four projects (`tokens`, `angular`, `html-js`, `storybook`) and `npm ci --ignore-scripts` installs cleanly from a fresh clone.

**This WP creates skeleton structure only — no component code, no CSS, no stories.**

## Context

- Repo root already contains: `README.md`, `LICENSE`, `.gitignore`, `.kittify/`, `docs/`, `kitty-specs/`, `tmp/` (gitignored)
- The existing `package.json` at root (if any) must be replaced by the nx workspace root manifest
- ADR-002: separate publishable packages (`@spec-kitty/tokens`, `@spec-kitty/angular`, `@spec-kitty/html-js`) in `packages/`; Storybook host in `apps/storybook/` (internal, not published)
- ADR-005: `npm ci --ignore-scripts` always; no `*` or `latest` version specifiers (C-009)
- nx module boundary rules are configured here; they encode ADR-002's token-first dependency rule

## Subtask Guidance

### T001 — Init nx 20.x workspace

**Purpose**: Create the nx workspace configuration at the repo root without wiping existing files.

**Steps**:
1. Do NOT run `create-nx-workspace` (it would scaffold a new directory). Instead, install nx manually:
   ```bash
   npm init -y  # only if no package.json exists
   npm install --save-dev nx@20 --ignore-scripts
   ```
2. Create `nx.json` (see T003 for contents).
3. Add `"workspaces": ["packages/*", "apps/*"]` to root `package.json`.

**Note**: nx 20.x does not require a `@nx/workspace` global. The local `nx` binary in `node_modules/.bin/nx` is sufficient.

**Validation**: `npx nx --version` returns `20.x.x`.

### T002 — Root `package.json`

**Purpose**: Workspace root manifest — not publishable, owns monorepo scripts.

**Final shape**:
```json
{
  "name": "spec-kitty-design",
  "version": "0.0.0",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "quality:lint": "nx run-many --target=lint --all",
    "quality:all": "nx run-many --target=lint --all && bash scripts/npm-audit-gate.sh",
    "tokens:catalogue": "node scripts/generate-token-catalogue.js"
  },
  "devDependencies": {
    "nx": "20.x.x"
  }
}
```

**Constraint (C-009)**: Use exact versions or caret-bounded ranges — no `*` or `latest`.

### T003 — `nx.json`

**Purpose**: nx workspace config with caching, target defaults, and dependency enforcement.

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "affected": { "defaultBase": "main" },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "storybook:build"]
      }
    }
  },
  "targetDefaults": {
    "build": { "dependsOn": ["^build"], "cache": true },
    "lint": { "cache": true },
    "storybook:build": { "dependsOn": ["^build"], "cache": true }
  },
  "defaultProject": "storybook"
}
```

### T004 — `packages/tokens/` skeleton

**Files to create**:

`packages/tokens/package.json`:
```json
{
  "name": "@spec-kitty/tokens",
  "version": "1.0.0",
  "description": "Spec Kitty design tokens — CSS custom properties (--sk-* namespace)",
  "main": "dist/tokens.css",
  "exports": { ".": "./dist/tokens.css", "./catalogue": "./dist/token-catalogue.json" },
  "files": ["dist/tokens.css", "dist/token-catalogue.json", "README.md"],
  "peerDependencies": {}
}
```

`packages/tokens/project.json`:
```json
{
  "name": "tokens",
  "projectType": "library",
  "sourceRoot": "packages/tokens/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "cp packages/tokens/src/tokens.css packages/tokens/dist/tokens.css" }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": { "lintFilePatterns": ["packages/tokens/**/*.css"] }
    }
  },
  "tags": ["scope:tokens", "type:publishable"]
}
```

Create `packages/tokens/src/.gitkeep` and `packages/tokens/dist/.gitkeep`.

### T005 — `packages/angular/` skeleton

`packages/angular/package.json`:
```json
{
  "name": "@spec-kitty/angular",
  "version": "1.0.0",
  "peerDependencies": {
    "@angular/core": ">=19.0.0 <20.0.0",
    "@spec-kitty/tokens": "^1.0.0"
  }
}
```

`packages/angular/project.json`:
```json
{
  "name": "angular",
  "projectType": "library",
  "sourceRoot": "packages/angular/src",
  "targets": {
    "build": { "executor": "@nx/angular:package", "options": { "project": "packages/angular/ng-package.json" } },
    "lint": { "executor": "@nx/eslint:lint", "options": { "lintFilePatterns": ["packages/angular/**/*.ts"] } }
  },
  "tags": ["scope:angular", "type:publishable", "framework:angular"]
}
```

Create `packages/angular/src/index.ts` (empty export) and `packages/angular/ng-package.json`:
```json
{ "$schema": "../../node_modules/ng-packagr/ng-package.schema.json", "lib": { "entryFile": "src/index.ts" } }
```

### T006 — `packages/html-js/` skeleton

Similar pattern to tokens. Tags: `["scope:html-js", "type:publishable", "framework:vanilla"]`.

`packages/html-js/src/index.ts` — empty export.

### T007 — `apps/storybook/` skeleton

Create the directory structure with placeholder files only. **WP04 owns `apps/storybook/package.json` and `apps/storybook/project.json`** — do not create those files here.

```bash
mkdir -p apps/storybook/src apps/storybook/.storybook
touch apps/storybook/src/.gitkeep
touch apps/storybook/.storybook/.gitkeep
```

WP04 will install Storybook and populate `package.json` and `project.json` when it runs.

### T008 — `.npmrc`

```ini
@spec-kitty:registry=https://registry.npmjs.org/
```

This scopes all `@spec-kitty/*` publishes to the public registry.

### T009 — Commit lockfile + verify clean install

1. Run `npm install --ignore-scripts` once to generate `package-lock.json`.
2. Run `npm ci --ignore-scripts` to verify it installs cleanly from the lockfile.
3. Commit `package-lock.json`.
4. Run `npx nx show projects` — must list all four projects.

**Validation checklist**:
- [ ] `npm ci --ignore-scripts` exits 0
- [ ] `npx nx show projects` lists: tokens, angular, html-js, storybook
- [ ] `package-lock.json` is committed and not in `.gitignore`
- [ ] No `*` or `latest` in any `package.json` devDependency

## Branch Strategy

Planning base: `main`. Merge target: `main`. The worktree for this WP is allocated by the lane executor. All file changes are within `owned_files` listed in frontmatter.

## Definition of Done

- [ ] `npm ci --ignore-scripts` succeeds from clean clone
- [ ] `npx nx show projects` lists tokens, angular, html-js, storybook
- [ ] `package-lock.json` committed
- [ ] All four `project.json` files present and valid
- [ ] `.npmrc` present with `@spec-kitty` scope config
- [ ] No `*` or `latest` version specifiers anywhere

## Risks

- If `@angular/core` 19.x is not yet available on npm, use the latest available LTS (document in ADR-003 addendum)
- nx 20.x and `@nx/angular` must be compatible — check [nx compatibility matrix](https://nx.dev/nx-api/angular) before installing

## Reviewer Guidance

Verify `npx nx graph` renders a valid dependency graph with no cross-framework edges. Check `package-lock.json` was committed (not gitignored). Confirm no `*` version specifiers via `grep -r '"latest"' packages/ apps/`.
