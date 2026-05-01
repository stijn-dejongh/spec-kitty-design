import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'apps/storybook/src/tests',
  fullyParallel: true,
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server apps/storybook/storybook-static --port 6006 --silent',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env['CI'],
    timeout: 60000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
