import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingList } from "@/components/features/booking/booking-list";
import type { BookingListProps } from "@/components/features/booking/types";

// --- Best Practice: Import real data types for mocks ---
import type { Doc, Id } from "@/../convex/_generated/dataModel";

// --- Best Practice: Mock modules at the top level ---
import { useCurrentUser, useUserBookings } from "@/lib/convex/client";

// Mock the entire hooks module. This is hoisted by Vitest.
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

// Use the 'Doc' type for the mock booking objects to ensure schema accuracy.
const mockBookings: Doc<"bookings">[] = [
  {
    _id: "booking1" as Id<"bookings">,
    _creationTime: Date.now(),
    userId: "user123" as Id<"users">,
    serviceType: "initial-consultation",
    date: Date.now() - 86400000, // Yesterday
    time: "09:00",
    status: "completed",
    notes: "Past consultation",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "booking2" as Id<"bookings">,
    _creationTime: Date.now(),
    userId: "user123" as Id<"users">,
    serviceType: "regular-adjustment",
    date: Date.now() + 86400000, // Tomorrow
    time: "14:00",
    status: "confirmed",
    notes: "Upcoming adjustment",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    _id: "booking3" as Id<"bookings">,
    _creationTime: Date.now(),
    userId: "user123" as Id<"users">,
    serviceType: "extended-comprehensive",
    date: Date.now() + 172800000, // In two days
    time: "16:00",
    status: "cancelled",
    notes: "Cancelled session",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// --- Type-safe mocking ---
const mockedUseCurrentUser = vi.mocked(useCurrentUser);
const mockedUseUserBookings = vi.mocked(useUserBookings);

describe("Booking History Integration Flow", () => {
  // Reset mocks after each test to ensure isolation.
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading and Error States", () => {
    it("should show a loading skeleton while data is being fetched", () => {
      // ARRANGE: Mock the loading state from the hooks.
      mockedUseCurrentUser.mockReturnValue({ user: undefined, isLoading: true });
      mockedUseUserBookings.mockReturnValue({ bookings: undefined, isLoading: true });

      render(<BookingList />);

      // ASSERT: Skeletons or placeholders should be visible.
      expect(screen.getAllByRole("generic", { name: /skeleton/i })).toHaveLength(3);
      expect(screen.queryByText("Your Bookings")).not.toBeInTheDocument();
    });

    it("should show an authentication error for unauthenticated users", async () => {
      // ARRANGE: Mock an unauthenticated user state.
      mockedUseCurrentUser.mockReturnValue({ user: null, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: undefined, isLoading: true }); // Bookings hook might not even run.

      render(<BookingList />);

      // ASSERT: An error or login prompt should be displayed.
      await waitFor(() => {
        expect(screen.getByText("Please log in to view your bookings.")).toBeInTheDocument();
      });
    });
  });

  describe("Booking Display and Filtering", () => {
    // Use a beforeEach here since most tests in this block start with a successful data state.
    beforeEach(() => {
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: mockBookings, isLoading: false });
    });

    it("should display a list of all user bookings by default", async () => {
      render(<BookingList />);
      await waitFor(() => {
        expect(screen.getByText("Your Bookings")).toBeInTheDocument();
      });

      // Assert that all three mock bookings are rendered.
      expect(screen.getByText("initial-consultation")).toBeInTheDocument();
      expect(screen.getByText("regular-adjustment")).toBeInTheDocument();
      expect(screen.getByText("extended-comprehensive")).toBeInTheDocument();
    });

    it("should filter to show only past bookings when 'Past' is clicked", async () => {
      render(<BookingList />);
      await screen.findByText("Your Bookings");

      // ACT: Click the 'Past' filter button.
      await userEvent.click(screen.getByRole("button", { name: /past/i }));

      // ASSERT: Only the past booking should be visible.
      await waitFor(() => {
        expect(screen.getByText("initial-consultation")).toBeInTheDocument();
        expect(screen.queryByText("regular-adjustment")).not.toBeInTheDocument();
        expect(screen.queryByText("extended-comprehensive")).not.toBeInTheDocument();
      });
    });

    it("should filter to show only upcoming bookings when 'Upcoming' is clicked", async () => {
      render(<BookingList />);
      await screen.findByText("Your Bookings");

      // ACT: Click the 'Upcoming' filter button.
      await userEvent.click(screen.getByRole("button", { name: /upcoming/i }));

      // ASSERT: Only the upcoming (confirmed) booking should be visible.
      await waitFor(() => {
        expect(screen.queryByText("initial-consultation")).not.toBeInTheDocument();
        expect(screen.getByText("regular-adjustment")).toBeInTheDocument();
        expect(screen.queryByText("extended-comprehensive")).not.toBeInTheDocument(); // Cancelled shouldn't show in upcoming
      });
    });

    it("should show an empty state for users with no bookings", async () => {
      // ARRANGE: Override the mock for this specific test to return an empty array.
      mockedUseUserBookings.mockReturnValue({ bookings: [], isLoading: false });

      render(<BookingList />);

      // ASSERT: Check for the empty state message and button.
      await waitFor(() => {
        expect(screen.getByText("No bookings yet")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Book your first appointment/i })).toBeInTheDocument();
      });
    });

    it("should show a limited number of bookings when maxItems prop is used", async () => {
      render(<BookingList maxItems={2} />);
      await screen.findByText("Your Bookings");

      // ASSERT: Only 2 bookings should be rendered, and a "View All" button should appear.
      const bookingItems = screen.getAllByRole("article");
      expect(bookingItems).toHaveLength(2);
      expect(screen.getByRole("button", { name: /View all 3 bookings/i })).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should navigate to the booking page when 'Book your first appointment' is clicked", async () => {
      // ARRANGE: Set up the empty state.
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: [], isLoading: false });

      render(<BookingList />);
      
      const bookButton = await screen.findByRole("button", { name: /Book your first appointment/i });
      await userEvent.click(bookButton);

      // ASSERT: The router should have been called.
      expect(mockPush).toHaveBeenCalledWith("/booking");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes and focus management", async () => {
      // ARRANGE: Set up the successful data state.
      mockedUseCurrentUser.mockReturnValue({ user: mockUser, isLoading: false });
      mockedUseUserBookings.mockReturnValue({ bookings: mockBookings, isLoading: false });
      
      render(<BookingList />);
      await screen.findByText("Your Bookings");

      // ASSERT: Check ARIA states on filter buttons.
      const allFilterButton = screen.getByRole("button", { name: /all/i });
      expect(allFilterButton).toHaveAttribute("aria-pressed", "true");

      const upcomingFilterButton = screen.getByRole("button", { name: /upcoming/i });
      expect(upcomingFilterButton).toHaveAttribute("aria-pressed", "false");

      // ACT: Click and check if ARIA state changes.
      await userEvent.click(upcomingFilterButton);
      expect(allFilterButton).toHaveAttribute("aria-pressed", "false");
      expect(upcomingFilterButton).toHaveAttribute("aria-pressed", "true");

      // ASSERT: Check focus.
      upcomingFilterButton.focus();
      expect(document.activeElement).toBe(upcomingFilterButton);
    });
  });
});