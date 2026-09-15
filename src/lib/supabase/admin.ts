import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getSupabaseConfig } from "./config"

let adminClient: SupabaseClient | null = null

/** Tạo client đặc quyền chỉ dành cho server để tra cứu hồ sơ xác thực nội bộ. */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const config = getSupabaseConfig()
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!config || !secretKey) {
    return null
  }

  adminClient ??= createClient(config.url, secretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })

  return adminClient
}
