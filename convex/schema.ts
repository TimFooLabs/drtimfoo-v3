import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal('user'), v.literal('admin')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email']),

  bookings: defineTable({
    userId: v.id('users'),
    serviceType: v.string(),
    date: v.number(),
    time: v.string(),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('cancelled'),
      v.literal('completed')
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_date', ['date'])
    .index('by_status', ['status']),

  testimonials: defineTable({
    userId: v.id('users'),
    name: v.string(),
    role: v.optional(v.string()),
    content: v.string(),
    rating: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('approved'),
      v.literal('rejected')
    ),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_featured', ['featured'])
    .index('by_user', ['userId']),

  contacts: defineTable({
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
  })
    .index('by_status', ['status'])
    .index('by_created_at', ['createdAt']),
})