"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch } from "@/store";
import { saveProgress } from "@/store/slices/readingSlice";

interface ChapterNavProps {
  slug: string;
  comicName: string;
  thumbUrl: string;
  cdnUrl: string;
  chapters: string[];
  current: string;
  prevChapter?: string;
  nextChapter?: string;
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Lọc bỏ trùng trước khi render
  const uniqueChapters = chapters.filter(
    (name, idx, arr) => arr.indexOf(name) === idx,
  );

  const saveAndNavigate = (chapter: string) => {
    dispatch(
      saveProgress({
        slug,
        chapterName: chapter,
        comicName,
        thumbUrl: `${cdnUrl}/uploads/comics/${thumbUrl}`,
      }),
    );
    router.push(`/truyen-tranh/${slug}/${chapter}`);
  };

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap my-4 px-4 py-3 bg-gray-800/60 rounded-xl border border-gray-700/50">
      {/* Prev */}
      {prevChapter ? (
        <button
          onClick={() => saveAndNavigate(prevChapter)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
          Ch.{prevChapter}
        </button>
      ) : (
        <Link
          href={`/truyen-tranh/${slug}`}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700/50 text-sm text-gray-400 hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Chi tiết
        </Link>
      )}

      {/* Chapter select */}
      <select
        value={current}
        onChange={(e) => saveAndNavigate(e.target.value)}
        className="flex-1 min-w-0 max-w-xs rounded-lg bg-gray-800 border border-gray-600 px-3 py-2 text-sm text-white hover:border-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
      >
        {uniqueChapters.map((name, idx) => (
          <option key={`chapter-opt-${idx}`} value={name}>
            Chapter {name}
          </option>
        ))}
      </select>

      {/* Next */}
      {nextChapter ? (
        <button
          onClick={() => saveAndNavigate(nextChapter)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700 text-sm text-white hover:bg-gray-600 transition-colors"
        >
          Ch.{nextChapter}
          <ChevronRight size={16} />
        </button>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-700/50 text-sm text-gray-500">
          Hết
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}
