"use client"

import { useMemo } from "react"

import { useState, useCallback, memo } from "react"
import Image from "next/image"
import { imageOptimization } from "@/app/lib/performance"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  sizes?: string
}

const OptimizedImageWithPlaceholder = memo(
  ({ src, alt, width, height, priority = false, className = "", sizes }: OptimizedImageProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const handleLoad = useCallback(() => {
      setIsLoading(false)
    }, [])

    const handleError = useCallback(() => {
      setHasError(true)
      setIsLoading(false)
    }, [])

    // Generate optimized image URL
    const optimizedSrc = useMemo(() => {
      if (hasError) return "/placeholder.svg"
      return imageOptimization.getResponsiveImageUrl(src, width)
    }, [src, width, hasError])

    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
        {/* Skeleton placeholder */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-700/30 animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-gray-700/20 via-gray-600/30 to-gray-700/20 animate-shimmer" />
          </div>
        )}

        {/* Optimized image */}
        <Image
          src={optimizedSrc || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
        />

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>
    )
  },
)

OptimizedImageWithPlaceholder.displayName = "OptimizedImageWithPlaceholder"

export default OptimizedImageWithPlaceholder
