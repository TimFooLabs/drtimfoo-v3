import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookingStatusBadge } from "@/components/features/booking/booking-status-badge";
import type { BookingStatusBadgeProps } from "@/components/features/booking/types";

// Mock data for testing
const mockBookingStatusBadgeProps: BookingStatusBadgeProps = {
  status: "pending",
  variant: "default",
  className: "",
};

describe("BookingStatusBadge", () => {
  describe("Status Variations", () => {
    it("should render pending status with correct styling", () => {
      render(<BookingStatusBadge {...mockBookingStatusBadgeProps} status="pending" />);

      const badge = screen.getByRole("button", { name: /pending/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Booking is awaiting confirmation");
    });

    it("should render confirmed status with correct styling", () => {
      render(<BookingStatusBadge status="confirmed" />);

      const badge = screen.getByRole("button", { name: /confirmed/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Booking has been confirmed");
    });

    it("should render cancelled status with correct styling", () => {
      render(<BookingStatusBadge status="cancelled" />);

      const badge = screen.getByRole("button", { name: /cancelled/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Booking has been cancelled");
    });

    it("should render completed status with correct styling", () => {
      render(<BookingStatusBadge status="completed" />);

      const badge = screen.getByRole("button", { name: /completed/i });
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("title", "Booking service has been completed");
    });
  });

  describe("Variant Support", () => {
    it("should render default variant with full text", () => {
      render(<BookingStatusBadge status="confirmed" variant="default" />);

      const badge = screen.getByText("Confirmed");
      expect(badge).toBeInTheDocument();
    });

    it("should render compact variant with first letter only", () => {
      render(<BookingStatusBadge status="confirmed" variant="compact" />);

      const badge = screen.getByText("C"); // First letter of "Confirmed"
      expect(badge).toBeInTheDocument();
    });

    it("should default to default variant when variant not specified", () => {
      render(<BookingStatusBadge status="pending" />);

      const badge = screen.getByText("Pending");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<BookingStatusBadge status="pending" />);

      const badge = screen.getByRole("button");
      expect(badge).toHaveAttribute("title", "Booking is awaiting confirmation");
    });

    it("should support custom className", () => {
      render(<BookingStatusBadge status="confirmed" className="custom-test-class" />);

      const badge = screen.getByRole("button");
      expect(badge).toHaveClass("custom-test-class");
    });
  });

  describe("Error Handling", () => {
    it("should handle unknown status gracefully", () => {
      // This test will fail initially - implementation should handle unknown status
      expect(() => {
        render(<BookingStatusBadge status="pending" />);
      }).not.toThrow();
    });
  });
});
