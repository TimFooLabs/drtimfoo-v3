# Test Payloads for Clerk Webhooks

This directory contains example webhook payloads for testing Clerk webhook integration with Convex.

## Available Payloads

### User Events

- **`user.created.json`** - Payload for when a new user is created in Clerk
- **`user.updated.json`** - Payload for when a user's information is updated
- **`user.deleted.json`** - Payload for when a user is deleted

### Session Events

- **`session.created.json`** - Payload for when a new session is created

## Using These Payloads

### With the Test Scripts

```bash
# Send user creation webhook
./scripts/test-webhook.sh send user.created ./test-payloads/user.created.json

# Send user update webhook
./scripts/test-webhook.sh send user.updated ./test-payloads/user.updated.json

# Send user deletion webhook
./scripts/test-webhook.sh send user.deleted ./test-payloads/user.deleted.json

# Send session creation webhook
./scripts/test-webhook.sh send session.created ./test-payloads/session.created.json
```

### With Manual Signature Generation

```bash
# Generate signature for a payload
node scripts/generate-svix-signature.js ./test-payloads/user.created.json

# This will create:
# - user.created_signature.txt (containing the signature)
# - user.created_curl.sh (containing the curl command)
```

### Custom Payloads

You can create your own test payloads by modifying the existing files or creating new ones. The payload structure should follow Clerk's webhook format:

```json
{
  "data": {
    // Event-specific data
  },
  "object": "event",
  "type": "event.type",
  "timestamp": 1654012591835
}
```

## Important Notes

1. **Timestamps**: The timestamps in these payloads are example values. When creating new payloads, use current Unix timestamps in milliseconds.

2. **User IDs**: The user IDs (e.g., `user_test_12345`) are example values. Replace them with actual user IDs from your Clerk instance when testing.

3. **Email Addresses**: The email addresses are examples. Use test email addresses that are registered in your Clerk instance.

4. **Verification**: These payloads are designed to work with the webhook endpoint at `http://localhost:3000/api/webhooks/clerk`.

## Testing Scenarios

### New User Registration Flow

1. Send `user.created.json` to test user creation webhook
2. Verify the user was created in Convex using `./scripts/verify-convex-data.sh verify`

### User Profile Update Flow

1. Send `user.updated.json` to test user update webhook
2. Verify the user data was updated in Convex

### User Deletion Flow

1. Send `user.deleted.json` to test user deletion webhook
2. Verify the user was marked as deleted in Convex (if your implementation supports this)

### Session Management Flow

1. Send `session.created.json` to test session creation webhook
2. Verify any session-related logic in your application

## Troubleshooting

If webhook tests fail:

1. Check that your Next.js server is running on `http://localhost:3000`
2. Verify your `CLERK_WEBHOOK_SIGNING_SECRET` environment variable is set correctly
3. Ensure the webhook endpoint exists at `src/app/api/webhooks/clerk/route.ts`
4. Check the server logs for any error messages
5. Verify the Convex server is running and accessible

## Related Scripts

- `scripts/test-webhook.sh` - Main script for sending webhooks
- `scripts/generate-svix-signature.js` - Script for generating Svix signatures
- `scripts/verify-convex-data.sh` - Script for verifying data in Convex
- `scripts/run-full-test-suite.sh` - Script for running the complete test suite