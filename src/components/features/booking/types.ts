// Define types based on the existing schema structure
// These match the Convex data model used in the project

export type Booking = {
  _id: string;
  userId: string;
  serviceType: string;
  date: number;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type User = {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: number;
  updatedAt: number;
};

export interface BookingConfirmationProps {
  bookingId?: string;
  className?: string;
}

export interface BookingListProps {
  userId?: string;
  maxItems?: number;
  showUpcomingOnly?: boolean;
  className?: string;
}

export interface BookingStatusBadgeProps {
  status: Booking["status"];
  variant?: "default" | "compact";
  className?: string;
}

export interface BookingCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  unavailableDates?: Date[];
  bookedDates?: Date[];
  bookings?: Booking[];
  className?: string;
}

export interface BookingConfirmationState {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
}

export interface BookingListState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  filter: "all" | "upcoming" | "past";
  sortBy: "date" | "status" | "service";
}

export interface StatusConfig {
  label: string;
  color: string;
  icon?: React.ComponentType;
  description: string;
}
