"use client";

import { memo, useEffect, useRef, useState } from "react";

const MAX_IMAGE_RETRIES = 2;
const IMAGE_RETRY_DELAY_MS = 500;

function addRetryQuery(src: string, retryCount: number) {
  if (retryCount === 0) return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}readerRetry=${retryCount}`;
}

interface ChapterImageProps {
  src: string;
  index: number;
  pageAlt: string;
  errorLabel: string;
  onSettled: (success: boolean) => void;
}

/**
 * Render ảnh chapter trực tiếp từ MangaDex@Home và để trình duyệt điều phối lazy-load.
 */
const ChapterImage = memo(({
  src,
  index,
  pageAlt,
  errorLabel,
  onSettled,
}: ChapterImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const settledRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  const settle = (success: boolean) => {
    if (settledRef.current) return;
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    settledRef.current = true;
    setLoaded(success);
    setFailed(!success);
    onSettled(success);
  };

  const retryOrFail = () => {
    if (retryTimerRef.current !== null) return;

    if (retryCount >= MAX_IMAGE_RETRIES) {
      settle(false);
      return;
    }

    retryTimerRef.current = window.setTimeout(() => {
      retryTimerRef.current = null;
      setRetryCount((current) => current + 1);
    }, IMAGE_RETRY_DELAY_MS * 2 ** retryCount);
  };

  const imageSrc = addRetryQuery(src, retryCount);

  return (
    <div
      data-page-index={index}
      className="relative mx-auto min-h-[40vh] w-full max-w-4xl bg-gray-950"
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }}
    >
      {!loaded && !failed && (
        <div
          className={`absolute inset-0 bg-gray-800/40 ${index <= 1 ? "animate-pulse" : ""}`}
        />
      )}

      {failed ? (
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
          {errorLabel}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- Ảnh chapter phải đi thẳng từ MangaDex@Home tới trình duyệt.
        <img
          key={retryCount}
          src={imageSrc}
          alt={pageAlt}
          width={800}
          height={1200}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={index === 0 ? "high" : "auto"}
          onLoad={() => settle(true)}
          onError={retryOrFail}
          className="relative block h-auto w-full object-contain"
        />
      )}
    </div>
  );
});

ChapterImage.displayName = "ChapterImage";
export default ChapterImage;
