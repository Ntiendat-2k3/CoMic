"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useOfflineComicController } from "@/features/offline/hooks/useOfflineComicController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";

export default function OfflineComicClient({ slug }: { slug: string }) {
  const { comic, chapters, isLoading } = useOfflineComicController(slug);
  const { locale, common, offline } = useDictionary();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>{offline.missingComic}</p>
        <Link href="/offline" className="text-pink-400 hover:text-pink-300 mt-4 inline-block">
          {offline.backToLibraryShort}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Link href="/offline" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ChevronLeft size={20} /> {offline.backToLibrary}
      </Link>

      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative w-40 md:w-56 aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-lg border border-gray-700/50">
          <Image
            src={resolveCoverUrl(comic.thumb_url, "https://img.otruyenapi.com")}
            alt={comic.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{comic.title}</h1>
          <p className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded w-fit mb-4 mt-2 font-medium">
            {offline.savedOffline}
          </p>
          <div className="text-gray-400 text-sm space-y-2 mt-auto">
            <p>{formatMessage(offline.downloadedChapterCount, { count: chapters.length })}</p>
            <p>{formatMessage(offline.savedDate, {
              date: new Date(comic.savedAt).toLocaleDateString(locale),
            })}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">
        {formatMessage(offline.downloadedChaptersHeading, { count: chapters.length })}
      </h2>
      {chapters.length === 0 ? (
        <div className="text-gray-400 italic p-6 border border-dashed border-gray-700 rounded-xl text-center">
          {offline.noDownloadedChapters}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chapters.map((chap) => (
            <Link
              key={chap.id}
              href={`/offline/${slug}/${chap.id}`}
              className="flex items-center justify-between p-4 glass rounded-xl hover:border-pink-500/50 transition-colors"
            >
              <div>
                <span className="text-white font-medium block">
                  {formatMessage(common.chapter, { chapter: chap.chapterName })}
                </span>
                <span className="text-xs text-gray-500 mt-1 block">
                  {formatMessage(offline.downloadedAt, {
                    date: new Date(chap.savedAt).toLocaleString(locale),
                  })}
                </span>
              </div>
              <CheckCircle2 size={20} className="text-green-500 opacity-80" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
