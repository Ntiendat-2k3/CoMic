"use client"

import Link from "next/link"
import { memo, useState, useCallback, useEffect } from "react"
import type { Comic } from "../types/comic"
import ImageFallback from "../utils/ImageFallback"

interface ComicCardProps {
  comic: Comic
  baseImageUrl: string
  priority?: boolean
}

const ComicCard = memo(({ comic, baseImageUrl, priority = false }: ComicCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isCurrentlyReading, setIsCurrentlyReading] = useState(false)
  const [lastReadChapter, setLastReadChapter] = useState<string | null>(null)

  // Memoize random values để tránh re-calculate
  const isNew = Math.random() > 0.7
  const isHot = Math.random() > 0.8

  // Check if user is currently reading this comic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastRead = localStorage.getItem(`lastRead-${comic.slug}`)
      if (lastRead) {
        setIsCurrentlyReading(true)
        setLastReadChapter(lastRead)
      }
    }
  }, [comic.slug])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  // Calculate total chapters
  const totalChapters = comic.chapters?.[0]?.server_data?.length || 0

  // Calculate real progress based on reading status
  const calculateProgress = () => {
    if (!isCurrentlyReading || !lastReadChapter || totalChapters === 0) {
      return 0
    }

    const currentChapterNumber = Number.parseInt(lastReadChapter) || 0
    const progress = Math.round((currentChapterNumber / totalChapters) * 100)
    return Math.min(progress, 100) // Đảm bảo không vượt quá 100%
  }

  const actualProgress = calculateProgress()

  return (
    <div className="group relative h-full">
      {/* Simplified floating particles - chỉ hiển thị khi hover trên desktop */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400/40 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

      {/* Currently Reading Highlight */}
      {isCurrentlyReading && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-pulse">
            📖 Đang đọc
          </div>
        </div>
      )}

      {/* Main card với animation nhẹ hơn - chỉ hover trên desktop */}
      <div
        className={`relative h-full rounded-2xl overflow-hidden backdrop-blur-sm border transition-all duration-300 md:group-hover:shadow-lg md:group-hover:shadow-pink-500/10 md:group-hover:transform md:group-hover:scale-[1.01] ${
          isCurrentlyReading
            ? "bg-gradient-to-br from-green-800/30 to-gray-800/50 border-green-500/50 shadow-lg shadow-green-500/20"
            : "bg-gray-800/50 border-gray-700/50 md:group-hover:border-pink-500/30"
        }`}
      >
        <Link href={`/truyen-tranh/${comic.slug}`} className="block h-full flex flex-col">
          {/* Image Container */}
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-700/50 flex-shrink-0">
            {/* Skeleton loading */}
            {!imageLoaded && <div className="absolute inset-0 bg-gray-700/30 animate-pulse" />}

            <ImageFallback
              src={baseImageUrl || "/placeholder.svg"}
              alt={comic.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className={`object-cover transition-all duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"} md:group-hover:scale-105`}
              onLoad={handleImageLoad}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />

            {/* Gradient overlay - chỉ hiển thị khi hover trên desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badges - simplified */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {isHot && (
                <div className="bg-red-500/90 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                  🔥
                </div>
              )}
              {isNew && (
                <div className="bg-green-500/90 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                  ✨
                </div>
              )}
            </div>

            {/* Mobile Chapter Info */}
            <div className="absolute bottom-2 left-2 sm:hidden flex items-center gap-2">
              <div
                className={`backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border ${
                  isCurrentlyReading
                    ? "bg-green-600/80 text-white border-green-400/50"
                    : "bg-black/60 text-white border-pink-400/30"
                }`}
              >
                {isCurrentlyReading && lastReadChapter
                  ? `${lastReadChapter}/${totalChapters} (${actualProgress}%)`
                  : `${totalChapters} chương`}
              </div>

              {/* "Đang đọc" badge for mobile */}
              {isCurrentlyReading && (
                <div className="bg-yellow-400/90 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-yellow-300/50">
                  Đang đọc
                </div>
              )}
            </div>

            {/* Progress indicator - simplified */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
              <div
                className={`h-full transition-all duration-500 ${
                  isCurrentlyReading
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-pink-500 to-purple-500"
                }`}
                style={{ width: `${actualProgress}%` }}
              />
            </div>
          </div>

          {/* Content - simplified */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col">
            {/* Title - chỉ hover trên desktop */}
            <h3
              className={`font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight transition-colors duration-300 ${
                isCurrentlyReading
                  ? "text-green-300 md:group-hover:text-green-200"
                  : "text-white md:group-hover:text-pink-300"
              }`}
            >
              {comic.name}
            </h3>

            {/* Categories - desktop only */}
            <div className="hidden sm:flex flex-wrap gap-1 mb-2">
              {comic.category.slice(0, 2).map((cat, index) => (
                <span
                  key={cat.slug}
                  className={`px-2 py-1 text-xs rounded-full font-medium transition-colors duration-300 ${
                    index === 0
                      ? isCurrentlyReading
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                      : "bg-gray-700/50 text-gray-300"
                  }`}
                >
                  {cat.name}
                </span>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Bottom info */}
            <div className="space-y-2 mt-auto">
              {/* Latest Chapter */}
              {comic.chaptersLatest?.length && (
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <span
                      className={`w-1 h-1 rounded-full ${isCurrentlyReading ? "bg-green-400" : "bg-green-400"}`}
                    ></span>
                    <span className="hidden sm:inline">Chương mới:</span>
                    <span className="sm:hidden">Ch:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold px-2 py-1 rounded-full ${
                        isCurrentlyReading ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"
                      }`}
                    >
                      {comic.chaptersLatest[0].chapter_name}
                    </span>
                    {/* "Đang đọc" badge for desktop */}
                    {isCurrentlyReading && (
                      <span className="hidden sm:inline bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold border border-yellow-400/30">
                        Đang đọc
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Currently Reading Info - Mobile */}
              {isCurrentlyReading && lastReadChapter && (
                <div className="sm:hidden text-xs text-green-300 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                  📖 Đã đọc đến chương {lastReadChapter}
                </div>
              )}

              {/* Progress bar - desktop only */}
              <div className="hidden sm:block">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Tiến độ</span>
                  <span className={isCurrentlyReading ? "text-green-400" : "text-pink-400"}>{actualProgress}%</span>
                </div>
                <div className="bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCurrentlyReading
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-pink-500 to-purple-500"
                    }`}
                    style={{ width: `${actualProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
})

ComicCard.displayName = "ComicCard"

export default ComicCard
