# Running quality checks locally

Match CI behavior locally before pushing. All checks below run in CI on every PR.

## Full check suite

```bash
npm run quality:all    # ESLint + Stylelint + HTMLHint
```

## Individual checks

| Check | Command | What it catches | When to run |
|---|---|---|---|
| ESLint | `npm run quality:lint` | TS errors, module boundary violations, security issues | Before every commit |
| Stylelint | `npm run quality:stylelint` | Hardcoded CSS values (must use `--sk-*`) | After editing any CSS |
| HTMLHint | `npm run quality:htmlhint` | HTML validity, missing `alt` attributes | After editing any HTML template |
| commitlint | `npm run quality:commitlint` | Conventional commit format | After the final commit on a branch |
| npm audit | `bash scripts/npm-audit-gate.sh` | Known CVEs in dependencies | After adding or updating dependencies |
| Lockfile | `npm ci --dry-run --ignore-scripts` | Lockfile drift detection | After any `package.json` change |
| Action SHA pins | `bash scripts/check-action-pins.sh` | Mutable `@v*` tags in workflows | After editing `.github/workflows/` |

## Storybook-specific

```bash
npx nx run storybook:storybook:build    # build to storybook-static/
node scripts/run-axe-storybook.js       # WCAG 2.1 AA check
npx playwright test                     # cross-browser + visual regression
```

## Visual regression

On a clean run:
```bash
npx playwright test apps/storybook/src/tests/visual.spec.ts
```

To update baselines after an intentional visual change:
```bash
npx playwright test --update-snapshots
git add apps/storybook/src/tests/visual.spec.ts-snapshots/
```

Baseline snapshots must be committed alongside the component change so that CI
can compare against the correct reference.

## CI parity note

CI uses `npm ci --ignore-scripts` (never `npm install`). Run locally with:
```bash
npm ci --ignore-scripts
```
If `npm install` is needed for a new dependency, commit the updated lockfile before
pushing — a lockfile drift failure in CI means the lockfile does not match `package.json`.
