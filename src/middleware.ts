import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CACHEABLE_CATEGORIES = new Set(['action', 'romance', 'comedy'])

export function middleware(request: NextRequest) {
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
}
