import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseConfig } from "./config"

/** Tạo client theo từng request để phiên cookie không bị dùng chung giữa người dùng. */
export async function getSupabaseServerClient() {
  const config = getSupabaseConfig()

  if (!config) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server Component không thể ghi cookie; middleware sẽ đảm nhiệm việc làm mới phiên.
        }
      },
    },
  })
}
