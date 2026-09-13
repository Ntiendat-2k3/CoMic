"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  removeFavorite,
  selectAllFavorites,
} from "@/store/slices/favoritesSlice";
import { selectReadingHistory } from "@/store/slices/readingSlice";
import { useHydrated } from "@/hooks/useHydrated";

/** Kết hợp yêu thích và tiến độ đọc thành model dành riêng cho giao diện. */
export function useFavoritesController() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectAllFavorites);
  const readingHistory = useAppSelector(selectReadingHistory);
  const hydrated = useHydrated();
  const remove = useCallback(
    (slug: string) => dispatch(removeFavorite(slug)),
    [dispatch],
  );
  const items = favorites.map((favorite) => ({
    favorite,
    lastRead: readingHistory[favorite.slug],
  }));

  return { items, hydrated, remove };
}
