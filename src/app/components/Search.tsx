"use client"

import type React from "react"

import { useEffect, useRef, memo, useState, useCallback, useMemo } from "react"
import Link from "next/link"
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

// Optimized Search Result Item
const SearchResultItem = memo(({ comic, onClick }: { comic: Comic; onClick: () => void }) => (
  <Link
    href={`/truyen-tranh/${comic.slug}`}
    className="flex items-center gap-3 p-3 md:hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-700/20"
    onClick={onClick}
    prefetch={false}
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
  </Link>
))

SearchResultItem.displayName = "SearchResultItem"

const Search = memo(
  ({ searchResults, isLoading, showSuggestions, setShowSuggestions, onSearch, onSubmit }: SearchProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null)

    // Optimized submit handler
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(inputValue)
        setShowSuggestions(false)
        inputRef.current?.blur()
      },
      [onSubmit, inputValue, setShowSuggestions],
    )

    // Optimized input change handler
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
      debouncedSearchRef.current?.(value)
    }, [])

    // Initialize debounced search with longer delay
    useEffect(() => {
      debouncedSearchRef.current = debounce((keyword: string) => {
        onSearch(keyword)
      }, 500) // Increased debounce time to reduce API calls

      return () => {
        debouncedSearchRef.current?.cancel()
      }
    }, [onSearch])

    // Optimized click outside handler
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setShowSuggestions(false)
        }
      }

      if (showSuggestions) {
        document.addEventListener("mousedown", handleClickOutside, { passive: true })
        return () => {
          document.removeEventListener("mousedown", handleClickOutside)
        }
      }
    }, [showSuggestions, setShowSuggestions])

    // Optimized close handler
    const handleClose = useCallback(() => {
      setShowSuggestions(false)
    }, [setShowSuggestions])

    // Memoized results list - limit results for performance
    const renderResults = useMemo(
      () =>
        searchResults
          .slice(0, 8)
          .map((comic) => <SearchResultItem key={comic.slug} comic={comic} onClick={handleClose} />),
      [searchResults, handleClose],
    )

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
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSuggestions(false)
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 md:hover:bg-pink-700 transition-colors duration-200"
              aria-label="Tìm kiếm"
            >
              🔍
            </button>
          </div>
        </form>

        {showSuggestions && (
          <div
            className="absolute top-full w-full lg:w-[400px] mt-2 bg-gray-900/95 border border-gray-700/50 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
            style={{ willChange: "transform" }}
          >
            {isLoading ? (
              <div className="space-y-3 p-3">
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
              <div className="py-2">{renderResults}</div>
            ) : inputValue.trim() ? (
              <div className="p-4 text-gray-400 text-center">Không tìm thấy kết quả</div>
            ) : (
              <div className="p-4 text-gray-400 text-center">Nhập từ khóa để tìm kiếm</div>
            )}
          </div>
        )}
      </div>
    )
  },
)

Search.displayName = "Search"

export default Search
