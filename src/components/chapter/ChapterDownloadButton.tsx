"use client";

import { DownloadCloud, CheckCircle2, Loader2 } from "lucide-react";
import type { Chapter } from "@/types/common";
import { useChapterDownloadController } from "@/features/chapter/hooks/useChapterDownloadController";
import { useDictionary } from "@/i18n/I18nProvider";

interface Props {
  comicSlug: string;
  chapter: Chapter;
}

export default function ChapterDownloadButton({ comicSlug, chapter }: Props) {
  const { status, download } = useChapterDownloadController(comicSlug, chapter);
  const { chapter: copy } = useDictionary();

  if (status === "downloaded") {
    return (
      <button className="p-2 text-green-400 cursor-default" title={copy.downloadedTitle} onClick={(e) => e.preventDefault()}>
        <CheckCircle2 size={16} />
      </button>
    );
  }

  if (status === "downloading") {
    return (
      <button className="p-2 text-blue-400 cursor-default" title={copy.downloadingTitle} onClick={(e) => e.preventDefault()}>
        <Loader2 size={16} className="animate-spin" />
      </button>
    );
  }

  return (
    <button 
      onClick={download}
      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
      title={copy.downloadTitle}
    >
      <DownloadCloud size={16} />
    </button>
  );
}
