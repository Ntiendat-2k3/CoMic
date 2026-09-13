"use client";

import { useEffect, useState } from "react";

/** Theo dõi phần trăm cuộn của tài liệu đọc hiện tại. */
export function useReadingProgressController(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollableHeight > 0
          ? Math.min(100, (scrollTop / scrollableHeight) * 100)
          : 0,
      );
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return progress;
}
