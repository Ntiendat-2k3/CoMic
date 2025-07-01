const SkeletonComicCard = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[3/4] shimmer relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Status Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <div className="glass rounded-full w-12 h-6"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 glass rounded-lg shimmer"></div>
          <div className="h-5 glass rounded-lg shimmer w-3/4"></div>
        </div>

        {/* Categories skeleton */}
        <div className="flex gap-2">
          <div className="h-6 w-16 glass rounded-full shimmer"></div>
          <div className="h-6 w-20 glass rounded-full shimmer"></div>
          <div className="h-6 w-14 glass rounded-full shimmer"></div>
        </div>

        {/* Chapter info skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 glass rounded shimmer"></div>
          <div className="h-6 w-16 glass rounded-full shimmer"></div>
        </div>

        {/* Progress bar skeleton */}
        <div className="glass rounded-full h-2 shimmer"></div>
      </div>

      {/* Floating elements skeleton */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-400/50 to-pink-400/50 rounded-full floating" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-400/50 to-cyan-400/50 rounded-full floating-delayed" />
    </div>
  )
}

export default SkeletonComicCard
