"use client"

import { memo, useMemo, useEffect, useState } from "react"
import type { Comic } from "@/app/types/comic"
import OptimizedComicCard from "../OptimizedComicCard"
import VirtualizedComicGrid from "../VirtualizedComicGrid"
import { PerformanceOptimizer } from "@/app/lib/performance-optimizer"

interface OptimizedComicGridProps {
  comics?: Comic[]
  isLoading?: boolean
  enableVirtualization?: boolean
}

const OptimizedComicGrid = memo(({ comics, isLoading, enableVirtualization = false }: OptimizedComicGridProps) => {
  const [shouldUseVirtualization, setShouldUseVirtualization] = useState(false)

  // Determine if virtualization should be used based on item count and device
  useEffect(() => {
    if (enableVirtualization && comics && comics.length > 50) {
      // Use virtualization for large lists on all devices
      setShouldUseVirtualization(true)
    } else if (comics && comics.length > 100 && window.innerWidth < 768) {
      // Force virtualization on mobile for very large lists
      setShouldUseVirtualization(true)
    }
  }, [comics, enableVirtualization])

  // Preload critical images
  useEffect(() => {
    if (comics && comics.length > 0) {
      const criticalImages = comics
        .slice(0, 8) // First 8 images
        .map((comic) => `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`)

      PerformanceOptimizer.getInstance().preloadCriticalImages(criticalImages)
    }
  }, [comics])

  // Memoize comic cards to prevent unnecessary re-renders
  const comicCards = useMemo(() => {
    if (!comics) return null

    return comics.map((comic, index) => (
      <OptimizedComicCard
        key={comic.slug}
        comic={comic}
        baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
        priority={index < 4} // Prioritize first 4 images
        index={index}
      />
    ))
  }, [comics])

  // Loading skeleton with reduced animation
  if (isLoading || !comics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 lg:gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[3/4] bg-gray-700/30 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  // Use virtualization for large lists
  if (shouldUseVirtualization) {
    return <VirtualizedComicGrid comics={comics} itemsPerRow={4} itemHeight={400} containerHeight={800} />
  }

  // Regular grid for smaller lists
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 lg:gap-4 md:gap-6"
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "0 400px",
      }}
    >
      {comicCards}
    </div>
  )
})

OptimizedComicGrid.displayName = "OptimizedComicGrid"

export default OptimizedComicGrid
