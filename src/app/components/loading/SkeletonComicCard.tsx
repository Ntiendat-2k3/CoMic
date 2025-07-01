const SkeletonComicCard = () => {
  return (
    <div className="group relative h-full">
      {/* Floating particles skeleton */}
      <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400/20 rounded-full animate-pulse" />
      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse" />

      {/* Main card skeleton */}
      <div className="relative h-full rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
        {/* Image Skeleton */}
        <div className="relative w-full aspect-[3/4] bg-gray-700/50 animate-pulse">
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                          translate-x-[-100%] animate-shimmer"
          />

          {/* Status Badge Skeleton */}
          <div className="absolute top-3 right-3">
            <div className="bg-gray-600/50 rounded-full w-12 h-6 animate-pulse"></div>
          </div>

          {/* Progress bar skeleton */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
            <div className="h-full bg-gray-600/50 w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-600/50 rounded-lg animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded-lg w-3/4 animate-pulse"></div>
          </div>

          {/* Categories skeleton */}
          <div className="hidden sm:flex gap-2">
            <div className="h-6 w-16 bg-gray-600/50 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-600/50 rounded-full animate-pulse"></div>
          </div>

          {/* Chapter info skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-600/50 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-600/50 rounded-full animate-pulse"></div>
          </div>

          {/* Progress bar skeleton */}
          <div className="hidden sm:block space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-12 bg-gray-600/50 rounded animate-pulse"></div>
              <div className="h-3 w-8 bg-gray-600/50 rounded animate-pulse"></div>
            </div>
            <div className="h-2 bg-gray-600/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonComicCard
