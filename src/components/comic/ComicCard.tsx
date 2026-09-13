"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useState } from "react";
import { BookOpen } from "lucide-react";
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
  const { common, comic: copy } = useDictionary();
  const { lastRead, isReading, progress } = useComicCardController(comic);

  const thumbSrc = resolveCoverUrl(comic.thumb_url, cdnUrl);

  return (
    <Link
      href={`/truyen-tranh/${comic.slug}`}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-200
        md:hover:scale-[1.02] md:hover:shadow-lg md:hover:shadow-pink-500/10
        ${isReading
          ? "bg-gray-800/60 border-green-500/40 shadow-green-500/10 shadow-md"
          : "bg-gray-800/50 border-gray-700/50 md:hover:border-pink-500/30"
        }`}
    >
      {/* Nhãn đang đọc */}
      {isReading && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          <BookOpen size={10} />
          {copy.reading}
        </div>
      )}

      {/* Ảnh bìa */}
      <div className="relative aspect-[3/4] w-full bg-gray-700/50 overflow-hidden flex-shrink-0">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-700/40" />
        )}
        <Image
          src={thumbSrc}
          alt={comic.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`object-cover transition-all duration-300 md:group-hover:scale-105
            ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={80} // Thêm chất lượng 80 để cân bằng nét và nhẹ
        />

        {/* Nhãn chương mới nhất */}
        {comic.chaptersLatest?.[0]?.chapter_name && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
            {formatMessage(common.shortChapter, {
              chapter: comic.chaptersLatest[0].chapter_name,
            })}
          </div>
        )}

        {/* Thanh tiến độ */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800/50">
          <div
            className={`h-full transition-all duration-500
              ${isReading
                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                : "bg-gradient-to-r from-pink-500 to-purple-500"
              }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Thông tin */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className={`font-semibold text-sm leading-tight line-clamp-2 transition-colors duration-200
          ${isReading
            ? "text-green-300 md:group-hover:text-green-200"
            : "text-white md:group-hover:text-pink-300"
          }`}
        >
          {comic.name}
        </h3>

        {/* Thể loại chỉ hiển thị trên màn hình lớn */}
        <div className="hidden sm:flex flex-wrap gap-1 mt-1">
          {comic.category.slice(0, 2).map((cat) => (
            <span
              key={cat.slug}
              className="px-1.5 py-0.5 text-[10px] rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/20"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Nội dung tiến độ */}
        {isReading && lastRead && (
          <p className="text-[10px] text-green-400 mt-auto">
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
