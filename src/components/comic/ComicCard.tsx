"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import { BookOpen, CalendarDays, Star } from "lucide-react";
import type { Comic } from "@/types/comic";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { useComicCardController } from "@/features/comic/hooks/useComicCardController";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";

interface ComicCardProps {
  comic: Comic;
  cdnUrl: string;
  priority?: boolean;
}

const ComicCard = memo(({ comic, cdnUrl, priority = false }: ComicCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { comic: copy, common, locale } = useDictionary();
  const { lastRead, isReading, progress } = useComicCardController(comic);
  const statusLabels: Record<string, string> = {
    ongoing: copy.ongoing,
    completed: copy.completed,
    hiatus: copy.hiatus,
    cancelled: copy.cancelled,
  };

  const thumbSrc = resolveCoverUrl(comic.thumb_url, cdnUrl);

  return (
    <Link
      href={`/truyen-tranh/${comic.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-[1.15rem] border transition-[border-color,background-color,box-shadow,transform] duration-200
        md:hover:-translate-y-1 md:hover:shadow-2xl md:hover:shadow-black/35
        ${isReading
          ? "border-emerald-500/35 bg-emerald-950/20 shadow-md shadow-emerald-500/10"
          : "border-white/10 bg-[linear-gradient(160deg,#1a1b27_0%,#11121b_100%)] md:hover:border-pink-400/45"
        }`}
    >
      {/* Nhãn đang đọc */}
      {isReading && (
        <div className="absolute top-2 left-2 z-10 flex min-h-6 items-center gap-1 rounded-full bg-emerald-500 px-2 text-[10px] font-bold text-white shadow">
          <BookOpen size={10} />
          {copy.reading}
        </div>
      )}

      {/* Ảnh bìa */}
      <div className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden bg-gray-800">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-700/40" />
        )}
        <Image
          src={thumbSrc}
          alt={comic.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`object-cover transition-[opacity,transform] duration-300 md:group-hover:scale-[1.035]
            ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={80}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#10111a] via-[#10111a]/45 to-transparent" />

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
          {comic.latestChapter ? (
            <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-pink-300/30 bg-pink-500/90 px-2.5 text-[10px] font-bold text-white shadow-lg shadow-pink-950/30 backdrop-blur-sm">
              <BookOpen size={11} aria-hidden="true" />
              {formatMessage(common.chapter, { chapter: comic.latestChapter })}
            </span>
          ) : (
            <span className="max-w-[72%] truncate rounded-full border border-white/10 bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              {comic.category[0]?.name ?? statusLabels[comic.status] ?? comic.status}
            </span>
          )}
        </div>

        {comic.statistics?.rating ? (
          <span className="absolute right-2 top-2 flex min-h-7 items-center gap-1 rounded-full border border-amber-200/20 bg-black/70 px-2 text-[10px] font-bold text-amber-300 backdrop-blur-md">
            <Star size={10} fill="currentColor" aria-hidden="true" />
            {comic.statistics.rating.toFixed(1)}
          </span>
        ) : null}

        {isReading ? (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800/70">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </div>

      {/* Thông tin */}
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <h3 className={`line-clamp-2 min-h-10 text-sm font-bold leading-snug transition-colors duration-200
          ${isReading
            ? "text-green-300 md:group-hover:text-green-200"
            : "text-[#f7f4f8] md:group-hover:text-pink-300"
          }`}
        >
          {comic.name}
        </h3>

        <div className="flex min-h-5 flex-wrap gap-1">
          {comic.category.slice(0, 2).map((category, index) => (
            <span
              key={category._id}
              className={`max-w-full truncate rounded-full border border-pink-400/20 bg-pink-400/10 px-2 py-0.5 text-[9px] font-medium text-pink-200 ${index === 1 ? "hidden sm:inline" : ""}`}
            >
              {category.name}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5 text-[10px] text-gray-400">
          <span className="flex min-w-0 items-center gap-1 truncate">
            <CalendarDays size={11} aria-hidden="true" />
            {new Date(comic.updatedAt).toLocaleDateString(locale, {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${comic.status === "completed" ? "bg-emerald-400" : "bg-pink-400"}`} />
            {statusLabels[comic.status] ?? comic.status}
          </span>
        </div>

        {isReading && lastRead && (
          <p className="text-[10px] text-emerald-400">
            {formatMessage(copy.readingProgress, {
              chapter: lastRead.chapterName,
              progress,
            })}
          </p>
        )}
      </div>
    </Link>
  );
});

ComicCard.displayName = "ComicCard";
export default ComicCard;
