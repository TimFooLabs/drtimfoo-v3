"use client";

import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useUserBookings } from "@/lib/convex/client";
import { BookingStatusBadge } from "./booking-status-badge";
import type { BookingConfirmationProps } from "./types";

// Re-use type definitions from types.ts
type Booking = import("./types").Booking;

/**
 * BookingConfirmation - Displays booking confirmation details after form submission
 *
 * Features:
 * - Shows comprehensive booking details (service, date, time, status)
 * - Integrates with Convex real-time data
 * - Includes loading states and error handling
 * - Responsive design with mobile optimization
 * - WCAG 2.1 AA accessibility compliance
 *
 * @param bookingId - Optional specific booking ID to display
 * @param className - Additional CSS classes for styling
 */
export function BookingConfirmation({ bookingId, className }: BookingConfirmationProps) {
  const router = useRouter();
  const { user, isLoading: userLoading } = useCurrentUser();
  const { bookings, isLoading: bookingsLoading } = useUserBookings(user?._id);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
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
        ? bookings?.find((b) => b._id === bookingId)
        : bookings?.sort((a, b) => b.createdAt - a.createdAt)[0];

      if (targetBooking) {
        setBooking(targetBooking);
      } else {
        setError("Booking not found");
      }
    }
  }, [user, bookings, userLoading, bookingsLoading, bookingId]);

  // Loading state with skeleton UI
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

  // Error state with retry option
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/booking")}
              aria-label="Book a new appointment"
            >
              Book an Appointment
            </Button>
            <Button onClick={() => router.refresh()} aria-label="Retry loading booking information">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No booking found state
  if (!booking) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              No booking information available. Please complete the booking form first.
            </AlertDescription>
          </Alert>
          <Button
            className="mt-4"
            onClick={() => router.push("/booking")}
            aria-label="Navigate to booking form"
          >
            Book an Appointment
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Success state with booking details
  const bookingDate = new Date(booking.date * 1000);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CalendarIcon className="h-5 w-5" aria-hidden="true" />
          Booking Confirmed!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2 text-lg">Appointment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="font-medium">{format(bookingDate, "EEEE, MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="font-medium">{booking.time}</span>
              </div>
              <div>
                <span className="font-medium">Service:</span>{" "}
                <span className="capitalize">{booking.serviceType.replace("-", " ")}</span>
              </div>
              {booking.notes && (
                <div>
                  <span className="font-medium">Notes:</span>{" "}
                  <span className="text-muted-foreground">{booking.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-lg">Status & Actions</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Current Status:</span>{" "}
                <BookingStatusBadge
                  status={booking.status}
                  aria-label={`Booking status is ${booking.status}`}
                />
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  You will receive a confirmation email shortly with all appointment details.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push("/booking/history")}
                    aria-label="View all your bookings"
                  >
                    View All Bookings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    aria-label="Return to homepage"
                  >
                    Return Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• You will receive a confirmation email within 24 hours</li>
            <li>• You can modify or cancel your booking up to 24 hours before the appointment</li>
            <li>• Arrival 10 minutes early is recommended for paperwork processing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
