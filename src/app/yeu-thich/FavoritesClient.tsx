"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Trash2, BookOpen, BookOpenCheck } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { removeFavorite, selectAllFavorites } from "@/store/slices/favoritesSlice"
import { selectLastRead } from "@/store/slices/readingSlice"

// ── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-700/60 w-full" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-700/60 rounded w-full" />
        <div className="h-3 bg-gray-700/40 rounded w-2/3" />
        <div className="h-1.5 bg-gray-700/30 rounded-full w-full mt-3" />
        <div className="h-6 bg-gray-700/30 rounded-lg w-full mt-1" />
      </div>
    </div>
  )
}

// ── Lấy số chapter từ string ───────────────────────────────────────────────
function parseChapterNumber(name: string): number | null {
  const match = name.match(/(\d+(\.\d+)?)/)
  return match ? parseFloat(match[1]) : null
}

// ── Progress bar ───────────────────────────────────────────────────────────
function ReadingProgress({ chapterName }: { chapterName: string }) {
  const num = parseChapterNumber(chapterName)

  const color =
    num == null ? "from-gray-600 to-gray-500"
    : num < 30  ? "from-blue-500 to-cyan-400"
    : num < 100 ? "from-pink-500 to-fuchsia-400"
    :              "from-amber-500 to-yellow-400"

  // Log scale: ch.1 ~ 9%, ch.50 ~ 51%, ch.500 ~ 100%
  const pct = num != null
    ? Math.min(100, Math.round((Math.log(num + 1) / Math.log(501)) * 100))
    : 0

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <BookOpen size={10} />
          {num != null ? "Chapter " + num : chapterName}
        </span>
        {num != null && (
          <span className="text-[10px] text-gray-600">{pct}%</span>
        )}
      </div>
      <div className="h-1 rounded-full bg-gray-700/60 overflow-hidden">
        <div
          className={"h-full rounded-full bg-gradient-to-r " + color + " transition-all duration-500"}
          style={{ width: (pct || 6) + "%" }}
        />
      </div>
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────
function FavoriteCard({ item }: { item: ReturnType<typeof selectAllFavorites>[0] }) {
  const dispatch = useAppDispatch()
  const lastRead = useAppSelector(selectLastRead(item.slug))

  return (
    <div className="group relative flex flex-col bg-gray-800/60 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-200">
      {/* Bỏ yêu thích */}
      <button
        onClick={() => dispatch(removeFavorite(item.slug))}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-gray-900/80 text-gray-400 hover:text-red-400 hover:bg-gray-900 transition-colors opacity-0 group-hover:opacity-100"
        title="Bỏ yêu thích"
      >
        <Trash2 size={14} />
      </button>

      {/* Thumbnail */}
      <Link href={"/truyen-tranh/" + item.slug} className="block flex-shrink-0">
        <div className="relative aspect-[3/4] w-full bg-gray-700/50">
          <Image
            src={item.cdnUrl + "/uploads/comics/" + item.thumbUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {/* Gradient overlay đáy ảnh khi đã có tiến độ */}
          {lastRead && (
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={"/truyen-tranh/" + item.slug}>
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-pink-300 transition-colors leading-snug">
            {item.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2">
          {lastRead ? (
            <>
              <ReadingProgress chapterName={lastRead.chapterName} />
              <Link
                href={"/truyen-tranh/" + item.slug + "/" + lastRead.chapterName}
                className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium text-pink-200 bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/35 transition-colors"
              >
                <BookOpenCheck size={12} />
                Đọc tiếp
              </Link>
            </>
          ) : (
            <Link
              href={"/truyen-tranh/" + item.slug}
              className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-gray-700/50 border border-gray-600/40 hover:bg-gray-700 transition-colors"
            >
              <BookOpen size={12} />
              Bắt đầu đọc
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function FavoritesClient() {
  const favorites = useAppSelector(selectAllFavorites)

  // Đợi hydrate xong mới render dữ liệu từ Redux/localStorage
  // → tránh mismatch server (0 items) vs client (n items)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
          <Heart size={20} className="text-pink-400 fill-pink-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Truyện yêu thích</h1>
          <p className="text-sm text-gray-400">
            {mounted ? favorites.length + " bộ truyện" : "Đang tải..."}
          </p>
        </div>
      </div>

      {/* Skeleton khi chưa mount */}
      {!mounted && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {mounted && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
          <Heart size={56} className="opacity-20" />
          <p className="text-lg">Chưa có truyện yêu thích nào</p>
          <Link href="/" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">
            Khám phá truyện ngay →
          </Link>
        </div>
      )}

      {/* Grid */}
      {mounted && favorites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {favorites.map((item) => (
            <FavoriteCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
