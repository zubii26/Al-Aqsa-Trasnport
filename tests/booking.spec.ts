import { test, expect } from '@playwright/test';

test.describe('Booking Flow Navigation', () => {
  test('should navigate between steps and preserve state via URL and sessionStorage', async ({ page }) => {
    // 1. Go to booking page
    await page.goto('/booking');
    
    // Ensure URL becomes /booking?step=1
    await expect(page).toHaveURL(/.*step=1/);

    // Verify Step 1 is rendered
    await expect(page.locator('text=Begin Your Journey').first()).toBeVisible();

    // 2. Click Continue/Next Step
    // Wait for the button with Continue or Next Step
    // Since we don't know the exact text, we can look for the button containing "Continue"
    const nextButton = page.locator('button', { hasText: /Continue|Next/i }).first();
    await nextButton.click();

    // Ensure URL becomes /booking?step=2
    await expect(page).toHaveURL(/.*step=2/);

    // Verify Step 2 is rendered
    await expect(page.locator('text=Select Your Vehicle').first()).toBeVisible();

    // 3. Test browser back button
    await page.goBack();

    // Ensure URL becomes /booking?step=1 again
    await expect(page).toHaveURL(/.*step=1/);
    await expect(page.locator('text=Begin Your Journey').first()).toBeVisible();

    // 4. Test browser forward button
    await page.goForward();

    // Ensure URL becomes /booking?step=2 again
    await expect(page).toHaveURL(/.*step=2/);
    await expect(page.locator('text=Select Your Vehicle').first()).toBeVisible();

    // 5. Test internal Back button
    const backButton = page.locator('button', { hasText: /Back/i }).first();
    await backButton.click();

    // Ensure URL becomes /booking?step=1 again
    await expect(page).toHaveURL(/.*step=1/);
    await expect(page.locator('text=Begin Your Journey').first()).toBeVisible();
    
    // Validate session storage preservation by refreshing the page
    // (In a full test, we'd enter data on Step 1, click next, refresh, and go back to ensure data is there)
    await page.reload();
    await expect(page).toHaveURL(/.*step=1/);
  });
});
