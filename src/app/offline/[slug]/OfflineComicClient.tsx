"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Trash2, CheckCircle2 } from "lucide-react";
import { OfflineManager } from "@/lib/offline-manager";

export default function OfflineComicClient({ slug }: { slug: string }) {
  const [comic, setComic] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [slug]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const comicData = await OfflineManager.getComic(slug);
      setComic(comicData);

      const savedChapters = await OfflineManager.getSavedChapters(slug);
      // Sort chapters by api data (using their id is simple enough usually)
      setChapters(savedChapters);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const cdnUrl = "https://img.otruyenapi.com";

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
        <p>Truyện này không có trong kho tải xuống hoặc đã bị xóa.</p>
        <Link href="/offline" className="text-pink-400 hover:text-pink-300 mt-4 inline-block">
          Quay lại kho
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Link href="/offline" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ChevronLeft size={20} /> Quay lại Kho Tải Xuống
      </Link>

      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative w-40 md:w-56 aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-lg border border-gray-700/50">
          <Image
            src={comic.thumb_url.includes("http") ? comic.thumb_url : `${cdnUrl}/uploads/comics/${comic.thumb_url}`}
            alt={comic.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{comic.title}</h1>
          <p className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded w-fit mb-4 mt-2 font-medium">
            Đã lưu ngoại tuyến
          </p>
          <div className="text-gray-400 text-sm space-y-2 mt-auto">
            <p>Số chương đã tải: <strong className="text-white">{chapters.length}</strong></p>
            <p>Lưu ngày: {new Date(comic.savedAt).toLocaleDateString("vi-VN")}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Các chương đã Tải ({chapters.length})</h2>
      {chapters.length === 0 ? (
        <div className="text-gray-400 italic p-6 border border-dashed border-gray-700 rounded-xl text-center">
          Bạn mới chỉ lưu thông tin truyện, chưa tải xuống chương nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chapters.map((chap) => (
            <Link
              key={chap.id}
              href={`/offline/${slug}/${chap.id}`}
              className="flex items-center justify-between p-4 glass-panel rounded-xl hover:border-pink-500/50 transition-colors"
            >
              <div>
                <span className="text-white font-medium block">Chapter {chap.chapterName}</span>
                <span className="text-xs text-gray-500 mt-1 block">Tải về: {new Date(chap.savedAt).toLocaleString("vi-VN")}</span>
              </div>
              <CheckCircle2 size={20} className="text-green-500 opacity-80" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
