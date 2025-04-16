"use client";

import { lazy, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Comic } from "../../types/comic";
import ComicGrid from "../home/ComicGrid";
import { debounce } from "lodash";

const SkeletonComicGrid = lazy(() => import("../home/SkeletonComicGrid"));
const HamsterLoading = lazy(() => import("../loading/HamsterLoading"));

interface SearchClientProps {
  initialKeyword: string;
  initialComics: Comic[];
  initialError: string;
}

export default function SearchClient({
  initialKeyword,
  initialComics,
  initialError,
}: SearchClientProps) {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [comics, setComics] = useState(initialComics);
  const [error, setError] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);

  // debounce cho API calls
  const handleSearch = useCallback(debounce(async (searchKeyword: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/search?keyword=${encodeURIComponent(
          searchKeyword
        )}&nocache=${Date.now()}`
      );

      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      setComics(data.comics);
      setError("");
      setKeyword(searchKeyword);
    } catch (err) {
      console.error(err);
      setError("Không thể cập nhật kết quả tìm kiếm");
    } finally {
      setIsLoading(false);
    }
  }, 300), []);;

  // Sync with URL parameters
  useEffect(() => {
    const currentKeyword = searchParams.get("keyword") || "";
    if (currentKeyword !== keyword) {
      handleSearch(currentKeyword);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-400 mb-8">
          {keyword ? (
            <>
              Kết quả tìm kiếm cho:{" "}
              <span className="text-white">&ldquo;{keyword}&rdquo;</span>
            </>
          ) : (
            <div className="flex flex-col items-center gap-10">
              <p>Vui lòng nhập từ khóa tìm kiếm ...</p>
              <HamsterLoading />
            </div>
          )}
        </h2>

        {isLoading && <SkeletonComicGrid />}

        {error && (
          <div className="text-center py-12 text-red-500 font-medium">
            {error}
          </div>
        )}

        {keyword && !isLoading && comics.length > 0 && (
          <ComicGrid comics={comics} />
        )}

        {!isLoading && !error && comics.length === 0 && keyword && (
          <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-10">
            <p>
              Không tìm thấy truyện phù hợp với từ khóa &ldquo;
              <span className="text-white">{keyword}</span>&rdquo;
            </p>
            <HamsterLoading />
          </div>
        )}
      </div>
    </div>
  );
}
