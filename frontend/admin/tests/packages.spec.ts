import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123');
    await page.locator('div').filter({ hasText: 'EmailEmailPasswordPasswordPassword requirements:Minimum 6 characters in' }).nth(2).click();
    await page.getByRole('button', { name: 'LOGIN' }).click();
});

test('should allow admin user to register the package', async ({ page }) => {
  await page.getByRole('button', { name: 'Register Package' }).click();
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'Saurabh Pingale (4601-4601)' }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'bin in' }).click();
  await page.getByRole('textbox', { name: 'Reference Tracking' }).fill('1453523526');
  await page.getByRole('combobox').nth(2).click();
  await page.getByRole('option', { name: 'amazon, India' }).click();
  await page.getByRole('textbox', { name: 'Weight (KG)' }).fill('10');
  await page.getByRole('checkbox', { name: 'Allow customer to add items?' }).check();
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText('Package registered successfully', { exact: false })).toBeVisible({ timeout: 10000 });
});

test('should allow admin user to filter the packages', async ({ page }) => {
  await page.waitForTimeout(5000);
  await page.locator('.MuiCard-root', { hasText: 'Action Required' }).click();
  await page.locator('.MuiCard-root', { hasText: 'In Review' }).click();
  await page.locator('.MuiCard-root', { hasText: 'Draft' }).click();
});

test('should allow admin user to upload the image', async ({ page }) => {
  await page.waitForTimeout(5000);
  await page
  .getByRole('row')
  .first()
  .getByRole('button', { name: /view details for package/i })
  .click();

  await expect(page.getByRole('heading', { name: 'Package Details' })).toBeVisible();

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page
    .locator('div:has-text("Missing Documents")')
    .getByText('Click to upload or drag and drop')
    .click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('51l yzd21CL._SY879.jpg');
  
  await expect(page.getByText('Upload successful')).toBeVisible();
});

test('should allow admin user to upload the item', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Item' }).click();
  await page.getByRole('textbox', { name: 'Enter item name' }).fill('Shirt');
  await page.getByRole('spinbutton').first().fill('10');
  await page.getByLabel('Add Item').locator('div').filter({ hasText: 'Amount' }).nth(3).click();
  await page.getByPlaceholder('$').fill('100');
  await page.getByRole('button', { name: 'Add Item' }).click();

  await expect(page.getByText('Shirt 12 $23.00')).toBeVisible();
});

test('should allow admin user to update the item', async ({ page }) => {
  await page.getByRole('row', { name: 'Shirt 10 $100.00 $' }).getByRole('button').first().click();
  await page.getByRole('spinbutton').first().fill('12');
  await page.getByPlaceholder('$').fill('23');
  await page.getByRole('button', { name: 'Update Item' }).click();
});

test('should allow admin user to delete the item', async ({ page }) => {
  await page.getByRole('row', { name: 'Shirt 12 $23.00 $' }).getByRole('button').nth(1).click();
});

test('should allow admin user to print the label', async ({ page }) => {
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Print Label' }).click();
  const page1 = await page1Promise;
});

test('should allow admin user to update the package information', async ({ page }) => {
  await page.getByRole('button', { name: 'Update Information' }).click();
  await page.getByRole('textbox', { name: 'Weight', exact: true }).fill('20.000Kg');
  await page.getByLabel('Dangerous Good').selectOption('false');
  await page.getByRole('button', { name: 'Save Changes' }).click();

  await expect(page.getByText('20.000Kg false')).toBeVisible();
});

test('should allow admin user to update the rack slot', async ({ page }) => {
  await page.getByText('bin in →Slot has 3 pkgs').click();
  await page.getByRole('combobox', { name: 'Rack Slot bin in (Slot has 3' }).click();
  await page.getByText('parcel(Slot has 0 packages)').click();
  await page.getByRole('button', { name: 'Update' }).click();

  await expect(page.getByText('parcel')).toBeVisible();
});