"use client"

import { useState, useMemo } from "react"

interface UseVirtualScrollProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualScroll({ items, itemHeight, containerHeight, overscan = 5 }: UseVirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + overscan, items.length)

    return {
      start: Math.max(0, start - overscan),
      end,
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
    }))
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight

  return {
    visibleItems,
    totalHeight,
    visibleRange,
    setScrollTop,
  }
}
