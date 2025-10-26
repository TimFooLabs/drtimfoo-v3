import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingConfirmation } from "@/components/features/booking/booking-confirmation";
import type { BookingConfirmationProps } from "@/components/features/booking/types";

// --- Best Practice: Import real data types for mocks ---
import type { Doc, Id } from "@/../convex/_generated/dataModel";

// --- Best Practice: Mock modules at the top level ---
import { useCurrentUser, useUserBookings } from "@/lib/convex/client";

// Mock the entire hooks module. This is hoisted by Vitest and runs before any test code.
vi.mock("@/lib/convex/client");

// Mock the Next.js router at the top level.
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// --- Type-Safe Test Data ---
// Use the 'Doc' type to ensure the mock user object is complete and matches the schema.
const mockUser: Doc<"users"> = {
  _id: "user123" as Id<"users">,
  _creationTime: Date.now(),
  clerkId: "clerk123",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// Use the 'Doc' type for the mock booking object to ensure schema accuracy.
const mockBookings: Doc<"bookings">[] = [
  {
    _id: "booking1" as Id<"bookings">,
    _creationTime: Date.now(),
    userId: "user123" as Id<"users">,
    serviceType: "initial-consultation",
    date: Date.now(), // This field was previously missing
    time: "09:00",
    status: "confirmed",
    notes: "Test booking",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// --- Type-safe mocking ---
// Create type-safe wrappers around the mocked functions for better autocompletion and type checking.
const mockedUseCurrentUser = vi.mocked(useCurrentUser);
const mockedUseUserBookings = vi.mocked(useUserBookings);

describe("Booking Confirmation Integration Flow", () => {
  // Use afterEach to reset mocks between tests, ensuring they don't leak state.
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading States", () => {
    it("should show a loading skeleton while hooks are loading", () => {
      // ARRANGE: Set hooks to their loading state.
      mockedUseCurrentUser.mockReturnValue({ user: undefined, isLoading: true });
      mockedUseUserBookings.mockReturnValue({ bookings: undefined, isLoading: true });

      render(<BookingConfirmation bookingId="booking1" />);

      // ASSERT: Check for a placeholder or skeleton component.
      // (This assumes you have a component with testid="loading-skeleton").
      expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
      expect(screen.queryByText("Booking Confirmed!")).not.toBeInTheDocument();
    });
  });

  describe("Booking Display", () => {
    it("should display booking confirmation with a valid booking", async () => {
      // ARRANGE: Set hooks to a successful loaded state for this specific test.
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: mockBookings, isLoading: false });

      render(<BookingConfirmation bookingId="booking1" />);

      // ASSERT: Wait for content to appear and verify details are correct.
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Booking Confirmed!" })).toBeInTheDocument();
      });

      expect(screen.getByText("initial-consultation")).toBeInTheDocument();
      expect(screen.getByText("09:00")).toBeInTheDocument();
      expect(screen.getByText(/Test booking/)).toBeInTheDocument();
    });

    it("should show an error message for an invalid booking ID", async () => {
      // ARRANGE: Simulate a valid user but a booking list that doesn't contain the requested ID.
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: mockBookings, isLoading: false });

      render(<BookingConfirmation bookingId="invalid-id" />);

      // ASSERT: Check for the "not found" message.
      await waitFor(() => {
        expect(screen.getByText("Booking not found")).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: /book an appointment/i })).toBeInTheDocument();
    });

    it("should show a login prompt for an unauthenticated user", async () => {
      // ARRANGE: Simulate a logged-out user where the hook returns null.
      mockedUseCurrentUser.mockReturnValue({ user: null, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: [], isLoading: false });

      render(<BookingConfirmation bookingId="any-id" />);

      // ASSERT: Check for the login prompt.
      await waitFor(() => {
        expect(screen.getByText(/Please log in to view your booking confirmation/)).toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    // A beforeEach is acceptable here since all interaction tests start from the same successful state.
    beforeEach(() => {
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: mockBookings, isLoading: false });
    });

    it("should navigate to booking history when button is clicked", async () => {
      render(<BookingConfirmation bookingId="booking1" />);
      
      const viewBookingsButton = await screen.findByRole("button", { name: /View all bookings/i });
      await userEvent.click(viewBookingsButton);

      expect(mockPush).toHaveBeenCalledWith("/booking/history");
    });

    it("should navigate to home when return button is clicked", async () => {
      render(<BookingConfirmation bookingId="booking1" />);

      const returnHomeButton = await screen.findByRole("button", { name: /Return to homepage/i });
      await userEvent.click(returnHomeButton);

      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy and ARIA labels", async () => {
      // ARRANGE: Set the component to a successful state to render all elements.
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: mockBookings, isLoading: false });
      
      render(<BookingConfirmation bookingId="booking1" />);

      // Wait for the component to finish loading before running assertions.
      await screen.findByRole("heading", { name: "Booking Confirmed!" });

      // ASSERT
      expect(screen.getByRole("heading", { name: "Appointment Details" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Status & Actions" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View all bookings/i })).toHaveAttribute("aria-label", "View all your bookings");
      expect(screen.getByRole("button", { name: /confirmed/i })).toHaveAttribute("aria-label", "Booking status: confirmed");
    });
  });
});