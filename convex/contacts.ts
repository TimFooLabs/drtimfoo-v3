import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('contacts', args)
  },
})

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('contacts')
      .withIndex('by_created_at')
      .order('desc')
      .collect()
  },
})

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('contacts')
      .withIndex('by_status', (q) => q.eq('status', args.status))
      .order('desc')
      .collect()
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('contacts'),
    status: v.union(
      v.literal('new'),
      v.literal('read'),
      v.literal('replied'),
      v.literal('archived')
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
    })
  },
})