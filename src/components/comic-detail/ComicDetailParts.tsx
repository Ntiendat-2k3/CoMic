"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Heart,
  Languages,
  Layers3,
  PenLine,
  Search,
  Share2,
  Star,
  Users,
} from "lucide-react";
import type { Comic } from "@/types/comic";
import { useComicActionsController } from "@/features/comic/hooks/useComicActionsController";
import { useDictionary } from "@/i18n/I18nProvider";
import SaveToOfflineButton from "./SaveToOfflineButton";

export function ComicThumbnail({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-pink-400/60 bg-gray-800 shadow-[0_18px_48px_rgba(0,0,0,.48),0_0_26px_rgba(236,72,153,.12)]">
      {!loaded ? <div className="absolute inset-0 animate-pulse bg-gray-700/60" /> : null}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 42vw, 300px"
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        priority
      />
    </div>
  );
}

interface ComicActionProps {
  comic: Comic;
  cdnUrl: string;
  firstChapterSlug: string;
}

/** Gom các thao tác có dữ liệu thật: đọc, yêu thích cục bộ và lưu ngoại tuyến. */
export function ActionButtons({ comic, cdnUrl, firstChapterSlug }: ComicActionProps) {
  const { isFavorite, toggle } = useComicActionsController(comic, cdnUrl);
  const { comic: copy } = useDictionary();

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {firstChapterSlug ? (
        <Link
          href={`/truyen-tranh/${comic.slug}/${firstChapterSlug}`}
          className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-300 px-2 text-xs font-extrabold text-[#240d18] shadow-[0_12px_30px_rgba(236,72,153,.28)] transition-[filter,transform] hover:brightness-110 active:scale-[.98] sm:px-5 sm:text-sm"
        >
          <BookOpen size={18} aria-hidden="true" />
          <span className="truncate">{copy.readNow}</span>
        </Link>
      ) : (
        <span className="flex min-h-12 items-center justify-center rounded-2xl border border-white/10 text-xs text-gray-500">
          {copy.noChapters}
        </span>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFavorite}
        className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl border px-2 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
          isFavorite
            ? "border-pink-400/55 bg-pink-500/18 text-pink-200"
            : "border-pink-400/35 bg-[#151824]/85 text-gray-200 hover:bg-pink-500/10 hover:text-pink-200"
        }`}
      >
        <Heart size={18} className={isFavorite ? "fill-current" : ""} aria-hidden="true" />
        <span className="truncate">{isFavorite ? copy.favorited : copy.favorite}</span>
      </button>

      <SaveToOfflineButton comic={comic} />
    </div>
  );
}

export function ComicMetadata({ comic }: { comic: Comic }) {
  const { locale, common, comic: copy } = useDictionary();
  const statusMap: Record<string, { label: string; color: string }> = {
    ongoing: { label: copy.ongoing, color: "text-emerald-300" },
    completed: { label: copy.completed, color: "text-sky-300" },
    hiatus: { label: copy.hiatus, color: "text-amber-300" },
    cancelled: { label: copy.cancelled, color: "text-rose-300" },
  };
  const status = statusMap[comic.status] ?? { label: comic.status, color: "text-gray-300" };
  const chapterCount = comic.chapters.reduce(
    (total, server) => total + server.server_data.length,
    0,
  );
  const rating = comic.statistics?.rating;
  const follows = comic.statistics?.follows;
  const compactNumber = new Intl.NumberFormat(locale, { notation: "compact" });
  const updatedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(
    new Date(comic.updatedAt),
  );
  const contentRating = comic.contentRating && comic.contentRating in copy.contentRatings
    ? copy.contentRatings[comic.contentRating as keyof typeof copy.contentRatings]
    : comic.contentRating;
  const plainDescription = comic.content.replace(/<[^>]+>/g, "");

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="min-w-0 text-xl font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-3xl lg:text-5xl">
          {comic.name}
        </h1>
        {contentRating ? (
          <span className="rounded-full border border-pink-400/45 bg-pink-500/10 px-2.5 py-1 text-[10px] font-semibold text-pink-300">
            {contentRating}
          </span>
        ) : null}
      </div>

      {comic.origin_name[0] ? (
        <p className="mt-1 line-clamp-1 text-xs text-gray-400 sm:text-sm">{comic.origin_name[0]}</p>
      ) : null}
      {plainDescription ? (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400 sm:text-sm sm:leading-6">
          {plainDescription}
        </p>
      ) : null}

      <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-2.5 text-center">
        <div>
          <strong className="flex items-center justify-center gap-1.5 text-sm text-white sm:text-base">
            <Star size={16} className="fill-pink-400 text-pink-400" aria-hidden="true" />
            {rating !== undefined ? rating.toFixed(1) : common.unknown}
          </strong>
          <span className="mt-0.5 block text-[9px] text-gray-500 sm:text-[11px]">{copy.ratingLabel}</span>
        </div>
        <div>
          <strong className="flex items-center justify-center gap-1.5 text-sm text-white sm:text-base">
            <Users size={16} className="text-pink-300" aria-hidden="true" />
            {follows !== undefined ? compactNumber.format(follows) : common.unknown}
          </strong>
          <span className="mt-0.5 block text-[9px] text-gray-500 sm:text-[11px]">{copy.followersLabel}</span>
        </div>
        <div>
          <strong className="flex items-center justify-center gap-1.5 text-sm text-white sm:text-base">
            <Layers3 size={16} className="text-pink-300" aria-hidden="true" />
            {chapterCount}
          </strong>
          <span className="mt-0.5 block text-[9px] text-gray-500 sm:text-[11px]">{copy.chaptersTab}</span>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-[11px] text-gray-400 min-[390px]:grid-cols-2 sm:text-xs">
        {comic.author.length > 0 ? (
          <div className="flex min-w-0 items-center gap-2">
            <PenLine size={14} className="flex-none text-gray-300" aria-hidden="true" />
            <dt>{copy.authorLabel}:</dt>
            <dd className="truncate text-gray-200">{comic.author.join(", ")}</dd>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <Layers3 size={14} className="flex-none text-gray-300" aria-hidden="true" />
          <dt>{copy.statusLabel}:</dt>
          <dd className={status.color}>{status.label}</dd>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays size={14} className="flex-none text-gray-300" aria-hidden="true" />
          <dt>{copy.lastUpdatedLabel}:</dt>
          <dd className="truncate text-gray-200">{updatedAt}</dd>
        </div>
        {comic.originalLanguage ? (
          <div className="flex items-center gap-2">
            <Languages size={14} className="flex-none text-gray-300" aria-hidden="true" />
            <dt>{copy.originalLanguageLabel}:</dt>
            <dd className="uppercase text-gray-200">{comic.originalLanguage}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

export function CategoriesList({ categories }: { categories: Comic["category"] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.slice(0, 6).map((category) => (
        <Link
          key={category._id || category.slug}
          href={`/the-loai/${category.slug}`}
          className="rounded-full border border-pink-400/35 bg-pink-500/10 px-2.5 py-1 text-[10px] text-pink-200 transition-colors hover:bg-pink-500/20 sm:text-xs"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}

export function Description({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const { comic } = useDictionary();
  const stripped = content.replace(/<[^>]+>/g, "");

  return (
    <div>
      <p className={`text-sm leading-7 text-gray-300 ${expanded ? "" : "line-clamp-4"}`}>
        {stripped}
      </p>
      {stripped.length > 300 ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-2 text-xs font-semibold text-pink-400 transition-colors hover:text-pink-300"
        >
          {expanded ? comic.showLess : comic.showMore}
        </button>
      ) : null}
    </div>
  );
}

interface ComicDetailHeaderProps {
  comic: Comic;
  cdnUrl: string;
}

/** Thanh điều hướng riêng của trang chi tiết trên mobile. */
export function ComicDetailHeader({ comic, cdnUrl }: ComicDetailHeaderProps) {
  const router = useRouter();
  const { isFavorite, toggle } = useComicActionsController(comic, cdnUrl);
  const { brand, comic: copy } = useDictionary();

  async function shareComic() {
    const shareData = { title: comic.name, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await navigator.clipboard?.writeText(shareData.url);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-white/[0.06] bg-[#0d1019]/88 px-3 backdrop-blur-xl md:hidden">
      <button
        type="button"
        onClick={() => router.back()}
        className="grid size-10 flex-none place-items-center rounded-full text-gray-200 transition-colors hover:bg-white/[0.06]"
        aria-label={copy.backAriaLabel}
      >
        <ArrowLeft size={23} aria-hidden="true" />
      </button>
      <Link href="/" className="flex min-w-0 flex-1 items-center gap-2" aria-label={brand.name}>
        <Image src="/assets/logo.png" alt="" width={38} height={38} className="size-[2.375rem] object-contain" />
        <strong className="truncate text-lg text-white">
          {brand.name.slice(0, -3)}<span className="text-pink-400">{brand.name.slice(-3)}</span>
        </strong>
      </Link>
      <Link
        href="/tim-kiem"
        className="grid size-10 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gray-200"
        aria-label={copy.searchAriaLabel}
      >
        <Search size={19} aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={shareComic}
        className="grid size-10 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.04] text-gray-200"
        aria-label={copy.shareAriaLabel}
      >
        <Share2 size={19} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isFavorite}
        className={`grid size-10 flex-none place-items-center rounded-full transition-colors ${isFavorite ? "text-pink-400" : "text-gray-200 hover:text-pink-300"}`}
        aria-label={isFavorite ? copy.favorited : copy.favorite}
      >
        <Heart size={22} className={isFavorite ? "fill-current" : ""} aria-hidden="true" />
      </button>
    </header>
  );
}
