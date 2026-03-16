"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { OfflineManager } from "@/lib/offline-manager";
import ReadingProgress from "@/components/chapter/ReadingProgress";

export default function OfflineReaderClient({ slug, chapterId }: { slug: string; chapterId: string }) {
  interface SavedComic {
    title: string;
    slug: string;
    thumb_url: string;
    chapters: { server_name: string; server_data: import('@/types/common').Chapter[] }[];
    savedAt: number;
  }

  interface SavedChapter {
    id: string;
    comicSlug: string;
    chapterName: string;
    images: string[];
    savedAt: number;
  }

  const [comic, setComic] = useState<SavedComic | null>(null);
  const [chapterData, setChapterData] = useState<SavedChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const comicData = await OfflineManager.getComic(slug);
        setComic(comicData as SavedComic);

        const chapters = await OfflineManager.getSavedChapters(slug);
        const targetChapter = chapters.find((c) => c.id === chapterId);
        setChapterData(targetChapter as SavedChapter);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [slug, chapterId]);

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
        <p className="text-gray-400">Đang tải trữ liệu từ máy...</p>
      </div>
    );
  }

  if (!chapterData || !comic) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
        <p className="text-lg">Dữ liệu chương này không tồn tại hoặc đã bị xóa.</p>
        <Link href={`/offline/${slug}`} className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
          <ChevronLeft size={16} /> Quay lại danh sách chương
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
            Kho Offline
          </Link>
          <span>/</span>
          <Link href={`/offline/${slug}`} className="text-pink-400 hover:text-pink-300 transition-colors truncate max-w-[150px] md:max-w-xs">
            {comic.title}
          </Link>
          <span>/</span>
          <span className="text-white">Chapter {chapterData.chapterName}</span>
        </nav>

        {/* Note block */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300/80 p-3 rounded-xl mb-6 text-sm text-center">
          Bạn đang xem chương này ở chế độ Offline. Các tính năng tương tác như bình luận, theo dõi server bị vô hiệu hóa.
        </div>

        {/* Chapter images */}
        <div className="space-y-0 w-full bg-black min-h-screen">
          {chapterData.images.map((src: string, i: number) => (
            <div key={`${src}-${i}`} className="w-full relative mx-auto min-h-[40vh] flex items-center justify-center border-b border-gray-900">
              <Image
                src={src}
                alt={`Trang ${i + 1}`}
                width={800}
                height={1200}
                className="w-full h-auto object-contain md:object-cover max-w-4xl"
                loading="lazy"
                unoptimized
              />
            </div>
          ))}
        </div>
        
        {/* Simple Bottom Nav */}
        <div className="mt-8 flex justify-center">
            <Link 
              href={`/offline/${slug}`}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700"
            >
              Hoàn thành đọc chương
            </Link>
        </div>
      </div>
    </div>
  );
}
