import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseConfig } from "./config"

let browserClient: SupabaseClient | null = null

/** Dùng chung một Supabase client trong trình duyệt để theo dõi phiên đăng nhập ổn định. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const config = getSupabaseConfig()

  if (!config) {
    return null
  }

  browserClient ??= createBrowserClient(config.url, config.publishableKey)
  return browserClient
}
