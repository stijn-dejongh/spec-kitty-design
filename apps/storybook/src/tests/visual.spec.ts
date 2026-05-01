import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('SK-stub Angular default — visual baseline', async ({ page }) => {
  // Navigate directly to the story iframe for stable visual snapshots
  await page.goto('/iframe.html?id=primitives-skstub-angular--default&viewMode=story');
  await page.waitForSelector('.sk-stub', { timeout: 20000 });
  await expect(page).toHaveScreenshot('sk-stub-angular-default.png', { threshold: 0.02 });
});

test('SK-stub HTML default — visual baseline', async ({ page }) => {
  // HTML story renders via the @storybook/html framework in the Storybook iframe
  await page.goto('/iframe.html?id=primitives-skstub-html--default&viewMode=story');
  // Brief delay to allow any initial render to settle
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveScreenshot('sk-stub-html-default.png', { threshold: 0.02 });
});
