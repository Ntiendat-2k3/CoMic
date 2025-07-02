"use client"

import Link from "next/link"
import { memo, useState, useCallback } from "react"
import type { Comic } from "../types/comic"
import ImageFallback from "../utils/ImageFallback"

interface ComicCardProps {
  comic: Comic
  baseImageUrl: string
  priority?: boolean
}

const ComicCard = memo(({ comic, baseImageUrl, priority = false }: ComicCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Memoize random values để tránh re-calculate
  const randomProgress = Math.floor(Math.random() * 100)
  const isNew = Math.random() > 0.7
  const isHot = Math.random() > 0.8

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  return (
    <div className="group relative h-full">
      {/* Simplified floating particles - chỉ hiển thị khi hover trên desktop */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400/40 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main card với animation nhẹ hơn - chỉ hover trên desktop */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 md:group-hover:border-pink-500/30 transition-all duration-300 md:group-hover:shadow-lg md:group-hover:shadow-pink-500/10 md:group-hover:transform md:group-hover:scale-[1.01]">
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

            {/* Chapter count - mobile only */}
            <div className="absolute bottom-2 left-2 sm:hidden">
              <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white font-medium border border-pink-400/30">
                {comic.chaptersLatest?.[0]?.chapter_name ? `Ch.${comic.chaptersLatest[0].chapter_name}` : "Mới"}
              </div>
            </div>

            {/* Progress indicator - simplified */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                style={{ width: `${randomProgress}%` }}
              />
            </div>
          </div>

          {/* Content - simplified */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col">
            {/* Title - chỉ hover trên desktop */}
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight md:group-hover:text-pink-300 transition-colors duration-300">
              {comic.name}
            </h3>

            {/* Categories - desktop only */}
            <div className="hidden sm:flex flex-wrap gap-1 mb-2">
              {comic.category.slice(0, 2).map((cat, index) => (
                <span
                  key={cat.slug}
                  className={`px-2 py-1 text-xs rounded-full font-medium transition-colors duration-300 ${
                    index === 0
                      ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
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
                    <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                    <span className="hidden sm:inline">Chương mới:</span>
                    <span className="sm:hidden">Ch:</span>
                  </span>
                  <span className="text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded-full">
                    {comic.chaptersLatest[0].chapter_name}
                  </span>
                </div>
              )}

              {/* Progress bar - desktop only */}
              <div className="hidden sm:block">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Tiến độ</span>
                  <span className="text-pink-400">{randomProgress}%</span>
                </div>
                <div className="bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${randomProgress}%` }}
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
