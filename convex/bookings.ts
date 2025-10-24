import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// import { Id } from './_generated/dataModel' // Currently unused, commented out for linting

export const create = mutation({
  args: {
    serviceType: v.string(),
    date: v.number(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated: Please sign in to book an appointment");
    }

    // Get or create user record to ensure we have the correct Convex user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User record not found. Please ensure your account is properly set up.");
    }

    const now = Date.now();

    const bookingId = await ctx.db.insert("bookings", {
      userId: user._id,
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return bookingId;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("bookings"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const getUpcoming = query({
  handler: async (ctx) => {
    const now = Date.now();

    return await ctx.db
      .query("bookings")
      .withIndex("by_date")
      .filter((q) => q.and(q.gte(q.field("date"), now), q.neq(q.field("status"), "cancelled")))
      .order("asc")
      .take(10);
  },
});
