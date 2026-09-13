"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { OfflineManager } from "@/lib/offline-manager";
import ComicCatalogService from "@/services/comic-catalog.service";
import type { Chapter } from "@/types/common";

export type ChapterDownloadStatus = "idle" | "downloading" | "downloaded";

/** Điều phối toàn bộ quy trình tải một chương và metadata liên quan. */
export function useChapterDownloadController(comicSlug: string, chapter: Chapter) {
  const [status, setStatus] = useState<ChapterDownloadStatus>("idle");
  const chapterId = useMemo(
    () =>
      `${comicSlug}_${chapter.chapter_api_data?.split("/").pop() || chapter.chapter_name}`,
    [chapter.chapter_api_data, chapter.chapter_name, comicSlug],
  );

  useEffect(() => {
    let active = true;

    OfflineManager.getSavedChapters(comicSlug).then((chapters) => {
      if (active && chapters.some((item) => item.id === chapterId)) {
        setStatus("downloaded");
      }
    });

    return () => {
      active = false;
    };
  }, [chapterId, comicSlug]);

  const download = useCallback(async (event: MouseEvent) => {
    event.preventDefault();
    if (status !== "idle" || !chapter.chapter_api_data) return;

    try {
      setStatus("downloading");
      const savedComic = await OfflineManager.getComic(comicSlug);

      if (!savedComic) {
        const detail = await ComicCatalogService.getComicDetail(comicSlug);
        await OfflineManager.saveComicMetadata(detail.data.item);
      }

      const images = await ComicCatalogService.getChapterImages(chapter.chapter_api_data);
      await OfflineManager.saveChapter(comicSlug, chapter, images);
      setStatus("downloaded");
    } catch (error) {
      console.error("Không thể tải chương:", error);
      setStatus("idle");
    }
  }, [chapter, comicSlug, status]);

  return { status, download };
}
