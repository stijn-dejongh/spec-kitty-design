# nx Project Contracts

*Phase 1 output — nx project.json shapes and executor contracts for each package*

---

## Workspace root `nx.json`

Key configuration decisions:

```json
{
  "npmScope": "spec-kitty",
  "affected": {
    "defaultBase": "main"
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "storybook:build"]
      }
    }
  },
  "targetDefaults": {
    "build": { "dependsOn": ["^build"] },
    "lint": { "inputs": ["default", "{workspaceRoot}/.eslintrc*", "{workspaceRoot}/eslint.config.mjs"] },
    "storybook:build": { "dependsOn": ["^build"] }
  }
}
```

---

## `packages/tokens` — `project.json`

```json
{
  "name": "tokens",
  "projectType": "library",
  "sourceRoot": "packages/tokens/src",
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "options": {
        "outputPath": "packages/tokens/dist",
        "assets": [
          { "input": "packages/tokens/src", "glob": "tokens.css", "output": "/" },
          { "input": "packages/tokens", "glob": "README.md", "output": "/" }
        ]
      }
    },
    "catalogue": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node scripts/generate-token-catalogue.js"
      },
      "dependsOn": ["build"]
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": { "lintFilePatterns": ["packages/tokens/**/*.css"] }
    }
  },
  "tags": ["scope:tokens", "type:publishable"]
}
```

---

## `packages/angular` — `project.json`

```json
{
  "name": "angular",
  "projectType": "library",
  "sourceRoot": "packages/angular/src",
  "targets": {
    "build": {
      "executor": "@nx/angular:package",
      "options": {
        "project": "packages/angular/ng-package.json"
      },
      "dependsOn": ["tokens:build"]
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": { "lintFilePatterns": ["packages/angular/**/*.ts", "packages/angular/**/*.html"] }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "options": { "jestConfig": "packages/angular/jest.config.ts" }
    }
  },
  "tags": ["scope:angular", "type:publishable", "framework:angular"]
}
```

---

## `packages/html-js` — `project.json`

```json
{
  "name": "html-js",
  "projectType": "library",
  "sourceRoot": "packages/html-js/src",
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "options": {
        "outputPath": "packages/html-js/dist",
        "tsConfig": "packages/html-js/tsconfig.lib.json"
      },
      "dependsOn": ["tokens:build"]
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": { "lintFilePatterns": ["packages/html-js/**/*.ts", "packages/html-js/**/*.html"] }
    }
  },
  "tags": ["scope:html-js", "type:publishable", "framework:vanilla"]
}
```

---

## `apps/storybook` — `project.json`

```json
{
  "name": "storybook",
  "projectType": "application",
  "sourceRoot": "apps/storybook/src",
  "targets": {
    "storybook": {
      "executor": "@nx/storybook:storybook",
      "options": {
        "port": 6006,
        "configDir": "apps/storybook/.storybook"
      },
      "dependsOn": ["angular:build", "html-js:build", "tokens:build"]
    },
    "storybook:build": {
      "executor": "@nx/storybook:build",
      "options": {
        "outputDir": "apps/storybook/storybook-static",
        "configDir": "apps/storybook/.storybook"
      },
      "dependsOn": ["angular:build", "html-js:build", "tokens:build"]
    },
    "a11y": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node scripts/run-axe-storybook.js"
      },
      "dependsOn": ["storybook:build"]
    },
    "visual-baseline": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test --update-snapshots"
      },
      "dependsOn": ["storybook:build"]
    }
  },
  "tags": ["scope:docs", "type:internal"]
}
```

---

## Dependency enforcement rule

nx module boundary lint rule (enforced via `@nx/eslint-plugin`):

```json
{
  "rule": "@nx/enforce-module-boundaries",
  "options": {
    "depConstraints": [
      { "sourceTag": "scope:angular",  "onlyDependOnLibsWithTags": ["scope:tokens"] },
      { "sourceTag": "scope:html-js",  "onlyDependOnLibsWithTags": ["scope:tokens"] },
      { "sourceTag": "scope:docs",     "onlyDependOnLibsWithTags": ["scope:tokens", "scope:angular", "scope:html-js"] },
      { "sourceTag": "type:publishable", "notDependOnLibsWithTags": ["type:internal"] }
    ]
  }
}
```

This encodes the token-first dependency rule from ADR-002 as an enforced lint constraint: framework packages may only depend on the token package, and publishable packages may not depend on internal packages.
