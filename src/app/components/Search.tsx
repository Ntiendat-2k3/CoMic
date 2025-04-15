"use client";

import {
  useEffect,
  useRef,
  memo,
  useState,
  useCallback,
  useMemo
} from "react";
import Link from "next/link";
import { debounce } from "lodash";
import ImageFallback from "../utils/ImageFallback";
import { Comic } from "../types/comic";
import dynamic from "next/dynamic";

const LoadingSkeletonSearch = dynamic(
  () => import("./loading/LoadingSkeletonSearch"),
  {
    ssr: false,
    loading: () => <div className="p-3">Đang tải...</div>
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
    const debouncedSearchRef = useRef<ReturnType<typeof debounce> | null>(null);

    // Xử lý submit form
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(inputValue);
        setShowSuggestions(false);
        inputRef.current?.blur();
      },
      [onSubmit, inputValue, setShowSuggestions]
    );

    // Xử lý thay đổi input với debounce
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        debouncedSearchRef.current?.(e.target.value);
      },
      []
    );

    // Khởi tạo debounce
    useEffect(() => {
      debouncedSearchRef.current = debounce((keyword: string) => {
        onSearch(keyword);
      }, 500);

      return () => {
        debouncedSearchRef.current?.cancel();
      };
    }, [onSearch]);

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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [setShowSuggestions]);

    // Memoize danh sách kết quả
    const renderResults = useMemo(
      () =>
        searchResults.map((comic) => (
          <SearchResultItem key={comic.slug} comic={comic} />
        )),
      [searchResults]
    );

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

        {showSuggestions && (
          <div className="absolute top-full w-full lg:w-[400px] mt-2 bg-dark-gradient rounded-lg shadow-xl max-h-96 overflow-y-auto custom-scrollbar z-50">
            {isLoading ? (
              <LoadingSkeletonSearch />
            ) : searchResults.length > 0 ? (
              renderResults
            ) : (
              <div className="p-4 text-gray-300">Không tìm thấy kết quả</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

// Component con cho từng kết quả tìm kiếm
const SearchResultItem = memo(({ comic }: { comic: Comic }) => (
  <Link
    href={`/truyen-tranh/${comic.slug}`}
    className="flex items-center gap-3 p-3 hover:bg-primary-light/10 transition-colors border-b border-primary-light/5"
    prefetch={false} // Tắt prefetch cho các item không quan trọng
  >
    <OptimizedImage
      src={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
      alt={comic.name}
    />
    <div className="flex-1 min-w-0">
      <div className="font-medium truncate">{comic.name}</div>
      <div className="mt-1 text-sm text-gray-300 flex flex-col">
        <span>
          Chap {comic.chaptersLatest?.[0]?.chapter_name || "mới nhất"}
        </span>
        <div className="line-clamp-1 text-gray-500">
          {comic.category.map((c) => c.name).join(", ")}
        </div>
      </div>
    </div>
  </Link>
));

// Component hình ảnh được tối ưu
const OptimizedImage = memo(
  ({ src, alt }: { src: string; alt: string }) => (
    <ImageFallback
      src={src}
      alt={alt}
      width={80}
      height={120}
      className="w-12 h-15 object-cover rounded-sm"
    />
  )
);

Search.displayName = "Search";
export default Search;