"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectIsFavorite,
  toggleFavorite,
} from "@/store/slices/favoritesSlice";
import type { Comic } from "@/types/comic";
import { useHydrated } from "@/hooks/useHydrated";

/** Đóng gói thao tác yêu thích để component nút chỉ xử lý hiển thị. */
export function useComicActionsController(
  comic: Pick<Comic, "slug" | "name" | "thumb_url">,
  cdnUrl: string,
) {
  const dispatch = useAppDispatch();
  const storedFavorite = useAppSelector(selectIsFavorite(comic.slug));
  const hydrated = useHydrated();
  const isFavorite = hydrated && storedFavorite;
  const toggle = useCallback(() => {
    dispatch(
      toggleFavorite({
        slug: comic.slug,
        name: comic.name,
        thumbUrl: comic.thumb_url,
        cdnUrl,
      }),
    );
  }, [cdnUrl, comic.name, comic.slug, comic.thumb_url, dispatch]);

  return { isFavorite, toggle };
}
