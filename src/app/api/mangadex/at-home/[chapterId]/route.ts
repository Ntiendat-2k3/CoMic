import { NextResponse } from "next/server";
import { mangaDexClient } from "@/infrastructure/mangadex/mangadex.client";

export const dynamic = "force-dynamic";

const MANGADEX_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface RouteContext {
  params: Promise<{ chapterId: string }>;
}

/**
 * Chuyển tiếp metadata At-Home qua backend cùng origin để trình duyệt không bị CORS.
 * Response không được cache vì MangaDex có thể đổi node ảnh giữa các lần gọi.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { chapterId } = await context.params;
  if (!MANGADEX_ID_PATTERN.test(chapterId)) {
    return NextResponse.json(
      { message: "Chapter ID không hợp lệ." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const data = await mangaDexClient.getAtHomeServer(chapterId);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[MangaDex] Không lấy được metadata At-Home:", error);
    return NextResponse.json(
      { message: "Không thể kết nối MangaDex@Home." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
