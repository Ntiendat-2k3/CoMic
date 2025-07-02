"use client"

import type React from "react"

import { useEffect, useRef, memo, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"
import ImageFallback from "../utils/ImageFallback"
import type { Comic } from "../types/comic"

interface SearchProps {
  searchResults: Comic[]
  isLoading: boolean
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  onSearch: (keyword: string) => void
  onSubmit: (keyword: string) => void
}

// Optimized Search Result Item with prefetch and preload
const SearchResultItem = memo(({ comic, onClick }: { comic: Comic; onClick: () => void }) => {
  const router = useRouter()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onClick() // Close dropdown

      // Optimistic navigation - faster than Link
      router.push(`/truyen-tranh/${comic.slug}`)
    },
    [onClick, router, comic.slug],
  )

  const handleMouseEnter = useCallback(() => {
    // Prefetch on hover for instant navigation
    router.prefetch(`/truyen-tranh/${comic.slug}`)
  }, [router, comic.slug])

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="flex items-center gap-3 p-3 hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700/20 cursor-pointer"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div className="w-12 h-15 flex-shrink-0">
        <ImageFallback
          src={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
          alt={comic.name}
          width={48}
          height={60}
          className="w-full h-full object-cover rounded-sm"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate text-white">{comic.name}</div>
        <div className="mt-1 text-sm text-gray-300 flex flex-col">
          <span>Chap {comic.chaptersLatest?.[0]?.chapter_name || "mới nhất"}</span>
          <div className="line-clamp-1 text-gray-500">{comic.category.map((c) => c.name).join(", ")}</div>
        </div>
      </div>
      <div className="flex-shrink-0 text-blue-400 text-sm">→</div>
    </div>
  )
})

SearchResultItem.displayName = "SearchResultItem"

const Search = memo(
  ({ searchResults, isLoading, showSuggestions, setShowSuggestions, onSearch, onSubmit }: SearchProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null)
    const router = useRouter()

    // Prefetch top results on search
    useEffect(() => {
      if (searchResults.length > 0) {
        // Prefetch first 3 results for instant navigation
        searchResults.slice(0, 3).forEach((comic) => {
          router.prefetch(`/truyen-tranh/${comic.slug}`)
        })
      }
    }, [searchResults, router])

    // Optimized submit handler
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
          onSubmit(inputValue)
          setShowSuggestions(false)
          inputRef.current?.blur()
        }
      },
      [onSubmit, inputValue, setShowSuggestions],
    )

    // Optimized input change handler
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
        if (value.trim()) {
          setShowSuggestions(true)
          debouncedSearchRef.current?.(value)
        } else {
          setShowSuggestions(false)
        }
      },
      [setShowSuggestions],
    )

    // Initialize debounced search
    useEffect(() => {
      debouncedSearchRef.current = debounce((keyword: string) => {
        onSearch(keyword)
      }, 300)

      return () => {
        debouncedSearchRef.current?.cancel()
      }
    }, [onSearch])

    // Simplified click outside handler
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setShowSuggestions(false)
        }
      }

      if (showSuggestions) {
        document.addEventListener("click", handleClickOutside)
        return () => {
          document.removeEventListener("click", handleClickOutside)
        }
      }
    }, [showSuggestions, setShowSuggestions])

    // Optimized close handler
    const handleClose = useCallback(() => {
      setShowSuggestions(false)
    }, [setShowSuggestions])

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowSuggestions(false)
          inputRef.current?.blur()
        }
      },
      [setShowSuggestions],
    )

    // Memoized results list
    const renderResults = useMemo(() => {
      return searchResults
        .slice(0, 8)
        .map((comic) => <SearchResultItem key={comic.slug} comic={comic} onClick={handleClose} />)
    }, [searchResults, handleClose])

    return (
      <div className="relative flex-1 w-full" ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-200 focus-within:border-pink-400/50">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm truyện..."
              aria-label="Tìm kiếm truyện"
              role="searchbox"
              className="w-full px-4 py-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => {
                if (inputValue.trim() && searchResults.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 transition-colors duration-200 flex-shrink-0"
              aria-label="Tìm kiếm"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (inputValue.trim() || searchResults.length > 0) && (
          <div
            className="absolute top-full left-0 right-0 lg:w-[400px] mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-hidden"
            style={{
              zIndex: 99999,
              position: "absolute",
            }}
          >
            {isLoading ? (
              <div className="space-y-3 p-3">
                <div className="text-center text-gray-400">🔄 Đang tìm kiếm...</div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-15 bg-gray-700/50 rounded-sm" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                      <div className="h-3 bg-gray-700/50 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="overflow-y-auto max-h-96">
                <div className="py-2">{renderResults}</div>
                {searchResults.length > 8 && (
                  <div className="border-t border-gray-700/30 p-3 text-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (inputValue.trim()) {
                          router.push(`/tim-kiem?keyword=${encodeURIComponent(inputValue)}`)
                          setShowSuggestions(false)
                        }
                      }}
                      className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors duration-200 cursor-pointer"
                    >
                      Xem tất cả {searchResults.length} kết quả →
                    </button>
                  </div>
                )}
              </div>
            ) : inputValue.trim() ? (
              <div className="p-4 text-gray-400 text-center">
                <div className="mb-2">Không tìm thấy kết quả cho "{inputValue}"</div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/tim-kiem?keyword=${encodeURIComponent(inputValue)}`)
                    setShowSuggestions(false)
                  }}
                  className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors duration-200 cursor-pointer"
                >
                  Tìm kiếm nâng cao →
                </button>
              </div>
            ) : (
              <div className="p-4 text-gray-400 text-center">
                <div className="mb-2">💡 Gợi ý tìm kiếm:</div>
                <div className="text-sm space-y-1">
                  <div>• Tên truyện: "One Piece", "Naruto"</div>
                  <div>• Tác giả: "Oda Eiichiro"</div>
                  <div>• Thể loại: "Action", "Romance"</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
)

Search.displayName = "Search"

export default Search
