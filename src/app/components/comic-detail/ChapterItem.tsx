import { Chapter } from "@/app/types/common";
import Link from "next/link";

interface ChapterItemProps {
  chapter: Chapter;
  comicSlug: string;
}

const ChapterItem = ({ chapter, comicSlug }: ChapterItemProps) => {
  return (
    <Link
      key={`chapter-item-${comicSlug}-${chapter.chapter_name}-${chapter.chapter_api_data}`}
      href={`/truyen-tranh/${comicSlug}/${chapter.chapter_name}`}
      className="group flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-gray-700 hover:border-primary-accent"
    >
      <div className="flex-1 min-w-0">
        <span className="text-base font-medium text-white truncate">
          Chương {chapter.chapter_name}
        </span>
        {chapter.chapter_title && (
          <span className="text-gray-400 text-sm ml-2 truncate">
            - {chapter.chapter_title}
          </span>
        )}
      </div>
      <div className="ml-4 flex-shrink-0">
        <span className="text-primary-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Đọc ngay →
        </span>
      </div>
    </Link>
  );
};

export default ChapterItem;