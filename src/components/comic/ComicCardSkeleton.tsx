import { memo } from "react";

const ComicCardSkeleton = memo(() => (
  <div className="rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 animate-pulse">
    {/* Thumbnail */}
    <div className="aspect-[3/4] w-full bg-gray-700/60" />
    {/* Info */}
    <div className="p-3 space-y-2">
      <div className="h-3.5 bg-gray-700/60 rounded w-5/6" />
      <div className="h-3 bg-gray-700/60 rounded w-3/4" />
      <div className="flex gap-1 mt-2">
        <div className="h-4 bg-gray-700/60 rounded-full w-14" />
        <div className="h-4 bg-gray-700/60 rounded-full w-12" />
      </div>
    </div>
  </div>
));

ComicCardSkeleton.displayName = "ComicCardSkeleton";
export default ComicCardSkeleton;
