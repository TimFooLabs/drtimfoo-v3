import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
// import { Id } from './_generated/dataModel' // Currently unused, commented out for linting

export const create = mutation({
  args: {
    userId: v.id('users'),
    serviceType: v.string(),
    date: v.number(),
    time: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    const bookingId = await ctx.db.insert('bookings', {
      ...args,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })

    return bookingId
  },
})

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bookings')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect()
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('bookings'),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('cancelled'),
      v.literal('completed')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    })
  },
})

export const getUpcoming = query({
  handler: async (ctx) => {
    const now = Date.now()
    
    return await ctx.db
      .query('bookings')
      .withIndex('by_date')
      .filter((q) => q.and(
        q.gte(q.field('date'), now),
        q.neq(q.field('status'), 'cancelled')
      ))
      .order('asc')
      .take(10)
  },
})