"use client";

// FIX: Organized imports alphabetically and by type.
import { format, isFuture, isPast, isToday } from "date-fns";
import { Calendar, CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useUserBookings } from "@/lib/convex/client";

import { BookingStatusBadge } from "./booking-status-badge";
import type { BookingListProps } from "./types";

/**
 * BookingList - Displays user's booking history with filtering and sorting
 */
export function BookingList({
  userId,
  maxItems,
  showUpcomingOnly = false,
  className,
}: BookingListProps) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bookings, isLoading: bookingsLoading } = useUserBookings(userId || user?._id);

  const [filter, setFilter] = useState<"all" | "upcoming" | "past">(
    showUpcomingOnly ? "upcoming" : "all",
  );
  // FIX: The `setSortBy` function is now used by the re-added sort buttons.
  const [sortBy, setSortBy] = useState<"date" | "status" | "service">("date");

  const processedBookings = useMemo(() => {
    if (!bookings) {
      return { filtered: [], upcomingCount: 0, pastCount: 0 };
    }

    const sorted = [...bookings].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date - a.date;
        case "status":
          return a.status.localeCompare(b.status);
        case "service":
          return a.serviceType.localeCompare(b.serviceType);
        default:
          return b.date - a.date;
      }
    });

    const filtered = sorted.filter((booking) => {
      const bookingDate = new Date(booking.date);
      switch (filter) {
        case "upcoming":
          return isFuture(bookingDate) && booking.status !== "cancelled";
        case "past":
          return isPast(bookingDate);
        default:
          return true;
      }
    });

    const upcomingCount = bookings.filter(
      (b) => isFuture(new Date(b.date)) && b.status !== "cancelled",
    ).length;
    const pastCount = bookings.filter((b) => isPast(new Date(b.date))).length;

    return { filtered, upcomingCount, pastCount };
  }, [bookings, filter, sortBy]);

  const limitedBookings = maxItems
    ? processedBookings.filtered.slice(0, maxItems)
    : processedBookings.filtered;
  const hasMoreBookings = maxItems && bookings && bookings.length > maxItems;

  if (userLoading || bookingsLoading) {
    return (
      <Card className={className} data-testid="loading-skeleton">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* FIX: Replaced map with static elements to avoid array-index-key warning and removed invalid ARIA props. */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="default">
            <AlertDescription className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              Please log in to view your bookings.
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
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" aria-hidden="true" />
            Your Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              You don't have any appointments scheduled. Book your first appointment to get started!
            </p>
            <Button
              onClick={() => router.push("/booking")}
              className="mt-4"
              aria-label="Book your first appointment"
            >
              Book Your First Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" aria-hidden="true" />
            Your Bookings
          </CardTitle>

          {!showUpcomingOnly && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                aria-pressed={filter === "all"}
              >
                All ({bookings.length})
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("upcoming")}
                aria-pressed={filter === "upcoming"}
              >
                Upcoming ({processedBookings.upcomingCount})
              </Button>
              <Button
                variant={filter === "past" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("past")}
                aria-pressed={filter === "past"}
              >
                Past ({processedBookings.pastCount})
              </Button>
            </div>
          )}

          {/* FIX: Re-added sort buttons to provide functionality and use the setSortBy state setter. */}
          <div className="flex gap-2">
            <Button
              variant={sortBy === "date" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("date")}
              aria-label="Sort by date"
              aria-pressed={sortBy === "date"}
            >
              Sort by Date
            </Button>
            <Button
              variant={sortBy === "service" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("service")}
              aria-label="Sort by service type"
              aria-pressed={sortBy === "service"}
            >
              Sort by Service
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {limitedBookings.map((booking) => {
            const bookingDate = new Date(booking.date);
            return (
              // FIX: Removed redundant role="article"
              <article
                key={booking._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-lg capitalize">
                      {booking.serviceType.replace(/-/g, " ")}
                    </h4>
                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                        <span>{format(bookingDate, "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" aria-hidden="true" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    {booking.notes && (
                      <p className="text-sm pt-2">
                        <span className="font-medium">Notes:</span>{" "}
                        <span className="text-muted-foreground">{booking.notes}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <BookingStatusBadge status={booking.status} />
                    <div className="text-xs text-muted-foreground">
                      {isToday(bookingDate) ? "Today" : format(new Date(booking.date), "MMM d")}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {hasMoreBookings && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => router.push("/booking/history")}
              aria-label={`View all ${bookings.length} bookings`}
            >
              View All {bookings.length} Bookings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
