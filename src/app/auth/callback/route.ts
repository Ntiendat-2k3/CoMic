import { NextResponse, type NextRequest } from "next/server"
import { getSafeRedirectPath } from "@/features/auth/redirect"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/** Đổi mã PKCE lấy phiên cookie rồi chuyển về đúng trang nội bộ đã yêu cầu. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get("next"))
  const supabase = await getSupabaseServerClient()

  if (!code || !supabase) {
    return NextResponse.redirect(new URL("/sign-in?error=configuration", request.url))
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL("/sign-in?error=callback", request.url))
  }

  return NextResponse.redirect(new URL(nextPath, request.url))
}
