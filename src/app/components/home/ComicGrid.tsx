"use client"

import { memo, useMemo } from "react"
import type { Comic } from "@/app/types/comic"
import ComicCard from "../ComicCard"
import { lazy } from "react"

const SkeletonComicGrid = lazy(() => import("./SkeletonComicGrid"))

interface ComicGridProps {
  comics?: Comic[]
  isLoading?: boolean
}

const ComicGrid = memo(({ comics, isLoading }: ComicGridProps) => {
  // Memoize comic cards để tránh re-render không cần thiết
  const comicCards = useMemo(() => {
    if (!comics) return null

    return comics.map((comic, index) => (
      <ComicCard
        key={comic.slug}
        comic={comic}
        baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
        priority={index < 4} // Ưu tiên load 4 ảnh đầu tiên
      />
    ))
  }, [comics])

  if (isLoading || !comics) {
    return <SkeletonComicGrid />
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 lg:gap-4 md:gap-6">
      {comicCards}
    </div>
  )
})

ComicGrid.displayName = "ComicGrid"

export default ComicGrid
