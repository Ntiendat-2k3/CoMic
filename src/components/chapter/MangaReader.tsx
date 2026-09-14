"use client";

/** Điều phối chất lượng, preload và đổi node MangaDex@Home cho reader online. */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { preconnect } from "react-dom";
import Link from "next/link";
import { ChevronLeft, RefreshCw } from "lucide-react";
import ChapterImage from "./ChapterImage";
import {
  buildAtHomePageUrls,
  fetchAtHomeServer,
  type ReaderQuality,
} from "@/infrastructure/mangadex/mangadex-at-home.client";
import type { MangaDexAtHomeResponse } from "@/infrastructure/mangadex/mangadex.types";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";

const QUALITY_STORAGE_KEY = "comic-reader-quality";
const MAX_FETCH_ATTEMPTS = 3;
const MAX_NODE_REFRESHES = 2;

interface NetworkInformationLike {
  effectiveType?: string;
  saveData?: boolean;
}

function getNetworkInformation() {
  return (
    navigator as Navigator & { connection?: NetworkInformationLike }
  ).connection;
}

function getPreloadCount() {
  const connection = getNetworkInformation();
  if (connection?.saveData) return 0;

  switch (connection?.effectiveType) {
    case "slow-2g":
    case "2g":
      return 0;
    case "3g":
      return 1;
    default:
      return connection ? 2 : 1;
  }
}

function waitBeforeRetry(attempt: number) {
  return new Promise((resolve) => window.setTimeout(resolve, 250 * attempt));
}

function readQualityPreference(): ReaderQuality | null {
  try {
    const value = window.localStorage.getItem(QUALITY_STORAGE_KEY);
    return value === "data" || value === "data-saver" ? value : null;
  } catch {
    // Trình duyệt có thể chặn storage; reader vẫn dùng data-saver mặc định.
    return null;
  }
}

function writeQualityPreference(quality: ReaderQuality) {
  try {
    window.localStorage.setItem(QUALITY_STORAGE_KEY, quality);
  } catch {
    // Việc lưu tùy chọn không được làm gián đoạn luồng đọc hiện tại.
  }
}

interface MangaReaderProps {
  chapterId: string;
  comicSlug: string;
}

export default function MangaReader({ chapterId, comicSlug }: MangaReaderProps) {
  const { common, chapter: copy } = useDictionary();
  const [atHome, setAtHome] = useState<MangaDexAtHomeResponse | null>(null);
  const [quality, setQuality] = useState<ReaderQuality>("data-saver");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);
  const nodeRefreshCountRef = useRef(0);
  const refreshInProgressRef = useRef(false);
  const preloadedImagesRef = useRef(new Map<string, HTMLImageElement>());

  useEffect(() => {
    const storedQuality = readQualityPreference();
    if (storedQuality) setQuality(storedQuality);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadAtHome() {
      setIsLoading(true);
      setError(false);
      setAtHome(null);

      for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
        try {
          const data = await fetchAtHomeServer(chapterId, controller.signal);
          if (active) setAtHome(data);
          return;
        } catch (fetchError) {
          if (controller.signal.aborted) return;

          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[MangaReader] Lấy node At-Home thất bại lần ${attempt}/${MAX_FETCH_ATTEMPTS}:`,
              fetchError,
            );
          }

          if (attempt === MAX_FETCH_ATTEMPTS) {
            if (active) setError(true);
            return;
          }
          await waitBeforeRetry(attempt);
        }
      }
    }

    void loadAtHome().finally(() => {
      if (active) {
        setIsLoading(false);
        refreshInProgressRef.current = false;
      }
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [chapterId, refreshVersion]);

  useEffect(() => {
    nodeRefreshCountRef.current = 0;
    preloadedImagesRef.current.clear();
  }, [chapterId]);

  const pages = useMemo(
    () => (atHome ? buildAtHomePageUrls(atHome, quality) : []),
    [atHome, quality],
  );

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || !atHome || pages.length === 0) {
      return;
    }

    console.group(
      `[MangaReader] Chương ${chapterId}: ${pages.length} ảnh (${quality})`,
    );
    console.info("[MangaReader] Node ảnh:", atHome.baseUrl);
    pages.forEach((url, index) => {
      console.info(`[MangaReader] Trang ${index + 1}:`, url);
    });
    console.groupEnd();
  }, [atHome, chapterId, pages, quality]);

  if (atHome) {
    preconnect(new URL(atHome.baseUrl).origin, { crossOrigin: "anonymous" });
  }

  useEffect(() => {
    preloadedImagesRef.current.clear();
  }, [pages]);

  useEffect(() => {
    const reader = readerRef.current;
    if (!reader || pages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        const index = Number((visibleEntry?.target as HTMLElement | undefined)?.dataset.pageIndex);
        if (Number.isInteger(index)) setCurrentIndex(index);
      },
      { rootMargin: "-20% 0px -55%", threshold: [0.01, 0.25, 0.5] },
    );

    reader.querySelectorAll<HTMLElement>("[data-page-index]").forEach((page) => {
      observer.observe(page);
    });

    return () => observer.disconnect();
  }, [pages]);

  useEffect(() => {
    const preloadCount = getPreloadCount();

    for (let offset = 1; offset <= preloadCount; offset += 1) {
      const src = pages[currentIndex + offset];
      if (!src || preloadedImagesRef.current.has(src)) continue;

      const image = new window.Image();
      image.decoding = "async";
      image.src = src;
      preloadedImagesRef.current.set(src, image);
    }
  }, [currentIndex, pages]);

  const changeQuality = useCallback((nextQuality: ReaderQuality) => {
    setQuality(nextQuality);
    writeQualityPreference(nextQuality);
  }, []);

  const handleImageSettled = useCallback(
    (success: boolean) => {
      if (
        success ||
        refreshInProgressRef.current ||
        nodeRefreshCountRef.current >= MAX_NODE_REFRESHES
      ) {
        return;
      }

      refreshInProgressRef.current = true;
      nodeRefreshCountRef.current += 1;
      setRefreshVersion((version) => version + 1);
    },
    [],
  );

  const retryManually = useCallback(() => {
    nodeRefreshCountRef.current = 0;
    refreshInProgressRef.current = true;
    setRefreshVersion((version) => version + 1);
  }, []);

  if (!atHome && isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-pink-500" />
        <span className="sr-only">{copy.readerLoading}</span>
      </div>
    );
  }

  if (!atHome || error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-gray-400">
        <p className="text-lg">{copy.imageLoadError}</p>
        <button
          type="button"
          onClick={retryManually}
          className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-400"
        >
          <RefreshCw size={16} />
          {copy.retryImages}
        </button>
        <Link
          href={`/truyen-tranh/${comicSlug}`}
          className="flex items-center gap-2 text-pink-400 hover:text-pink-300"
        >
          <ChevronLeft size={16} />
          {copy.backToComic}
        </Link>
      </div>
    );
  }

  return (
    <section aria-label={copy.readerLabel}>
      <div className="sticky top-[75px] z-30 mx-4 mb-3 flex items-center justify-center gap-2 rounded-xl border border-gray-700/60 bg-gray-900/90 p-2 backdrop-blur lg:mx-0">
        <button
          type="button"
          aria-pressed={quality === "data-saver"}
          onClick={() => changeQuality("data-saver")}
          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
            quality === "data-saver"
              ? "bg-pink-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {copy.dataSaverQuality}
        </button>
        <button
          type="button"
          aria-pressed={quality === "data"}
          onClick={() => changeQuality("data")}
          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
            quality === "data"
              ? "bg-pink-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {copy.originalQuality}
        </button>
        {isLoading && <RefreshCw size={15} className="animate-spin text-pink-400" />}
      </div>

      <div ref={readerRef} className="w-full bg-black">
        {pages.map((src, index) => (
          <ChapterImage
            key={src}
            src={src}
            index={index}
            onSettled={handleImageSettled}
            pageAlt={formatMessage(common.pageImageAlt, { page: index + 1 })}
            errorLabel={common.noImage}
          />
        ))}
      </div>
    </section>
  );
}
