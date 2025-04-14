"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageFallbackProps extends ImageProps {
  alt: string; 
}

const ImageFallback = ({ src, alt, ...props }: ImageFallbackProps) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-10 h-15 bg-primary-light/20 rounded-sm flex items-center justify-center">
        <span className="text-xs text-center">No Image</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
      placeholder="blur"
      blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
      loading="lazy"
    />
  );
};

export default ImageFallback;