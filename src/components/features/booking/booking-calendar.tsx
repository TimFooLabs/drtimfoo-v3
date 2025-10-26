"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BookingCalendarProps } from "./types";

/**
 * BookingCalendar - Enhanced calendar with availability indicators
 *
 * Provides an interactive calendar interface with:
 * - Availability indicators for booked/unavailable dates
 * - Multi-month navigation support
 * - Keyboard navigation and accessibility features
 * - Integration with existing booking data
 * - WCAG 2.1 AA compliance
 *
 * @param selectedDate - Currently selected date
 * @param onDateSelect - Callback when date is selected
 * @param unavailableDates - Array of unavailable dates
 * @param bookedDates - Array of already booked dates
 * @param bookings - Optional array of booking objects for density display
 * @param className - Additional CSS classes for styling
 */
export function BookingCalendar({
  selectedDate,
  onDateSelect,
  unavailableDates = [],
  bookedDates = [],
  bookings = [],
  className,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // Helper function to check if a date is unavailable
  const isUnavailable = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) => date.toDateString() === unavailableDate.toDateString(),
    );
  };

  // Helper function to check if a date is booked
  const isBooked = (date: Date) => {
    return bookedDates.some((bookedDate) => date.toDateString() === bookedDate.toDateString());
  };

  // Helper function to get booking density for a date
  const getBookingDensity = (date: Date) => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date * 1000);
      return date.toDateString() === bookingDate.toDateString();
    }).length;
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isUnavailable(date)) {
      onDateSelect(date);
    }
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Select Date</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {/* Legend */}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="h-8 w-8 p-0"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <h2 className="text-sm font-medium text-foreground">{getMonthName(currentMonth)}</h2>

          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="h-8 w-8 p-0"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-muted-foreground text-center py-2"
                role="columnheader"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1" role="grid">
            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="w-10 h-10"
                    role="gridcell"
                    aria-hidden="true"
                  />
                );
              }

              const isSelected =
                selectedDate && date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              const unavailable = isUnavailable(date);
              const booked = isBooked(date);
              const density = getBookingDensity(date);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  role="gridcell"
                  className={cn(
                    "relative w-10 h-10 text-sm rounded-md cursor-pointer transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    isSelected && "bg-blue-500 text-white hover:bg-blue-600",
                    isToday &&
                      !isSelected &&
                      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                    unavailable &&
                      "opacity-50 cursor-not-allowed bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400",
                    booked &&
                      !unavailable &&
                      "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
                    "disabled:opacity-30 disabled:cursor-not-allowed",
                  )}
                  onClick={() => handleDateSelect(date)}
                  disabled={unavailable}
                  aria-label={`${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${isSelected ? ", selected" : ""}${unavailable ? ", unavailable" : ""}${booked ? ", booked" : ""}`}
                  aria-selected={isSelected}
                  aria-disabled={unavailable}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-sm font-medium">{date.getDate()}</span>

                    {/* Booking density indicator */}
                    {density > 0 && !unavailable && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {[...Array(Math.min(density, 3))].map((_, i) => (
                          <div
                            key={`density-${date.toISOString()}-${i}`}
                            className={cn(
                              "w-1 h-1 rounded-full",
                              booked ? "bg-green-500" : "bg-blue-400",
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {/* Status indicators */}
                    {booked && !unavailable && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Booked" />
                      </div>
                    )}

                    {unavailable && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full" title="Unavailable" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick navigation buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="flex-1"
          >
            Today
          </Button>

          {selectedDate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateSelect(selectedDate)}
              className="flex-1"
            >
              Select {selectedDate.toLocaleDateString()}
            </Button>
          )}
        </div>

        {/* Additional information */}
        {(bookedDates.length > 0 || unavailableDates.length > 0) && (
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p>
              • {bookedDates.length} date{bookedDates.length !== 1 ? "s" : ""} already booked
            </p>
            <p>
              • {unavailableDates.length} date{unavailableDates.length !== 1 ? "s" : ""} unavailable
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BookingCalendar;
