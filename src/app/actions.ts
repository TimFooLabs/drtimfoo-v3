"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export async function createBookingAction(formData: FormData) {
  // Get authenticated user
  const { userId } = await auth();

  if (!userId) {
    return {
      error: "You must be signed in to book an appointment",
    };
  }

  // Extract form data
  const serviceType = formData.get("serviceType") as string;
  const dateString = formData.get("date") as string;
  const time = formData.get("time") as string;
  const notes = formData.get("notes") as string;

  // Validate required fields
  if (!serviceType) {
    return {
      error: "Please select a service type",
    };
  }

  if (!dateString) {
    return {
      error: "Please select a date",
    };
  }

  if (!time) {
    return {
      error: "Please select a time",
    };
  }

  try {
    // Parse date and validate it's not in the past
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        error: "Please select a future date",
      };
    }

    // Call Convex mutation from server action
    const result = await fetchMutation(api.bookings.create, {
      serviceType: serviceType,
      date: Math.floor(selectedDate.getTime() / 1000), // Convert to timestamp
      time: time,
      notes: notes || undefined,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Booking creation failed:", error);
    return {
      error: "Failed to create booking. Please try again.",
    };
  }
}
