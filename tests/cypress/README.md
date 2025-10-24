# Cypress E2E Testing for Clerk Integration

This directory contains Cypress tests for end-to-end testing of Clerk authentication and webhook integration with Convex.

## Setup

### Prerequisites

1. Install dependencies:
```bash
npm install --save-dev cypress @clerk/testing
```

2. Set up environment variables in `.env.test`:
```bash
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CONVEX_URL=https://your-test-app.convex.cloud
```

3. Open Cypress:
```bash
npx cypress open
```

## Running Tests

### Interactive Mode
```bash
npx cypress open
```

### Headless Mode
```bash
npx cypress run
```

### Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/clerk-auth.cy.ts"
```

### Run Tests in Specific Browser
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### Run Tests with Custom Configuration
```bash
npx cypress run --config baseUrl=http://localhost:3001
```

## Test Structure

### Files

- **`cypress.config.ts`** - Cypress configuration
- **`support/e2e.ts`** - Global setup and custom commands
- **`e2e/clerk-auth.cy.ts`** - Authentication flow tests

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
- User deletion webhook removes data from Convex
- User update webhook syncs changes to Convex

#### Session Management Tests
- Session creation and activity tracking
- Session expiration handling

## Writing New Tests

### Basic Test Structure

```typescript
describe('Test Suite Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.visit('/')
  })

  it('test description', () => {
    // Use Clerk testing helpers
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })
    
    // Assertions
    cy.contains('Expected Text').should('be.visible')
  })
})
```

### Clerk Testing Commands

#### Sign In
```typescript
cy.clerkSignIn({
  strategy: 'password', // 'password', 'phone_code', or 'email_code'
  identifier: 'test@example.com',
  password: 'password123',
})
```

#### Sign Up
```typescript
cy.clerkSignUp({
  firstName: 'Test',
  lastName: 'User',
  emailAddress: 'test@example.com',
  password: 'password123',
})
```

#### Sign Out
```typescript
cy.clerkSignOut()
```

### Custom Commands

#### Wait for Webhook Processing
```typescript
cy.waitForWebhookProcessing(5000) // Wait 5 seconds
```

#### Get Convex User Data
```typescript
cy.getConvexUser('user_clerk_id').then((userData) => {
  expect(userData.email).to.eq('test@example.com')
})
```

#### Verify User in Convex
```typescript
cy.verifyUserInConvex('test@example.com', 'Test User')
```

## Best Practices

1. **Use meaningful test names** that describe what is being tested
2. **Group related tests** using `describe()` blocks
3. **Use data-testid attributes** for elements that need to be selected
4. **Wait for network operations** to complete before asserting
5. **Clean up test data** after tests if needed
6. **Use custom commands** for repetitive actions

## Debugging

### Test Runner
- Use the Cypress Test Runner for interactive debugging
- Use `.debug()` to pause test execution
- Use `cy.log()` to output debug information

### Screenshots and Videos
- Screenshots are automatically taken on test failures
- Videos are recorded for all tests in headless mode
- Files are saved in `cypress/screenshots/` and `cypress/videos/`

### Network Requests
- Use the Network tab in the Test Runner to inspect HTTP requests
- Use `cy.intercept()` to mock or spy on network requests

### Time Travel
- Cypress automatically snapshots the DOM at each command
- Hover over commands in the Test Runner to see the application state

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Start application
  run: npm run dev &
  wait-on: http://localhost:3000

- name: Run Cypress tests
  run: npx cypress run

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: cypress-results
    path: cypress/videos/
```

### Docker Example

```dockerfile
FROM cypress/included:13.6.1

WORKDIR /e2e
COPY . .
RUN npm ci

ENTRYPOINT ["cypress", "run", "--config", "baseUrl=http://app:3000"]
```

## Troubleshooting

### Common Issues

1. **"Cannot find module '@clerk/testing/cypress'"**
   - Install the package: `npm install --save-dev @clerk/testing`

2. **Authentication not working**
   - Check environment variables are set correctly
   - Verify Clerk keys are valid and active
   - Ensure the frontend API URL is correct

3. **Tests timing out**
   - Increase timeout in `cypress.config.ts`
   - Add explicit waits for network operations
   - Check if the application is running on the expected port

4. **Element not found**
   - Use Cypress Test Runner to inspect elements
   - Add data-testid attributes to elements
   - Use `cy.contains()` for text-based selectors

5. **Webhook tests failing**
   - Ensure webhook endpoint is accessible
   - Check webhook signing secret is correct
   - Verify Convex connection is working

### Getting Help

- [Cypress Documentation](https://docs.cypress.io/)
- [Clerk Testing Documentation](https://clerk.com/docs/testing/overview)
- [Cypress VS Code Extension](https://marketplace.visualstudio.com/items?itemName=CypressVSCode.cypress-test-observed)

## Advanced Usage

### Custom Commands
Create custom commands in `cypress/support/commands.ts`:

```typescript
Cypress.Commands.add('loginAsAdmin', () => {
  cy.clerkSignIn({
    strategy: 'password',
    identifier: 'admin@example.com',
    password: 'adminpass123',
  })
})
```

### Page Object Model
Create page objects in `cypress/support/page-objects/`:

```typescript
export class LoginPage {
  visit() {
    cy.visit('/sign-in')
  }
  
  login(email: string, password: string) {
    cy.clerkSignIn({
      strategy: 'password',
      identifier: email,
      password,
    })
  }
}
```

### Data Management
Use fixtures for test data:

```typescript
// cypress/fixtures/users.json
{
  "testUser": {
    "email": "test@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User"
  }
}

// In test
cy.fixture('users').then((users) => {
  cy.clerkSignUp(users.testUser)
})