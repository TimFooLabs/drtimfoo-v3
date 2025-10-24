/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to sign up a new user using Clerk.
     * @example cy.clerkSignUp({ email, password })
     */
    clerkSignUp(options: any): Chainable<void>;

    /**
     * Custom command to wait for a specified time for webhook processing.
     * @example cy.waitForWebhookProcessing(5000)
     */
    waitForWebhookProcessing(timeout?: number): Chainable<void>;

    /**
     * Custom command to retrieve a user from Convex by their Clerk ID.
     * @example cy.getConvexUser('user_12345')
     */
    getConvexUser(clerkId: string): Chainable<any>;

    /**
     * Custom command to verify that a user exists in Convex.
     * @example cy.verifyUserInConvex('test@example.com', 'Test User')
     */
    verifyUserInConvex(email: string, name?: string): Chainable<void>;
  }
}