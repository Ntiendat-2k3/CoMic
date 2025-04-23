"use client";

import Link from "next/link";
import { Comic } from "../types/comic";
import ImageFallback from "../utils/ImageFallback";

interface ComicCardProps {
  comic: Comic;
  baseImageUrl: string;
}

export default function ComicCard({ comic, baseImageUrl }: ComicCardProps) {  
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl">
      <Link href={`/truyen-tranh/${comic.slug}`}>
        {/* tỉ lệ 3:4 trên mobile */}
        <div className="relative w-full aspect-[3/4]">
          <ImageFallback
            src={baseImageUrl}
            alt={comic.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
          />
        </div>

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="truncate font-bold text-lg sm:text-xl">{comic.name}</h3>

          <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
            {comic.category.map((cat) => (
              <span
                key={cat.slug}
                className="rounded-full bg-primary/80 px-2 py-0.5 text-[11px] sm:text-[15px]"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {comic.chaptersLatest?.length && (
            <div className="mt-1 text-xs sm:text-sm">
              Chapter {comic.chaptersLatest[0].chapter_name}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
