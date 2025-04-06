
import { test, expect } from '@playwright/test';

test.describe('Client Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page and login if needed
    await page.goto('/');
    
    // Check if we need to login
    const loginButton = page.getByText('Login');
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Wait for login to complete
      await expect(page.getByText('Dashboard')).toBeVisible();
    }
  });

  test('Create a new client', async ({ page }) => {
    // Navigate to the clients page
    await page.getByRole('link', { name: 'Clients' }).click();
    
    // Click on the "New Client" button
    await page.getByRole('link', { name: 'New Client' }).click();
    
    // Fill out the client form
    await page.getByLabel('Business Name').fill('E2E Test Company');
    await page.getByLabel('Trading Name').fill('E2E Trading Co.');
    await page.getByLabel('ABN').fill('12345678901');
    await page.getByLabel('Status').selectOption('Active');
    
    // Submit the form
    await page.getByRole('button', { name: 'Create Client' }).click();
    
    // Verify success message
    await expect(page.getByText('Client created successfully')).toBeVisible();
    
    // Verify we are redirected to the clients list
    await expect(page).toHaveURL(/\/clients$/);
    
    // Verify the new client appears in the list
    await expect(page.getByText('E2E Test Company')).toBeVisible();
  });

  test('Update an existing client', async ({ page }) => {
    // Navigate to the clients page
    await page.getByRole('link', { name: 'Clients' }).click();
    
    // Click on the first client in the list
    await page.getByRole('link', { name: 'E2E Test Company' }).first().click();
    
    // Update the client's business name
    await page.getByLabel('Business Name').fill('E2E Updated Company');
    
    // Submit the form
    await page.getByRole('button', { name: 'Update Client' }).click();
    
    // Verify success message
    await expect(page.getByText('Client updated successfully')).toBeVisible();
    
    // Navigate back to clients list and verify the update
    await page.getByRole('link', { name: 'Clients' }).click();
    await expect(page.getByText('E2E Updated Company')).toBeVisible();
  });
});
