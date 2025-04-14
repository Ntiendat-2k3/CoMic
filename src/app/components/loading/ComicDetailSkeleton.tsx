export function ComicDetailSkeleton() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-6" />
  
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Thumbnail Skeleton */}
          <div className="lg:w-1/3 w-full">
            <div className="aspect-[2/3] bg-gray-700 rounded-xl" />
          </div>
  
          {/* Metadata Skeleton */}
          <div className="lg:w-2/3 w-full space-y-6">
            <div className="h-8 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-700 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
  
        {/* Chapters Skeleton */}
        <div className="bg-gray-900 p-6 rounded-xl space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg p-4">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-8 bg-gray-700 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }