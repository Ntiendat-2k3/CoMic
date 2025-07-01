"use client"

import Link from "next/link"
import type { Comic } from "../types/comic"
import ImageFallback from "../utils/ImageFallback"

interface ComicCardProps {
  comic: Comic
  baseImageUrl: string
}

export default function ComicCard({ comic, baseImageUrl }: ComicCardProps) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden group relative h-full flex flex-col">
      <Link href={`/truyen-tranh/${comic.slug}`}>
        {/* Image Container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <ImageFallback
            src={baseImageUrl || "/placeholder.svg"}
            alt={comic.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Glass Overlay on Hover */}
          <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-light" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div className="glass-button px-4 py-2 rounded-full text-sm font-semibold glow-pink">
              <span className="gradient-text">✨ Mới</span>
            </div>
          </div>

          {/* Reading Progress Indicator */}
          <div className="absolute top-4 left-4">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-400 animate-pulse glow-pink"></div>
          </div>
        </div>

        {/* Content - Flexible area */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-glass font-bold text-xl mb-4 line-clamp-2 group-hover:gradient-text transition-all duration-300 flex-shrink-0">
            {comic.name}
          </h3>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
            {comic.category.slice(0, 3).map((cat, index) => (
              <span
                key={cat.slug}
                className={`glass-button px-4 py-2 text-sm rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                  index === 0 ? "border-pink-glow/50" : index === 1 ? "border-pink-400/30" : "border-pink-300/20"
                }`}
              >
                {cat.name}
              </span>
            ))}
          </div>

          {/* Spacer to push bottom content down */}
          <div className="flex-1"></div>

          {/* Fixed Bottom Content */}
          <div className="space-y-4 mt-auto">
            {/* Latest Chapter - Always at bottom */}
            {comic.chaptersLatest?.length && (
              <div className="flex items-center justify-between p-3 glass-dark rounded-2xl">
                <span className="text-glass-muted text-sm font-medium">Chương mới nhất:</span>
                <span className="glass-button px-4 py-2 rounded-full text-sm font-bold gradient-text">
                  {comic.chaptersLatest[0].chapter_name}
                </span>
              </div>
            )}

            {/* Reading Progress Bar - Always at bottom */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-glass-muted">
                <span>Tiến độ đọc</span>
                <span>{Math.floor(Math.random() * 100)}%</span>
              </div>
              <div className="glass rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-700 group-hover:from-pink-400 group-hover:to-pink-300 glow-pink"
                  style={{ width: `${Math.random() * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 floating glow-pink" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 floating-delayed glow-pink" />

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pink-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-br-3xl"></div>
      </Link>
    </div>
  )
}
