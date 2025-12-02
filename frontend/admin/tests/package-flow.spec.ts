import { test, expect } from '@playwright/test';

async function closeDialog(page) {
  const dialog = page.locator('.MuiDialog-container');
  if (await dialog.isVisible()) {
    await page.locator('.MuiDialog-container .MuiIconButton-root').first().click().catch(() => {});
    await dialog.waitFor({ state: 'detached', timeout: 10000 });
  }
}

test('test', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const page = await adminContext.newPage();
  const customerContext = await browser.newContext();
  const page2 = await customerContext.newPage();

  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123');
  await page.locator('div').nth(2).click();
  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.getByRole('button', { name: 'Register Package' }).click({ timeout: 20000 });
  await page.getByRole('combobox').first().click();
  await expect(page.getByRole('option', { name: 'Test User (7770-7770)' })).toBeVisible();
  await page.getByRole('option', { name: 'Test User (7770-7770)' }).click();
  await page.getByRole('combobox').nth(1).click();
  await expect(page.getByRole('option', { name: 'bin in' })).toBeVisible();
  await page.getByRole('option', { name: 'bin in' }).click();
  await page.getByRole('textbox', { name: 'Reference Tracking' }).fill('11123451234');
  await page.getByRole('combobox').nth(2).click();
  await expect(page.getByRole('option', { name: 'amazon, India' })).toBeVisible();
  await page.getByRole('option', { name: 'amazon, India' }).click();
  await page.getByRole('textbox', { name: 'Weight (KG)' }).fill('10');
  await page.getByText('Allow customer to add items?').click();
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText('IN-00000034')).toBeVisible({ timeout: 30000 });
  await page.waitForLoadState('networkidle');

  await closeDialog(page);

  await page.locator('tr:has-text("IN-00000034")').locator('.MuiIconButton-root').first().click();
  await page.getByRole('button', { name: 'Add Item' }).click({ timeout: 40000 });
  await page.getByRole('textbox', { name: 'Enter item name' }).fill('Shirt');
  await page.getByRole('spinbutton').first().fill('3');
  await page.getByPlaceholder('$').fill('15');
  await page.getByRole('button', { name: 'Add Item' }).click();

  await expect(page.getByText('Action Logs', { exact: true })).toBeVisible({ timeout: 30000 });

  await page.waitForLoadState('networkidle');
  const addButton = page.getByRole('button', { name: 'ADD' }).nth(1);
  await addButton.waitFor({ state: 'visible', timeout: 10000 });
  await addButton.click();

  const uploadDialog = page.getByRole('dialog', { name: 'Upload Documents' });
  await uploadDialog.waitFor({ state: 'visible', timeout: 10000 });
  await uploadDialog.locator('input[type="file"]').setInputFiles('./tests/assets/nft_logo.png');
  await page.getByRole('checkbox').check({ timeout: 10000 });

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Print Label' }).click();
  const page1 = await page1Promise;
  await page.locator('.MuiBox-root.css-rg5chy').click();
  

  await page2.goto('http://localhost:3000/sign-in');
  await page2.getByRole('textbox', { name: 'Email' }).fill('testuser@test.com');
  await page2.getByRole('textbox', { name: 'Password' }).fill('Test@123');
  await page2.locator('div').nth(2).click();
  await page2.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page2.getByTestId('ExpandMoreIcon').click();
  await page2.getByRole('checkbox').check();
  await page2.getByRole('button', { name: 'Request Ship (1)' }).click();
  await page2.getByRole('button', { name: 'Shipments (1)' }).click();
  await page2.getByText(/S20258809IN.*SHIP_REQUEST/).click();
  await page2.goto('http://localhost:3000/shipment/S20258809IN');


  await page.getByRole('button', { name: 'Shipments' }).click();
  await page.locator('button').nth(2).click();
  await page.getByRole('cell').filter({ hasText: 'IN-00000034' }).locator('button').click();
  await page.locator('button').nth(3).click();
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall').first().click();
  await page.getByText('Click to upload or drag and dropPNG, JPG, PDF up to 10MB').click();
  await page.locator('body').setInputFiles('home.jpg');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Print Hold Label' }).click();
  const download = await downloadPromise;
  const download1Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Commercial Invoice' }).click();
  const download1 = await download1Promise;
  await page.getByRole('button', { name: 'Raise Invoice' }).click();
  await page.getByRole('checkbox', { name: 'Add new charges' }).check();
  await page.getByRole('combobox', { name: 'Select Charge' }).click();
  await page.getByRole('option', { name: 'Repacking - $' }).click();
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('2');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('row', { name: '2 Additional Services' }).getByRole('button').click();
  await page.getByRole('combobox', { name: 'Select Charge' }).click();
  await page.getByRole('option', { name: 'Repacking - $' }).click();
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('2');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Raise Invoice' }).click();
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-rupi8w-MuiButtonBase-root-MuiIconButton-root').click();


  await page2.goto('http://localhost:3000/shipment/S20258809IN');
  await page2.locator('div').filter({ hasText: /^＋$/ }).nth(1).click();
  await page2.getByText('My SuiteOrdersAssisted ShoppingPickup RequestWelcome, Test UserTFedExSuite No:').setInputFiles('logo2.png');


  await page.goto('http://localhost:5173/shipments/S20258809IN');
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-rupi8w-MuiButtonBase-root-MuiIconButton-root').click();
  await page.getByRole('button', { name: 'Approve Payment' }).nth(1).click();


  await page2.goto('http://localhost:3000/shipment/S20258809IN');


  await page.goto('http://localhost:5173/shipments/S20258809IN');
  const download2Promise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Print Carrier Label' }).click();
  const download2 = await download2Promise;
  await page.getByRole('button', { name: 'Shipments' }).click();
  await page.getByRole('button', { name: 'Shipment Export' }).click();
  await page.getByRole('button', { name: 'Create Export' }).click();
  await page.getByRole('spinbutton', { name: 'No of Boxes' }).fill('2');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('div').filter({ hasText: 'Box 1Dimension (LxBxH):0 x 0' }).nth(5).click();
  await page.locator('button').first().click();
  await page.getByRole('textbox', { name: 'Label' }).fill('Shirt Box');
  await page.getByRole('spinbutton', { name: 'Length (CM)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Length (CM)' }).press('Tab');
  await page.getByRole('spinbutton', { name: 'Breadth (CM)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Breadth (CM)' }).press('Tab');
  await page.getByRole('spinbutton', { name: 'Height (CM)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Height (CM)' }).press('Tab');
  await page.getByRole('spinbutton', { name: 'Volumetric Weight (KG)' }).fill('10');
  await page.getByRole('spinbutton', { name: 'Volumetric Weight (KG)' }).press('Tab');
  await page.getByRole('spinbutton', { name: 'Mass Weight (KG)' }).fill('10');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('div').filter({ hasText: 'Shirt BoxDimension (LxBxH):10' }).nth(4).click();
  await page.getByRole('button', { name: 'Shipments' }).nth(1).click();
  await page.getByRole('button', { name: 'Shipment Export' }).click();
  await page.locator('button').nth(5).click();
  await page.locator('div').filter({ hasText: 'Shirt BoxDimension (LxBxH):10' }).nth(5).click();
  await page.getByRole('button', { name: 'Shipments' }).nth(1).click();
  await page.getByRole('button', { name: 'Shipment Export' }).click();
  await page.locator('button').nth(5).click();
  await page.locator('div').filter({ hasText: 'Shirt BoxDimension (LxBxH):10' }).nth(5).click();
  await page.locator('button').nth(5).click();
  await page.locator('div').filter({ hasText: 'Shirt BoxDimension (LxBxH):10' }).nth(5).click();
  await page.getByRole('textbox', { name: 'Search shipment number' }).fill('S20258809IN');
  await page.getByRole('textbox', { name: 'Search shipment number' }).press('Enter');
  await page.getByRole('button', { name: 'Shipment Export' }).click();
  await page.getByRole('button', { name: 'Add MAWB' }).first().click();
  await page.getByRole('textbox', { name: 'MAWB' }).fill('12345');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('button').nth(4).click();
  await page.locator('div').filter({ hasText: 'Shirt BoxDimension (LxBxH):10' }).nth(4).click();
  await page.getByRole('button', { name: 'Update to Departed' }).click();
  await page.getByRole('button', { name: 'Shipments' }).nth(1).click();


  await page2.goto('http://localhost:3000/shipment/S20258809IN');
});