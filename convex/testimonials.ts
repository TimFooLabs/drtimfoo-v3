import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    role: v.optional(v.string()),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("testimonials", {
      ...args,
      status: "pending",
      featured: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getApproved = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .collect();
  },
});

export const getFeatured = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .take(6);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("testimonials"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const toggleFeatured = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    const testimonial = await ctx.db.get(args.id);

    if (!testimonial) throw new Error("Testimonial not found");

    await ctx.db.patch(args.id, {
      featured: !testimonial.featured,
      updatedAt: Date.now(),
    });
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("testimonials").order("desc").collect();
  },
});
