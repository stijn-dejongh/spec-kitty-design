# Contributor Quickstart: Design System Monorepo Infrastructure

*Phase 1 output — onboarding guide for new contributors (NFR-001: ≤30 min from clone to passing checks)*

---

## Prerequisites

- Node.js 22 LTS (`node --version` should show `v22.x.x`)
- npm 10+ (bundled with Node 22)
- Git

No other global installs required before setup.

---

## 1. Clone and install

```bash
git clone https://github.com/stijn-dejongh/spec-kitty-design.git
cd spec-kitty-design
npm ci --ignore-scripts
```

> `npm ci` (not `npm install`) is required — it reads the lockfile exactly and never updates it. `--ignore-scripts` prevents postinstall hooks from running.

---

## 2. Verify the workspace

```bash
npx nx show projects
```

Expected output:
```
tokens
angular
html-js
storybook
```

---

## 3. Run all quality checks locally

```bash
npm run quality:all
```

This runs (in order): lockfile check → ESLint → Stylelint → HTMLHint → axe snapshot → Playwright smoke.

For a faster feedback loop on a specific package:

```bash
npx nx run tokens:lint
npx nx run angular:lint
npx nx run storybook:build
```

---

## 4. Start Storybook

```bash
npx nx run storybook:storybook
```

Opens at `http://localhost:6006`. The "Getting Started" page shows how to import and use the token package.

---

## 5. Build the publishable packages

```bash
npx nx run-many --target=build --projects=tokens,angular,html-js
```

Outputs land in `packages/{tokens,angular,html-js}/dist/`.

---

## 6. Adding a design token

1. Open `packages/tokens/src/tokens.css`
2. Add the property in the correct category block following the `--sk-<category>-<name>` convention (ADR-003)
3. Regenerate the catalogue: `npm run tokens:catalogue`
4. Verify Stylelint passes: `npx nx run tokens:lint`
5. Commit: `git commit -m "feat(tokens): add --sk-<name>"`

---

## 7. Adding a component

1. Generate the Angular component stub:
   ```bash
   npx nx g @nx/angular:component <name> --project=angular --export
   ```
2. Add a matching HTML primitive in `packages/html-js/src/<name>/`
3. Write Storybook stories in `apps/storybook/src/stories/<name>.stories.ts`
4. Run checks: `npx nx run storybook:build && npm run quality:a11y`
5. Commit following conventional commit format: `feat(angular): add <name> component`

---

## 8. Commit message format

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, chore, docs, style, refactor, test, ci
Scopes: tokens, angular, html-js, storybook, doctrine, ci, docs
```

commitlint enforces this on every commit.

---

## 9. Submitting a PR

- PRs automatically get a surge.sh preview URL posted as a comment (NFR-008)
- All CI gates must be green before merge
- PRs touching component files or the token layer require a screenshot or visual diff in the description
- Documentation-only PRs (stories, README, SKILL.md) can self-merge when CI is green

---

## 10. Key files at a glance

| File | Purpose |
|---|---|
| `packages/tokens/src/tokens.css` | All `--sk-*` token values — the single source of truth |
| `packages/tokens/dist/token-catalogue.json` | Generated schema — used by Stylelint and agent governance |
| `apps/storybook/.storybook/main.ts` | Storybook multi-framework renderer config |
| `doctrine/` | Org-layer brand governance artifacts for AI agents |
| `skills/spec-kitty-design/SKILL.md` | Claude Code / AI agent skill |
| `docs/architecture/sad-lite.md` | System architecture overview |
| `.github/workflows/ci-quality.yml` | CI pipeline definition |
| `docs/contributing/` | Full contributor documentation |
