# CLI-Focused Testing Walkthrough for Clerk Webhook and Auth Flows

This guide provides step-by-step, command-oriented instructions for programmatically testing the Clerk webhook integration with Convex. It assumes the integration is complete as per the project setup (referencing `src/app/api/webhooks/clerk/route.ts` for webhook handling, `convex/users.ts` for the `createOrUpdate` mutation, and [`src/proxy.ts`](src/proxy.ts) for Next.js 16 authentication middleware).

## Table of Contents
1. [Local Preparation](#1-local-preparation)
2. [Programmatic Auth Testing](#2-programmatic-auth-testing)
3. [Webhook Testing](#3-webhook-testing)
4. [Convex Verification](#4-convex-verification)
5. [End-to-End Testing](#5-end-to-end-testing)
6. [Automation Pointers](#6-automation-pointers)

## 1. Local Preparation

Before testing, populate `.env.local` with required values based on `.env.example`. Key variables include:

```bash
# Convex
CONVEX_DEPLOYMENT=your_convex_deployment_id
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
```

### Environment Setup Notes

> **Development Mode**: The application now includes relaxed environment validation for development. Missing optional variables (like webhook secrets) will show console warnings but won't prevent app startup. See `src/lib/env.ts` for implementation details.

### Start the local servers

- **Next.js server**: Run `bun dev` to start on `http://localhost:3000`
- **Convex server**: Run `npx convex dev` to start the Convex backend locally

### Quick Setup Script

```bash
# Make sure all dependencies are installed
npm install

# Start both services in separate terminals
npm run dev &
npx convex dev &
```

## 2. Programmatic Auth Testing

Use the provided scripts or curl commands to simulate auth flows without manual UI interactions.

### Using the Test Scripts

```bash
# Create a test user
./scripts/test-user-creation.sh

# Create a session and get token
./scripts/test-session-creation.sh
```

### Manual curl Commands

**Create a test user:**
```bash
curl -X POST https://api.clerk.com/v1/users \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email_address": ["test@example.com"],
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Create a session token:**
```bash
# First create a session
curl -X POST https://api.clerk.com/v1/sessions \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_2abc123"}'

# Then get the session token
curl -X GET https://api.clerk.com/v1/sessions/{session_id}/tokens/{session_token_id} \
  -H "Authorization: Bearer $CLERK_SECRET_KEY"
```

## 3. Webhook Testing

Test webhook delivery to `http://localhost:3000/api/webhooks/clerk`. The route expects Svix-signed payloads for `user.created` or `user.updated` events.

### Using the Webhook Test Script

```bash
# Send a test webhook
./scripts/test-webhook.sh user.created

# Send with custom payload
./scripts/test-webhook.sh user.updated --payload ./test-payloads/user-updated.json
```

### Manual Webhook Testing

1. **Create a test payload** (see `test-payloads/` directory for examples):
```json
{
  "data": {
    "id": "user_2abc123",
    "email_addresses": [{"email_address": "test@example.com"}],
    "first_name": "Test",
    "last_name": "User"
  },
  "object": "event",
  "type": "user.created"
}
```

2. **Generate Svix headers** using the signature script:
```bash
node scripts/generate-svix-signature.js ./payload.json
```

3. **Send webhook via curl**:
```bash
curl -X POST http://localhost:3000/api/webhooks/clerk \
  -H "svix-id: msg_$(date +%s)" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,<generated-signature>" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

### Webhook Signature Verification Fixes

The webhook handler has been updated to address common Svix verification issues:

#### Key Changes Made:
1. **Automatic trailing newline handling**: The handler now ensures payloads end with a newline character, as required by Svix signature verification
2. **Timestamp tolerance validation**: Enforces 5-minute tolerance for webhook timestamps to prevent replay attacks
3. **Raw body processing**: Uses `arrayBuffer` to preserve exact payload formatting for signature verification
4. **Enhanced logging**: Added detailed logging for debugging verification failures

#### Testing with Debug Artifacts:
When debugging webhook issues, use the generated debug artifacts:
- `*_simple.json`: Compact JSON payloads without extra whitespace
- `*_debug_curl.sh`: Complete curl commands with proper headers and signatures
- Check server logs for detailed verification error messages

#### Common Verification Failure Scenarios:
1. **Missing trailing newline**: The handler now automatically adds this if missing
2. **Timestamp outside tolerance**: Update to current timestamp or check server time
3. **Incorrect payload formatting**: Use the `*_simple.json` files as reference

## 4. Convex Verification

After webhook execution, verify data in Convex.

### Using the Verification Script

```bash
# Check if user was created in Convex
./scripts/verify-convex-data.sh user_2abc123
```

### Manual Verification

**Query via Convex CLI:**
```bash
npx convex query users:get --id user_2abc123
```

**Using Convex dashboard:**
```bash
npx convex dashboard
```

**Via curl:**
```bash
curl -X POST $NEXT_PUBLIC_CONVEX_URL/query \
  -H "Authorization: Bearer <convex-auth-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "users:get",
    "args": {"id": "user_2abc123"}
  }'
```

## 5. End-to-End Testing

### Playwright Setup

1. Install dependencies:
```bash
npm install --save-dev @clerk/testing @playwright/test
```

2. Run the Playwright tests:
```bash
npx playwright test
```

3. See `tests/playwright/` for example test files.

### Cypress Setup

1. Install dependencies:
```bash
npm install --save-dev @clerk/testing cypress
```

2. Run Cypress tests:
```bash
npx cypress run
# or for interactive mode
npx cypress open
```

3. See `tests/cypress/` for example test files.

## 6. Automation Pointers

### Shell Scripts

All scripts are located in the `scripts/` directory:
- `test-user-creation.sh` - Creates test users via Clerk API
- `test-session-creation.sh` - Creates sessions and gets tokens
- `test-webhook.sh` - Sends signed webhooks to your endpoint
- `verify-convex-data.sh` - Verifies data in Convex
- `run-full-test-suite.sh` - Runs the complete test sequence

### CI/CD Integration

See `.github/workflows/test-integration.yml` for a complete GitHub Actions workflow example.

### Environment Variables for Testing

Create a `.env.test` file:
```bash
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
NEXT_PUBLIC_CONVEX_URL=https://your-test-app.convex.cloud
```

### Test Data Management

- Test payloads are in `test-payloads/`
- Test user data is stored in `test-data/`
- Logs are written to `test-logs/`

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Check your `CLERK_WEBHOOK_SIGNING_SECRET` environment variable
   - Ensure the timestamp is current (within 5 minutes)
   - Verify the payload format matches Clerk's schema
   - **Important**: Ensure JSON payloads are compact (no extra whitespace) and include trailing newlines
   - Use the debug artifacts (`*_simple.json` and `*_debug_curl.sh`) to verify exact payload formatting

2. **JSON formatting mismatch causing Svix verification failures**
   - **Root cause**: Svix signatures are sensitive to exact whitespace, including trailing newlines
   - **Solution**: The webhook handler now automatically adds trailing newlines if missing
   - **Testing**: Use the `*_simple.json` files which contain compact JSON without extra whitespace
   - **Debugging**: Check the debug curl scripts (`*_debug_curl.sh`) for exact command formatting

3. **Timestamp tolerance validation**
   - The webhook handler now validates timestamps are within 5 minutes
   - If testing with old timestamps, update them to current Unix timestamps
   - Check server logs for timestamp validation errors

4. **Convex mutations not executing**
   - Check Convex logs: `npx convex logs`
   - Verify the Convex URL is correct in `.env.local`
   - Ensure the mutation function exists in `convex/users.ts`

5. **Clerk API authentication errors**
   - Verify your `CLERK_SECRET_KEY` is correct and active
   - Check that the user creation payload matches the expected format
   - Ensure rate limits aren't exceeded

### Log Locations

- Next.js logs: Terminal running `npm run dev`
- Convex logs: `npx convex logs`
- Test logs: `test-logs/` directory
- Webhook logs: Check Clerk Dashboard > Webhooks > Your endpoint > Logs

## Resources

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks/overview)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads)
- [Clerk Testing Package](https://clerk.com/docs/testing/overview)
- [Convex Testing Guide](https://docs.convex.dev/production/testing)
