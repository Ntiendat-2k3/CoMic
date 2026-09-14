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
    "flex size-11 shrink-0 items-center justify-center rounded-lg border border-gray-700/70 bg-gray-800 text-gray-200 transition-colors hover:border-pink-500/50 hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400";

  return (
    <nav
      aria-label={comicCopy.chapterListHeading}
      className={`grid grid-cols-[1fr_auto] gap-2 border border-gray-700/70 bg-gray-950 p-2 shadow-xl sm:flex sm:flex-nowrap sm:items-center sm:rounded-xl ${
        sticky ? "sticky top-0 z-50 my-0 rounded-none sm:my-4" : "my-4 rounded-xl"
      }`}
    >
      <div className="col-start-1 row-start-1 flex items-center gap-2">
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
            sizes="32px"
            className="size-8 object-contain"
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
          <RefreshCw size={20} aria-hidden="true" />
        </button>

      </div>

      <div className="col-span-2 row-start-2 flex min-w-0 items-center gap-2 sm:flex-1">
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
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={`/truyen-tranh/${slug}`}
            className={iconButtonClass}
            aria-label={common.details}
            title={common.details}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </Link>
        )}

        <select
          value={current}
          onChange={(event) => navigate(event.target.value)}
          aria-label={comicCopy.chapterListHeading}
          className="h-11 min-w-0 flex-1 rounded-lg border border-gray-600 bg-white px-3 text-sm font-medium text-gray-950 transition-colors hover:border-pink-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
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
            className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-pink-500 text-white transition-colors hover:bg-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            aria-label={formatMessage(common.shortChapter, {
              chapter: nextChapter.chapter_name ?? common.unknown,
            })}
            title={formatMessage(common.shortChapter, {
              chapter: nextChapter.chapter_name ?? common.unknown,
            })}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        ) : (
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gray-800/70 text-gray-600"
            aria-label={common.end}
            title={common.end}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFavorite}
        className={`col-start-2 row-start-1 flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 ${
          isFavorite
            ? "border-pink-400/60 bg-pink-500/20 text-pink-200"
            : "border-pink-400/30 bg-pink-500 text-white hover:bg-pink-400"
        }`}
      >
        <Heart
          size={19}
          className={isFavorite ? "fill-current" : ""}
          aria-hidden="true"
        />
        <span>{isFavorite ? comicCopy.following : comicCopy.follow}</span>
      </button>
    </nav>
  );
}
