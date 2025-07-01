"use client"

import { memo, useCallback } from "react"
import { FixedSizeGrid as Grid } from "react-window"
import type { Comic } from "@/app/types/comic"
import ComicCard from "./ComicCard"

interface VirtualizedComicGridProps {
  comics: Comic[]
  width: number
  height: number
  columnCount?: number
}

const VirtualizedComicGrid = memo(({ comics, width, height, columnCount = 4 }: VirtualizedComicGridProps) => {
  const rowCount = Math.ceil(comics.length / columnCount)
  const columnWidth = width / columnCount
  const rowHeight = 400 // Approximate card height

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const index = rowIndex * columnCount + columnIndex
      const comic = comics[index]

      if (!comic) return null

      return (
        <div style={style} className="p-2">
          <ComicCard
            comic={comic}
            baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
            priority={index < 8}
          />
        </div>
      )
    },
    [comics, columnCount],
  )

  return (
    <Grid
      columnCount={columnCount}
      columnWidth={columnWidth}
      height={height}
      rowCount={rowCount}
      rowHeight={rowHeight}
      width={width}
      overscanRowCount={2}
      overscanColumnCount={1}
    >
      {Cell}
    </Grid>
  )
})

VirtualizedComicGrid.displayName = "VirtualizedComicGrid"

export default VirtualizedComicGrid
