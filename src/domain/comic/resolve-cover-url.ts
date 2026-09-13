/** Chuẩn hóa URL bìa mới và vẫn đọc được dữ liệu OTruyen đã lưu trong trình duyệt. */
export function resolveCoverUrl(coverUrl: string, legacyCdnUrl = "") {
  if (/^https?:\/\//i.test(coverUrl) || coverUrl.startsWith("/")) {
    return coverUrl;
  }

  const cdnUrl = legacyCdnUrl.replace(/\/$/, "");
  return cdnUrl
    ? `${cdnUrl}/uploads/comics/${coverUrl.replace(/^\//, "")}`
    : `/${coverUrl.replace(/^\//, "")}`;
}
