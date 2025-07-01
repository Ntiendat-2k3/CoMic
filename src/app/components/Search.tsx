"use client"

import type React from "react"

import { useEffect, useRef, memo, useState, useCallback, useMemo, lazy } from "react"
import Link from "next/link"
import { debounce } from "lodash"
import ImageFallback from "../utils/ImageFallback"
import type { Comic } from "../types/comic"

const LoadingSkeletonSearch = lazy(() => import("./loading/LoadingSkeletonSearch"))

interface SearchProps {
  searchResults: Comic[]
  isLoading: boolean
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  onSearch: (keyword: string) => void
  onSubmit: (keyword: string) => void
}

// Memoized Search Result Item
const SearchResultItem = memo(({ comic, onClick }: { comic: Comic; onClick: () => void }) => (
  <Link
    href={`/truyen-tranh/${comic.slug}`}
    className="flex items-center gap-3 p-3 hover:bg-primary-light/10 transition-colors duration-200 border-b border-primary-light/5"
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

    // Memoized submit handler
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(inputValue)
        setShowSuggestions(false)
        inputRef.current?.blur()
      },
      [onSubmit, inputValue, setShowSuggestions],
    )

    // Memoized input change handler
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
      debouncedSearchRef.current?.(value)
    }, [])

    // Initialize debounced search
    useEffect(() => {
      debouncedSearchRef.current = debounce((keyword: string) => {
        onSearch(keyword)
      }, 300) // Reduced debounce time for better UX

      return () => {
        debouncedSearchRef.current?.cancel()
      }
    }, [onSearch])

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setShowSuggestions(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [setShowSuggestions])

    // Memoized close handler
    const handleClose = useCallback(() => {
      setShowSuggestions(false)
    }, [setShowSuggestions])

    // Memoized results list
    const renderResults = useMemo(
      () => searchResults.map((comic) => <SearchResultItem key={comic.slug} comic={comic} onClick={handleClose} />),
      [searchResults, handleClose],
    )

    return (
      <div className="relative flex-1 w-full" ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-light/20 transition-all duration-200 focus-within:border-pink-400/50">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm truyện..."
              aria-label="Tìm kiếm truyện"
              role="searchbox"
              className="w-full px-4 py-2 bg-transparent text-white focus:outline-none placeholder-gray-300"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSuggestions(false)
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-accent hover:bg-primary-accent/80 transition-colors duration-200"
              aria-label="Tìm kiếm"
            >
              🔍
            </button>
          </div>
        </form>

        {showSuggestions && (
          <div className="absolute top-full w-full lg:w-[400px] mt-2 bg-dark-gradient rounded-lg shadow-xl max-h-96 overflow-y-auto custom-scrollbar z-50 border border-pink-glow/20">
            {isLoading ? (
              <LoadingSkeletonSearch />
            ) : searchResults.length > 0 ? (
              <div className="py-2">{renderResults}</div>
            ) : inputValue.trim() ? (
              <div className="p-4 text-gray-300 text-center">Không tìm thấy kết quả</div>
            ) : (
              <div className="p-4 text-gray-300 text-center">Nhập từ khóa để tìm kiếm</div>
            )}
          </div>
        )}
      </div>
    )
  },
)

Search.displayName = "Search"

export default Search
