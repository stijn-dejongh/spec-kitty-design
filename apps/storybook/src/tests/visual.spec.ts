import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('SK-stub Angular default — visual baseline', async ({ page }) => {
  // Navigate directly to the story iframe for stable visual snapshots
  await page.goto('/iframe.html?id=primitives-skstub-angular--default&viewMode=story');
  await page.waitForSelector('.sk-stub', { timeout: 20000 });
  await expect(page).toHaveScreenshot('sk-stub-angular-default.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});

test('SK-stub HTML default — visual baseline', async ({ page }) => {
  // HTML story renders via the @storybook/html framework in the Storybook iframe
  await page.goto('/iframe.html?id=primitives-skstub-html--default&viewMode=story');
  // Brief delay to allow any initial render to settle
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveScreenshot('sk-stub-html-default.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});

test('SK-feature-card Angular default — visual baseline', async ({ page }) => {
  await page.goto('/iframe.html?id=components-skfeaturecard-angular--default&viewMode=story');
  await page.waitForSelector('.sk-feature-card', { timeout: 20000 });
  await expect(page).toHaveScreenshot('sk-feature-card-angular-default.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});

test('SK-feature-card HTML default — visual baseline', async ({ page }) => {
  await page.goto('/iframe.html?id=components-skfeaturecard-html--default&viewMode=story');
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveScreenshot('sk-feature-card-html-default.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});

test('SK-ribbon-card Angular default (no ribbon) — visual baseline', async ({ page }) => {
  await page.goto('/iframe.html?id=components-skribboncard-angular--default&viewMode=story');
  await page.waitForSelector('.sk-ribbon-card', { timeout: 20000 });
  await expect(page).toHaveScreenshot('sk-ribbon-card-angular-default.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});

test('SK-ribbon-card Angular with ribbon — visual baseline', async ({ page }) => {
  await page.goto('/iframe.html?id=components-skribboncard-angular--with-ribbon&viewMode=story');
  await page.waitForSelector('.sk-ribbon-card', { timeout: 20000 });
  await expect(page).toHaveScreenshot('sk-ribbon-card-angular-with-ribbon.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});

test('SK-ribbon-card HTML with ribbon — visual baseline', async ({ page }) => {
  await page.goto('/iframe.html?id=components-skribboncard-html--with-ribbon&viewMode=story');
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveScreenshot('sk-ribbon-card-html-with-ribbon.png', { threshold: 0.02, maxDiffPixelRatio: 0.02 });
});
