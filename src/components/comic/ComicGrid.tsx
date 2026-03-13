"use client";

import { memo, useCallback, useRef, useState, useEffect } from "react";
import ComicCard from "./ComicCard";
import ComicCardSkeleton from "./ComicCardSkeleton";
import type { Comic } from "@/types/comic";

const DEFAULT_CDN = "https://img.otruyenapi.com";

const COLS = {
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
};

interface ComicGridProps {
  comics?: Comic[];
  cdnUrl?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

// Tính số cột thực dựa trên container width
function useColumnCount(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [cols, setCols] = useState(COLS.lg);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w < 640) setCols(COLS.sm);
      else if (w < 768) setCols(COLS.md);
      else if (w < 1280) setCols(COLS.lg);
      else setCols(COLS.xl);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  return cols;
}

const ComicGrid = memo(({
  comics,
  cdnUrl = DEFAULT_CDN,
  isLoading = false,
  skeletonCount = 15,
}: ComicGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cols = useColumnCount(containerRef);

  // Render từng card với IntersectionObserver để lazy load
  const renderCard = useCallback(
    (comic: Comic, index: number) => (
      <ComicCard
        key={comic._id}
        comic={comic}
        cdnUrl={cdnUrl}
        // Priority cho 2 hàng đầu
        priority={index < cols * 2}
      />
    ),
    [cdnUrl, cols]
  );

  return (
    <div
      ref={containerRef}
      className="grid gap-3 sm:gap-4"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {isLoading || !comics
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <ComicCardSkeleton key={i} />
          ))
        : comics.map(renderCard)}
    </div>
  );
});

ComicGrid.displayName = "ComicGrid";
export default ComicGrid;
