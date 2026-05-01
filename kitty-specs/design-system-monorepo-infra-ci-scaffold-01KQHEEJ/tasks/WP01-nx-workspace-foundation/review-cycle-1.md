# WP01 Review Cycle 1 — Reviewer: Renata

**Reviewed**: 2026-05-01
**Outcome**: Changes Requested

---

## Passing Criteria

All core acceptance criteria pass:

- `npm ci --ignore-scripts` exits 0 (verified)
- `npx nx show projects` lists all four projects: `tokens`, `angular`, `html-js`, `storybook` (verified)
- All four `project.json` files present with correct tags (verified)
- `.npmrc` present with `@spec-kitty:registry=https://registry.npmjs.org/` (verified)
- No `*` or `latest` version specifiers in any `package.json` (verified)
- Root `package.json` has `"private": true` and `"workspaces": ["packages/*", "apps/*"]` (verified)
- `nx.json` present with cache config and `targetDefaults` (verified)
- `package-lock.json` committed and not gitignored (verified)
- nx 20.x present (v20.8.4 local) (verified)
- `apps/storybook/src/.gitkeep` and `apps/storybook/.storybook/.gitkeep` present (verified)

---

## Issue 1 — T007 Boundary Violation: storybook `package.json` and `project.json` must NOT be created in WP01

**Severity**: Blocking

**Description**: T007 of the WP01 spec explicitly states:

> "WP04 owns `apps/storybook/package.json` and `apps/storybook/project.json` — do not create those files here. WP04 will install Storybook and populate `package.json` and `project.json` when it runs."

However, the WP01 commit includes both files:
- `apps/storybook/package.json`
- `apps/storybook/project.json`

This violates DIRECTIVE_010 (Specification Fidelity Requirement) and DIRECTIVE_001 (Architectural Integrity Standard). WP04 depends on these files not existing so it can own their creation as part of the Storybook installation step. Pre-creating them with placeholder content means WP04 must either conflict-resolve or overwrite, introducing unintended coupling between WP01 and WP04.

**Note**: The `apps/storybook/` directory skeleton with `src/.gitkeep` and `.storybook/.gitkeep` IS correct and expected — only the two JSON files are out of scope for WP01.

**How to fix**:

1. Remove the two files from git tracking:
   ```bash
   cd /home/stijnd/Documents/code/forks/spec-kitty-design/.worktrees/design-system-monorepo-infra-ci-scaffold-01KQHEEJ-lane-a
   git rm apps/storybook/package.json apps/storybook/project.json
   ```

2. Verify nx still lists `storybook` (it will NOT after removing `project.json` — that is expected and correct; WP04 will register it when it adds the file):
   ```bash
   npx nx show projects
   # After removal, storybook should NOT be listed — this is correct; WP04 owns registration
   ```

3. Re-run `npm ci --ignore-scripts` to confirm the lockfile is still clean.

4. Commit the removal:
   ```bash
   git commit -m "fix(WP01): remove storybook package.json and project.json — owned by WP04"
   ```

---

## Notes for WP04

WP04 agent: when you implement the Storybook installation, you will need to create `apps/storybook/package.json` and `apps/storybook/project.json` from scratch. They will NOT be present after this fix is applied. The `apps/storybook/` directory will exist with `.gitkeep` placeholders in `src/` and `.storybook/`.

---

## Notes for Dependent WPs

WP02, WP05, WP06, WP10, WP11 all depend on WP01. Once WP01 is re-approved after this fix, rebase your lanes:

```bash
git rebase kitty/mission-design-system-monorepo-infra-ci-scaffold-01KQHEEJ
```
