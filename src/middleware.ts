import type { NextRequest } from "next/server"
import { updateSupabaseSession } from "@/lib/supabase/middleware"

const CACHEABLE_CATEGORIES = new Set(["action", "romance", "comedy"])

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const response = await updateSupabaseSession(request)

  // Không ghi đè chỉ thị chống cache khi Supabase vừa làm mới cookie xác thực.
  if (!response.headers.has("Cache-Control") && path.startsWith("/the-loai/")) {
    const slug = path.split("/")[2]
    if (CACHEABLE_CATEGORIES.has(slug)) {
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=600, stale-while-revalidate=3600",
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    // Bỏ qua tài nguyên tĩnh và phần nội bộ của Next.js, trừ khi nằm trong query string.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Luôn làm mới phiên cho API route.
    '/(api|trpc)(.*)',
  ],
}
