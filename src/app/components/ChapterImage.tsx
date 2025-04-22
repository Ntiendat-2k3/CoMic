"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  index: number;
}

export default function ChapterImage({ src, index }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full">
      {!loaded && (
        <div className="aspect-[2/3] w-full animate-pulse rounded bg-gray-800/30" />
      )}

      <Image
        src={src}
        alt={`Page ${index + 1}`}
        width={800}
        height={1200}
        sizes="(max-width: 768px) 100vw, 800px"
        className={`h-auto w-full object-contain ${loaded ? "" : "hidden"}`}
        priority={index < 2} // ưu tiên 2 ảnh đầu
        loading={index < 2 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
