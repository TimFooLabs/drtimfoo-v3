# Booking API Contracts

**Feature**: Complete Booking Feature Implementation - Missing Components
**Date**: 2025-01-24

## Overview

The booking components will use existing Convex queries and mutations. No new API endpoints are required for this feature implementation.

## Existing Convex API Usage

### Queries

#### Get User Bookings

**Hook**: `useUserBookings(userId)`

**Input**:
```typescript
{
  userId: Id<"users">  // Authenticated user ID
}
```

**Output**:
```typescript
Booking[] | undefined  // Array of user's bookings
```

**Error Handling**:
- Returns `undefined` if user not authenticated
- Throws Convex error for database issues

#### Get Upcoming Bookings

**Hook**: `useUpcomingBookings()`

**Input**: None (uses authenticated user context)

**Output**:
```typescript
Booking[] | undefined  // Array of upcoming bookings
```

#### Get Current User

**Hook**: `useCurrentUser(clerkId)`

**Input**:
```typescript
{
  clerkId: string  // Clerk authentication ID
}
```

**Output**:
```typescript
User | undefined  // User information
```

### Mutations

#### Create Booking

**Hook**: `useCreateBooking()`

**Input**:
```typescript
{
  serviceType: string,
  date: number,        // Unix timestamp
  time: string,        // Time slot
  notes?: string       // Optional notes
}
```

**Output**:
```typescript
Id<"bookings">  // Created booking ID
```

## Component-Level Data Contracts

### BookingConfirmation Component

**Props Interface**:
```typescript
interface BookingConfirmationProps {
  bookingId?: string;           // Optional booking ID from URL
  className?: string;           // Additional CSS classes
}
```

**Data Requirements**:
- Recent booking data (from navigation state or URL parameter)
- User information for personalization

**State Management**:
```typescript
interface BookingConfirmationState {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
}
```

### BookingList Component

**Props Interface**:
```typescript
interface BookingListProps {
  userId?: Id<"users">;         // User ID (defaults to authenticated user)
  maxItems?: number;            // Optional limit for display
  showUpcomingOnly?: boolean;   // Filter for upcoming bookings only
  className?: string;           // Additional CSS classes
}
```

**Data Requirements**:
- Array of user bookings from Convex
- Loading and error states
- Sorting and filtering capabilities

**State Management**:
```typescript
interface BookingListState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'upcoming' | 'past';
  sortBy: 'date' | 'status' | 'service';
}
```

### BookingStatusBadge Component

**Props Interface**:
```typescript
interface BookingStatusBadgeProps {
  status: BookingStatus;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}
```

**Status Configuration**:
```typescript
interface StatusConfig {
  label: string;
  color: string;
  icon?: React.ComponentType;
  description: string;
}
```

### BookingCalendar Component

**Props Interface**:
```typescript
interface BookingCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  unavailableDates?: Date[];
  bookedDates?: Date[];
  className?: string;
}
```

**Data Requirements**:
- Selected date state
- Arrays of unavailable and booked dates
- Date selection handler

## Error Handling Contracts

### Standard Error Response

```typescript
interface BookingError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}
```

### Error Types

| Error Code | Description | Retryable | User Action |
|------------|-------------|-----------|-------------|
| `NETWORK_ERROR` | Connection issue | Yes | Retry connection |
| `AUTHENTICATION_REQUIRED` | User not logged in | No | Log in |
| `BOOKING_NOT_FOUND` | Invalid booking ID | No | Contact support |
| `PERMISSION_DENIED` | Access denied | No | Check permissions |
| `VALIDATION_ERROR` | Invalid input data | No | Correct input |

## Loading State Contracts

### Skeleton Loading Interface

```typescript
interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;  // 0-100 for multi-step operations
}
```

### Loading Components

- `BookingConfirmationSkeleton`: Full-page loading state
- `BookingListSkeleton`: List item placeholders
- `BookingStatusBadgeSkeleton`: Badge placeholder
- `BookingCalendarSkeleton`: Calendar grid placeholder

## Accessibility Contracts

### ARIA Labels and Roles

```typescript
interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-live'?: 'polite' | 'assertive';
  role?: string;
}
```

### Keyboard Navigation

```typescript
interface KeyboardNavigation {
  tabIndex: number;
  onKeyDown: (event: KeyboardEvent) => void;
  focus(): void;
}
```

## Performance Contracts

### Response Time Requirements

- **Booking Confirmation Display**: < 2 seconds
- **Booking History Load**: < 3 seconds for 100+ bookings
- **Status Badge Rendering**: < 100ms
- **Calendar Interaction**: < 200ms

### Data Size Limits

- **Maximum Bookings per User**: 1000 (with pagination)
- **Calendar Date Range**: 12 months viewable
- **Notes Character Limit**: 500 characters
- **Service Type Options**: 20 maximum

## Integration Test Contracts

### Test Scenarios

1. **Booking Confirmation Flow**
   - Create booking → Redirect to confirmation → Verify details

2. **Booking History Display**
   - Login → View history → Verify chronological order

3. **Status Badge Updates**
   - Change booking status → Verify badge update

4. **Calendar Date Selection**
   - Select date → Verify availability → Update booking form

### Mock Data Contracts

```typescript
interface MockBooking extends Booking {
  _id: string;
  // Additional test-specific properties
}

interface MockUser extends User {
  _id: string;
  // Additional test-specific properties
}
```

## Version Compatibility

### Current Convex Schema Version

- **Bookings Table**: v1.0 (compatible)
- **Users Table**: v1.0 (compatible)
- **No breaking changes** required for this feature

### Future Compatibility

- Components designed to be backward compatible
- Graceful degradation for schema changes
- Migration path for data structure updates