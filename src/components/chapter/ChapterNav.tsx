"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  RefreshCw,
} from "lucide-react";
import { useChapterNavigationController } from "@/features/chapter/hooks/useChapterNavigationController";
import { useComicActionsController } from "@/features/comic/hooks/useComicActionsController";
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
  sticky?: boolean;
}

/** Hiển thị các thao tác đọc thường dùng trong một thanh điều hướng thích ứng theo màn hình. */
export default function ChapterNav({
  slug,
  comicName,
  thumbUrl,
  cdnUrl,
  chapters,
  current,
  prevChapter,
  nextChapter,
  sticky = false,
}: ChapterNavProps) {
  const { uniqueChapters, navigate } = useChapterNavigationController({
    slug,
    comicName,
    thumbUrl,
    cdnUrl,
    chapters,
  });
  const { isFavorite, toggle } = useComicActionsController(
    { slug, name: comicName, thumb_url: thumbUrl },
    cdnUrl,
  );
  const { common, navigation, comic: comicCopy, errors } = useDictionary();
  const iconButtonClass =
    "flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-700/70 bg-gray-800 text-gray-200 transition-colors hover:border-pink-500/50 hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 sm:size-11 sm:rounded-lg";

  return (
    <nav
      aria-label={comicCopy.chapterListHeading}
      className={`flex flex-nowrap items-center gap-1 border border-gray-700/70 bg-gray-950 p-1 shadow-xl sm:gap-2 sm:p-2 sm:rounded-xl ${
        sticky ? "sticky top-0 z-50 my-0 rounded-none sm:my-4" : "my-4 rounded-xl"
      }`}
    >
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link
          href="/"
          className={iconButtonClass}
          aria-label={navigation.home}
          title={navigation.home}
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={32}
            height={32}
            sizes="(min-width: 640px) 32px, 24px"
            className="size-6 object-contain sm:size-8"
          />
          <span className="sr-only">{navigation.home}</span>
        </Link>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className={iconButtonClass}
          aria-label={errors.reload}
          title={errors.reload}
        >
          <RefreshCw className="size-[18px] sm:size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
        {prevChapter ? (
          <button
            type="button"
            onClick={() => navigate(prevChapter.chapter_slug ?? prevChapter.chapter_name ?? "")}
            className={iconButtonClass}
            aria-label={formatMessage(common.shortChapter, {
              chapter: prevChapter.chapter_name ?? common.unknown,
            })}
            title={formatMessage(common.shortChapter, {
              chapter: prevChapter.chapter_name ?? common.unknown,
            })}
          >
            <ChevronLeft className="size-5 sm:size-[22px]" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={`/truyen-tranh/${slug}`}
            className={iconButtonClass}
            aria-label={common.details}
            title={common.details}
          >
            <ChevronLeft className="size-5 sm:size-[22px]" aria-hidden="true" />
          </Link>
        )}

        <select
          value={current}
          onChange={(event) => navigate(event.target.value)}
          aria-label={comicCopy.chapterListHeading}
          className="h-9 min-w-0 flex-1 rounded-md border border-gray-600 bg-white px-2 text-xs font-medium text-gray-950 transition-colors hover:border-pink-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/40 sm:h-11 sm:rounded-lg sm:px-3 sm:text-sm"
        >
          {uniqueChapters.map((chapter, index) => (
            <option
              key={chapter.chapter_slug ?? `chapter-opt-${index}`}
              value={chapter.chapter_slug ?? chapter.chapter_name}
            >
              {formatMessage(common.chapter, {
                chapter: chapter.chapter_name ?? common.unknown,
              })}
            </option>
          ))}
        </select>

        {nextChapter ? (
          <button
            type="button"
            onClick={() => navigate(nextChapter.chapter_slug ?? nextChapter.chapter_name ?? "")}
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-pink-500 text-white transition-colors hover:bg-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 sm:size-11 sm:rounded-lg"
            aria-label={formatMessage(common.shortChapter, {
              chapter: nextChapter.chapter_name ?? common.unknown,
            })}
            title={formatMessage(common.shortChapter, {
              chapter: nextChapter.chapter_name ?? common.unknown,
            })}
          >
            <ChevronRight className="size-5 sm:size-[22px]" aria-hidden="true" />
          </button>
        ) : (
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gray-800/70 text-gray-600 sm:size-11 sm:rounded-lg"
            aria-label={common.end}
            title={common.end}
          >
            <ChevronRight className="size-5 sm:size-[22px]" aria-hidden="true" />
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFavorite}
        className={`flex size-9 shrink-0 items-center justify-center rounded-md border p-0 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 sm:h-11 sm:w-auto sm:gap-2 sm:rounded-lg sm:px-3 ${
          isFavorite
            ? "border-pink-400/60 bg-pink-500/20 text-pink-200"
            : "border-pink-400/30 bg-pink-500 text-white hover:bg-pink-400"
        }`}
      >
        <Heart
          className={`size-[18px] sm:size-[19px] ${isFavorite ? "fill-current" : ""}`}
          aria-hidden="true"
        />
        <span className="sr-only sm:not-sr-only">
          {isFavorite ? comicCopy.following : comicCopy.follow}
        </span>
      </button>
    </nav>
  );
}
