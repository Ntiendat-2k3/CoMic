"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { useLocalComicList } from "@/app/hooks/useLocalComicList";
import { Comic } from "@/app/types/comic";

interface FollowItem {
  slug: string;
  comic: Comic;
  lastRead?: string;
}

export default function FollowContent() {
  const { isSignedIn } = useUser();
  const [rawItems, loading] = useLocalComicList<string>("follow-");
  const [items, setItems] = useState<FollowItem[]>([]);

  // Chuyển rawItems (slug + meta) thành danh sách FollowItem, chỉ lấy những mục meta === "true"
  useEffect(() => {
    if (!loading) {
      const follows = rawItems
        .filter((it) => it.meta === "true")
        .map((it) => ({
          slug: it.slug,
          comic: it.comic,
          lastRead: localStorage.getItem(`lastRead-${it.slug}`) || undefined,
        }));
      setItems(follows);
    }
  }, [rawItems, loading]);

  // Bỏ theo dõi ngay lập tức
  const handleUnfollow = (slug: string) => {
    localStorage.setItem(`follow-${slug}`, "false");
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  };

  if (!isSignedIn) {
    return (
      <div className="p-6 text-center text-lg text-white">
        Vui lòng đăng nhập để xem truyện theo dõi.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-white/70">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold">Truyện theo dõi</span>
      </nav>

      <h1 className="mb-6 text-xl lg:text-2xl font-bold text-white">
        Truyện bạn theo dõi
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/70">
          Bạn chưa theo dõi truyện nào.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {items.map(({ slug, comic, lastRead }) => {
            const imgSrc = `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`;
            return (
              <li
                key={slug}
                className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow"
              >
                {/* Nút Bỏ theo dõi */}
                <button
                  onClick={() => handleUnfollow(slug)}
                  className="absolute right-2 top-2 z-10 rounded-full bg-gray-700 p-1 text-red-400 hover:bg-gray-600"
                >
                  <Trash2 size={16} />
                </button>

                <Link href={`/truyen-tranh/${slug}`} className="block">
                  <img
                    src={imgSrc}
                    alt={comic.name}
                    className="h-48 w-full object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="truncate text-lg font-semibold text-white">
                    {comic.name}
                  </h2>
                  {comic.category?.length > 0 && (
                    <p className="mt-1 text-sm text-white/70">
                      {comic.category.map((c) => c.name).join(", ")}
                    </p>
                  )}
                  {lastRead && (
                    <p className="mt-1 text-sm text-yellow-300">
                      Đã đọc đến chap {lastRead}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
