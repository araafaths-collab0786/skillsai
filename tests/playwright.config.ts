import { defineConfig, devices } from '@playwright/test';

/**
 * SkillLens AI - Cross-Device Responsive Test Configuration
 * Section 4A Viewport Matrix
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'Mobile Small - iPhone SE',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Mobile Large - Pixel 7',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 412, height: 915 },
      },
    },
    {
      name: 'Mobile Landscape - iPhone SE',
      use: {
        viewport: { width: 667, height: 375 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'Tablet Portrait - iPad Mini',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Laptop - 1366x768',
      use: {
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'Desktop Full HD - 1920x1080',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
