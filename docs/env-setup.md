# Environment Setup Guide

## Development Mode (Permissive)
🔧 **Allow partial configuration** - App starts with missing environment variables and console warnings

### Required for Development (Flexible):
```bash
# All variables are optional - app will start with defaults
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=                    # Optional, defaults to empty
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=         # Optional, defaults to empty
CLERK_SECRET_KEY=                          # Optional, defaults to empty
CLERK_WEBHOOK_SIGNING_SECRET=              # Optional, always allowed
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in    # Optional, defaults to '/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up    # Optional, defaults to '/sign-up'
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/     # Optional, defaults to '/'
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/     # Optional, defaults to '/'
```

### What Happens:
- ✅ App compiles and starts successfully
- ⚠️ Console shows: `"⚠️ Running with partial environment configuration (development mode)"`
- 🔄 Missing Clerk keys don't crash, but auth features may not work
- 🔄 Missing Convex URL allows frontend development without backend

## Production Mode (Strict)
🚫 **All variables required** - Missing env vars cause startup failure

### Required for Production:
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com      # Required, valid URL
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud  # Required, valid Convex URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...   # Required, non-empty
CLERK_SECRET_KEY=sk_live_...                    # Required, non-empty
CLERK_WEBHOOK_SIGNING_SECRET=whsec_live_...     # Optional for some features
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in          # Required, non-empty
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up          # Required, non-empty
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard  # Required, non-empty
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/welcome    # Required, non-empty
```

### What Happens if Missing:
- ❌ App refuses to start with error message
- ❌ Displays specific missing variables in console
- ❌ Shows: `"Environment validation failed - check console for details"`

## Environment Variables Reference

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `NODE_ENV` | Auto-set to `development` | Must be `production` | Application mode |
| `NEXT_PUBLIC_APP_URL` | Default `http://localhost:3000` | Required URL | Base application URL |
| `NEXT_PUBLIC_CONVEX_URL` | Optional | Required valid Convex URL | Database connection |
| `NEXT_PUBLIC_CLERK_*` | Optional | Required non-empty | Authentication routing |
| `CLERK_SECRET_KEY` | Optional | Required non-empty | Server-side auth secret |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Optional | Optional | Webhook verification |

## Setup Instructions

1. **Copy example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your values:**
   - Next.js dev server uses `.env.local` automatically
   - Add real Convex and Clerk credentials for full functionality

3. **Development workflow:**
   - Start with partial env vars to build UI
   - Add full env vars to test auth/backend features
   - Environment validation provides helpful debugging messages

## Debugging

### Common Issues:

**"Environment validation failed"**
```bash
# Fix: Add missing variables to .env.local
# Check console for specific missing variables
```

**Clerk auth not working in development**
```bash
# Fix: Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
# Optional: Can develop UI components without these keys
```

**Convex queries failing**
```bash
# Fix: Add NEXT_PUBLIC_CONVEX_URL
# Optional: Frontend development possible without backend
```

### Manual Testing:
```bash
# Check if env vars load correctly
bun run dev

# Look for this message:
# ✅ Environment validation passed (Mode: development)
```

## Security Notes

- ✅ **Development Mode**: Easy iteration, console warnings encourage completion
- ✅ **Production Mode**: Strict validation prevents deployment with incomplete config
- ✅ **Webhook Secret**: Always optional (webhooks not required for all use cases)
- ✅ **No Secrets Exposed**: Client-side prefixes ensure sensitive data stays server-side

This dual-mode validation enables rapid development while maintaining production safety.
