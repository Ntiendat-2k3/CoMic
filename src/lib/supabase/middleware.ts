import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseConfig } from "./config"

/** Làm mới token và chuyển toàn bộ cookie/header chống cache về response hiện tại. */
export async function updateSupabaseSession(request: NextRequest) {
  const config = getSupabaseConfig()
  let response = NextResponse.next({ request })

  if (!config) {
    return response
  }

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value),
        )
      },
    },
  })

  await supabase.auth.getClaims()
  return response
}
