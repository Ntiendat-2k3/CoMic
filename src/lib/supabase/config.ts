export interface SupabaseConfig {
  publishableKey: string
  url: string
}

/** Trả về cấu hình công khai của Supabase khi ứng dụng đã được thiết lập đầy đủ. */
export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    return null
  }

  return { publishableKey, url }
}
