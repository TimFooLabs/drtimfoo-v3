'use client'

import { useConvex, useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

// Booking hooks
export function useCreateBooking() {
  return useMutation(api.bookings.create)
}

export function useUserBookings(userId: Id<'users'> | undefined) {
  return useQuery(
    api.bookings.getByUser,
    userId ? { userId } : 'skip'
  )
}

export function useUpcomingBookings() {
  return useQuery(api.bookings.getUpcoming)
}

// Testimonial hooks
export function useCreateTestimonial() {
  return useMutation(api.testimonials.create)
}

export function useFeaturedTestimonials() {
  return useQuery(api.testimonials.getFeatured)
}

export function useApprovedTestimonials() {
  return useQuery(api.testimonials.getApproved)
}

// User hooks
export function useCurrentUser(clerkId: string | undefined) {
  return useQuery(
    api.users.getByClerkId,
    clerkId ? { clerkId } : 'skip'
  )
}

export function useIsAdmin(clerkId: string | undefined) {
  return useQuery(
    api.users.isAdmin,
    clerkId ? { clerkId } : 'skip'
  )
}