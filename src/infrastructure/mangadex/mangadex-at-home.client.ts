/** Lấy metadata MangaDex@Home qua backend cùng origin; ảnh vẫn tải trực tiếp từ node CDN. */
import type { MangaDexAtHomeResponse } from "./mangadex.types";

export type ReaderQuality = "data" | "data-saver";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isAtHomeResponse(value: unknown): value is MangaDexAtHomeResponse {
  if (typeof value !== "object" || value === null) return false;

  const response = value as Partial<MangaDexAtHomeResponse>;
  const chapter = response.chapter;
  if (
    response.result !== "ok" ||
    typeof response.baseUrl !== "string" ||
    typeof chapter !== "object" ||
    chapter === null ||
    typeof chapter.hash !== "string" ||
    !isStringArray(chapter.data) ||
    chapter.data.length === 0 ||
    !isStringArray(chapter.dataSaver) ||
    chapter.dataSaver.length === 0
  ) {
    return false;
  }

  try {
    return new URL(response.baseUrl).protocol === "https:";
  } catch {
    return false;
  }
}

/** Lấy node At-Home mới qua proxy metadata để tránh CORS trên trình duyệt. */
export async function fetchAtHomeServer(
  chapterId: string,
  signal?: AbortSignal,
): Promise<MangaDexAtHomeResponse> {
  const response = await fetch(
    `/api/mangadex/at-home/${encodeURIComponent(chapterId)}`,
    {
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json" },
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`MangaDex@Home trả về HTTP ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!isAtHomeResponse(data)) {
    throw new Error("Phản hồi MangaDex@Home không hợp lệ");
  }

  return data;
}

/** Tạo URL trang theo đúng cặp field JSON và path chất lượng của MangaDex. */
export function buildAtHomePageUrls(
  atHome: MangaDexAtHomeResponse,
  quality: ReaderQuality,
) {
  const baseUrl = atHome.baseUrl.replace(/\/$/, "");
  const files = quality === "data" ? atHome.chapter.data : atHome.chapter.dataSaver;

  return files.map(
    (fileName) => `${baseUrl}/${quality}/${atHome.chapter.hash}/${fileName}`,
  );
}
