/** Chỉ cho phép redirect nội bộ để tránh chuyển người dùng sang miền ngoài ý muốn. */
export function getSafeRedirectPath(value: string | null | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/"
}
