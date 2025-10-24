# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with TypeScript, built for a professional services business with booking functionality. The tech stack includes:

- **Framework**: Next.js 16 with App Router and React 19
- **Styling**: Tailwind CSS with custom component library
- **Database**: Convex for real-time data sync
- **Authentication**: Clerk with webhook integration
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Code Quality**: Biome for linting and formatting
- **Package Manager**: Bun (preferred, though npm scripts work)

## Development Commands

### Core Development
- `bun dev` - Start development server with Turbo
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun run typecheck` - Run TypeScript type checking

### Code Quality
- `bun run lint` - Run Biome linter
- `bun run lint:fix` - Fix linting issues automatically
- `bun run deps:check` - Check for outdated dependencies
- `bun run deps:update` - Interactive dependency updates
- `bun run deps:unused` - Find unused dependencies

### Testing
- `bun run test` - Run unit tests (Vitest)
- `bun run test:ui` - Run tests with UI
- `bun run test:coverage` - Run tests with coverage
- `bun run test:e2e` - Run Playwright E2E tests
- `bun run test:e2e:ui` - Run E2E tests with UI
- `bun run test:integration` - Run full integration test suite

### Convex Development
- `bun run convex:dev` - Start Convex development backend
- `bun run convex:deploy` - Deploy Convex to production

### Integration Testing
- `./scripts/run-full-test-suite.sh` - Complete integration test suite covering Clerk, webhooks, and Convex

## Architecture Overview

### App Router Structure
The app uses Next.js App Router with route groups:

- `(marketing)/` - Public marketing pages with header/footer layout
- `(blog)/` - Blog functionality with minimal layout
- `(admin)/` - Admin dashboard with authentication checks
- `api/` - API routes including webhooks and booking endpoints

### Database Schema (Convex)
Core entities managed in `convex/schema.ts`:

- **users**: Linked to Clerk authentication, includes role-based access
- **bookings**: Service bookings with status tracking (pending → confirmed → completed/cancelled)
- **testimonials**: Customer testimonials with approval workflow
- **contacts**: Contact form submissions with status tracking

### Authentication Flow
C handles authentication with Clerk:
1. Users authenticate via Clerk UI
2. Clerk webhooks sync user data to Convex database
3. Server-side auth helpers (`src/lib/convex/server.ts`) provide protected route utilities
4. Client-side hooks (`src/lib/convex/client.ts`) provide reactive data access

### Component Architecture
- UI components in `src/components/ui/` built on Radix UI primitives
- Layout components in `src/components/layout/` for navigation, header, footer
- Feature-specific components in `src/components/features/`
- Consistent styling with Tailwind CSS and CSS-in-JS patterns

### Environment Management
Environment variables are validated with Zod schema in `src/lib/env.ts`. Required variables include:
- Clerk keys and webhook secrets
- Convex deployment URLs
- Application URL configuration

## Key Integration Points

### Clerk Webhook Processing
Webhooks are handled at `src/app/api/webhooks/clerk/route.ts` and automatically sync:
- User creation/deletion to Convex users table
- Role updates for admin access

### Booking System
Bookings flow through:
1. Frontend form submission to `src/app/api/bookings/route.ts`
2. Server-side validation and user authentication
3. Convex database storage with real-time updates

### Admin Features
Admin functionality includes:
- Role-based access control via `requireAdmin()` helper
- Dashboard for managing bookings and testimonials
- Protected API routes with authentication checks

## Testing Strategy

The project uses comprehensive testing:
- Unit tests with Vitest and React Testing Library
- E2E tests with Playwright covering critical user flows
- Integration tests validating Clerk + Convex workflows
- Custom test scripts for webhook and authentication scenarios

## Development Notes

- Use Bun for package management when possible
- Biome handles both linting and formatting - configure in `biome.json`
- Convex provides real-time data sync - leverage reactive queries
- Clerk authentication requires proper webhook setup for user sync
- All API routes should include proper error handling and validation
- Component variants use class-variance-authority (CVA) pattern