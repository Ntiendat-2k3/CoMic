import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { mangaDexClient } from "@/infrastructure/mangadex/mangadex.client";
import type { MangaDexAtHomeResponse } from "@/infrastructure/mangadex/mangadex.types";

export const dynamic = "force-dynamic";

const MANGADEX_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_IMAGE_FETCH_ATTEMPTS = 3;

type ReaderQuality = "data" | "data-saver";

interface RouteContext {
  params: Promise<{
    chapterId: string;
    quality: string;
    pageIndex: string;
  }>;
}

const getCachedAtHomeServer = unstable_cache(
  (chapterId: string) => mangaDexClient.getAtHomeServer(chapterId),
  ["mangadex-at-home-image-fallback"],
  { revalidate: 60 },
);

function isReaderQuality(value: string): value is ReaderQuality {
  return value === "data" || value === "data-saver";
}

function getImageUrl(
  atHome: MangaDexAtHomeResponse,
  quality: ReaderQuality,
  pageIndex: number,
) {
  const files = quality === "data" ? atHome.chapter.data : atHome.chapter.dataSaver;
  const fileName = files[pageIndex];
  if (!fileName) return null;

  const baseUrl = new URL(atHome.baseUrl);
  const isAllowedHost =
    baseUrl.hostname === "uploads.mangadex.org" ||
    baseUrl.hostname === "uploads.mangadex.dev" ||
    baseUrl.hostname.endsWith(".mangadex.network");
  if (baseUrl.protocol !== "https:" || !isAllowedHost) return null;

  return `${baseUrl.href.replace(/\/$/, "")}/${quality}/${atHome.chapter.hash}/${fileName}`;
}

function waitBeforeRetry(attempt: number) {
  return new Promise((resolve) => setTimeout(resolve, 300 * attempt));
}

/**
 * Chỉ proxy ảnh khi node MangaDex không phục vụ được trực tiếp cho trình duyệt.
 * Metadata được cache một phút; mỗi lần node lỗi sẽ lấy metadata mới trước khi thử lại.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { chapterId, quality, pageIndex: rawPageIndex } = await context.params;
  const pageIndex = Number(rawPageIndex);
  if (
    !MANGADEX_ID_PATTERN.test(chapterId) ||
    !isReaderQuality(quality) ||
    !Number.isInteger(pageIndex) ||
    pageIndex < 0
  ) {
    return NextResponse.json(
      { message: "Yêu cầu ảnh không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    let atHome = await getCachedAtHomeServer(chapterId);

    for (let attempt = 1; attempt <= MAX_IMAGE_FETCH_ATTEMPTS; attempt += 1) {
      const imageUrl = getImageUrl(atHome, quality, pageIndex);
      if (!imageUrl) {
        return NextResponse.json(
          { message: "Trang ảnh không tồn tại." },
          { status: 404, headers: { "Cache-Control": "no-store" } },
        );
      }

      const response = await fetch(imageUrl, {
        cache: "no-store",
        headers: { Accept: "image/avif,image/webp,image/*,*/*" },
      });
      if (response.ok && response.body) {
        const headers = new Headers({
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
          "X-Content-Type-Options": "nosniff",
        });
        const contentLength = response.headers.get("Content-Length");
        if (contentLength) headers.set("Content-Length", contentLength);

        return new Response(response.body, { status: 200, headers });
      }

      if (attempt < MAX_IMAGE_FETCH_ATTEMPTS) {
        await waitBeforeRetry(attempt);
        atHome = await mangaDexClient.getAtHomeServer(chapterId);
      }
    }

    throw new Error("MangaDex@Home không trả về ảnh sau nhiều lần thử.");
  } catch (error) {
    console.error("[MangaDex] Không proxy được ảnh chapter:", error);
    return NextResponse.json(
      { message: "Không thể tải ảnh từ MangaDex@Home." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
