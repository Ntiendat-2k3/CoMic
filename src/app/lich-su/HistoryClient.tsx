"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Trash2, BookOpen, RotateCcw, BookOpenCheck } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { clearHistory, removeEntry, selectAllHistory } from "@/store/slices/readingSlice"

// ── Lấy số chapter từ string ───────────────────────────────────────────────
function parseChapterNumber(name: string): number | null {
  const match = name.match(/(\d+(\.\d+)?)/)
  return match ? parseFloat(match[1]) : null
}

// ── Thanh tiến độ ──────────────────────────────────────────────────────────
function ReadingProgress({ chapterName }: { chapterName: string }) {
  const num = parseChapterNumber(chapterName)

  // Màu theo khoảng chapter
  const color =
    num == null    ? "from-gray-600 to-gray-500"
    : num < 30    ? "from-blue-500 to-cyan-400"
    : num < 100   ? "from-pink-500 to-fuchsia-400"
    :               "from-amber-500 to-yellow-400"

  // Log scale: ch.1 ≈ 9%, ch.50 ≈ 51%, ch.500 ≈ 100%
  const pct = num != null
    ? Math.min(100, Math.round((Math.log(num + 1) / Math.log(501)) * 100))
    : 0

  return (
    <div className="mt-2 space-y-1 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <BookOpen size={10} />
          Chapter {num ?? chapterName}
        </span>
        {num != null && (
          <span className="text-[10px] text-gray-500">{pct}%</span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-gray-700/60 overflow-hidden w-full">
        <div
          className={"h-full rounded-full bg-gradient-to-r " + color + " transition-all duration-500"}
          style={{ width: (pct || 4) + "%" }}
        />
      </div>
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex gap-4 bg-gray-800/40 rounded-2xl p-4 mb-3 animate-pulse">
      <div className="w-14 h-20 rounded-xl bg-gray-700/60 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-gray-700/60 rounded w-3/4" />
        <div className="h-3 bg-gray-700/40 rounded w-1/2" />
        <div className="h-1.5 bg-gray-700/30 rounded-full w-full mt-3" />
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function HistoryClient() {
  const dispatch = useAppDispatch()
  const history = useAppSelector(selectAllHistory)

  // Đợi client hydrate xong mới render — tránh mismatch server vs client
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-5 w-32 bg-gray-700/60 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-700/40 rounded animate-pulse" />
          </div>
        </div>
        {Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Clock size={20} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lịch sử đọc</h1>
            <p className="text-sm text-gray-400">{history.length} bộ truyện đã đọc</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => dispatch(clearHistory())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors"
          >
            <RotateCcw size={14} />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Empty */}
      {history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
          <Clock size={56} className="opacity-20" />
          <p className="text-lg">Chưa có lịch sử đọc</p>
          <Link href="/" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">
            Bắt đầu đọc ngay →
          </Link>
        </div>
      )}

      {/* List */}
      {history.length > 0 && (
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.slug}
              className="group flex items-center gap-4 bg-gray-800/60 border border-gray-700/50 rounded-2xl p-3 sm:p-4 hover:border-blue-500/30 transition-all duration-200"
            >
              {/* Thumbnail */}
              <Link href={`/truyen-tranh/${entry.slug}`} className="flex-shrink-0">
                <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-xl overflow-hidden bg-gray-700/50">
                  <Image
                    src={entry.thumbUrl}
                    alt={entry.comicName}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </Link>

              {/* Info + Progress */}
              <div className="flex-1 min-w-0">
                <Link href={`/truyen-tranh/${entry.slug}`}>
                  <h3 className="font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {entry.comicName}
                  </h3>
                </Link>
                <p className="text-xs text-gray-600 mt-0.5">
                  {new Date(entry.readAt).toLocaleString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                {/* ── Thanh tiến độ ── */}
                <ReadingProgress chapterName={entry.chapterName} />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                <Link
                  href={`/truyen-tranh/${entry.slug}/${entry.chapterName}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/15 border border-blue-500/25 rounded-lg hover:bg-blue-500/25 transition-colors whitespace-nowrap"
                >
                  <BookOpenCheck size={13} />
                  Đọc tiếp
                </Link>
                <button
                  onClick={() => dispatch(removeEntry(entry.slug))}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Xóa khỏi lịch sử"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
