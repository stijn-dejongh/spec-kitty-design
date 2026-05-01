---
work_package_id: WP08
title: Visual, A11y & Browser Quality Gates
dependencies:
- WP04
- WP07
requirement_refs:
- FR-021
- FR-022
- FR-023
- FR-024
- FR-025
planning_base_branch: main
merge_target_branch: main
branch_strategy: Planning artifacts for this feature were generated on main. During /spec-kitty.implement this WP may branch from a dependency-specific base, but completed changes must merge back into main unless the human explicitly redirects the landing branch.
subtasks:
- T044
- T045
- T046
- T047
- T048
- T049
agent: claude
history:
- date: '2026-05-01'
  event: created
agent_profile: frontend-freddy
authoritative_surface: playwright.config.ts
execution_mode: code_change
owned_files:
- playwright.config.ts
- apps/storybook/.visual-baselines/**
- apps/storybook/src/tests/**
- scripts/run-axe-storybook.js
role: implementer
tags: []
---

## ⚡ Do This First: Load Agent Profile

```
/ad-hoc-profile-load frontend-freddy
```

---

## Objective

Extend the CI pipeline with Storybook interaction tests, axe-core WCAG 2.1 AA hard gate, Playwright cross-browser smoke, Lighthouse advisory checks, and Playwright visual regression baselines. All extend `ci-quality.yml` established in WP07.

## Subtask Guidance

### T044 — axe-core WCAG 2.1 AA CI gate (FR-021, hard gate)

Install:
```bash
npm install --save-dev axe-playwright @axe-core/cli --ignore-scripts
```

**`scripts/run-axe-storybook.js`**:
```javascript
#!/usr/bin/env node
// Runs axe-core against the built Storybook and fails on WCAG 2.1 AA violations
const { chromium } = require('playwright');
const { injectAxe, checkA11y } = require('axe-playwright');
const { readdirSync, readFileSync } = require('fs');
const path = require('path');

const STORYBOOK_DIR = 'apps/storybook/storybook-static';
const BASE_URL = `file://${path.resolve(STORYBOOK_DIR)}/index.html`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BASE_URL);
  await injectAxe(page);

  const results = await checkA11y(page, '#storybook-root', {
    axeOptions: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } },
    detailedReport: true,
  });

  await browser.close();

  if (results.violations.length > 0) {
    console.error(`❌ ${results.violations.length} WCAG 2.1 AA violations found:`);
    results.violations.forEach(v => console.error(`  ${v.id}: ${v.description}`));
    process.exit(1);
  }
  console.log('✅ Zero WCAG 2.1 AA violations.');
})();
```

### T045 — Playwright cross-browser smoke tests (FR-023)

Install: `npm install --save-dev @playwright/test --ignore-scripts`
Install browsers: `npx playwright install --with-deps chromium firefox webkit`

**`playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'apps/storybook/src/tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: `file://${process.cwd()}/apps/storybook/storybook-static/`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

**`apps/storybook/src/tests/smoke.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test('Storybook loads and renders stub stories', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Storybook/);
});

test('SK-stub Angular story renders', async ({ page }) => {
  await page.goto('/?path=/story/primitives-skstub-angular--default');
  const stub = page.locator('.sk-stub').first();
  await expect(stub).toBeVisible();
});

test('SK-stub HTML story renders', async ({ page }) => {
  await page.goto('/?path=/story/primitives-skstub-html--default');
  const stub = page.locator('.sk-stub').first();
  await expect(stub).toBeVisible();
});
```

### T046 — Playwright visual regression baselines (FR-024)

**`apps/storybook/src/tests/visual.spec.ts`**:
```typescript
import { test, expect } from '@playwright/test';

test('SK-stub Angular default — visual baseline', async ({ page }) => {
  await page.goto('/?path=/story/primitives-skstub-angular--default');
  await page.waitForSelector('.sk-stub');
  await expect(page).toMatchSnapshot('sk-stub-angular-default.png', { threshold: 0.02 });
});

test('SK-stub HTML default — visual baseline', async ({ page }) => {
  await page.goto('/?path=/story/primitives-skstub-html--default');
  await page.waitForSelector('.sk-stub');
  await expect(page).toMatchSnapshot('sk-stub-html-default.png', { threshold: 0.02 });
});
```

**Create initial baselines**:
```bash
npx playwright test apps/storybook/src/tests/visual.spec.ts --update-snapshots
```

Commit the `.png` baseline files in `apps/storybook/src/tests/visual.spec.ts-snapshots/`.

### T047 — Lighthouse CI advisory (FR-022)

Install: `npm install --save-dev @lhci/cli --ignore-scripts`

**`lighthouserc.cjs`** (root):
```javascript
module.exports = {
  ci: {
    collect: {
      staticDistDir: 'apps/storybook/storybook-static',
      numberOfRuns: 1,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:performance':   ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
```

**Note**: Lighthouse results are advisory (warn, not error) — they do not block merge but are reported in CI.

### T048 — Storybook interaction tests (FR-025)

The Storybook `@storybook/test` package is already installed in WP04. Add interaction test to the Angular stub story:

**Update `packages/angular/src/lib/stub/sk-stub.stories.ts`**:
```typescript
import { userEvent, within } from '@storybook/test';

// Add to existing story:
export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stub = canvas.getByRole('generic', { name: /stub/i });
    await userEvent.hover(stub);
  },
};
```

These interaction tests run during `npx nx run storybook:storybook:build` — no separate runner needed.

### T049 — Extend `ci-quality.yml`

Add these jobs to `.github/workflows/ci-quality.yml` after the `storybook-build` job:

```yaml
  # ── Accessibility gate ────────────────────────────────────────────────────
  a11y:
    runs-on: ubuntu-latest
    needs: [storybook-build]
    if: needs.storybook-build.result == 'success'
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - uses: actions/download-artifact@REPLACE_WITH_SHA
        with: { name: storybook-static, path: apps/storybook/storybook-static }
      - name: "[ENFORCED] axe WCAG 2.1 AA gate (FR-021)"
        run: npx playwright install chromium && node scripts/run-axe-storybook.js

  # ── Visual regression ──────────────────────────────────────────────────────
  visual-regression:
    runs-on: ubuntu-latest
    needs: [storybook-build]
    if: needs.storybook-build.result == 'success'
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - uses: actions/download-artifact@REPLACE_WITH_SHA
        with: { name: storybook-static, path: apps/storybook/storybook-static }
      - run: npx playwright install --with-deps chromium
      - name: "[ENFORCED] Visual regression (FR-024)"
        run: npx playwright test apps/storybook/src/tests/visual.spec.ts
      - uses: actions/upload-artifact@REPLACE_WITH_SHA
        if: failure()
        with:
          name: visual-regression-diffs
          path: playwright-report/

  # ── Cross-browser smoke ────────────────────────────────────────────────────
  playwright:
    runs-on: ubuntu-latest
    needs: [storybook-build]
    if: needs.storybook-build.result == 'success'
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - uses: actions/download-artifact@REPLACE_WITH_SHA
        with: { name: storybook-static, path: apps/storybook/storybook-static }
      - run: npx playwright install --with-deps
      - name: "[ENFORCED] Cross-browser smoke (FR-023)"
        run: npx playwright test apps/storybook/src/tests/smoke.spec.ts

  # ── Lighthouse (advisory) ──────────────────────────────────────────────────
  lighthouse:
    runs-on: ubuntu-latest
    needs: [storybook-build]
    if: needs.storybook-build.result == 'success'
    continue-on-error: true   # advisory only
    steps:
      - uses: actions/checkout@REPLACE_WITH_SHA
      - uses: actions/setup-node@REPLACE_WITH_SHA
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci --ignore-scripts
      - uses: actions/download-artifact@REPLACE_WITH_SHA
        with: { name: storybook-static, path: apps/storybook/storybook-static }
      - name: "[INFO] Lighthouse audit (FR-022)"
        run: npx lhci autorun
```

Also update the `gate` job to depend on `a11y`, `visual-regression`, `playwright`:
```yaml
  gate:
    needs: [security, workflow-pin-check, lint-code, a11y, visual-regression, playwright]
```

## Branch Strategy

Planning base: `main`. Merge target: `main`.

## Definition of Done

- [ ] `scripts/run-axe-storybook.js` exits 1 on WCAG 2.1 AA violations
- [ ] `playwright.config.ts` targets Chrome, Firefox, Safari
- [ ] Visual baseline PNGs committed to `apps/storybook/src/tests/visual.spec.ts-snapshots/`
- [ ] `ci-quality.yml` extended with `a11y`, `visual-regression`, `playwright`, `lighthouse` jobs
- [ ] `a11y` and `visual-regression` are hard gates (`gate` depends on them)
- [ ] `lighthouse` is advisory (`continue-on-error: true`)

## Reviewer Guidance

Temporarily add `aria-hidden="true"` to the stub component. Verify the `a11y` CI job fails. Remove it and verify green. Check that visual diff artifacts are uploaded on failure.
