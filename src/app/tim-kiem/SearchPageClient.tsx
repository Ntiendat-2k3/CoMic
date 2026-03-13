"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { useSearchQuery } from "@/hooks/queries/useComicQueries"
import { useDebounce } from "@/hooks/useDebounce"
import ComicGrid from "@/components/comic/ComicGrid"

const DEFAULT_CDN = "https://img.otruyenapi.com"

interface SearchPageClientProps {
  initialKeyword: string
}

export default function SearchPageClient({ initialKeyword }: SearchPageClientProps) {
  const router = useRouter()
  const [input, setInput] = useState(initialKeyword)
  const debouncedKeyword = useDebounce(input, 500)

  // Sync URL khi keyword đổi
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      router.replace(`/tim-kiem?keyword=${encodeURIComponent(debouncedKeyword.trim())}`, {
        scroll: false,
      })
    }
  }, [debouncedKeyword, router])

  const {
    data: results = [],
    isLoading,
    isFetching,
    isError,
  } = useSearchQuery(debouncedKeyword)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Tìm kiếm truyện</h1>
        <p className="text-gray-400 text-sm">Nhập tên truyện để tìm kiếm</p>
      </div>

      {/* Search input */}
      <div className="relative max-w-xl mx-auto">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tên truyện..."
          autoFocus
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/60 transition-colors text-base"
        />
        {isFetching && (
          <Loader2
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 animate-spin"
          />
        )}
      </div>

      {/* Status / Results */}
      {isError && (
        <div className="text-center py-10 text-red-400">
          Không thể tải kết quả. Vui lòng thử lại.
        </div>
      )}

      {!isLoading && !isError && debouncedKeyword && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            {results.length > 0
              ? `Tìm thấy ${results.length} kết quả cho "${debouncedKeyword}"`
              : `Không tìm thấy kết quả cho "${debouncedKeyword}"`}
          </span>
        </div>
      )}

      {/* Comic Grid */}
      <ComicGrid
        comics={results}
        cdnUrl={DEFAULT_CDN}
        isLoading={isLoading && Boolean(debouncedKeyword)}
        skeletonCount={10}
      />

      {/* Empty state */}
      {!debouncedKeyword && !isLoading && (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>Hãy nhập từ khóa để bắt đầu tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
