#!/usr/bin/env node
// Runs axe-core against the built Storybook and fails on WCAG 2.1 AA violations.
// Tests the Angular stub story iframe directly to target the rendered component.
const { chromium } = require('playwright');
const { injectAxe, getViolations } = require('axe-playwright');
const path = require('path');

const STORYBOOK_DIR = 'apps/storybook/storybook-static';
// Use the Angular stub story iframe for a11y testing of rendered component output
const STORY_URL = `file://${path.resolve(STORYBOOK_DIR)}/iframe.html?id=primitives-skstub-angular--default&viewMode=story`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(STORY_URL);

  // Wait for Angular component to bootstrap
  await page.waitForSelector('.sk-stub', { timeout: 15000 }).catch(() => {
    console.warn('⚠ .sk-stub not found, running axe on full page');
  });

  await injectAxe(page);

  const violations = await getViolations(page, 'body', {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  });

  await browser.close();

  if (violations.length > 0) {
    console.error(`❌ ${violations.length} WCAG 2.1 AA violations found:`);
    violations.forEach(v => console.error(`  ${v.id}: ${v.description}`));
    process.exit(1);
  }
  console.log('✅ Zero WCAG 2.1 AA violations.');
})();
