"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, BookmarkCheck, Book, Play } from "lucide-react"

interface ActionButtonsProps {
  comicSlug: string
  firstChapterSlug: string
}

export default function ActionButtons({ comicSlug, firstChapterSlug }: ActionButtonsProps) {
  const [following, setFollowing] = useState(false)
  const [continueSlug, setContinueSlug] = useState<string | undefined>()

  /* --------- đồng bộ với localStorage khi mount --------- */
  useEffect(() => {
    if (typeof window === "undefined") return

    setFollowing(localStorage.getItem(`follow-${comicSlug}`) === "true")
    const last = localStorage.getItem(`lastRead-${comicSlug}`)
    if (last) setContinueSlug(last)
  }, [comicSlug])

  /* --------- helpers --------- */
  const toggleFollow = () => {
    const newState = !following
    setFollowing(newState)
    localStorage.setItem(`follow-${comicSlug}`, String(newState))
  }

  /** mỗi khi user bấm vô link chapter, lưu lại để nút "Đọc tiếp" lần sau */
  const handleRead = (slug: string) => () => localStorage.setItem(`lastRead-${comicSlug}`, slug)

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {/* Primary action - Đọc từ đầu hoặc Đọc tiếp */}
      {continueSlug ? (
        <Link
          href={`/truyen-tranh/${comicSlug}/${continueSlug}`}
          onClick={handleRead(continueSlug)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors flex-1 sm:flex-none"
        >
          <Play size={18} />
          <span>Đọc tiếp</span>
          <span className="hidden sm:inline">({continueSlug})</span>
        </Link>
      ) : (
        <Link
          href={`/truyen-tranh/${comicSlug}/${firstChapterSlug}`}
          onClick={handleRead(firstChapterSlug)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors flex-1 sm:flex-none"
        >
          <Book size={18} />
          <span>Đọc từ đầu</span>
        </Link>
      )}

      {/* Secondary actions */}
      <div className="flex gap-2">
        {/* Theo dõi */}
        <button
          onClick={toggleFollow}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-lg font-medium transition-colors flex-1 sm:flex-none ${
            following ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-600 hover:bg-gray-500 text-white"
          }`}
        >
          {following ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          <span className="hidden sm:inline">{following ? "Đã theo dõi" : "Theo dõi"}</span>
        </button>

        {/* Đọc từ đầu (nếu đang có đọc tiếp) */}
        {continueSlug && (
          <Link
            href={`/truyen-tranh/${comicSlug}/${firstChapterSlug}`}
            onClick={handleRead(firstChapterSlug)}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-lg font-medium bg-gray-600 hover:bg-gray-500 text-white transition-colors"
          >
            <Book size={18} />
            <span className="hidden sm:inline">Từ đầu</span>
          </Link>
        )}
      </div>
    </div>
  )
}
