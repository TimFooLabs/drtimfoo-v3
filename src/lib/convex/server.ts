import { getAuth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'
import { env } from '../env'
import { NextRequest } from 'next/server'

const client = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL)

export async function getServerUser(request: NextRequest) {
  const { userId } = getAuth(request)
  
  if (!userId) return null

  return await client.query(api.users.getByClerkId, { clerkId: userId })
}

export async function requireServerUser(request: NextRequest) {
  const user = await getServerUser(request)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

export async function requireAdmin(request: NextRequest) {
  const { userId } = getAuth(request)
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const isAdmin = await client.query(api.users.isAdmin, { clerkId: userId })
  
  if (!isAdmin) {
    throw new Error('Forbidden: Admin access required')
  }
  
  return userId
}