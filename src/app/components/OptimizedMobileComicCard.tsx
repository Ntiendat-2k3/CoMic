// "use client"

// import Link from "next/link"
// import { memo, useState, useCallback, useEffect, useRef } from "react"
// import type { Comic } from "../types/comic"
// import { MobileImageOptimizer, MobilePerformanceOptimizer } from "../lib/performance-mobile"

// interface OptimizedMobileComicCardProps {
//   comic: Comic
//   baseImageUrl: string
//   priority?: boolean
//   index: number
// }

// const OptimizedMobileComicCard = memo(
//   ({ comic, baseImageUrl, priority = false, index }: OptimizedMobileComicCardProps) => {
//     const [imageLoaded, setImageLoaded] = useState(false)
//     const [isCurrentlyReading, setIsCurrentlyReading] = useState(false)
//     const [lastReadChapter, setLastReadChapter] = useState<string | null>(null)
//     const [savedProgress, setSavedProgress] = useState<number>(0)
//     const cardRef = useRef<HTMLDivElement>(null)
//     const imageRef = useRef<HTMLImageElement>(null)

//     const optimizer = MobilePerformanceOptimizer.getInstance()
//     const shouldLazyLoad = !priority && optimizer.shouldUseLazyLoading(index)
//     const reduceAnimations = optimizer.shouldReduceAnimations()

//     // Memoize static values to prevent recalculation
//     const staticValues = useRef({
//       isNew: Math.random() > 0.8, // Reduced probability for better performance
//       isHot: Math.random() > 0.9,
//     }).current

//     // Optimized effect for reading status
//     useEffect(() => {
//       if (typeof window === "undefined") return

//       const lastRead = localStorage.getItem(`lastRead-${comic.slug}`)
//       const savedProgressValue = localStorage.getItem(`progress-${comic.slug}`)

//       if (lastRead) {
//         setIsCurrentlyReading(true)
//         setLastReadChapter(lastRead)
//       }

//       if (savedProgressValue) {
//         setSavedProgress(Number.parseInt(savedProgressValue) || 0)
//       }
//     }, [comic.slug])

//     // Intersection Observer for lazy loading
//     useEffect(() => {
//       if (!shouldLazyLoad || !cardRef.current) return

//       const observer = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             if (entry.isIntersecting && imageRef.current) {
//               const img = imageRef.current
//               if (img.dataset.src) {
//                 img.src = img.dataset.src
//                 img.removeAttribute("data-src")
//                 observer.unobserve(entry.target)
//               }
//             }
//           })
//         },
//         { rootMargin: "50px 0px" },
//       )

//       observer.observe(cardRef.current)

//       return () => {
//         if (cardRef.current) {
//           observer.unobserve(cardRef.current)
//         }
//       }
//     }, [shouldLazyLoad])

//     const handleImageLoad = useCallback(() => {
//       setImageLoaded(true)
//     }, [])

//     const handleImageError = useCallback(() => {
//       setImageLoaded(true) // Still remove skeleton
//     }, [])

//     // Optimized progress calculation
//     const getLatestChapterNumber = useCallback(() => {
//       if (!comic.chaptersLatest?.[0]?.chapter_name) return 0
//       const chapterString = comic.chaptersLatest[0].chapter_name
//       return Number.parseFloat(chapterString) || 0
//     }, [comic.chaptersLatest])

//     const calculateProgress = useCallback(() => {
//       const totalChapters = getLatestChapterNumber()

//       if (!isCurrentlyReading || !lastReadChapter || totalChapters === 0) {
//         return savedProgress
//       }

//       const currentChapterNumber = Number.parseFloat(lastReadChapter) || 0
//       const progress = Math.round((currentChapterNumber / totalChapters) * 100)
//       const finalProgress = Math.min(progress, 100)

//       // Save progress
//       if (typeof window !== "undefined") {
//         localStorage.setItem(`progress-${comic.slug}`, finalProgress.toString())
//       }

//       return finalProgress
//     }, [isCurrentlyReading, lastReadChapter, savedProgress, getLatestChapterNumber, comic.slug])

//     const actualProgress = calculateProgress()
//     const totalChapters = getLatestChapterNumber()

//     // Generate optimized image URLs
//     const optimizedImageSrc = MobileImageOptimizer.generateOptimizedSrc(baseImageUrl, 300)
//     const optimizedSrcSet = MobileImageOptimizer.generateMobileSrcSet(baseImageUrl)

//     return (
//       <div
//         ref={cardRef}
//         className="group relative h-full"
//         style={{
//           contentVisibility: "auto",
//           containIntrinsicSize: "0 400px",
//         }}
//       >
//         {/* Simplified floating particles - only on desktop and good connections */}
//         {!reduceAnimations && (
//           <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400/40 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
//         )}

//         {/* Currently Reading Highlight - Simplified for mobile */}
//         {isCurrentlyReading && (
//           <div className="absolute -top-2 -left-2 z-10">
//             <div
//               className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg ${!reduceAnimations ? "animate-pulse" : ""}`}
//             >
//               📖
//             </div>
//           </div>
//         )}

//         {/* Main card - Reduced animations on mobile */}
//         <div
//           className={`relative h-full rounded-2xl overflow-hidden backdrop-blur-sm border transition-all duration-300 ${
//             !reduceAnimations
//               ? "md:group-hover:shadow-lg md:group-hover:shadow-pink-500/10 md:group-hover:transform md:group-hover:scale-[1.01]"
//               : ""
//           } ${
//             isCurrentlyReading
//               ? "bg-gradient-to-br from-green-800/30 to-gray-800/50 border-green-500/50 shadow-lg shadow-green-500/20"
//               : "bg-gray-800/50 border-gray-700/50 md:group-hover:border-pink-500/30"
//           }`}
//           style={{
//             willChange: reduceAnimations ? "auto" : "transform",
//           }}
//         >
//           <Link href={`/truyen-tranh/${comic.slug}`} className="block h-full flex flex-col">
//             {/* Optimized Image Container */}
//             <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-700/50 flex-shrink-0">
//               {/* Optimized skeleton loading */}
//               {!imageLoaded && (
//                 <div className="absolute inset-0 bg-gray-700/30">
//                   <div className="w-full h-full bg-gradient-to-r from-gray-700/20 via-gray-600/30 to-gray-700/20 animate-pulse" />
//                 </div>
//               )}

//               {/* Optimized Image with responsive loading */}
//               <img
//                 ref={imageRef}
//                 src={shouldLazyLoad ? undefined : optimizedImageSrc}
//                 data-src={shouldLazyLoad ? optimizedImageSrc : undefined}
//                 srcSet={shouldLazyLoad ? undefined : optimizedSrcSet}
//                 sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
//                 alt={comic.name}
//                 loading={priority ? "eager" : "lazy"}
//                 decoding="async"
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//                 className={`w-full h-full object-cover transition-opacity duration-300 ${
//                   imageLoaded ? "opacity-100" : "opacity-0"
//                 } ${!reduceAnimations ? "md:group-hover:scale-105" : ""}`}
//                 style={{
//                   transform: "translateZ(0)", // Force GPU acceleration
//                 }}
//               />

//               {/* Simplified gradient overlay */}
//               {!reduceAnimations && (
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
//               )}

//               {/* Optimized Status Badges - Only show if needed */}
//               {(staticValues.isHot || staticValues.isNew) && (
//                 <div className="absolute top-2 right-2 flex flex-col gap-1">
//                   {staticValues.isHot && (
//                     <div className="bg-red-500/90 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
//                       🔥
//                     </div>
//                   )}
//                   {staticValues.isNew && (
//                     <div className="bg-green-500/90 px-2 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
//                       ✨
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Mobile Chapter Info - Optimized */}
//               <div className="absolute bottom-2 left-2 sm:hidden flex items-center gap-2">
//                 <div
//                   className={`backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border ${
//                     isCurrentlyReading
//                       ? "bg-green-600/80 text-white border-green-400/50"
//                       : "bg-black/60 text-white border-pink-400/30"
//                   }`}
//                 >
//                   {isCurrentlyReading && lastReadChapter
//                     ? `${lastReadChapter}/${totalChapters}`
//                     : actualProgress > 0
//                       ? `${actualProgress}%`
//                       : `${totalChapters}ch`}
//                 </div>
//               </div>

//               {/* Simplified progress indicator */}
//               <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
//                 <div
//                   className={`h-full transition-all duration-500 ${
//                     isCurrentlyReading
//                       ? "bg-gradient-to-r from-green-500 to-emerald-500"
//                       : actualProgress > 0
//                         ? "bg-gradient-to-r from-blue-500 to-cyan-500"
//                         : "bg-gradient-to-r from-pink-500 to-purple-500"
//                   }`}
//                   style={{
//                     width: `${actualProgress}%`,
//                     transform: "translateZ(0)",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Optimized Content */}
//             <div className="p-3 sm:p-4 flex-1 flex flex-col">
//               {/* Title - Optimized for mobile */}
//               <h3
//                 className={`font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight transition-colors duration-300 ${
//                   isCurrentlyReading ? "text-green-300" : actualProgress > 0 ? "text-blue-300" : "text-white"
//                 } ${!reduceAnimations ? "md:group-hover:text-pink-300" : ""}`}
//               >
//                 {comic.name}
//               </h3>

//               {/* Categories - Desktop only for performance */}
//               <div className="hidden sm:flex flex-wrap gap-1 mb-2">
//                 {comic.category.slice(0, 2).map((cat, catIndex) => (
//                   <span
//                     key={cat.slug}
//                     className={`px-2 py-1 text-xs rounded-full font-medium transition-colors duration-300 ${
//                       catIndex === 0
//                         ? isCurrentlyReading
//                           ? "bg-green-500/20 text-green-300 border border-green-500/30"
//                           : actualProgress > 0
//                             ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
//                             : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
//                         : "bg-gray-700/50 text-gray-300"
//                     }`}
//                   >
//                     {cat.name}
//                   </span>
//                 ))}
//               </div>

//               {/* Spacer */}
//               <div className="flex-1"></div>

//               {/* Bottom info - Simplified */}
//               <div className="space-y-2 mt-auto">
//                 {/* Latest Chapter - Optimized */}
//                 {comic.chaptersLatest?.length && (
//                   <div className="flex items-center justify-between text-xs sm:text-sm">
//                     <span className="text-gray-400 flex items-center gap-1">
//                       <span
//                         className={`w-1 h-1 rounded-full ${
//                           isCurrentlyReading ? "bg-green-400" : actualProgress > 0 ? "bg-blue-400" : "bg-green-400"
//                         }`}
//                       ></span>
//                       <span className="hidden sm:inline">Ch mới:</span>
//                       <span className="sm:hidden">Ch:</span>
//                     </span>
//                     <span
//                       className={`font-semibold px-2 py-1 rounded-full ${
//                         isCurrentlyReading
//                           ? "text-green-400 bg-green-400/10"
//                           : actualProgress > 0
//                             ? "text-blue-400 bg-blue-400/10"
//                             : "text-blue-400 bg-blue-400/10"
//                       }`}
//                     >
//                       {comic.chaptersLatest[0].chapter_name}
//                     </span>
//                   </div>
//                 )}

//                 {/* Progress bar - Desktop only */}
//                 <div className="hidden sm:block">
//                   <div className="flex justify-between text-xs text-gray-400 mb-1">
//                     <span>Tiến độ</span>
//                     <span
//                       className={
//                         isCurrentlyReading ? "text-green-400" : actualProgress > 0 ? "text-blue-400" : "text-pink-400"
//                       }
//                     >
//                       {actualProgress}%
//                     </span>
//                   </div>
//                   <div className="bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
//                     <div
//                       className={`h-full transition-all duration-500 ${
//                         isCurrentlyReading
//                           ? "bg-gradient-to-r from-green-500 to-emerald-500"
//                           : actualProgress > 0
//                             ? "bg-gradient-to-r from-blue-500 to-cyan-500"
//                             : "bg-gradient-to-r from-pink-500 to-purple-500"
//                       }`}
//                       style={{
//                         width: `${actualProgress}%`,
//                         transform: "translateZ(0)",
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </div>
//     )
//   },
// )

// OptimizedMobileComicCard.displayName = "OptimizedMobileComicCard"

// export default OptimizedMobileComicCard
