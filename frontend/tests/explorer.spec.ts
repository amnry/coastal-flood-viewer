import { test, expect } from '@playwright/test';

test.describe('Sea Level Explorer', () => {
  test('loads the explorer page', async ({ page }) => {
    await page.goto('/explorer');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Coastal Flood Viewer/);
    
    // Check for main heading
    await expect(page.getByText('Sea Level Explorer')).toBeVisible();
  });

  test('has working controls', async ({ page }) => {
    await page.goto('/explorer');
    
    // Check for time controls
    await expect(page.getByText('Year')).toBeVisible();
    await expect(page.getByText('Month')).toBeVisible();
    
    // Check for layer controls
    await expect(page.getByText('Layers')).toBeVisible();
    await expect(page.getByText('Sea Level Anomaly')).toBeVisible();
  });

  test('has working tabs', async ({ page }) => {
    await page.goto('/explorer');
    
    // Check for tab navigation
    await expect(page.getByText('Controls')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
    
    // Click on Analytics tab
    await page.getByText('Analytics').click();
    await expect(page.getByText('Click on the map to view analytics')).toBeVisible();
  });
});
