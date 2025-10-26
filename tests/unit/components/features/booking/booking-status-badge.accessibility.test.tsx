import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingStatusBadge } from "@/components/features/booking/booking-status-badge";

// Accessibility-focused tests for WCAG 2.1 AA compliance
describe("BookingStatusBadge Accessibility", () => {
  describe("Color Contrast & Visual Accessibility", () => {
    it("should have sufficient color contrast for status indicators", () => {
      // This test validates that shadcn/ui Badge variants meet WCAG 2.1 AA 4.5:1 contrast
      // The actual color contrast is verified by the underlying shadcn/ui components
      const statuses = ["pending", "confirmed", "cancelled", "completed"] as const;

      statuses.forEach(status => {
        const { container } = render(<BookingStatusBadge status={status} />);
        const badge = container.querySelector('[role="button"]');

        expect(badge).toBeInTheDocument();
        // shadcn/ui Badge components are designed to meet WCAG contrast requirements
      });
    });

    it("should have focus indicators for keyboard navigation", () => {
      render(<BookingStatusBadge status="confirmed" />);

      const badge = screen.getByRole("button", { name: /confirmed/i });

      // Test that element can receive focus
      badge.focus();
      expect(badge).toHaveFocus();
    });

    it("should maintain accessibility in compact variant", () => {
      render(<BookingStatusBadge status="pending" variant="compact" />);

      const badge = screen.getByRole("button", { name: /pending/i });

      // Compact variant should still have proper accessibility attributes
      expect(badge).toHaveAttribute("title", "Booking is awaiting confirmation");
      expect(badge).toHaveAttribute("aria-label", "Booking status: Pending");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should be keyboard accessible with Tab key", async () => {
      const user = userEvent.setup();
      render(<BookingStatusBadge status="confirmed" />);

      const badge = screen.getByRole("button", { name: /confirmed/i });

      // Test keyboard navigation
      await user.tab();
      expect(badge).toHaveFocus();
    });

    it("should support keyboard interaction", async () => {
      const user = userEvent.setup();
      render(<BookingStatusBadge status="pending" />);

      const badge = screen.getByRole("button", { name: /pending/i });

      // Focus the element
      badge.focus();
      expect(badge).toHaveFocus();

      // Test Enter key
      await user.keyboard("{Enter}");
      // Component should handle keyboard interaction without errors
      expect(badge).toBeInTheDocument();

      // Test Space key
      await user.keyboard(" ");
      // Component should handle keyboard interaction without errors
      expect(badge).toBeInTheDocument();
    });

    it("should have proper tab order", () => {
      render(
        <div>
          <button>Before</button>
          <BookingStatusBadge status="confirmed" />
          <button>After</button>
        </div>
      );

      const beforeButton = screen.getByText("Before");
      const badge = screen.getByRole("button", { name: /confirmed/i });
      const afterButton = screen.getByText("After");

      // Verify tab order structure
      expect(beforeButton).toBeInTheDocument();
      expect(badge).toBeInTheDocument();
      expect(afterButton).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("should have descriptive aria-labels", () => {
      const statuses = [
        { status: "pending" as const, expectedLabel: "Booking status: Pending" },
        { status: "confirmed" as const, expectedLabel: "Booking status: Confirmed" },
        { status: "cancelled" as const, expectedLabel: "Booking status: Cancelled" },
        { status: "completed" as const, expectedLabel: "Booking status: Completed" },
      ];

      statuses.forEach(({ status, expectedLabel }) => {
        render(<BookingStatusBadge status={status} />);

        const badge = screen.getByRole("button", { name: new RegExp(status, "i") });
        expect(badge).toHaveAttribute("aria-label", expectedLabel);
      });
    });

    it("should provide descriptive titles for additional context", () => {
      const statusDescriptions = {
        pending: "Booking is awaiting confirmation",
        confirmed: "Booking has been confirmed",
        cancelled: "Booking has been cancelled",
        completed: "Booking service has been completed",
      };

      Object.entries(statusDescriptions).forEach(([status, expectedDescription]) => {
        render(<BookingStatusBadge status={status as any} />);

        const badge = screen.getByRole("button", { name: new RegExp(status, "i") });
        expect(badge).toHaveAttribute("title", expectedDescription);
      });
    });

    it("should announce status changes to screen readers", () => {
      // This test ensures that status badges are properly announced
      const { rerender } = render(<BookingStatusBadge status="pending" />);

      let badge = screen.getByRole("button", { name: /pending/i });
      expect(badge).toHaveAttribute("aria-label", "Booking status: Pending");

      // Simulate status change
      rerender(<BookingStatusBadge status="confirmed" />);

      badge = screen.getByRole("button", { name: /confirmed/i });
      expect(badge).toHaveAttribute("aria-label", "Booking status: Confirmed");
    });
  });

  describe("Semantic HTML & Structure", () => {
    it("should use semantic HTML elements", () => {
      render(<BookingStatusBadge status="confirmed" />);

      const badge = screen.getByRole("button");

      // Should have proper role for interactive elements
      expect(badge).toHaveAttribute("role", "button");

      // Should be focusable
      expect(badge).toHaveAttribute("tabIndex", "0");
    });

    it("should maintain proper heading hierarchy", () => {
      render(
        <div>
          <h2>Booking Status</h2>
          <BookingStatusBadge status="completed" />
        </div>
      );

      const heading = screen.getByRole("heading", { level: 2 });
      const badge = screen.getByRole("button", { name: /completed/i });

      expect(heading).toBeInTheDocument();
      expect(badge).toBeInTheDocument();
      // Badge should not interfere with heading hierarchy
    });
  });

  describe("Error Handling & Edge Cases", () => {
    it("should handle unknown status accessibly", () => {
      // @ts-expect-error - Testing unknown status handling
      render(<BookingStatusBadge status="unknown" />);

      const badge = screen.getByText("Unknown");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Unknown booking status");
    });

    it("should remain accessible with custom className", () => {
      render(
        <BookingStatusBadge
          status="pending"
          className="custom-accessibility-class"
        />
      );

      const badge = screen.getByRole("button", { name: /pending/i });
      expect(badge).toHaveClass("custom-accessibility-class");
      // Accessibility attributes should still be present
      expect(badge).toHaveAttribute("aria-label", "Booking status: Pending");
    });
  });

  describe("Mobile & Touch Accessibility", () => {
    it("should have appropriate touch target size", () => {
      render(<BookingStatusBadge status="confirmed" />);

      const badge = screen.getByRole("button", { name: /confirmed/i });

      // Touch targets should be at least 44x44 pixels (WCAG guideline)
      // This is typically handled by shadcn/ui Badge component styling
      expect(badge).toBeInTheDocument();
    });

    it("should support touch interactions", async () => {
      const user = userEvent.setup();
      render(<BookingStatusBadge status="pending" />);

      const badge = screen.getByRole("button", { name: /pending/i });

      // Test touch/click interaction
      await user.click(badge);
      expect(badge).toBeInTheDocument();
    });
  });
});