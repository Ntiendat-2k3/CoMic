"use client";

import { useCallback, useEffect, useState } from "react";
import { OfflineManager } from "@/lib/offline-manager";
import type { ComicDetailResponse } from "@/types/response";

type OfflineComic = ComicDetailResponse["data"]["item"];

/** Quản lý trạng thái lưu metadata truyện vào IndexedDB. */
export function useOfflineSaveController(comic: OfflineComic) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    OfflineManager.getComic(comic.slug).then((savedComic) => {
      if (active) setIsSaved(Boolean(savedComic));
    });

    return () => {
      active = false;
    };
  }, [comic.slug]);

  const toggleSave = useCallback(async () => {
    setIsSaving(true);

    try {
      if (isSaved) {
        await OfflineManager.removeComic(comic.slug);
        setIsSaved(false);
      } else {
        await OfflineManager.saveComicMetadata(comic);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Không thể cập nhật dữ liệu offline:", error);
    } finally {
      setIsSaving(false);
    }
  }, [comic, isSaved]);

  return { isSaved, isSaving, toggleSave };
}
