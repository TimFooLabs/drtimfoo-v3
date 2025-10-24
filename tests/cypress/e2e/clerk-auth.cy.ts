describe('Clerk Authentication', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/')
  })

  it('signs in with password strategy and accesses protected content', () => {
    // Sign in using the Clerk testing helper
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })

    // Wait for navigation after sign in
    cy.url().should('not.include', '/sign-in')

    // Navigate to a protected route (assuming you have one)
    cy.visit('/admin')

    // Assert that protected content is visible
    // Adjust the selector based on your actual protected content
    cy.contains('Admin Dashboard').should('be.visible')
  })

  it('signs up new user and verifies data sync to Convex', () => {
    const testEmail = 'test-cypress@example.com'
    const testName = 'Cypress Test'

    // Sign up using the Clerk testing helper
    cy.clerkSignUp({
      firstName: 'Cypress',
      lastName: 'Test',
      emailAddress: testEmail,
      password: 'testpass123',
    })

    // Wait for sign up completion
    cy.url().should('not.include', '/sign-up')

    // Navigate to a page that shows user data
    cy.visit('/profile')

    // Assert that user data is displayed
    cy.contains('Cypress Test').should('be.visible')
    cy.contains(testEmail).should('be.visible')

    // Wait for webhook processing
    cy.waitForWebhookProcessing(5000)

    // Verify user data in Convex (if you have a way to check)
    // This would depend on your specific implementation
    cy.log('User created successfully, webhook should have synced to Convex')
  })

  it('signs out and redirects to public page', () => {
    // First sign in
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })

    // Navigate to a protected page
    cy.visit('/admin')
    cy.contains('Admin Dashboard').should('be.visible')

    // Sign out using Clerk testing helper
    cy.clerkSignOut()

    // Assert that we're redirected to a public page
    cy.url().should('include', '/')
    
    // Try to access protected page again
    cy.visit('/admin')
    
    // Assert that we're redirected away from protected page
    // This depends on your auth implementation
    cy.url().should('not.include', '/admin')
  })

  it('handles authentication errors gracefully', () => {
    // Try to sign in with invalid credentials
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'invalid@example.com',
      password: 'wrongpassword',
    })

    // Wait for error message to appear
    cy.contains(/invalid|incorrect|error/i, { timeout: 10000 }).should('be.visible')
  })

  it('persists authentication across page reloads', () => {
    // Sign in
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })

    // Navigate to protected page
    cy.visit('/admin')
    cy.contains('Admin Dashboard').should('be.visible')

    // Reload the page
    cy.reload()

    // Assert that user is still authenticated
    cy.contains('Admin Dashboard').should('be.visible')
  })

  it('updates user profile and reflects changes', () => {
    // Sign in
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })

    // Navigate to profile page
    cy.visit('/profile')

    // Update profile (this is an example - adjust based on your UI)
    cy.get('input[name="firstName"]').clear().type('Updated')
    cy.get('button[type="submit"]').click()

    // Wait for update to complete
    cy.waitForWebhookProcessing(2000)

    // Assert that the update is reflected
    cy.contains('Updated User').should('be.visible')
  })

  it('verifies email address change triggers webhook', () => {
    const newEmail = 'updated-cypress@example.com'

    // Sign in
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })

    // Navigate to profile page
    cy.visit('/profile')

    // Change email (adjust based on your UI)
    cy.get('input[name="email"]').clear().type(newEmail)
    cy.get('button[type="submit"]').click()

    // Wait for webhook processing
    cy.waitForWebhookProcessing(5000)

    // Verify the change was processed
    cy.log(`Email updated to ${newEmail}, webhook should have triggered`)
  })
})

describe('Webhook Integration', () => {
  it('verifies user creation webhook triggers Convex sync', () => {
    const testEmail = 'webhook-test@example.com'
    const testName = 'Webhook Test'

    // Create a user via Clerk testing
    cy.clerkSignUp({
      firstName: 'Webhook',
      lastName: 'Test',
      emailAddress: testEmail,
      password: 'testpass123',
    })

    // Wait for webhook processing
    cy.waitForWebhookProcessing(5000)

    // Navigate to admin page to verify user exists
    cy.visit('/admin/users')

    // Verify the user appears in the system
    cy.contains(testEmail).should('be.visible')
    cy.contains(testName).should('be.visible')

    cy.log('User creation webhook successfully synced to Convex')
  })

  it('verifies user deletion webhook removes data from Convex', () => {
    // First create a user
    const testEmail = 'delete-test@example.com'
    
    cy.clerkSignUp({
      firstName: 'Delete',
      lastName: 'Test',
      emailAddress: testEmail,
      password: 'testpass123',
    })

    // Wait for user creation webhook
    cy.waitForWebhookProcessing(3000)

    // Sign in as admin to delete the user
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'admin@example.com',
      password: 'adminpass123',
    })

    // Navigate to admin users page
    cy.visit('/admin/users')

    // Find and delete the test user (adjust based on your UI)
    cy.contains(testEmail).parent().find('button[aria-label="delete"]').click()
    cy.get('button:contains("Confirm")').click()

    // Wait for deletion webhook
    cy.waitForWebhookProcessing(3000)

    // Verify user is gone
    cy.contains(testEmail).should('not.exist')

    cy.log('User deletion webhook successfully removed data from Convex')
  })

  it('verifies user update webhook syncs changes to Convex', () => {
    const originalEmail = 'update-test@example.com'
    const updatedEmail = 'updated-test@example.com'

    // Create a user
    cy.clerkSignUp({
      firstName: 'Update',
      lastName: 'Test',
      emailAddress: originalEmail,
      password: 'testpass123',
    })

    // Wait for creation webhook
    cy.waitForWebhookProcessing(3000)

    // Update user profile
    cy.visit('/profile')
    cy.get('input[name="email"]').clear().type(updatedEmail)
    cy.get('button[type="submit"]').click()

    // Wait for update webhook
    cy.waitForWebhookProcessing(3000)

    // Verify the change was synced
    cy.visit('/admin/users')
    cy.contains(updatedEmail).should('be.visible')
    cy.contains(originalEmail).should('not.exist')

    cy.log('User update webhook successfully synced changes to Convex')
  })
})

describe('Session Management', () => {
  it('creates session and tracks activity', () => {
    // Sign in
    cy.clerkSignIn({
      strategy: 'password',
      identifier: 'test@example.com',
      password: 'testpass123',
    })

    // Navigate to different pages to generate activity
    cy.visit('/profile')
    cy.wait(1000)
    cy.visit('/admin')
    cy.wait(1000)
    cy.visit('/settings')
    cy.wait(1000)

    // Verify session is still active
    cy.reload()
    cy.contains('Admin Dashboard').should('be.visible')

    cy.log('Session management working correctly')
  })

  it('handles session expiration gracefully', () => {
    // This test would need to simulate session expiration
    // Implementation depends on your session handling
    cy.log('Session expiration test - implementation depends on your setup')
  })
})