"use client"

import Link from "next/link"
import { memo, useState, useCallback, useRef, useEffect } from "react"
import type { Comic } from "../types/comic"
import { ImageOptimizer, PerformanceOptimizer } from "../lib/performance-optimizer"

interface OptimizedComicCardProps {
  comic: Comic
  baseImageUrl: string
  priority?: boolean
  index: number
}

const OptimizedComicCard = memo(({ comic, baseImageUrl, priority = false, index }: OptimizedComicCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // Memoize static values to prevent recalculation
  const staticValues = useRef({
    randomProgress: Math.floor(Math.random() * 100),
    isNew: Math.random() > 0.7,
    isHot: Math.random() > 0.8,
  }).current

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!cardRef.current) return

    const observer = PerformanceOptimizer.getInstance().createLazyLoader(0.1)
    if (observer) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (observer && cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  // Optimized image loading
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    setIsVisible(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageLoaded(true) // Still set loaded to remove skeleton
  }, [])

  // Prefetch on hover (desktop only)
  const handleMouseEnter = useCallback(() => {
    if (window.innerWidth >= 768) {
      PerformanceOptimizer.getInstance().smartPrefetch(`/truyen-tranh/${comic.slug}`, "low")
    }
  }, [comic.slug])

  // Generate optimized image URLs
  const optimizedImageUrl = ImageOptimizer.getOptimizedUrl(baseImageUrl, 300, 80)
  const srcSet = ImageOptimizer.generateSrcSet(baseImageUrl, [150, 300, 450])

  return (
    <div
      ref={cardRef}
      className="group relative h-full"
      onMouseEnter={handleMouseEnter}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "300px 400px",
      }}
    >
      {/* Optimized floating particles */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400/40 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 will-change-opacity" />

      {/* Main card with GPU acceleration */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 md:group-hover:border-pink-500/30 transition-all duration-300 md:group-hover:shadow-lg md:group-hover:shadow-pink-500/10 will-change-transform">
        <Link href={`/truyen-tranh/${comic.slug}`} className="block h-full flex flex-col" prefetch={false}>
          {/* Optimized Image Container */}
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-700/50 flex-shrink-0">
            {/* Skeleton loading with reduced animation */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700/30">
                <div className="w-full h-full bg-gradient-to-r from-gray-700/20 via-gray-600/30 to-gray-700/20 animate-pulse" />
              </div>
            )}

            {/* Optimized Image with lazy loading */}
            <img
              ref={imgRef}
              src={priority ? optimizedImageUrl : undefined}
              data-src={!priority ? optimizedImageUrl : undefined}
              srcSet={priority ? srcSet : undefined}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              alt={comic.name}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-all duration-300 will-change-transform ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } md:group-hover:scale-105 ${!priority ? "lazy-loading" : ""}`}
              style={{
                transform: "translateZ(0)", // Force GPU acceleration
              }}
            />

            {/* Optimized gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 will-change-opacity" />

            {/* Status Badges - only render if needed */}
            {(staticValues.isHot || staticValues.isNew) && (
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {staticValues.isHot && (
                  <div className="bg-red-500/90 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                    🔥
                  </div>
                )}
                {staticValues.isNew && (
                  <div className="bg-green-500/90 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
                    ✨
                  </div>
                )}
              </div>
            )}

            {/* Chapter count - mobile only */}
            <div className="absolute bottom-2 left-2 sm:hidden">
              <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white font-medium border border-pink-400/30">
                {comic.chaptersLatest?.[0]?.chapter_name ? `Ch.${comic.chaptersLatest[0].chapter_name}` : "Mới"}
              </div>
            </div>

            {/* Simplified progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 will-change-transform"
                style={{
                  width: `${staticValues.randomProgress}%`,
                  transform: "translateZ(0)",
                }}
              />
            </div>
          </div>

          {/* Optimized Content */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col">
            {/* Title with text optimization */}
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight md:group-hover:text-pink-300 transition-colors duration-300 will-change-color">
              {comic.name}
            </h3>

            {/* Categories - desktop only, memoized */}
            <div className="hidden sm:flex flex-wrap gap-1 mb-2">
              {comic.category.slice(0, 2).map((cat, catIndex) => (
                <span
                  key={cat.slug}
                  className={`px-2 py-1 text-xs rounded-full font-medium transition-colors duration-300 ${
                    catIndex === 0
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

            {/* Bottom info - optimized */}
            <div className="space-y-2 mt-auto">
              {/* Latest Chapter */}
              {comic.chaptersLatest?.length > 0 && (
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
                  <span className="text-pink-400">{staticValues.randomProgress}%</span>
                </div>
                <div className="bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 will-change-transform"
                    style={{
                      width: `${staticValues.randomProgress}%`,
                      transform: "translateZ(0)",
                    }}
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

OptimizedComicCard.displayName = "OptimizedComicCard"

export default OptimizedComicCard
