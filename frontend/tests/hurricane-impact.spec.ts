import { test, expect } from '@playwright/test';

test.describe('Hurricane Impact Simulator', () => {
  test('loads the hurricane impact page', async ({ page }) => {
    await page.goto('/hurricane-impact');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Coastal Flood Viewer/);
    
    // Check for main heading
    await expect(page.getByText('Hurricane Impact Simulator')).toBeVisible();
  });

  test('has working storm filters', async ({ page }) => {
    await page.goto('/hurricane-impact');
    
    // Check for filter controls
    await expect(page.getByText('Storm Filters')).toBeVisible();
    await expect(page.getByText('Storm Name')).toBeVisible();
    await expect(page.getByText('Year')).toBeVisible();
    await expect(page.getByText('Basin')).toBeVisible();
    await expect(page.getByText('Category')).toBeVisible();
  });

  test('has storm category legend', async ({ page }) => {
    await page.goto('/hurricane-impact');
    
    // Check for legend
    await expect(page.getByText('Storm Categories')).toBeVisible();
    await expect(page.getByText('Tropical Storm')).toBeVisible();
    await expect(page.getByText('Category 1')).toBeVisible();
    await expect(page.getByText('Category 5')).toBeVisible();
  });

  test('has working tabs', async ({ page }) => {
    await page.goto('/hurricane-impact');
    
    // Check for tab navigation
    await expect(page.getByText('Filters')).toBeVisible();
    await expect(page.getByText('Analytics')).toBeVisible();
  });
});
