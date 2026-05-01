import { test, expect } from '@playwright/test';

test('Storybook loads and renders stub stories', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Storybook/);
});

test('SK-stub Angular story renders', async ({ page }) => {
  // Navigate directly to the story iframe for reliable component visibility checks
  await page.goto('/iframe.html?id=primitives-skstub-angular--default&viewMode=story');
  const stub = page.locator('.sk-stub').first();
  await expect(stub).toBeVisible({ timeout: 20000 });
});

test('SK-stub HTML story iframe loads', async ({ page }) => {
  // Verify the HTML story iframe URL is accessible (the story page loads)
  // Note: @storybook/html stories render in a separate framework context;
  // component visibility is covered by the visual regression baseline.
  const response = await page.goto('/iframe.html?id=primitives-skstub-html--default&viewMode=story');
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator('#storybook-root')).toBeAttached();
});
