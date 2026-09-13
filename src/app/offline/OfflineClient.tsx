"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Trash2, LibraryIcon } from "lucide-react";
import { useOfflineLibraryController } from "@/features/offline/hooks/useOfflineLibraryController";
import { useDictionary } from "@/i18n/I18nProvider";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";

export default function OfflineClient() {
  const { offline } = useDictionary();
  const { comics, isLoading, removeComic } = useOfflineLibraryController(
    offline.removeConfirm,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (comics.length === 0) {
    return (
      <div className="text-center py-20 px-4 glass-panel rounded-2xl">
        <LibraryIcon size={64} className="mx-auto mb-6 text-gray-600" />
        <h3 className="text-xl font-bold text-gray-300 mb-2">{offline.emptyTitle}</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          {offline.emptyDescription}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-medium rounded-xl transition-colors"
        >
          {offline.explore}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
      {comics.map((comic) => (
        <div
          key={comic.slug}
          className="group relative flex flex-col bg-gray-800/40 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-pink-500/50 hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-1"
        >
          <Link href={`/offline/${comic.slug}`} className="relative block aspect-[3/4] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
            
            <Image
              src={resolveCoverUrl(comic.thumb_url, "https://img.otruyenapi.com")}
              alt={comic.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />

            <div className="absolute top-2 left-2 z-20">
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-pink-500/90 rounded-md shadow-sm backdrop-blur-md">
                {offline.savedBadge}
              </span>
            </div>
            
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.preventDefault(); removeComic(comic.slug); }}
                className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur hover:scale-110 transition-all"
                title={offline.removeTitle}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </Link>

          <Link href={`/offline/${comic.slug}`} className="p-3 flex flex-col flex-1 justify-between z-20">
            <div>
              <h3 className="text-sm font-bold text-gray-200 line-clamp-2 group-hover:text-pink-400 transition-colors mb-1" title={comic.title}>
                {comic.title}
              </h3>
            </div>

            <div className="flex items-center gap-3 mt-3 justify-between">
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                <BookOpen size={12} /> {offline.ready}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
