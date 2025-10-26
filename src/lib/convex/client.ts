"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

// =================================================================
// Consistent Wrapper Hooks for All Queries
// =================================================================

// Booking hooks
export function useUserBookings(userId: string | Id<"users"> | undefined) {
  const userIdParam = userId as Id<"users"> | undefined;
  const data = useQuery(api.bookings.getByUser, userIdParam ? { userId: userIdParam } : "skip");
  return {
    bookings: data,
    isLoading: data === undefined,
  };
}

export function useUpcomingBookings() {
  const data = useQuery(api.bookings.getUpcoming);
  return {
    bookings: data,
    isLoading: data === undefined,
  };
}

// Testimonial hooks
export function useFeaturedTestimonials() {
  const data = useQuery(api.testimonials.getFeatured);
  return {
    testimonials: data,
    isLoading: data === undefined,
  };
}

export function useApprovedTestimonials() {
  const data = useQuery(api.testimonials.getApproved);
  return {
    testimonials: data,
    isLoading: data === undefined,
  };
}

// User hooks
/**
 * A hook to get the currently authenticated user's data.
 * It automatically handles getting the clerkId from the auth context.
 * No need to pass any arguments.
 */
export function useCurrentUser() {
  const { userId: clerkId } = useAuth(); // Gets clerkId from the context
  const data = useQuery(api.users.getByClerkId, clerkId ? { clerkId } : "skip");
  return {
    user: data,
    isLoading: data === undefined,
  };
}

/**
 * A hook to determine if the current user is an admin.
 * It derives its state from the `useCurrentUser` hook to avoid a second network request.
 */
export function useIsAdmin() {
  const { user, isLoading } = useCurrentUser();
  return {
    isAdmin: user?.role === "admin",
    isLoading: isLoading,
  };
}

// =================================================================
// Mutation Hooks (Often don't need wrapping unless adding logic)
// =================================================================

export function useCreateBooking() {
  return useMutation(api.bookings.create);
}

export function useCreateTestimonial() {
  return useMutation(api.testimonials.create);
}
