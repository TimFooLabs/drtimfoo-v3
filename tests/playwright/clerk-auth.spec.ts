import { clerk } from '@clerk/testing/playwright';
import { test, expect } from '@playwright/test';

test.describe('Clerk Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('/');
  });

  test('signs in with password strategy and accesses protected content', async ({ page }) => {
    // Sign in using the Clerk testing helper
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: 'test@example.com',
        password: 'testpass123',
      },
    });

    // Wait for navigation after sign in
    await page.waitForLoadState('networkidle');

    // Navigate to a protected route (assuming you have one)
    await page.goto('/admin');

    // Assert that protected content is visible
    await expect(page.locator('body')).toContainText('Admin Dashboard', { timeout: 10000 });
  });

  // --- CORRECTED THIS TEST ---
  test('signs up new user and verifies data sync to Convex', async ({ page }) => {
    // Generate a unique email for this test run to ensure repeatability
    const uniqueEmail = `test-playwright-${Date.now()}@example.com`;
    const password = 'testpass123';

    // Navigate to your application's sign-up page
    await page.goto('/sign-up');

    // Fill out and submit the sign-up form by interacting with the UI
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="emailAddress"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    // Wait for sign up completion and potential redirect
    await page.waitForLoadState('networkidle');

    // Navigate to a page that shows user data
    await page.goto('/profile');

    // Assert that user data is displayed
    await expect(page.locator('body')).toContainText('Test User', { timeout: 10000 });
    await expect(page.locator('body')).toContainText(uniqueEmail, { timeout: 10000 });

    // Note on verifying Convex sync remains the same.
  });

  test('signs out and redirects to public page', async ({ page }) => {
    // First sign in
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: 'test@example.com',
        password: 'testpass123',
      },
    });
    await page.waitForLoadState('networkidle');

    // Navigate to a protected page
    await page.goto('/admin');
    await expect(page.locator('body')).toContainText('Admin Dashboard');

    // Sign out using Clerk testing helper
    await clerk.signOut({ page });
    await page.waitForLoadState('networkidle');

    // Assert that we're redirected to a public page
    await expect(page).toHaveURL('/');
    
    // Try to access protected page again
    await page.goto('/admin');
    
    // Assert that we're redirected away from protected page
    await expect(page).not.toHaveURL('/admin');
  });

  test('handles authentication errors gracefully', async ({ page }) => {
    // Try to sign in with invalid credentials
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: 'invalid@example.com',
        password: 'wrongpassword',
      },
    });

    await page.waitForTimeout(2000);

    // Assert that error message is shown
    await expect(page.locator('body')).toContainText('invalid', { timeout: 10000 });
  });

  test('persists authentication across page reloads', async ({ page }) => {
    // Sign in
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: 'test@example.com',
        password: 'testpass123',
      },
    });
    await page.waitForLoadState('networkidle');

    // Navigate to protected page
    await page.goto('/admin');
    await expect(page.locator('body')).toContainText('Admin Dashboard');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Assert that user is still authenticated
    await expect(page.locator('body')).toContainText('Admin Dashboard');
  });

  test('updates user profile and reflects changes', async ({ page }) => {
    // Sign in
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: 'test@example.com',
        password: 'testpass123',
      },
    });
    await page.waitForLoadState('networkidle');

    // Navigate to profile page
    await page.goto('/profile');

    // Update profile
    const firstNameInput = page.locator('input[name="firstName"]');
    await firstNameInput.fill('Updated');
    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(2000);

    // Assert that the update is reflected
    await expect(page.locator('body')).toContainText('Updated User');
  });
});

test.describe('Webhook Integration', () => {
  // --- CORRECTED THIS TEST ---
  test('verifies user creation webhook triggers Convex sync', async ({ page }) => {
    const uniqueEmail = `webhook-test-${Date.now()}@example.com`;
    const password = 'testpass123';

    // Navigate to the sign-up page to create a user
    await page.goto('/sign-up');

    // Create a user via the UI
    await page.locator('input[name="firstName"]').fill('Webhook');
    await page.locator('input[name="lastName"]').fill('Test');
    await page.locator('input[name="emailAddress"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();

    // Wait for the redirect and for the webhook to be processed by your backend
    await page.waitForTimeout(5000);

    // Verify the data exists in your system by checking a page that displays it
    await page.goto('/admin/users');
    await expect(page.locator('body')).toContainText(uniqueEmail);
  });
});