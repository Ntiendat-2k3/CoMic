"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchQuery } from "@/hooks/queries/useComicQueries";

const DEFAULT_CDN = "https://img.otruyenapi.com";

export default function SearchBox() {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedKeyword = useDebounce(input, 400);

  const { data: results = [], isFetching } = useSearchQuery(
    debouncedKeyword,
    open && debouncedKeyword.length >= 2
  );

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/tim-kiem?keyword=${encodeURIComponent(input.trim())}`);
    setOpen(false);
  };

  const handleClear = () => {
    setInput("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tìm kiếm truyện..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700/60 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500/60 transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isFetching && <Loader2 size={16} className="text-pink-400 animate-spin" />}
          {!isFetching && input && (
            <button type="button" onClick={handleClear}>
              <X size={16} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown suggestions */}
      {open && input.length >= 2 && (
        <div className="absolute top-full mt-2 inset-x-0 bg-gray-900/95 border border-gray-700/60 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {results.length === 0 && !isFetching && (
            <p className="py-4 text-center text-sm text-gray-500">
              Không tìm thấy kết quả nào
            </p>
          )}

          {results.slice(0, 8).map((comic) => (
            <Link
              key={comic._id || comic.slug}
              href={`/truyen-tranh/${comic.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 last:border-0"
            >
              <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-700/50">
                <Image
                  src={`${DEFAULT_CDN}/uploads/comics/${comic.thumb_url}`}
                  alt={comic.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{comic.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {comic.category.slice(0, 2).map((c) => c.name).join(" · ")}
                </p>
              </div>
            </Link>
          ))}

          {results.length > 0 && (
            <button
              onClick={handleSubmit}
              className="w-full py-2.5 text-center text-sm text-pink-400 hover:text-pink-300 hover:bg-gray-800/50 transition-colors font-medium"
            >
              Xem tất cả {results.length} kết quả →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
