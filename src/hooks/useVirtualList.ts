"use client";

import { useRef, useCallback } from "react";
import { VariableSizeList as List } from "react-window";

interface UseVirtualListOptions {
  itemCount: number;
  estimatedItemHeight?: number;
}

/**
 * Hook wrapper cho react-window VariableSizeList.
 * Dùng để render danh sách dài (chapter list, search results)
 * mà không cần mount toàn bộ DOM elements.
 */
export function useVirtualList({ estimatedItemHeight = 48 }: UseVirtualListOptions) {
  const listRef = useRef<List>(null);
  const itemSizeCache = useRef<Record<number, number>>({});

  // Trả về height của item (dùng cache để tránh đo lại)
  const getItemSize = useCallback(
    (index: number) => itemSizeCache.current[index] ?? estimatedItemHeight,
    [estimatedItemHeight]
  );

  // Cập nhật height thực sau khi render (dùng với ResizeObserver)
  const setItemSize = useCallback((index: number, size: number) => {
    if (itemSizeCache.current[index] !== size) {
      itemSizeCache.current[index] = size;
      listRef.current?.resetAfterIndex(index);
    }
  }, []);

  // Scroll đến item cụ thể
  const scrollToItem = useCallback((index: number, align: "start" | "center" | "end" = "start") => {
    listRef.current?.scrollToItem(index, align);
  }, []);

  return { listRef, getItemSize, setItemSize, scrollToItem };
}
