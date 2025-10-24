<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0 (initial adoption)
Modified principles: N/A (all new)
Added sections: Core Principles, Development Standards, Quality Gates, Governance
Removed sections: N/A
Templates requiring updates: ✅ plan-template.md (constitution check), ✅ spec-template.md (user stories), ✅ tasks-template.md (independent implementation)
Follow-up TODOs: N/A
-->

# DrTimFoo Constitution

## Core Principles

### I. User-Centric Web Application
Every feature MUST prioritize user experience for professional services booking. Interfaces SHALL be intuitive, responsive, and accessible. All user journeys MUST be independently testable and deliver measurable value.

### II. Real-Time Data Synchronization
All application state MUST sync in real-time using Convex. Data changes SHALL propagate immediately across all client connections. Offline capabilities MUST be considered but real-time consistency is prioritized.

### III. Secure Authentication & Authorization
Clerk authentication MUST be integrated for all user access. Role-based access control SHALL enforce proper authorization boundaries. All API endpoints MUST validate authentication and authorize requests before processing.

### IV. Test-First Development (NON-NEGOTIABLE)
TDD is MANDATORY: Tests MUST be written → User stories validated → Tests confirmed to fail → Only then implement features. Red-Green-Refactor cycle SHALL be strictly enforced for all development.

### V. Integration Testing Excellence
Integration tests MUST cover critical user workflows: Booking creation flow, Authentication lifecycle, Webhook processing, Real-time data synchronization, Cross-component interactions.

## Development Standards

### Technology Stack Requirements
Next.js 16 with App Router is MANDATORY. TypeScript SHALL be used for all code. Tailwind CSS MUST be used for styling. Bun is the preferred package manager. Biome SHALL handle all linting and formatting.

### Performance & Accessibility
All pages MUST load within 2 seconds. Components SHALL be accessible (WCAG 2.1 AA). Images MUST be optimized. Core Web Vitals SHALL meet Google thresholds. Real-time updates MUST not block UI responsiveness.

### Security Standards
All API routes MUST validate inputs. Environment variables SHALL be validated with Zod. Clerk webhooks MUST be verified. Convex security rules SHALL enforce data access patterns. No sensitive data SHALL be exposed to clients.

## Quality Gates

### Code Review Requirements
All code changes MUST pass Biome checks. TypeScript MUST compile without errors. All tests MUST pass. Critical user flows MUST have integration tests. Performance budgets SHALL not be exceeded.

### Deployment Standards
Features MUST be tested in staging environments. Database schema changes MUST be backward compatible. Webhook endpoints MUST be validated before deployment. Rollback procedures SHALL be documented.

### Documentation Requirements
All public APIs MUST be documented. User stories MUST include acceptance criteria. Complex business logic SHALL have inline documentation. Deployment procedures SHALL be documented in runbooks.

## Governance

This constitution supersedes all other development practices. Amendments MUST be proposed as pull requests with clear rationale. Changes require team approval and MUST update all dependent templates. Compliance SHALL be verified in all code reviews. Version follows semantic versioning: MAJOR for principle changes, MINOR for additions, PATCH for clarifications.

**Version**: 1.0.0 | **Ratified**: 2025-01-24 | **Last Amended**: 2025-01-24