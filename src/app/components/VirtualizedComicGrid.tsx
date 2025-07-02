"use client"

import type React from "react"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import type { Comic } from "@/app/types/comic"
import OptimizedComicCard from "./OptimizedComicCard"

interface VirtualizedComicGridProps {
  comics: Comic[]
  itemsPerRow?: number
  itemHeight?: number
  containerHeight?: number
}

const VirtualizedComicGrid = memo(
  ({ comics, itemsPerRow = 4, itemHeight = 400, containerHeight = 600 }: VirtualizedComicGridProps) => {
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
    const [scrollTop, setScrollTop] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollingRef = useRef(false)

    // Calculate visible items based on scroll position
    const calculateVisibleRange = useCallback(
      (scrollTop: number) => {
        const rowHeight = itemHeight + 24 // Include gap
        const startRow = Math.floor(scrollTop / rowHeight)
        const endRow = Math.min(
          startRow + Math.ceil(containerHeight / rowHeight) + 2, // Buffer rows
          Math.ceil(comics.length / itemsPerRow),
        )

        return {
          start: Math.max(0, startRow * itemsPerRow),
          end: Math.min(endRow * itemsPerRow, comics.length),
        }
      },
      [comics.length, itemsPerRow, itemHeight, containerHeight],
    )

    // Optimized scroll handler with RAF
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop
        setScrollTop(scrollTop)

        if (!scrollingRef.current) {
          scrollingRef.current = true
          requestAnimationFrame(() => {
            const newRange = calculateVisibleRange(scrollTop)
            setVisibleRange(newRange)
            scrollingRef.current = false
          })
        }
      },
      [calculateVisibleRange],
    )

    // Initialize visible range
    useEffect(() => {
      const initialRange = calculateVisibleRange(0)
      setVisibleRange(initialRange)
    }, [calculateVisibleRange])

    // Calculate total height and visible items
    const totalRows = Math.ceil(comics.length / itemsPerRow)
    const totalHeight = totalRows * (itemHeight + 24)
    const visibleComics = comics.slice(visibleRange.start, visibleRange.end)

    // Calculate offset for visible items
    const startRow = Math.floor(visibleRange.start / itemsPerRow)
    const offsetY = startRow * (itemHeight + 24)

    return (
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Total height spacer */}
        <div style={{ height: totalHeight, position: "relative" }}>
          {/* Visible items container */}
          <div
            className="absolute w-full"
            style={{
              transform: `translateY(${offsetY}px)`,
              willChange: "transform",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 lg:gap-4 md:gap-6">
              {visibleComics.map((comic, index) => (
                <OptimizedComicCard
                  key={comic.slug}
                  comic={comic}
                  baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
                  priority={visibleRange.start + index < 8}
                  index={visibleRange.start + index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

VirtualizedComicGrid.displayName = "VirtualizedComicGrid"

export default VirtualizedComicGrid
