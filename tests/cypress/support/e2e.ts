// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add Clerk testing commands
import { addClerkCommands } from '@clerk/testing/cypress'

// Add custom Cypress commands for Clerk testing
addClerkCommands({ Cypress, cy })

// Global beforeEach hook to set up testing environment
beforeEach(() => {
  // Clear local storage before each test
  cy.clearLocalStorage()
  
  // Clear cookies before each test
  cy.clearCookies()
})

// Global afterEach hook for cleanup
afterEach(() => {
  // Take screenshot on test failure
  cy.screenshot({ capture: 'viewport' })
})

// Add custom commands for testing Convex data
Cypress.Commands.add('getConvexUser', (clerkId: string) => {
  cy.request({
    method: 'POST',
    url: Cypress.env('NEXT_PUBLIC_CONVEX_URL') + '/query',
    body: {
      path: 'users.getByClerkId',
      args: { clerkId }
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    return response.body
  })
})

// Add custom command to wait for webhook processing
Cypress.Commands.add('waitForWebhookProcessing', (timeout: number = 5000) => {
  cy.wait(timeout, { log: false })
})

// Add custom command to verify user in Convex
Cypress.Commands.add('verifyUserInConvex', (email: string, name?: string) => {
  // This would need to be implemented based on your Convex schema
  // You might need to create a custom API endpoint for testing
  cy.log(`Verifying user ${email} exists in Convex`)
  // Implementation depends on your Convex setup
})