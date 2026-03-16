"use client";

import { useState, useEffect } from "react";
import { DownloadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { OfflineManager } from "@/lib/offline-manager";
import OTruyenService from "@/services/otruyen.service";
import type { Chapter } from "@/types/common";

interface Props {
  comicSlug: string;
  chapter: Chapter;
}

export default function ChapterDownloadButton({ comicSlug, chapter }: Props) {
  const [status, setStatus] = useState<"idle" | "downloading" | "downloaded">("idle");

  const chapterId = `${comicSlug}_${chapter.chapter_api_data?.split("/").pop() || chapter.chapter_name}`;

  useEffect(() => {
    // Check if this chapter is already downloaded
    OfflineManager.getSavedChapters(comicSlug).then((chapters) => {
      const isDownloaded = chapters.some((c) => c.id === chapterId);
      if (isDownloaded) setStatus("downloaded");
    });
  }, [comicSlug, chapterId]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to chapter link
    if (status !== "idle" || !chapter.chapter_api_data) return;

    try {
      setStatus("downloading");
      
      // Auto-save comic metadata first if not exists so it shows in Library
      const savedComic = await OfflineManager.getComic(comicSlug);
      if (!savedComic) {
         const detail = await OTruyenService.getComicDetail(comicSlug);
         await OfflineManager.saveComicMetadata(detail.data.item);
      }

      // Fetch chapter images
      const res = await OTruyenService.getChapterData(chapter.chapter_api_data);
      const raw = (res.data?.data ?? res.data) as {
        images?: string[];
        domain_cdn?: string;
        item?: {
          chapter_path: string;
          chapter_image: { image_page: number; image_file: string }[];
        };
      };
      
      let images: string[] = [];
      if ("images" in raw && raw.images) {
        images = raw.images;
      } else if (raw.item && raw.domain_cdn) {
        const { domain_cdn, item } = raw;
        images = item.chapter_image
          .sort((a: { image_page: number }, b: { image_page: number }) => a.image_page - b.image_page)
          .map((img: { image_file: string }) => `${domain_cdn}/${item.chapter_path}/${img.image_file}`);
      }

      // Save to IDB & Cache
      await OfflineManager.saveChapter(comicSlug, chapter, images);
      setStatus("downloaded");
    } catch (error) {
      console.error("Failed to download chapter:", error);
      setStatus("idle");
    }
  };

  if (status === "downloaded") {
    return (
      <button className="p-2 text-green-400 cursor-default" title="Đã tải xuống" onClick={(e) => e.preventDefault()}>
        <CheckCircle2 size={16} />
      </button>
    );
  }

  if (status === "downloading") {
    return (
      <button className="p-2 text-blue-400 cursor-default" title="Đang tải..." onClick={(e) => e.preventDefault()}>
        <Loader2 size={16} className="animate-spin" />
      </button>
    );
  }

  return (
    <button 
      onClick={handleDownload}
      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
      title="Tải chương này để đọc offline"
    >
      <DownloadCloud size={16} />
    </button>
  );
}
