import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'
import { env } from '../env'

const client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)

export async function getServerUser() {
  const { userId } = await auth()
  
  if (!userId) return null

  return await client.query(api.users.getByClerkId, { clerkId: userId })
}

export async function requireServerUser() {
  const user = await getServerUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

export async function requireAdmin() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const isAdmin = await client.query(api.users.isAdmin, { clerkId: userId })
  
  if (!isAdmin) {
    throw new Error('Forbidden: Admin access required')
  }
  
  return userId
}