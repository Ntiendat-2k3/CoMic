"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearHistory,
  removeEntry,
  selectAllHistory,
} from "@/store/slices/readingSlice";
import { useHydrated } from "@/hooks/useHydrated";

/** Kết nối trang lịch sử với store và che chi tiết Redux khỏi lớp hiển thị. */
export function useHistoryController() {
  const dispatch = useAppDispatch();
  const history = useAppSelector(selectAllHistory);
  const hydrated = useHydrated();
  const clear = useCallback(() => dispatch(clearHistory()), [dispatch]);
  const remove = useCallback(
    (slug: string) => dispatch(removeEntry(slug)),
    [dispatch],
  );

  return { history, hydrated, clear, remove };
}
