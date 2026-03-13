"use client";

import { memo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FixedSizeList as List } from "react-window";
import type { Chapter } from "@/types/common";

interface VirtualChapterListProps {
  chapters: Chapter[];
  comicSlug: string;
  activeChapter?: string;
}

const ITEM_HEIGHT = 44;

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
  const isActive = chapter.chapter_name === activeChapter;

  return (
    <div style={style} className="px-2">
      <Link
        href={`/truyen-tranh/${comicSlug}/${chapter.chapter_name}`}
        className={`flex items-center justify-between px-4 h-10 rounded-lg text-sm transition-colors duration-150
          ${isActive
            ? "bg-pink-500/20 text-pink-300 border border-pink-500/40 font-semibold"
            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
          }`}
      >
        <span>Chapter {chapter.chapter_name}</span>
        {chapter.chapter_title && (
          <span className="text-gray-500 text-xs truncate max-w-[60%] text-right">
            {chapter.chapter_title}
          </span>
        )}
      </Link>
    </div>
  );
});

ChapterRow.displayName = "ChapterRow";

/**
 * Dùng ResizeObserver để đo width container thay vì AutoSizer
 * (tránh phụ thuộc vào API deprecated)
 */
function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(300);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Lấy width ban đầu
    setWidth(el.offsetWidth);

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
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

  // Dưới 20 chapter → render thường, không cần virtual scroll
  if (chapters.length < 20) {
    return (
      <div className="space-y-0.5">
        {chapters.map((chapter, index) => (
          <ChapterRow
            key={chapter.chapter_name}
            index={index}
            style={{}}
            data={itemData}
          />
        ))}
      </div>
    );
  }

  // Virtual scroll cho danh sách >= 20 chapters
  const listHeight = Math.min(chapters.length * ITEM_HEIGHT, 480);

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
