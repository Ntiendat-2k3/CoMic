"use client";

import { useEffect, useState } from "react";
import { OfflineManager } from "@/lib/offline-manager";

type SavedComic = Awaited<ReturnType<typeof OfflineManager.getComic>>;
type SavedChapter = Awaited<ReturnType<typeof OfflineManager.getSavedChapters>>[number];

/** Tải dữ liệu cần thiết cho trình đọc offline và chọn đúng chương. */
export function useOfflineReaderController(slug: string, chapterId: string) {
  const [comic, setComic] = useState<SavedComic>(null);
  const [chapter, setChapter] = useState<SavedChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      OfflineManager.getComic(slug),
      OfflineManager.getSavedChapters(slug),
    ])
      .then(([comicData, chapters]) => {
        if (!active) return;
        setComic(comicData);
        setChapter(chapters.find((item) => item.id === chapterId) ?? null);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [chapterId, slug]);

  return { comic, chapter, isLoading };
}
