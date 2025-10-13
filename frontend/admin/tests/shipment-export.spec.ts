import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123');
    await page.locator('div').filter({ hasText: 'EmailEmailPasswordPasswordPassword requirements:Minimum 6 characters in' }).nth(2).click();
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page).toHaveURL(/.*packages\/all/);
});

test('should allow admin user to create the shipment export', async ({ page }) => {
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Shipments Export' }).click();
  await page.getByRole('button', { name: 'Create Export' }).click();
  await page.getByRole('spinbutton', { name: 'No of Boxes' }).fill('2');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL(/.*shipment\/export/);
});

test('should allow admin user to filter the shipment export by date', async ({ page }) => {
  await page.getByRole('button', { name: 'Shipments Export' }).click();
  await page.getByRole('button', { name: 'Choose date' }).click();
  await page.getByRole('button', { name: 'Previous month' }).click();
  await page.waitForTimeout(2000);
  await page.getByRole('gridcell', { name: '30' }).click();

  await expect(page.getByText(/Sep 30, 2025/).first()).toBeVisible();
});

test('should allow admin user to update the box details', async ({ page }) => {
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Shipments Export' }).click();
  await page.getByRole('row', { name: 'MS/IN/1759737155471 Oct 6,' }).getByRole('button').nth(1).click();
  await page.getByRole('textbox', { name: 'Label' }).fill('Mobile Packgae');
  await page.getByRole('spinbutton', { name: 'Length (CM)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Breadth (CM)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Height (CM)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Volumetric Weight (KG)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Mass Weight (KG)' }).fill('10');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Box updated successfully')).toBeVisible();
  await expect(page.getByText('Mobile Package')).toBeVisible();
});

test('should allow admin user to delete the box', async ({ page }) => {
  await page.waitForTimeout(5000);
  await page.getByRole('button', { name: 'Shipments Export' }).click();
  await page.getByRole('row', { name: 'MS/IN/1759737155471 Oct 6,' }).getByRole('button').nth(1).click();
  await page.locator('button').nth(3).click();

  await expect(page.getByText('Box deleted successfully')).toBeVisible();
});