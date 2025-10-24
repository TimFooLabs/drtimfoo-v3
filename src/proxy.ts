import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/services',
  '/blog(.*)',
  '/contact',
  '/api/webhooks(.*)',
])

const isIgnoredRoute = createRouteMatcher([
  '/api/health',
])

export default clerkMiddleware(async (auth, req) => {
  if (isIgnoredRoute(req)) {
    return
  }
  
  if (!isPublicRoute(req)) {
    const session = await auth()
    if (!session.userId) {
      return Response.redirect(new URL('/sign-in', req.url))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}