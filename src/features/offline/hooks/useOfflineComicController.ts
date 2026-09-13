"use client";

import { useEffect, useState } from "react";
import { OfflineManager } from "@/lib/offline-manager";

type SavedComic = Awaited<ReturnType<typeof OfflineManager.getComic>>;
type SavedChapter = Awaited<ReturnType<typeof OfflineManager.getSavedChapters>>[number];

/** Tải song song metadata truyện và danh sách chương đã lưu. */
export function useOfflineComicController(slug: string) {
  const [comic, setComic] = useState<SavedComic>(null);
  const [chapters, setChapters] = useState<SavedChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      OfflineManager.getComic(slug),
      OfflineManager.getSavedChapters(slug),
    ])
      .then(([comicData, savedChapters]) => {
        if (!active) return;
        setComic(comicData);
        setChapters(savedChapters);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return { comic, chapters, isLoading };
}
