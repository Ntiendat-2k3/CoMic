"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ReadingProgress from "@/components/chapter/ReadingProgress";
import { useOfflineReaderController } from "@/features/offline/hooks/useOfflineReaderController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";

export default function OfflineReaderClient({ slug, chapterId }: { slug: string; chapterId: string }) {
  const { comic, chapter: chapterData, isLoading } = useOfflineReaderController(
    slug,
    chapterId,
  );
  const { common, navigation, offline } = useDictionary();

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        <p className="text-gray-400">{offline.loadingLocalData}</p>
      </div>
    );
  }

  if (!chapterData || !comic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
        <p className="text-lg">{offline.missingChapter}</p>
        <Link href={`/offline/${slug}`} className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
          <ChevronLeft size={16} /> {offline.backToChapters}
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <ReadingProgress />
      
      <div className="max-w-4xl mx-auto lg:px-4 lg:py-6 relative z-10">
        <nav className="text-sm text-white/60 p-4 lg:p-0 mb-4 flex items-center gap-1 flex-wrap sticky top-16 bg-[#0f111a]/80 backdrop-blur z-20 py-3 rounded-b-xl border-b border-gray-800 lg:static lg:bg-transparent lg:border-none lg:backdrop-filter-none">
          <Link href="/offline" className="hover:text-white transition-colors">
            {navigation.offlineLibrary}
          </Link>
          <span>/</span>
          <Link href={`/offline/${slug}`} className="text-pink-400 hover:text-pink-300 transition-colors truncate max-w-[150px] md:max-w-xs">
            {comic.title}
          </Link>
          <span>/</span>
          <span className="text-white">
            {formatMessage(common.chapter, { chapter: chapterData.chapterName })}
          </span>
        </nav>

        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300/80 p-3 rounded-xl mb-6 text-sm text-center">
          {offline.readerNotice}
        </div>

        <div className="space-y-0 w-full bg-black min-h-screen">
          {chapterData.images.map((src: string, i: number) => (
            <div key={`${src}-${i}`} className="w-full relative mx-auto min-h-[40vh] flex items-center justify-center border-b border-gray-900">
              <Image
                src={src}
                alt={formatMessage(common.pageImageAlt, { page: i + 1 })}
                width={800}
                height={1200}
                className="w-full h-auto object-contain md:object-cover max-w-4xl"
                loading="lazy"
                unoptimized
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
            <Link 
              href={`/offline/${slug}`}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700"
            >
              {offline.finishChapter}
            </Link>
        </div>
      </div>
    </div>
  );
}
