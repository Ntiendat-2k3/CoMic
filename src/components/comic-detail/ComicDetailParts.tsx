"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Play, BookOpen, Star } from "lucide-react";
import type { Comic } from "@/types/comic";
import { useComicActionsController } from "@/features/comic/hooks/useComicActionsController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";

/* ──────────────────────────────────────────────
   Ảnh bìa
────────────────────────────────────────────── */
export function ComicThumbnail({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-700/50 shadow-xl">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-700/60" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 300px"
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        priority
        unoptimized
      />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Nút thao tác đọc và yêu thích
────────────────────────────────────────────── */
interface ActionButtonsProps {
  comic: Comic;
  cdnUrl: string;
  firstChapterSlug: string;
}

import SaveToOfflineButton from "./SaveToOfflineButton";

export function ActionButtons({ comic, cdnUrl, firstChapterSlug }: ActionButtonsProps) {
  const { isFavorite, toggle } = useComicActionsController(comic, cdnUrl);
  const { comic: copy } = useDictionary();

  return (
    <div className="flex flex-wrap gap-3">
      {firstChapterSlug && (
        <Link
          href={`/truyen-tranh/${comic.slug}/${firstChapterSlug}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-pink-500/20"
        >
          <Play size={16} fill="white" />
          {copy.readFromStart}
        </Link>
      )}

      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all border ${
          isFavorite
            ? "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-pink-500/10 shadow-md"
            : "bg-gray-700/60 text-gray-300 border-gray-600/50 hover:border-pink-500/30 hover:text-pink-300"
        }`}
      >
        <Heart size={16} className={isFavorite ? "fill-pink-400" : ""} />
        {isFavorite ? copy.favorited : copy.favorite}
      </button>

      <SaveToOfflineButton comic={comic} />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Thông tin truyện: tên, tác giả và trạng thái
────────────────────────────────────────────── */
export function ComicMetadata({ comic }: { comic: Comic }) {
  const { locale, common, comic: copy } = useDictionary();
  const statusMap: Record<string, { label: string; color: string }> = {
    "ongoing": { label: copy.ongoing, color: "text-green-400 bg-green-400/10 border-green-400/30" },
    "completed": { label: copy.completed, color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
    "hiatus": { label: copy.hiatus, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
    "cancelled": { label: copy.cancelled, color: "text-red-400 bg-red-400/10 border-red-400/30" },
  };
  const status = statusMap[comic.status] ?? { label: comic.status, color: "text-gray-400 bg-gray-400/10 border-gray-400/30" };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
        {comic.name}
      </h1>
      {comic.origin_name?.[0] && (
        <p className="text-gray-400 text-sm italic">{comic.origin_name[0]}</p>
      )}

      <div className="flex flex-wrap gap-2 text-sm">
        <span className={`px-3 py-1 rounded-full border text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
        {comic.author?.length > 0 && (
          <span className="flex items-center gap-1 text-gray-300">
            <Star size={13} className="text-yellow-400" />
            {comic.author.join(", ")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <BookOpen size={14} />
          {formatMessage(common.chapterCount, {
            count: comic.chapters.reduce(
              (total, server) => total + server.server_data.length,
              0,
            ),
          })}
        </span>
        <span>
          {formatMessage(copy.updatedAt, {
            date: new Date(comic.updatedAt).toLocaleDateString(locale),
          })}
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Danh sách thể loại
────────────────────────────────────────────── */
export function CategoriesList({ categories }: { categories: Comic["category"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat._id || cat.slug}
          href={`/the-loai/${cat.slug}`}
          className="px-3 py-1 text-xs rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25 hover:bg-pink-500/25 hover:text-pink-200 transition-colors"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Mô tả có thể thu gọn
────────────────────────────────────────────── */
export function Description({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const { comic } = useDictionary();

  const stripped = content.replace(/<[^>]+>/g, "");

  return (
    <div>
      <p className={`text-gray-300 text-sm leading-relaxed ${!expanded ? "line-clamp-4" : ""}`}>
        {stripped}
      </p>
      {stripped.length > 300 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors"
        >
          {expanded ? comic.showLess : comic.showMore}
        </button>
      )}
    </div>
  );
}
