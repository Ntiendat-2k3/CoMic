import type { Chapter } from "@/app/types/common"
import Link from "next/link"

interface ChapterItemProps {
  chapter: Chapter
  comicSlug: string
}

const ChapterItem = ({ chapter, comicSlug }: ChapterItemProps) => {
  return (
    <Link
      href={`/truyen-tranh/${comicSlug}/${chapter.chapter_name}`}
      className="block p-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-lg transition-colors border border-gray-600 hover:border-gray-500 touch-manipulation"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium flex-shrink-0">
              {chapter.chapter_name}
            </span>
            <span className="text-white font-medium text-sm sm:text-base truncate">
              <span className="hidden sm:inline">Chương </span>
              {chapter.chapter_name}
            </span>
          </div>
          {chapter.chapter_title && (
            <p className="text-gray-400 text-xs sm:text-sm mt-1 ml-8 sm:ml-12 truncate">{chapter.chapter_title}</p>
          )}
        </div>
        <div className="ml-2 sm:ml-4 flex-shrink-0">
          <span className="text-blue-400 text-sm">→</span>
        </div>
      </div>
    </Link>
  )
}

export default ChapterItem
