"use client";

import { useAppSelector } from "@/store";
import { selectLastRead } from "@/store/slices/readingSlice";
import type { Comic } from "@/types/comic";

/** Tạo trạng thái tiến độ đọc dành riêng cho một thẻ truyện. */
export function useComicCardController(comic: Comic) {
  const lastRead = useAppSelector(selectLastRead(comic.slug));
  const totalChapters = comic.chapters?.[0]?.server_data?.length ?? 0;
  const isReading = Boolean(lastRead);
  const progress = lastRead && totalChapters > 0
    ? Math.min(
        Math.round((Number(lastRead.chapterName) / totalChapters) * 100),
        100,
      )
    : 0;

  return { lastRead, isReading, progress };
}
