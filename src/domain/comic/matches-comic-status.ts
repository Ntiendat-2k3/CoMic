const STATUS_ALIASES: Record<string, readonly string[]> = {
  "dang-phat-hanh": ["ongoing", "đang phát hành", "đang tiến hành"],
  "hoan-thanh": ["completed", "hoàn thành"],
  "tam-ngung": ["hiatus", "tạm ngưng"],
};

/** Đối chiếu trạng thái từ API với slug trạng thái ổn định dùng trong URL. */
export function matchesComicStatus(status: string, filterStatus: string): boolean {
  const aliases = STATUS_ALIASES[filterStatus];
  if (!aliases) return true;

  const normalizedStatus = status.trim().toLocaleLowerCase("vi-VN");
  return aliases.some((alias) => normalizedStatus.includes(alias));
}
