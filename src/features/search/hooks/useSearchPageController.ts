"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { matchesComicStatus } from "@/domain/comic/matches-comic-status";
import { useSearchQuery } from "@/hooks/queries/useSearchQuery";
import { useDebounce } from "@/hooks/useDebounce";

/** Điều phối URL, truy vấn và lọc dữ liệu cho trang tìm kiếm. */
export function useSearchPageController(initialKeyword: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [input, setInput] = useState(initialKeyword);
  const debouncedKeyword = useDebounce(input, 500);
  const filterCategory = searchParams.get("category");
  const filterStatus = searchParams.get("status");

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const keyword = debouncedKeyword.trim();

    if (keyword) {
      params.set("keyword", keyword);
    } else if (input === "") {
      params.delete("keyword");
    } else {
      return;
    }

    const nextSearch = params.toString();
    const nextUrl = `/tim-kiem${nextSearch ? `?${nextSearch}` : ""}`;
    const currentUrl = `/tim-kiem${searchParamsString ? `?${searchParamsString}` : ""}`;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [debouncedKeyword, input, router, searchParamsString]);

  const query = useSearchQuery(debouncedKeyword);
  const results = useMemo(
    () =>
      (query.data ?? []).filter((comic) => {
        const matchesCategory = filterCategory
          ? comic.category?.some((category) => category.slug === filterCategory)
          : true;
        const matchesStatus = filterStatus
          ? matchesComicStatus(comic.status, filterStatus)
          : true;

        return matchesCategory && matchesStatus;
      }),
    [filterCategory, filterStatus, query.data],
  );

  return {
    input,
    setInput,
    debouncedKeyword,
    results,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    showUnsupportedFilters: Boolean(
      !debouncedKeyword && filterCategory && filterStatus,
    ),
  };
}
