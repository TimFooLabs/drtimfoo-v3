# Data Model: Booking Components

**Feature**: Complete Booking Feature Implementation - Missing Components
**Date**: 2025-01-24

## Overview

The booking components will work with the existing Convex database schema, leveraging the established `bookings` and `users` tables. No schema changes are required for this feature implementation.

## Core Entities

### Booking

**Source**: `convex/schema.ts` (existing)

```typescript
{
  _id: Id<"bookings">,
  userId: Id<"users">,           // Foreign key to users table
  serviceType: string,           // Type of service booked
  date: number,                  // Unix timestamp for booking date
  time: string,                  // Time slot (e.g., "09:00", "14:30")
  status: BookingStatus,         // Current booking status
  notes?: string,                // Optional user notes
  createdAt: number,             // Creation timestamp
  updatedAt: number,             // Last update timestamp
}
```

**Validation Rules**:
- `serviceType`: Must match predefined service options
- `date`: Must be future timestamp at time of creation
- `time`: Must match available time slot format
- `status`: Must be one of valid status values
- `notes`: Optional, max 500 characters if provided

### User

**Source**: `convex/schema.ts` (existing)

```typescript
{
  _id: Id<"users">,
  clerkId: string,               // Clerk authentication ID
  email: string,                 // User email
  name?: string,                 // Optional display name
  role: UserRole,                // User role (user/admin)
  createdAt: number,             // Account creation timestamp
  updatedAt: number,             // Last update timestamp
}
```

**Validation Rules**:
- `clerkId`: Must be valid Clerk user ID
- `email`: Must be valid email format
- `name`: Optional, max 100 characters if provided

## Data Types

### BookingStatus

```typescript
type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"
```

**Status Flow**:
1. `pending` → Initial state after booking creation
2. `confirmed` → Booking approved/confirmed
3. `cancelled` → Booking cancelled by user or admin
4. `completed` → Booking service delivered

### UserRole

```typescript
type UserRole = "user" | "admin"
```

## Component Data Requirements

### BookingConfirmation Component

**Input Data**:
- Single booking object (from recent booking or URL parameter)
- User information for personalization

**Data Sources**:
- Convex query: Get booking by ID
- Convex query: Get user by Clerk ID (for personalization)

### BookingList Component

**Input Data**:
- Array of user bookings (filtered by authenticated user)
- Loading states and error information

**Data Sources**:
- Convex query: `useUserBookings(userId)` hook
- Real-time updates via Convex subscriptions

### BookingStatusBadge Component

**Input Data**:
- Booking status string
- Optional styling variant

**Data Sources**:
- Static status configuration
- No external data dependencies

### BookingCalendar Component

**Input Data**:
- Selected date state
- Available/unavailable date indicators
- Booking density information (optional)

**Data Sources**:
- Existing booking data for availability calculation
- Date selection state management

## Data Access Patterns

### Authentication-Based Filtering

All booking data access must be filtered by the authenticated user's ID:

```typescript
// Existing pattern in src/lib/convex/client.ts
useUserBookings(userId: Id<"users"> | undefined)
```

### Real-Time Updates

Components will subscribe to Convex real-time updates:

```typescript
// Automatic updates when booking data changes
const bookings = useQuery(api.bookings.getByUser, { userId });
```

### Error Handling

- Network errors: Display retry options
- Authentication errors: Redirect to login
- Data validation errors: Display user-friendly messages
- Not found errors: Show appropriate empty states

## Performance Considerations

### Data Loading Strategy

1. **Optimistic Loading**: Show skeleton states while data loads
2. **Pagination**: For users with many bookings (100+)
3. **Caching**: Leverage Convex's built-in caching
4. **Lazy Loading**: Load booking history on demand

### Query Optimization

- Use existing Convex indexes (`by_user`, `by_date`, `by_status`)
- Filter data at the database level
- Minimize client-side data processing

## Security Considerations

### Data Isolation

- Users can only access their own bookings
- Admin access requires additional role verification
- No cross-user data exposure

### Input Validation

- Validate booking IDs before database queries
- Sanitize user inputs for search/filter functions
- Protect against injection attacks

## Integration Points

### Existing Hooks

The components will leverage existing Convex hooks:

```typescript
// From src/lib/convex/client.ts
useCreateBooking()           // For future booking modifications
useUserBookings(userId)      // For booking history
useUpcomingBookings()        // For dashboard components
useCurrentUser(clerkId)      // For user information
```

### Form Integration

- Booking form already creates bookings correctly
- Confirmation component will display recently created bookings
- History component will show all user bookings

## Data Migration

No data migration is required. The feature will work with existing booking data and user accounts.