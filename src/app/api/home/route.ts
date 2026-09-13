import { NextRequest, NextResponse } from "next/server";
import ComicCatalogService from "@/services/comic-catalog.service";

export const dynamic = "force-dynamic";

function toPositiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

export async function GET(request: NextRequest) {
  const page = toPositiveInteger(request.nextUrl.searchParams.get("page"), 1, 500);
  const limit = toPositiveInteger(request.nextUrl.searchParams.get("limit"), 15, 100);

  try {
    const response = await ComicCatalogService.getHomeData(page, limit);
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Không thể tải danh sách truyện." },
      { status: 502 },
    );
  }
}
