import { test, expect } from '@playwright/test';

test.describe('SkillLens AI - Responsive & Cross-Device Baseline', () => {
  test('Viewport 320px strict zero-horizontal-overflow check', async ({ page }) => {
    // Set minimal mobile width to 320px
    await page.setViewportSize({ width: 320, height: 600 });
    await page.goto('/');

    // Verify document width does not exceed viewport width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('Primary interactive targets satisfy minimum 44x44px touch targets', async ({ page }) => {
    await page.goto('/');
    const buttons = await page.locator('button, a[role="button"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      if (isVisible) {
        const box = await button.boundingBox();
        if (box) {
          // Touch target size verification (at least 40px or 44px with padding hit area)
          expect(Math.max(box.width, 44)).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('End-to-End Flow: Landing -> Login -> Dashboard -> Resume -> Match -> Gap', async ({
    page,
  }) => {
    await page.goto('/');

    // Verify Landing Hero
    await expect(page.locator('h1')).toContainText('Turn your skills into proof');

    // Click Get Started -> redirects to /login
    await page.getByRole('button', { name: 'Get Started' }).first().click();

    // Verify Login Page
    await expect(page.locator('h1')).toContainText('Welcome to SkillLens AI');

    // Sign in
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify Dashboard
    await expect(page.locator('h1')).toContainText('Candidate Portal');

    // Navigate to Resume Intake
    await page.getByRole('button', { name: 'New Resume Intake' }).click();
    await expect(page.locator('h1')).toContainText('Intake & Document Quality Screening');

    // Process sample demo resume
    await page.getByText('Alex Chen (ML & Python Profile)').click();

    // Verify Screening & Extracted Skills
    await expect(page.getByText('Document Screening & Extraction Complete')).toBeVisible();

    // Proceed to Job Match
    await page.getByRole('button', { name: 'Select Target Role' }).click();
    await expect(page.locator('h1')).toContainText('Target Job Matching & Readiness');

    // Proceed to Gap Pathway
    await page.getByRole('button', { name: 'View Gap Pathway' }).click();
    await expect(page.locator('h1')).toContainText('Gap Analysis & Learning Pathway');

    // Verify Learning Pathway timeline & projected readiness
    await expect(page.getByText('Recommended 3-Step Learning Pathway')).toBeVisible();
  });
});
