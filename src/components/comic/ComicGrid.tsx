"use client";

import { memo } from "react";
import ComicCard from "./ComicCard";
import ComicCardSkeleton from "./ComicCardSkeleton";
import type { Comic } from "@/types/comic";

interface ComicGridProps {
  comics?: Comic[];
  cdnUrl?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  layout?: "catalog" | "related";
}

const layoutClasses = {
  catalog: "grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5",
  related: "grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6",
};

const ComicGrid = memo(({
  comics,
  cdnUrl = "",
  isLoading = false,
  skeletonCount = 15,
  layout = "catalog",
}: ComicGridProps) => {
  return (
    <div
      className={`grid ${layoutClasses[layout]}`}
    >
      {isLoading || !comics
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <ComicCardSkeleton key={i} />
          ))
        : comics.map((comic, index) => (
            <ComicCard
              key={comic._id}
              comic={comic}
              cdnUrl={cdnUrl}
              priority={index === 0}
            />
          ))}
    </div>
  );
});

ComicGrid.displayName = "ComicGrid";
export default ComicGrid;
