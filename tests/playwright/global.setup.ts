import { clerkSetup } from '@clerk/testing/playwright';
import { test as setup } from '@playwright/test';

// Use Playwright's global setup to configure Clerk once before all tests run
setup('global setup', async ({}) => {
  console.log('Setting up Clerk testing environment...');
  
  // This fetches the Testing Token and makes it available globally
  await clerkSetup({
    // Optional: Specify custom frontend API URL if needed
    // frontendApi: process.env.CLERK_FRONTEND_API,
    
    // Optional: Specify custom publishable key if different from env
    // publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    
    // Optional: Specify custom secret key if different from env
    // secretKey: process.env.CLERK_SECRET_KEY,
  });
  
  console.log('Clerk testing environment setup complete');
});