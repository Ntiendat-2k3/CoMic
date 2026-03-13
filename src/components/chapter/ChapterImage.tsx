"use client";

import { useState, useRef, useEffect, memo } from "react";
import Image from "next/image";

interface ChapterImageProps {
  src: string;
  index: number;
}

/**
 * Render ảnh chapter với IntersectionObserver - chỉ load khi gần viewport.
 * Giữ skeleton placeholder cho đến khi ảnh tải xong để tránh layout shift.
 */
const ChapterImage = memo(({ src, index }: ChapterImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(index < 3); // 3 ảnh đầu load ngay
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) return; // Đã trong viewport rồi
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" } // Bắt đầu load trước 400px
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Skeleton giữ chỗ khi chưa load */}
      {(!inView || !loaded) && (
        <div className="aspect-[2/3] w-full animate-pulse bg-gray-800/40 rounded" />
      )}

      {inView && (
        <Image
          src={src}
          alt={`Trang ${index + 1}`}
          width={800}
          height={1200}
          sizes="(max-width: 768px) 100vw, 800px"
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          unoptimized
          className={`w-full h-auto object-contain transition-opacity duration-300
            ${loaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
        />
      )}
    </div>
  );
});

ChapterImage.displayName = "ChapterImage";
export default ChapterImage;
