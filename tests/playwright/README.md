# Playwright E2E Testing for Clerk Integration

This directory contains Playwright tests for end-to-end testing of Clerk authentication and webhook integration with Convex.

## Setup

### Prerequisites

1. Install dependencies:
```bash
npm install --save-dev @playwright/test @clerk/testing
```

2. Set up environment variables in `.env.test`:
```bash
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CONVEX_URL=https://your-test-app.convex.cloud
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test clerk-auth.spec.ts
```

### Run tests in headed mode (useful for debugging)
```bash
npx playwright test --headed
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Generate test report
```bash
npx playwright show-report
```

## Test Structure

### Files

- **`global.setup.ts`** - Global setup for Clerk testing environment
- **`clerk-auth.spec.ts`** - Authentication flow tests
- **`playwright.config.ts`** - Playwright configuration

### Test Categories

#### Authentication Tests
- User sign in with password strategy
- User sign up and data verification
- User sign out and redirect behavior
- Authentication error handling
- Session persistence across reloads
- User profile updates

#### Webhook Integration Tests
- User creation webhook triggers Convex sync
- User update webhook reflects changes
- Session management through webhooks

## Writing New Tests

### Basic Test Structure

```typescript
import { clerk } from '@clerk/testing/playwright';
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  // Navigate to page
  await page.goto('/');
  
  // Use Clerk testing helpers
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    },
  });
  
  // Assertions
  await expect(page.locator('selector')).toContainText('expected text');
});
```

### Clerk Testing Helpers

#### Sign In
```typescript
await clerk.signIn({
  page,
  signInParams: {
    strategy: 'password', // 'password', 'phone_code', or 'email_code'
    identifier: 'test@example.com',
    password: 'password123',
  },
});
```

#### Sign Up
```typescript
await clerk.signUp({
  page,
  signUpParams: {
    firstName: 'Test',
    lastName: 'User',
    emailAddress: 'test@example.com',
    password: 'password123',
  },
});
```

#### Sign Out
```typescript
await clerk.signOut({ page });
```

### Best Practices

1. **Use meaningful test names** that describe what is being tested
2. **Group related tests** using `test.describe()`
3. **Use specific selectors** rather than generic ones
4. **Wait for network idle** after authentication actions
5. **Clean up test data** after tests if needed
6. **Use data-testid attributes** for elements that need to be selected

## Debugging

### View Test Details
```bash
npx playwright test --trace on
```

### Take Screenshots
Screenshots are automatically taken on failure and saved in `test-results/`

### View Videos
Videos are recorded for failed tests and saved in `test-results/`

### Debug Mode
```bash
npx playwright test --debug
```

### UI Mode
```bash
npx playwright test --ui
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Common Issues

1. **"Cannot find module '@clerk/testing/playwright'"**
   - Install the package: `npm install --save-dev @clerk/testing`

2. **Authentication not working**
   - Check environment variables are set correctly
   - Verify Clerk keys are valid and active
   - Ensure the frontend API URL is correct

3. **Tests timing out**
   - Increase timeout in `playwright.config.ts`
   - Add explicit waits for network operations
   - Check if the application is running on the expected port

4. **Element not found**
   - Use Playwright's codegen to generate selectors: `npx playwright codegen`
   - Add data-testid attributes to elements
   - Wait for elements to be visible before interacting

### Getting Help

- [Playwright Documentation](https://playwright.dev/)
- [Clerk Testing Documentation](https://clerk.com/docs/testing/overview)
- [Playwright VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)