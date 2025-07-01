"use client"

import Link from "next/link"
import type { Comic } from "../types/comic"
import ImageFallback from "../utils/ImageFallback"

interface ComicCardProps {
  comic: Comic
  baseImageUrl: string
}

export default function ComicCard({ comic, baseImageUrl }: ComicCardProps) {
  const randomProgress = Math.floor(Math.random() * 100)
  const isNew = Math.random() > 0.7 // 30% chance of being "new"
  const isHot = Math.random() > 0.8 // 20% chance of being "hot"

  return (
    <div className="group relative h-full">
      {/* Floating particles */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-pink-400/60 to-purple-400/60 rounded-full floating opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full floating-delayed opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Main card with gradient border */}
      <div
        className="relative h-full rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
                      group-hover:border-pink-500/50 transition-all duration-500 ease-out
                      group-hover:shadow-lg group-hover:shadow-pink-500/20
                      group-hover:transform group-hover:scale-[1.02] group-hover:-translate-y-1"
      >
        {/* Gradient border glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-sm -z-10"
        />

        <Link href={`/truyen-tranh/${comic.slug}`} className="block h-full flex flex-col">
          {/* Image Container with enhanced effects */}
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-700/50 flex-shrink-0">
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"
            />

            <ImageFallback
              src={baseImageUrl || "/placeholder.svg"}
              alt={comic.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Enhanced Status Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {isHot && (
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 rounded-full text-xs font-bold text-white
                               shadow-lg shadow-red-500/30 animate-pulse"
                >
                  🔥 HOT
                </div>
              )}
              {isNew && (
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 rounded-full text-xs font-bold text-white
                               shadow-lg shadow-green-500/30 glow-green"
                >
                  ✨ MỚI
                </div>
              )}
            </div>

            {/* Chapter count - Enhanced mobile display */}
            <div className="absolute bottom-3 left-3 sm:hidden">
              <div
                className="glass-dark px-3 py-1 rounded-full text-xs text-white font-medium
                             border border-pink-400/30 shadow-lg"
              >
                {comic.chaptersLatest?.[0]?.chapter_name ? `Ch.${comic.chaptersLatest[0].chapter_name}` : "Mới"}
              </div>
            </div>

            {/* Reading progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-700 ease-out"
                style={{ width: `${randomProgress}%` }}
              />
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-b-2xl" />

            {/* Title with gradient on hover */}
            <h3
              className="relative text-white font-semibold text-sm sm:text-base mb-3 line-clamp-2 leading-tight
                          group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400
                          group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
            >
              {comic.name}
            </h3>

            {/* Enhanced Categories */}
            <div className="hidden sm:flex flex-wrap gap-1 mb-3 relative">
              {comic.category.slice(0, 2).map((cat, index) => (
                <span
                  key={cat.slug}
                  className={`px-2 py-1 text-xs rounded-full font-medium transition-all duration-300
                            ${
                              index === 0
                                ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30"
                                : "bg-gray-700/50 text-gray-300 border border-gray-600/50"
                            }
                            group-hover:scale-105 group-hover:shadow-sm`}
                >
                  {cat.name}
                </span>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Enhanced Bottom info */}
            <div className="space-y-3 mt-auto relative">
              {/* Latest Chapter with icon */}
              {comic.chaptersLatest?.length && (
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="hidden sm:inline">Chương mới nhất:</span>
                    <span className="sm:hidden">Ch:</span>
                  </span>
                  <span className="text-blue-400 font-semibold bg-blue-400/10 px-2 py-1 rounded-full border border-blue-400/20">
                    {comic.chaptersLatest[0].chapter_name}
                  </span>
                </div>
              )}

              {/* Enhanced Progress bar - Desktop only */}
              <div className="hidden sm:block">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                    Tiến độ
                  </span>
                  <span className="font-medium text-pink-400">{randomProgress}%</span>
                </div>
                <div className="relative bg-gray-700/50 rounded-full h-2 overflow-hidden border border-gray-600/50">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full"></div>
                  {/* Progress bar with animation */}
                  <div
                    className="relative h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-700 ease-out
                              shadow-sm shadow-pink-500/50 group-hover:shadow-pink-500/70"
                    style={{ width: `${randomProgress}%` }}
                  >
                    {/* Shine effect */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
