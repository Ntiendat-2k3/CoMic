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
  const [inView, setInView] = useState(index < 5); // Load 5 ảnh đầu ngay lập tức thay vì 3
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "1500px 0px", // Tăng vùng đệm lên 1500px để tải sớm hơn nhiều khi cuộn nhanh
        threshold: 0.01,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <div ref={ref} className="relative w-full min-h-[40vh]">
      {/* Skeleton giữ chỗ khi chưa load hoặc chưa vào view */}
      {(!inView || !loaded) && (
        <div className="absolute inset-0 animate-pulse bg-gray-800/40 rounded shadow-inner" />
      )}

      {inView && (
        <Image
          src={src}
          alt={`Trang ${index + 1}`}
          width={800}
          height={1200}
          sizes="(max-width: 768px) 100vw, 800px"
          priority={index < 10} // Tăng lên 10 để Next.js tự động set fetchPriority="high"
          loading={index < 10 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto object-contain transition-opacity duration-300
            ${loaded ? "opacity-100" : "opacity-0 invisible"}`}
        />
      )}
    </div>
  );
});

ChapterImage.displayName = "ChapterImage";
export default ChapterImage;
