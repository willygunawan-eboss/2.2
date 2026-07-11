import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ichangeboss/i);
});

test('login process', async ({ page }) => {
  await page.goto('/');
  // Basic login assertion since it's hardcoded to allow any credentials
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill('admin@ichangeboss.com');
    await page.locator('input[type="password"]').fill('password');
    await page.locator('button:has-text("Sign in")').click();
    
    // Wait for the login form to disappear (either Dashboard or Bootstrap Wizard will load)
    await expect(emailInput).toBeHidden({ timeout: 10000 });
  }
});
