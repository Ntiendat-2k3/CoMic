"use client";

import { useState } from "react";
import { useHomeQuery } from "@/hooks/queries/useHomeQuery";
import type { HomeResponse } from "@/types/response";

/** Điều phối phân trang và truy vấn dữ liệu cho trang chủ. */
export function useHomePageController(initialData?: HomeResponse) {
  const [page, setPage] = useState(1);
  const query = useHomeQuery(page, initialData);

  return {
    page,
    setPage,
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
