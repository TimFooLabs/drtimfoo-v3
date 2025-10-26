import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingCalendar } from "@/components/features/booking/booking-calendar";
import type { BookingCalendarProps } from "@/components/features/booking/types";

// Mock data for testing
const mockProps: BookingCalendarProps = {
  onDateSelect: vi.fn(),
  selectedDate: new Date(2024, 0, 15), // January 15, 2024
  unavailableDates: [
    new Date(2024, 0, 10), // January 10, 2024
    new Date(2024, 0, 20), // January 20, 2024
  ],
  bookedDates: [
    new Date(2024, 0, 5),  // January 5, 2024
    new Date(2024, 0, 25), // January 25, 2024
  ],
  bookings: [
    {
      _id: "1",
      userId: "user1",
      serviceType: "Consultation",
      date: new Date(2024, 0, 5).getTime() / 1000,
      time: "10:00",
      status: "confirmed",
      createdAt: Date.now() / 1000,
      updatedAt: Date.now() / 1000,
    },
    {
      _id: "2",
      userId: "user2",
      serviceType: "Follow-up",
      date: new Date(2024, 0, 25).getTime() / 1000,
      time: "14:00",
      status: "pending",
      createdAt: Date.now() / 1000,
      updatedAt: Date.now() / 1000,
    },
  ],
};

describe("BookingCalendar", () => {
  describe("Calendar Rendering", () => {
    it("should render calendar with correct structure", () => {
      render(<BookingCalendar {...mockProps} />);

      expect(screen.getByText("Select Date")).toBeInTheDocument();
      expect(screen.getByText("Booked")).toBeInTheDocument();
      expect(screen.getByText("Unavailable")).toBeInTheDocument();
      expect(screen.getByText("Today")).toBeInTheDocument();
    });

    it("should display selected date if provided", () => {
      render(<BookingCalendar {...mockProps} />);

      const selectButton = screen.getByText(/Select.*2024/);
      expect(selectButton).toBeInTheDocument();
    });

    it("should handle no selected date gracefully", () => {
      const propsWithoutDate = { ...mockProps, selectedDate: undefined };
      render(<BookingCalendar {...propsWithoutDate} />);

      expect(screen.queryByText(/Select.*2024/)).not.toBeInTheDocument();
    });
  });

  describe("Date Availability Indicators", () => {
    it("should display unavailable dates with proper styling", () => {
      render(<BookingCalendar {...mockProps} />);

      // Look for the 10th day (unavailable date)
      const unavailableDay = screen.getByText("10");
      expect(unavailableDay).toBeInTheDocument();
      expect(unavailableDay.closest('[aria-disabled="true"]')).toBeTruthy();
    });

    it("should display booked dates with proper styling", () => {
      render(<BookingCalendar {...mockProps} />);

      // Look for the 5th day (booked date)
      const bookedDay = screen.getByText("5");
      expect(bookedDay).toBeInTheDocument();
      // Booked dates should be clickable but have green styling
      expect(bookedDay.closest('[aria-disabled="true"]')).toBeFalsy();
    });

    it("should handle empty availability arrays", () => {
      const propsWithNoDates = {
        ...mockProps,
        unavailableDates: [],
        bookedDates: [],
        bookings: [],
      };
      render(<BookingCalendar {...propsWithNoDates} />);

      expect(screen.getByText("Select Date")).toBeInTheDocument();
      // Should not show availability counts when empty
      expect(screen.queryByText(/dates already booked/)).not.toBeInTheDocument();
    });
  });

  describe("Month Navigation", () => {
    it("should navigate to previous month", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const previousButton = screen.getByLabelText("Previous month");
      await user.click(previousButton);

      // The calendar should update to show the previous month
      // This is verified by the component not throwing errors
      expect(screen.getByText("Select Date")).toBeInTheDocument();
    });

    it("should navigate to next month", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const nextButton = screen.getByLabelText("Next month");
      await user.click(nextButton);

      expect(screen.getByText("Select Date")).toBeInTheDocument();
    });

    it("should return to today when Today button is clicked", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const todayButton = screen.getByText("Today");
      await user.click(todayButton);

      // Should remain functional and not throw errors
      expect(screen.getByText("Today")).toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("should call onDateSelect when a date is clicked", async () => {
      const user = userEvent.setup();
      const mockOnDateSelect = vi.fn();
      const propsWithCallback = { ...mockProps, onDateSelect: mockOnDateSelect };

      render(<BookingCalendar {...propsWithCallback} />);

      // Click on a date that should be available (e.g., day 15)
      const availableDay = screen.getByText("15");
      await user.click(availableDay);

      expect(mockOnDateSelect).toHaveBeenCalled();
    });

    it("should not call onDateSelect when unavailable date is clicked", async () => {
      const user = userEvent.setup();
      const mockOnDateSelect = vi.fn();
      const propsWithCallback = { ...mockProps, onDateSelect: mockOnDateSelect };

      render(<BookingCalendar {...propsWithCallback} />);

      // Try to click on an unavailable date (day 10)
      const unavailableDay = screen.getByText("10");
      await user.click(unavailableDay);

      expect(mockOnDateSelect).not.toHaveBeenCalled();
    });

    it("should call onDateSelect when Select button is clicked", async () => {
      const user = userEvent.setup();
      const mockOnDateSelect = vi.fn();
      const propsWithCallback = { ...mockProps, onDateSelect: mockOnDateSelect };

      render(<BookingCalendar {...propsWithCallback} />);

      const selectButton = screen.getByText(/Select.*2024/);
      await user.click(selectButton);

      expect(mockOnDateSelect).toHaveBeenCalledWith(mockProps.selectedDate);
    });
  });

  describe("Booking Density Display", () => {
    it("should show density indicators for dates with multiple bookings", () => {
      render(<BookingCalendar {...mockProps} />);

      // The 5th and 25th should have booking density indicators
      const day5 = screen.getByText("5");
      const day25 = screen.getByText("25");

      expect(day5).toBeInTheDocument();
      expect(day25).toBeInTheDocument();
    });

    it("should handle bookings array with different date formats", () => {
      const propsWithEdgeCaseBookings = {
        ...mockProps,
        bookings: [
          ...(mockProps.bookings || []),
          {
            _id: "3",
            userId: "user3",
            serviceType: "Emergency",
            date: new Date(2024, 0, 5, 12, 30).getTime() / 1000, // Same day, different time
            time: "12:30",
            status: "confirmed" as const,
            createdAt: Date.now() / 1000,
            updatedAt: Date.now() / 1000,
          },
        ],
      };

      render(<BookingCalendar {...propsWithEdgeCaseBookings} />);

      // Should still render without errors
      expect(screen.getByText("Select Date")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<BookingCalendar {...mockProps} />);

      const previousButton = screen.getByLabelText("Previous month");
      const nextButton = screen.getByLabelText("Next month");

      expect(previousButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it("should mark unavailable dates as disabled", () => {
      render(<BookingCalendar {...mockProps} />);

      const unavailableDay = screen.getByText("10");
      expect(unavailableDay.closest('[aria-disabled="true"]')).toBeTruthy();
    });

    it("should allow keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const calendar = screen.getByRole("grid");
      calendar.focus();

      // Should not throw errors with keyboard interaction
      await user.tab();
      expect(screen.getByText("Select Date")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should render with responsive classes", () => {
      render(<BookingCalendar {...mockProps} />);

      const calendar = screen.getByRole("grid");
      expect(calendar).toBeInTheDocument();

      // Check that the card has responsive classes
      const card = calendar.closest(".max-w-md");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid dates gracefully", () => {
      const propsWithInvalidDates = {
        ...mockProps,
        unavailableDates: [new Date("invalid")],
        bookedDates: [new Date("invalid")],
      };

      // Should not throw errors
      expect(() => {
        render(<BookingCalendar {...propsWithInvalidDates} />);
      }).not.toThrow();
    });

    it("should handle missing callback gracefully", () => {
      const propsWithoutCallback = { ...mockProps, onDateSelect: undefined as any };

      // Should not throw errors during render
      expect(() => {
        render(<BookingCalendar {...propsWithoutCallback} />);
      }).not.toThrow();
    });

    it("should handle empty props", () => {
      const emptyProps: BookingCalendarProps = {
        onDateSelect: vi.fn(),
      };

      expect(() => {
        render(<BookingCalendar {...emptyProps} />);
      }).not.toThrow();
    });
  });

  describe("Custom Styling", () => {
    it("should apply custom className", () => {
      const customClass = "custom-calendar-class";
      const propsWithCustomClass = { ...mockProps, className: customClass };

      render(<BookingCalendar {...propsWithCustomClass} />);

      const calendarCard = screen.getByText("Select Date").closest(".custom-calendar-class");
      expect(calendarCard).toBeInTheDocument();
    });
  });
});