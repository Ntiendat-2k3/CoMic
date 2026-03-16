import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server'

const CACHEABLE_CATEGORIES = new Set(['action', 'romance', 'comedy'])

export default clerkMiddleware((auth, request) => {
  const path = request.nextUrl.pathname
  const response = NextResponse.next()

  // Cache popular categories
  if (path.startsWith('/the-loai/')) {
    const slug = path.split('/')[2]
    if (CACHEABLE_CATEGORIES.has(slug)) {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=600, stale-while-revalidate=3600'
      )
    }
  }

  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
