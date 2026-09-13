"use client";

import { useCallback, useEffect, useState } from "react";
import { OfflineManager } from "@/lib/offline-manager";

type SavedComic = Awaited<ReturnType<typeof OfflineManager.getSavedComics>>[number];

/** Điều phối danh sách truyện đã lưu và thao tác xóa khỏi thiết bị. */
export function useOfflineLibraryController(removeConfirmMessage: string) {
  const [comics, setComics] = useState<SavedComic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComics = useCallback(async () => {
    const data = await OfflineManager.getSavedComics();
    setComics(data.toSorted((a, b) => b.savedAt - a.savedAt));
  }, []);

  useEffect(() => {
    let active = true;

    OfflineManager.getSavedComics()
      .then((data) => {
        if (active) {
          setComics(data.toSorted((a, b) => b.savedAt - a.savedAt));
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const removeComic = async (slug: string) => {
    if (!window.confirm(removeConfirmMessage)) return;

    await OfflineManager.removeComic(slug);
    await loadComics();
  };

  return { comics, isLoading, removeComic };
}
