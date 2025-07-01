"use client"
import Image, { type ImageProps } from "next/image"
import { useState, useCallback } from "react"

interface ImageFallbackProps extends ImageProps {
  alt: string
  onLoad?: () => void
}

const ImageFallback = ({ src, alt, onLoad, ...props }: ImageFallbackProps) => {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    setLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setError(true)
  }, [])

  if (error) {
    return (
      <div className="w-full h-full bg-gray-700/30 rounded-sm flex items-center justify-center">
        <span className="text-xs text-gray-400 text-center">No Image</span>
      </div>
    )
  }

  return (
    <Image
      {...props}
      src={src || "/placeholder.svg"}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
      className={`${props.className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  )
}

export default ImageFallback
