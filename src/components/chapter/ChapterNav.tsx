"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useChapterNavigationController } from "@/features/chapter/hooks/useChapterNavigationController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import type { Chapter } from "@/types/common";

interface ChapterNavProps {
  slug: string;
  comicName: string;
  thumbUrl: string;
  cdnUrl: string;
  chapters: Chapter[];
  current: string;
  prevChapter?: Chapter;
  nextChapter?: Chapter;
}

export default function ChapterNav({
  slug,
  comicName,
  thumbUrl,
  cdnUrl,
  chapters,
  current,
  prevChapter,
  nextChapter,
}: ChapterNavProps) {
  const { uniqueChapters, navigate } = useChapterNavigationController({
    slug,
    comicName,
    thumbUrl,
    cdnUrl,
    chapters,
  });
  const { common } = useDictionary();

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap my-4 px-4 py-3 bg-gray-800/60 rounded-xl border border-gray-700/50">
      {/* Chương trước */}
      {prevChapter ? (
        <button
          onClick={() => navigate(prevChapter.chapter_slug ?? prevChapter.chapter_name ?? "")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
          {formatMessage(common.shortChapter, { chapter: prevChapter.chapter_name ?? common.unknown })}
        </button>
      ) : (
        <Link
          href={`/truyen-tranh/${slug}`}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700/50 text-sm text-gray-400 hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={16} />
          {common.details}
        </Link>
      )}

      {/* Chọn chương */}
      <select
        value={current}
        onChange={(e) => navigate(e.target.value)}
        className="flex-1 min-w-0 max-w-xs rounded-lg bg-gray-800 border border-gray-600 px-3 py-2 text-sm text-white hover:border-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
      >
        {uniqueChapters.map((chapter, idx) => (
          <option
            key={chapter.chapter_slug ?? `chapter-opt-${idx}`}
            value={chapter.chapter_slug ?? chapter.chapter_name}
          >
            {formatMessage(common.chapter, { chapter: chapter.chapter_name ?? common.unknown })}
          </option>
        ))}
      </select>

      {/* Chương sau */}
      {nextChapter ? (
        <button
          onClick={() => navigate(nextChapter.chapter_slug ?? nextChapter.chapter_name ?? "")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors"
        >
          {formatMessage(common.shortChapter, { chapter: nextChapter.chapter_name ?? common.unknown })}
          <ChevronRight size={16} />
        </button>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700/50 text-sm text-gray-500">
          {common.end}
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}
