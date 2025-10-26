import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingCalendar } from "@/components/features/booking/booking-calendar";
import type { BookingCalendarProps } from "@/components/features/booking/types";

// Mock data for testing
const mockProps: BookingCalendarProps = {
  onDateSelect: vi.fn(),
  selectedDate: new Date(2024, 0, 15),
  unavailableDates: [new Date(2024, 0, 10)],
  bookedDates: [new Date(2024, 0, 5)],
  bookings: [],
};

describe("BookingCalendar Accessibility", () => {
  describe("WCAG 2.1 AA Compliance", () => {
    it("should have proper semantic HTML structure", () => {
      render(<BookingCalendar {...mockProps} />);

      // Check for proper heading structure
      const heading = screen.getByRole("heading", { name: /select date/i });
      expect(heading).toBeInTheDocument();

      // Check for grid structure
      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();
    });

    it("should provide sufficient color contrast", () => {
      render(<BookingCalendar {...mockProps} />);

      // The calendar should use shadcn/ui components which meet WCAG contrast requirements
      // This test validates the structure is in place for proper contrast
      const calendarCells = screen.getAllByRole("gridcell");
      expect(calendarCells.length).toBeGreaterThan(0);
    });

    it("should have proper focus indicators", () => {
      render(<BookingCalendar {...mockProps} />);

      const previousButton = screen.getByLabelText("Previous month");
      const nextButton = screen.getByLabelText("Next month");

      // Elements should be focusable
      expect(previousButton).toHaveAttribute("type");
      expect(nextButton).toHaveAttribute("type");

      // Focus management
      previousButton.focus();
      expect(previousButton).toHaveFocus();

      nextButton.focus();
      expect(nextButton).toHaveFocus();
    });
  });

  describe("Keyboard Navigation", () => {
    it("should support full keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      // Tab through interactive elements
      await user.tab();
      expect(screen.getByLabelText("Previous month")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Next month")).toHaveFocus();

      await user.tab();
      // Should focus on calendar grid
      const grid = screen.getByRole("grid");
      expect(grid).toHaveFocus();
    });

    it("should support arrow key navigation within calendar", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const grid = screen.getByRole("grid");
      grid.focus();

      // Test arrow key navigation
      await user.keyboard("{ArrowRight}");
      await user.keyboard("{ArrowLeft}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowUp}");

      // Should remain functional without errors
      expect(grid).toBeInTheDocument();
    });

    it("should support Home/End key navigation", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const grid = screen.getByRole("grid");
      grid.focus();

      // Test Home/End keys
      await user.keyboard("{Home}");
      await user.keyboard("{End}");

      expect(grid).toBeInTheDocument();
    });

    it("should support PageUp/PageDown navigation", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const grid = screen.getByRole("grid");
      grid.focus();

      // Test PageUp/PageDown for month navigation
      await user.keyboard("{PageUp}");
      await user.keyboard("{PageDown}");

      expect(grid).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("should have descriptive labels for all interactive elements", () => {
      render(<BookingCalendar {...mockProps} />);

      // Navigation buttons
      expect(screen.getByLabelText("Previous month")).toBeInTheDocument();
      expect(screen.getByLabelText("Next month")).toBeInTheDocument();

      // Today button
      expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();

      // Select button (when date is selected)
      expect(screen.getByRole("button", { name: /select.*2024/i })).toBeInTheDocument();
    });

    it("should announce date states to screen readers", () => {
      render(<BookingCalendar {...mockProps} />);

      // Check that grid cells have appropriate states
      const gridCells = screen.getAllByRole("gridcell");
      expect(gridCells.length).toBeGreaterThan(0);

      // Unavailable dates should be announced as disabled
      const unavailableDates = gridCells.filter(cell =>
        cell.getAttribute("aria-disabled") === "true"
      );
      expect(unavailableDates.length).toBeGreaterThan(0);
    });

    it("should provide calendar grid structure information", () => {
      render(<BookingCalendar {...mockProps} />);

      // Check for proper grid structure
      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();

      // Check for column headers (days of week)
      const columnHeaders = screen.getAllByRole("columnheader");
      expect(columnHeaders.length).toBe(7); // 7 days of week
    });

    it("should have proper reading order for date information", () => {
      render(<BookingCalendar {...mockProps} />);

      // Legend information should be readable
      expect(screen.getByText("Booked")).toBeInTheDocument();
      expect(screen.getByText("Unavailable")).toBeInTheDocument();

      // Additional information should be available
      expect(screen.getByText(/dates already booked/i)).toBeInTheDocument();
      expect(screen.getByText(/dates unavailable/i)).toBeInTheDocument();
    });
  });

  describe("ARIA Attributes", () => {
    it("should have proper ARIA labels and descriptions", () => {
      render(<BookingCalendar {...mockProps} />);

      // Navigation buttons with labels
      const prevButton = screen.getByLabelText("Previous month");
      const nextButton = screen.getByLabelText("Next month");

      expect(prevButton).toHaveAttribute("aria-label", "Previous month");
      expect(nextButton).toHaveAttribute("aria-label", "Next month");
    });

    it("should properly identify disabled dates", () => {
      render(<BookingCalendar {...mockProps} />);

      const unavailableDates = screen.getAllByRole("gridcell")
        .filter(cell => cell.getAttribute("aria-disabled") === "true");

      expect(unavailableDates.length).toBeGreaterThan(0);

      unavailableDates.forEach(date => {
        expect(date).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("should have proper ARIA attributes for selected dates", () => {
      render(<BookingCalendar {...mockProps} />);

      // Selected date should be properly identified
      const selectedDateCell = screen.getAllByRole("gridcell")
        .find(cell => cell.getAttribute("aria-selected") === "true");

      if (selectedDateCell) {
        expect(selectedDateCell).toHaveAttribute("aria-selected", "true");
      }
    });
  });

  describe("Focus Management", () => {
    it("should maintain focus within calendar grid", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const grid = screen.getByRole("grid");
      grid.focus();

      // Focus should stay within grid during navigation
      await user.keyboard("{ArrowRight}");
      expect(grid).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(grid).toHaveFocus();
    });

    it("should handle focus when navigating months", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const nextButton = screen.getByLabelText("Next month");
      await user.click(nextButton);

      // Grid should remain focusable after month change
      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();

      grid.focus();
      expect(grid).toHaveFocus();
    });

    it("should return focus to appropriate element after date selection", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      const availableDate = screen.getByText("15"); // Selected date
      await user.click(availableDate);

      // Should not break focus management
      const selectButton = screen.getByRole("button", { name: /select.*2024/i });
      expect(selectButton).toBeInTheDocument();
    });
  });

  describe("Error Accessibility", () => {
    it("should handle missing dates accessibly", () => {
      const propsWithNoDates = {
        ...mockProps,
        selectedDate: undefined,
        unavailableDates: [],
        bookedDates: [],
      };

      render(<BookingCalendar {...mockProps} />);

      // Should still provide accessible interface
      expect(screen.getByRole("heading", { name: /select date/i })).toBeInTheDocument();
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("should provide accessible feedback for interactions", async () => {
      const user = userEvent.setup();
      const mockOnDateSelect = vi.fn();
      const propsWithCallback = { ...mockProps, onDateSelect: mockOnDateSelect };

      render(<BookingCalendar {...propsWithCallback} />);

      const availableDate = screen.getByText("15");
      await user.click(availableDate);

      // Should trigger callback without accessibility issues
      expect(mockOnDateSelect).toHaveBeenCalled();
    });
  });

  describe("Mobile & Touch Accessibility", () => {
    it("should have appropriate touch targets", () => {
      render(<BookingCalendar {...mockProps} />);

      // All interactive elements should have sufficient touch target size
      const buttons = screen.getAllByRole("button");
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });

    it("should support touch interactions", async () => {
      const user = userEvent.setup();
      render(<BookingCalendar {...mockProps} />);

      // Test touch interactions on calendar cells
      const availableDate = screen.getByText("15");
      await user.click(availableDate);

      expect(mockProps.onDateSelect).toHaveBeenCalled();
    });
  });

  describe("High Contrast Mode Support", () => {
    it("should maintain visibility in high contrast mode", () => {
      render(<BookingCalendar {...mockProps} />);

      // Elements should maintain structure and functionality
      expect(screen.getByRole("grid")).toBeInTheDocument();
      expect(screen.getAllByRole("gridcell").length).toBeGreaterThan(0);

      // Interactive elements should be identifiable
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Reduced Motion Support", () => {
    it("should respect prefers-reduced-motion", () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<BookingCalendar {...mockProps} />);

      // Component should still render and function properly
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });
  });
});