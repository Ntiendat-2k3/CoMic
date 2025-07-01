"use client"

import { useState, useMemo } from "react"

interface VirtualItem<T = unknown> {
  item: T
  index: number
}

interface UseVirtualScrollProps<T = unknown> {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface VirtualScrollReturn<T = unknown> {
  visibleItems: VirtualItem<T>[]
  totalHeight: number
  visibleRange: { start: number; end: number }
  setScrollTop: (scrollTop: number) => void
}

export function useVirtualScroll<T = unknown>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: UseVirtualScrollProps<T>): VirtualScrollReturn<T> {
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
