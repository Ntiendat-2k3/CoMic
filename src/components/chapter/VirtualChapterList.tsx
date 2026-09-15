"use client";

import { memo, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import type { Chapter } from "@/types/common";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import ChapterDownloadButton from "./ChapterDownloadButton";

interface VirtualChapterListProps {
  chapters: Chapter[];
  comicSlug: string;
  activeChapter?: string;
}

const ITEM_HEIGHT = 68;

interface RowData {
  chapters: Chapter[];
  comicSlug: string;
  activeChapter?: string;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: RowData;
}

const ChapterRow = memo(({ index, style, data }: RowProps) => {
  const { chapters, comicSlug, activeChapter } = data;
  const chapter = chapters[index];
  const chapterSlug = chapter.chapter_slug ?? chapter.chapter_name;
  const isActive = chapterSlug === activeChapter;
  const { common, comic, locale } = useDictionary();
  const publishedAt = chapter.published_at
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(chapter.published_at))
    : null;
  const href = `/truyen-tranh/${comicSlug}/${chapterSlug}`;

  return (
    <div style={style} className="px-1 py-1">
      <div className={`flex h-[60px] items-center gap-2 overflow-hidden rounded-2xl border px-3 transition-colors ${
        isActive
          ? "border-pink-400/70 bg-pink-500/12 shadow-[inset_0_0_24px_rgba(236,72,153,.08)]"
          : "border-white/[0.07] bg-[#151924]/78 hover:border-pink-400/25"
      }`}>
        <Link href={href} className="min-w-0 flex-1">
          <span className="flex min-w-0 items-center gap-2">
            <strong className="truncate text-sm text-gray-100">
              {formatMessage(common.chapter, {
                chapter: chapter.chapter_name ?? common.unknown,
              })}
            </strong>
            {index === 0 ? (
              <span className="flex-none rounded-full bg-pink-500 px-2 py-0.5 text-[9px] font-bold text-white">
                {comic.newBadge}
              </span>
            ) : null}
          </span>
          <span className="mt-1 flex min-w-0 items-center gap-2 text-[10px] text-gray-500">
            {chapter.chapter_title ? <span className="truncate">{chapter.chapter_title}</span> : null}
            {publishedAt ? <time className="ml-auto flex-none">{publishedAt}</time> : null}
          </span>
        </Link>

        <ChapterDownloadButton comicSlug={comicSlug} chapter={chapter} />
        <Link
          href={href}
          className={`grid size-9 flex-none place-items-center rounded-full ${
            isActive ? "bg-pink-500 text-white" : "bg-white/[0.05] text-gray-200 hover:bg-pink-500 hover:text-white"
          }`}
          aria-label={formatMessage(comic.readChapterAriaLabel, {
            chapter: chapter.chapter_name ?? common.unknown,
          })}
        >
          <Play size={14} fill="currentColor" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
});

ChapterRow.displayName = "ChapterRow";

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(300);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setWidth(element.offsetWidth);
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

const VirtualChapterList = memo(({
  chapters,
  comicSlug,
  activeChapter,
}: VirtualChapterListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const itemData: RowData = { chapters, comicSlug, activeChapter };

  if (chapters.length < 20) {
    return (
      <div>
        {chapters.map((chapter, index) => (
          <ChapterRow
            key={chapter.chapter_slug ?? chapter.chapter_name}
            index={index}
            style={{}}
            data={itemData}
          />
        ))}
      </div>
    );
  }

  const listHeight = Math.min(chapters.length * ITEM_HEIGHT, 520);

  return (
    <div ref={containerRef} style={{ height: listHeight }}>
      <List
        height={listHeight}
        itemCount={chapters.length}
        itemSize={ITEM_HEIGHT}
        width={containerWidth}
        itemData={itemData}
        overscanCount={5}
      >
        {ChapterRow}
      </List>
    </div>
  );
});

VirtualChapterList.displayName = "VirtualChapterList";
export default VirtualChapterList;
