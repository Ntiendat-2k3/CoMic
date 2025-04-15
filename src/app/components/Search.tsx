"use client";

import { useEffect, useRef, memo, useState, useCallback } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import ImageFallback from "../utils/ImageFallback";
import { Comic } from "../types/comic";
import dynamic from "next/dynamic";

const LoadingSkeletonSearch = dynamic(
  () => import("./loading/LoadingSkeletonSearch"),
  {
    ssr: true,
  }
);

interface SearchProps {
  searchResults: Comic[];
  isLoading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  onSearch: (keyword: string) => void;
  onSubmit: (keyword: string) => void;
}

const Search = memo(
  ({
    searchResults,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    onSearch,
    onSubmit,
  }: SearchProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Xử lý click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSuggestions]);

    // Debounce search
    const debouncedSearch = useCallback(
      debounce((keyword: string) => {
        onSearch(keyword);
      }, 500),
      [onSearch] // Thêm dependency nếu cần
    );

    useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
    }, [debouncedSearch]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(inputValue);
      setShowSuggestions(false);
      inputRef.current?.blur();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      debouncedSearch(e.target.value);
    };

    return (
      <div className="relative flex-1 max-w-xl" ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-light/20">
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
                if (e.key === "Escape") setShowSuggestions(false);
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-accent hover:bg-primary-accent/80 transition-colors"
              aria-label="Tìm kiếm"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Dropdown gợi ý */}
        {showSuggestions && (
          <div className="absolute top-full w-full lg:w-[400px] mt-2 bg-dark-gradient rounded-lg shadow-xl max-h-96 overflow-y-auto custom-scrollbar z-50">
            {isLoading ? (
              <LoadingSkeletonSearch />
            ) : searchResults.length > 0 ? (
              searchResults.map((comic) => (
                <Link
                  key={comic.slug}
                  href={`/truyen-tranh/${comic.slug}`}
                  className="flex items-center gap-3 p-3 hover:bg-primary-light/10 transition-colors border-b border-primary-light/5"
                >
                  <ImageFallback
                    src={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
                    alt={comic.name}
                    width={80}
                    height={120}
                    className="w-12 h-15 object-cover rounded-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{comic.name}</div>
                    <div className="mt-1 text-sm text-gray-300 flex flex-col">
                      <span>
                        Chap{" "}
                        {comic.chaptersLatest?.[0]?.chapter_name || "mới nhất"}
                      </span>
                      <div className="line-clamp-1 text-gray-500">
                        {comic.category.map((c) => c.name).join(", ")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              !isLoading && (
                <div className="p-4 text-gray-300">Không tìm thấy kết quả</div>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

Search.displayName = "Search";

export default Search;
