# Quick Start Guide: Booking Components Implementation

**Feature**: Complete Booking Feature Implementation - Missing Components
**Date**: 2025-01-24

## Overview

This guide provides step-by-step instructions for implementing the missing booking components. The implementation builds upon the existing booking-form.tsx and integrates with the established Convex database and Clerk authentication system.

## Prerequisites

### Required Dependencies

All required dependencies are already installed in the project:

```json
{
  "@clerk/nextjs": "^6.34.0",
  "@hookform/resolvers": "^5.2.2",
  "@radix-ui/react-*": "various UI components",
  "convex": "^1.28.0",
  "next": "16.0.0",
  "react": "19.2.0",
  "react-hook-form": "^7.65.0",
  "tailwindcss": "^4",
  "zod": "^4.1.12"
}
```

### Development Environment

- Node.js 18+ and Bun package manager
- Convex development environment running
- Clerk development keys configured
- Existing booking-form.tsx component in place

## Implementation Steps

### Step 1: Add Missing shadcn/ui Components

Run these commands to add any missing UI components:

```bash
bunx shadcn@latest add badge
bunx shadcn@latest add skeleton
bunx shadcn@latest add separator
bunx shadcn@latest add alert
```

### Step 2: Create BookingStatusBadge Component

Create `src/components/features/booking/booking-status-badge.tsx`:

```typescript
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Booking } from "@/convex/_generated/dataModel";

interface BookingStatusBadgeProps {
  status: Booking["status"];
  variant?: "default" | "compact";
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    description: "Booking is awaiting confirmation",
  },
  confirmed: {
    label: "Confirmed",
    variant: "default" as const,
    description: "Booking has been confirmed",
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive" as const,
    description: "Booking has been cancelled",
  },
  completed: {
    label: "Completed",
    variant: "outline" as const,
    description: "Booking service has been completed",
  },
};

export function BookingStatusBadge({
  status,
  variant = "default",
  className
}: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  if (variant === "compact") {
    return (
      <Badge
        variant={config.variant}
        className={cn("text-xs", className)}
      >
        {config.label.charAt(0)}
      </Badge>
    );
  }

  return (
    <Badge
      variant={config.variant}
      className={className}
      title={config.description}
    >
      {config.label}
    </Badge>
  );
}
```

### Step 3: Create BookingConfirmation Component

Create `src/components/features/booking/booking-confirmation.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { useUserBookings, useCurrentUser } from "@/lib/convex/client";
import { BookingStatusBadge } from "./booking-status-badge";
import type { Id } from "@/convex/_generated/dataModel";

interface BookingConfirmationProps {
  bookingId?: string;
  className?: string;
}

export function BookingConfirmation({ bookingId, className }: BookingConfirmationProps) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bookings, isLoading: bookingsLoading } = useUserBookings(user?._id);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !bookingsLoading) {
      setLoading(false);

      if (!user) {
        setError("Please log in to view your booking confirmation");
        return;
      }

      // Find most recent booking or specific booking by ID
      const targetBooking = bookingId
        ? bookings?.find(b => b._id === bookingId)
        : bookings?.sort((a, b) => b.createdAt - a.createdAt)[0];

      if (targetBooking) {
        setBooking(targetBooking);
      } else {
        setError("Booking not found");
      }
    }
  }, [user, bookings, userLoading, bookingsLoading, bookingId]);

  if (loading || userLoading || bookingsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button
            className="mt-4"
            onClick={() => router.push("/booking")}
          >
            Book an Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Booking Confirmed!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Appointment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(new Date(booking.date * 1000), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                {booking.time}
              </div>
              <div>
                <strong>Service:</strong> {booking.serviceType}
              </div>
              {booking.notes && (
                <div>
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push("/booking/history")}>
            View All Bookings
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 4: Create BookingList Component

Create `src/components/features/booking/booking-list.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, ClockIcon, EmptyStateIcon } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";
import { useUserBookings, useCurrentUser } from "@/lib/convex/client";
import { BookingStatusBadge } from "./booking-status-badge";
import type { Id } from "@/convex/_generated/dataModel";

interface BookingListProps {
  userId?: Id<"users">;
  maxItems?: number;
  showUpcomingOnly?: boolean;
  className?: string;
}

export function BookingList({
  userId,
  maxItems,
  showUpcomingOnly = false,
  className
}: BookingListProps) {
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bookings, isLoading: bookingsLoading } = useUserBookings(userId || user?._id);

  const [filter, setFilter] = useState<"all" | "upcoming" | "past">(
    showUpcomingOnly ? "upcoming" : "all"
  );

  if (userLoading || bookingsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Please log in to view your booking history.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You don't have any bookings yet.
            </p>
            <Button onClick={() => window.location.href = "/booking"}>
              Book Your First Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.date * 1000);
      switch (filter) {
        case "upcoming":
          return isFuture(bookingDate);
        case "past":
          return isPast(bookingDate);
        default:
          return true;
      }
    })
    .sort((a, b) => b.date - a.date)
    .slice(0, maxItems);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Bookings</CardTitle>
          {!showUpcomingOnly && (
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
              </Button>
              <Button
                variant={filter === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("past")}
              >
                Past
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const bookingDate = new Date(booking.date * 1000);
            const isUpcoming = isFuture(bookingDate);

            return (
              <div key={booking._id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{booking.serviceType}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {format(bookingDate, "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {booking.time}
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="text-sm text-muted-foreground">
                        {booking.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isUpcoming && (
                      <Badge variant="outline">Upcoming</Badge>
                    )}
                    <BookingStatusBadge status={booking.status} variant="compact" />
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            );
          })}
        </div>

        {maxItems && bookings.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline">
              View All {bookings.length} Bookings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Step 5: Create Index Barrel Export

Create `src/components/features/booking/index.ts`:

```typescript
export { BookingForm } from "./booking-form";
export { BookingConfirmation } from "./booking-confirmation";
export { BookingList } from "./booking-list";
export { BookingStatusBadge } from "./booking-status-badge";

// Re-export types for external use
export type {
  BookingConfirmationProps,
  BookingListProps,
  BookingStatusBadgeProps,
} from "./types";
```

Create `src/components/features/booking/types.ts`:

```typescript
import type { Booking, Id } from "@/convex/_generated/dataModel";

export interface BookingConfirmationProps {
  bookingId?: string;
  className?: string;
}

export interface BookingListProps {
  userId?: Id<"users">;
  maxItems?: number;
  showUpcomingOnly?: boolean;
  className?: string;
}

export interface BookingStatusBadgeProps {
  status: Booking["status"];
  variant?: "default" | "compact";
  className?: string;
}
```

## Testing the Implementation

### 1. Component Testing

```bash
# Run unit tests
bun run test:unit

# Run tests with UI
bun run test:ui
```

### 2. Integration Testing

```bash
# Run E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui
```

### 3. Type Checking

```bash
# Run TypeScript compiler check
bun run typecheck
```

### 4. Linting

```bash
# Run Biome linter
bun run lint

# Fix linting issues
bun run lint:fix
```

## Usage Examples

### Booking Confirmation Page

```typescript
// app/booking/confirmation/page.tsx
import { BookingConfirmation } from "@/components/features/booking";

export default function BookingConfirmationPage() {
  return (
    <div className="container py-8">
      <BookingConfirmation />
    </div>
  );
}
```

### Booking History Page

```typescript
// app/booking/history/page.tsx
import { BookingList } from "@/components/features/booking";

export default function BookingHistoryPage() {
  return (
    <div className="container py-8">
      <BookingList />
    </div>
  );
}
```

### Dashboard Integration

```typescript
// app/dashboard/page.tsx
import { BookingList } from "@/components/features/booking";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      <BookingList showUpcomingOnly maxItems={5} />
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Convex Connection Issues**
   - Ensure Convex development server is running: `bun run convex:dev`
   - Check environment variables are correctly set

2. **Authentication Issues**
   - Verify Clerk keys are configured
   - Check user is properly authenticated

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check shadcn/ui components are installed

4. **TypeScript Errors**
   - Run `bun run typecheck` to identify issues
   - Ensure all imports are correct

### Performance Optimization

1. **Large Booking Lists**
   - Implement pagination for users with 100+ bookings
   - Use virtual scrolling for very large lists

2. **Slow Loading**
   - Implement skeleton loading states
   - Use optimistic updates where appropriate

## Next Steps

After implementing the basic components:

1. Add comprehensive unit and integration tests
2. Implement advanced filtering and search capabilities
3. Add booking modification features (reschedule, cancel)
4. Enhance accessibility features
5. Add internationalization support

This implementation provides a solid foundation for the booking feature while maintaining consistency with existing project patterns and constitutional requirements.