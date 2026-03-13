// "use client"

// import { memo, useMemo, useEffect, useState, useCallback } from "react"
// import type { Comic } from "@/app/types/comic"
// import OptimizedMobileComicCard from "../OptimizedMobileComicCard"
// import { MobileImageOptimizer, MobilePerformanceOptimizer } from "@/app/lib/performance-mobile"

// interface OptimizedMobileComicGridProps {
//   comics?: Comic[]
//   isLoading?: boolean
// }

// const OptimizedMobileComicGrid = memo(({ comics, isLoading }: OptimizedMobileComicGridProps) => {
//   const [visibleCount, setVisibleCount] = useState(12)
//   const optimizer = MobilePerformanceOptimizer.getInstance()

//   // Preload critical images
//   useEffect(() => {
//     if (comics && comics.length > 0) {
//       const criticalImages = comics
//         .slice(0, 4) // First 4 images
//         .map((comic) => `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`)

//       MobileImageOptimizer.preloadCriticalImages(criticalImages, 4)
//     }
//   }, [comics])

//   // Progressive loading for mobile
//   const loadMore = useCallback(() => {
//     const chunkSize = optimizer.getOptimalChunkSize()
//     setVisibleCount((prev) => Math.min(prev + chunkSize, comics?.length || 0))
//   }, [optimizer, comics?.length])

//   // Auto-load more on scroll (mobile only)
//   useEffect(() => {
//     if (typeof window === "undefined" || !comics || window.innerWidth > 768) return

//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
//         loadMore()
//       }
//     }

//     const throttledScroll = throttle(handleScroll, 200)
//     window.addEventListener("scroll", throttledScroll, { passive: true })

//     return () => {
//       window.removeEventListener("scroll", throttledScroll)
//     }
//   }, [loadMore, comics])

//   // Memoize visible comics
//   const visibleComics = useMemo(() => {
//     if (!comics) return []
//     return comics.slice(0, visibleCount)
//   }, [comics, visibleCount])

//   // Memoize comic cards
//   const comicCards = useMemo(() => {
//     return visibleComics.map((comic, index) => (
//       <OptimizedMobileComicCard
//         key={comic.slug}
//         comic={comic}
//         baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
//         priority={index < 4} // Prioritize first 4 images
//         index={index}
//       />
//     ))
//   }, [visibleComics])

//   // Loading skeleton with reduced animation
//   if (isLoading || !comics) {
//     return (
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 lg:gap-4 md:gap-6">
//         {Array.from({ length: 12 }).map((_, index) => (
//           <div
//             key={index}
//             className="aspect-[3/4] bg-gray-700/30 rounded-2xl"
//             style={{
//               animation: index < 4 ? "pulse 1.5s ease-in-out infinite" : "none",
//             }}
//           />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <>
//       <div
//         className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 lg:gap-4 md:gap-6"
//         style={{
//           contentVisibility: "auto",
//           containIntrinsicSize: "0 400px",
//         }}
//       >
//         {comicCards}
//       </div>

//       {/* Load More Button for mobile */}
//       {comics && visibleCount < comics.length && (
//         <div className="flex justify-center mt-8 md:hidden">
//           <button
//             onClick={loadMore}
//             className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
//           >
//             Xem thêm ({comics.length - visibleCount} còn lại)
//           </button>
//         </div>
//       )}
//     </>
//   )
// })

// OptimizedMobileComicGrid.displayName = "OptimizedMobileComicGrid"

// // Throttle utility
// function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
//   let inThrottle: boolean
//   return ((...args: any[]) => {
//     if (!inThrottle) {
//       func.apply(this, args)
//       inThrottle = true
//       setTimeout(() => (inThrottle = false), limit)
//     }
//   }) as T
// }

// export default OptimizedMobileComicGrid
