import { test, expect } from '@playwright/test';

test('should allow admin user to log in and log out successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123');
  await page.locator('div').filter({ hasText: 'EmailEmailPasswordPasswordPassword requirements:Minimum 6 characters in' }).nth(2).click();
  await page.getByRole('button', { name: 'LOGIN' }).click();
  
  await expect(page).toHaveURL('http://localhost:5173/packages/all');
  
  await page.locator('.MuiButtonBase-root.MuiIconButton-root').first().click();
  await page.waitForSelector('.MuiList-root', { timeout: 10000 });
  await page.locator('text=Sign Out').click();
  
  await expect(page).toHaveURL('http://localhost:5173/login');
});