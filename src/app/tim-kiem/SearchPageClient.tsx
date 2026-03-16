"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { useSearchQuery } from "@/hooks/queries/useComicQueries"
import { useDebounce } from "@/hooks/useDebounce"
import ComicGrid from "@/components/comic/ComicGrid"
import AdvancedFilter from "@/components/search/AdvancedFilter"

const DEFAULT_CDN = "https://img.otruyenapi.com"

interface SearchPageClientProps {
  initialKeyword: string
}

export default function SearchPageClient({ initialKeyword }: SearchPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [input, setInput] = useState(initialKeyword)
  const debouncedKeyword = useDebounce(input, 500)

  const filterCategory = searchParams.get("category")
  const filterStatus = searchParams.get("status")

  // Sync URL khi keyword đổi
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("keyword", debouncedKeyword.trim())
      router.replace(`/tim-kiem?${params.toString()}`, {
        scroll: false,
      })
    } else if (input === "") {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("keyword")
      router.replace(`/tim-kiem${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      })
    }
  }, [debouncedKeyword, router, searchParams, input])

  const {
    data: rawResults = [],
    isLoading,
    isFetching,
    isError,
  } = useSearchQuery(debouncedKeyword)

  // Client-side filtering when keyword is provided and filters are active
  const results = useMemo(() => {
    let filtered = rawResults
    if (filterCategory) {
      filtered = filtered.filter(comic => 
        comic.category && comic.category.some(c => c.slug === filterCategory)
      )
    }
    if (filterStatus) {
      filtered = filtered.filter(comic => {
        // OTruyen API status check
        if (filterStatus === "dang-phat-hanh") return comic.status.toLowerCase().includes("đang");
        if (filterStatus === "hoan-thanh") return comic.status.toLowerCase().includes("hoàn");
        if (filterStatus === "sap-ra-mat") return comic.status.toLowerCase().includes("sắp");
        return true;
      })
    }
    return filtered
  }, [rawResults, filterCategory, filterStatus])

  const showNoSupportMessage = (!debouncedKeyword && filterCategory && filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Tìm kiếm truyện</h1>
        <p className="text-gray-400 text-sm">Sử dụng bộ lọc và từ khóa để tìm truyện dễ dàng hơn</p>
      </div>

      <AdvancedFilter />

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

      {showNoSupportMessage && (
        <div className="text-center py-6 text-yellow-500 glass-panel rounded-xl mt-4">
          <p>Lọc kết hợp hai điều kiện <strong>Thể Loại</strong> và <strong>Trạng Thái</strong> yêu cầu phải nhập <strong>từ khóa tìm kiếm</strong> do giới hạn API.</p>
        </div>
      )}

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
              ? `Tìm thấy ${results.length} kết quả phù hợp`
              : `Không tìm thấy kết quả phù hợp với bộ lọc hiện tại`}
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
      {!debouncedKeyword && !isLoading && !showNoSupportMessage && (
        <div className="text-center py-16 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>Nhập từ khóa hoặc chọn bộ lọc để bắt đầu</p>
        </div>
      )}
    </div>
  )
}
