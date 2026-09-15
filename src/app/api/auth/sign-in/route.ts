import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/
const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" }

type SignInError =
  | "auth_rate_limit"
  | "configuration"
  | "email_not_confirmed"
  | "invalid_credentials"
  | "username_not_configured"

function errorResponse(error: SignInError, status: number) {
  return NextResponse.json({ error }, { headers: PRIVATE_HEADERS, status })
}

/** Chặn request khác origin để tránh một website ngoài ý muốn thay đổi phiên đăng nhập. */
function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!origin) return true

  try {
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
    return new URL(origin).host === requestHost
  } catch {
    return false
  }
}

/** Phân giải username ở server, không trả email riêng tư về trình duyệt. */
async function resolveEmailFromUsername(username: string) {
  const admin = getSupabaseAdminClient()
  if (!admin) return { configured: false, email: null }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle()

  if (profileError) return { configured: false, email: null }
  if (!profile) return { configured: true, email: null }

  const { data, error } = await admin.auth.admin.getUserById(profile.id)
  return { configured: true, email: error ? null : (data.user.email ?? null) }
}

/** Đăng nhập bằng email hoặc username và ghi phiên vào cookie HTTP-only của Supabase. */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return errorResponse("invalid_credentials", 403)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse("invalid_credentials", 400)
  }

  if (!body || typeof body !== "object") {
    return errorResponse("invalid_credentials", 400)
  }

  const { identifier: rawIdentifier, password } = body as Record<string, unknown>
  if (
    typeof rawIdentifier !== "string" ||
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 4096
  ) {
    return errorResponse("invalid_credentials", 400)
  }

  const identifier = rawIdentifier.trim().toLowerCase()
  if (!identifier || identifier.length > 254) {
    return errorResponse("invalid_credentials", 400)
  }

  let email = identifier
  if (!identifier.includes("@")) {
    if (!USERNAME_PATTERN.test(identifier)) {
      return errorResponse("invalid_credentials", 401)
    }

    const resolved = await resolveEmailFromUsername(identifier)
    if (!resolved.configured) {
      return errorResponse("username_not_configured", 503)
    }

    // Email giả giữ phản hồi đăng nhập sai đồng nhất mà không tiết lộ username có tồn tại hay không.
    email = resolved.email ?? `${identifier}@invalid.local`
  }

  const supabase = await getSupabaseServerClient()
  if (!supabase) {
    return errorResponse("configuration", 503)
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.status === 429) {
      return errorResponse("auth_rate_limit", 429)
    }

    const errorCode = error.code === "email_not_confirmed" ? "email_not_confirmed" : "invalid_credentials"
    return errorResponse(errorCode, 401)
  }

  return NextResponse.json({ ok: true }, { headers: PRIVATE_HEADERS })
}
