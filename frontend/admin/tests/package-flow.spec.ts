import { test, expect } from '@playwright/test';

//  BEFORE RUNNING THIS TEST:
//  1. Replace the reference tracking number: Search and update: 111234512351239
//  2. Replace the tracking number: Search and update: S20251558IN
//  3. Replace the shipment number wherever used: Search and update: S20251558IN

async function closeDialog(page) {
  const dialog = page.locator('.MuiDialog-container');

  if (await dialog.count()) {
    try {
      await dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    } catch {}

    const closeBtn = page.locator('.MuiDialog-container .MuiIconButton-root').first();

    if (await closeBtn.isVisible()) {
      await closeBtn.click({ force: true });
    }

    await dialog.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  }
}

test('End-to-end workflow: register package, add items, upload documents, raise invoice, approve payment, export shipment, and update to departed status', async ({ browser }) => {
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
  await page.getByRole('textbox', { name: 'Reference Tracking' }).fill('111234512351239');
  await page.getByRole('combobox').nth(2).click();
  await expect(page.getByRole('option', { name: 'amazon, India' })).toBeVisible();
  await page.getByRole('option', { name: 'amazon, India' }).click();
  await page.getByRole('textbox', { name: 'Weight (KG)' }).fill('10');
  await page.getByText('Allow customer to add items?').click();
  await page.getByRole('button', { name: 'Register' }).click();
  
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('111234512351239')).toBeVisible({ timeout: 60000 });

  await page.locator('tr:has-text("111234512351239")').locator('.MuiIconButton-root').first().click();
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'Add Item' }).click({ timeout: 60000 });
  await page.getByRole('textbox', { name: 'Enter item name' }).fill('Watch');
  await page.getByRole('spinbutton').first().fill('3');
  await page.getByPlaceholder('$').fill('15');
  await page.getByRole('button', { name: 'Add Item' }).click();

  await closeDialog(page);

  await expect(page.getByText('Action Logs', { exact: true })).toBeVisible({ timeout: 50000 });

  await page.waitForLoadState('networkidle');
  
  const fileInput = page.locator('.MuiBox-root.css-anl6t0 input[type="file"]').first();
  await expect(fileInput).toBeAttached({ timeout: 30000 });
  await fileInput.setInputFiles('./tests/assets/nft_logo.png');
  
  const statusCircle = await page.locator('.MuiBox-root.css-anl6t0 .MuiBox-root.css-rg5chy').first();
  await statusCircle.click({ timeout: 40000 });

  const [pdfPage] = await Promise.all([
    page.context().waitForEvent('page', { timeout: 70000 }),
    page.getByRole('button', { name: 'Print Label' }).click(),
  ]);
  await expect(pdfPage.url()).toMatch(":");

  await page2.goto('http://localhost:3000/sign-in');
  await page.waitForLoadState('networkidle');
  await page2.getByRole('textbox', { name: 'Email' }).fill('testuser@test.com');
  await page2.getByRole('textbox', { name: 'Password' }).fill('Test@123');
  await page2.locator('div').nth(2).click();
  await page2.getByRole('button', { name: 'Sign in', exact: true }).click();

  await page2.getByRole('checkbox').check();
  await page2.getByRole('button', { name: 'Request Ship (1)' }).click();
  await page.waitForLoadState('networkidle');
  await page2.getByRole('button', { name: 'Shipments (4)' }).click({ timeout: 40000 });
  await page2.getByText(/S20251558IN.*SHIP_REQUEST/).click({ timeout: 40000 });
  await page2.goto('http://localhost:3000/shipment/S20251558IN', { timeout: 40000 });

  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Shipments' }).click({ timeout: 40000 });
  const visibilityBtn = page.locator(
    'tr:has-text("S20251558IN") button:has(svg[data-testid="VisibilityOutlinedIcon"])'
  );
  await visibilityBtn.click({ timeout: 50000 });

  await expect(page).toHaveURL(/.*\/shipments\/S20251558IN/);

  await page.locator('.MuiCircularProgress-root').waitFor({ state: 'detached', timeout: 80000 });

  await page.locator('text=Uploaded Files').waitFor({ state: 'visible', timeout: 80000 });

  const fileInput2  = page.locator('.MuiBox-root.css-anl6t0 input[type="file"]').first();
  await expect(fileInput2).toBeAttached({ timeout: 30000 });
  await fileInput2.setInputFiles('./tests/assets/home.jpg');

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


   await page2.goto('http://localhost:3000/shipment/S20251558IN');
   await page2.locator('input[type="file"]').setInputFiles('./tests/assets/logo2.png');


  await page.goto('http://localhost:5173/shipments/S20251558IN');
  await page.locator('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall.css-rupi8w-MuiButtonBase-root-MuiIconButton-root').click();
  await page.getByRole('button', { name: 'Approve Payment' }).nth(1).click();


  await page2.goto('http://localhost:3000/shipment/S20251558IN');


  await page.goto('http://localhost:5173/shipments/S20251558IN');
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
  await page.getByRole('textbox', { name: 'Label' }).fill('Watch Box');
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
  await page.locator('div').filter({ hasText: 'Watch BoxDimension (LxBxH):10' }).nth(4).click();
 
  const searchBox = page.getByRole('textbox', { name: 'Search shipment number' });
  await searchBox.fill('S20251558IN');
  await searchBox.press('Enter');

  await page.getByRole('button', { name: 'Shipment Export' }).click();
  await page.getByRole('button', { name: 'Add MAWB' }).first().click();
  await page.getByRole('textbox', { name: 'MAWB' }).fill('1234567');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('1234567')).toBeVisible({ timeout: 60000 });
  await page.locator('tr:has-text("1234567")').locator('.MuiIconButton-root').first().click();
 
  await page.locator('div').filter({ hasText: 'Watch BoxDimension (LxBxH):10' }).nth(4).click();
  await page.getByRole('button', { name: 'Update to Departed' }).click();
  await page.getByRole('button', { name: 'Shipments' }).nth(1).click();


  await page2.goto('http://localhost:3000/shipment/S20251558IN');
});