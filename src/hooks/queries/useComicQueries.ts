import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ComicCatalogService, { ComicListStatus } from "@/services/comic-catalog.service";
import { queryKeys } from "./queryKeys";

/* ──────────────────────────────────────────────
   Chi tiết truyện
────────────────────────────────────────────── */
export function useComicDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.comicDetail(slug),
    queryFn: () => ComicCatalogService.getComicDetail(slug),
    staleTime: 10 * 60 * 1000, // 10 phút - chi tiết truyện ít thay đổi
    select: (res) => ({
      comic: res.data.item,
      cdnUrl: res.data.APP_DOMAIN_CDN_IMAGE,
      breadCrumb: res.data.breadCrumb,
      seoData: res.data.seoOnPage,
    }),
  });
}

export function useChapterImages(chapterApiUrl: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.chapter(chapterApiUrl),
    queryFn: async () => {
      return ComicCatalogService.getChapterImages(chapterApiUrl);
    },
    enabled: Boolean(chapterApiUrl) && enabled,
    staleTime: 30 * 60 * 1000, // 30 phút - ảnh chapter không đổi
    gcTime: 60 * 60 * 1000,    // Giữ cache 1 tiếng
  });
}

/* ──────────────────────────────────────────────
   Thể loại
────────────────────────────────────────────── */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => ComicCatalogService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 giờ - thể loại rất ít khi thay đổi
    gcTime: 2 * 60 * 60 * 1000,
  });
}

/* ──────────────────────────────────────────────
   Truyện theo thể loại
────────────────────────────────────────────── */
export function useComicsByCategory(slug: string, page: number) {
  return useQuery({
    queryKey: queryKeys.comicsByCategory(slug, page),
    queryFn: () => ComicCatalogService.getComicsByCategory(slug, page),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    select: (res) => ({
      comics: res.data.items,
      titlePage: res.data.titlePage,
      breadCrumb: res.data.breadCrumb,
      cdnUrl: res.data.APP_DOMAIN_CDN_IMAGE,
      pagination: res.data.params.pagination,
    }),
  });
}

/* ──────────────────────────────────────────────
   Truyện theo trạng thái (truyen-moi, hoan-thanh, ...)
────────────────────────────────────────────── */
export function useComicsByStatus(type: ComicListStatus, page: number) {
  return useQuery({
    queryKey: queryKeys.comicsByStatus(type, page),
    queryFn: () => ComicCatalogService.getComicList(type, page),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    select: (res) => ({
      comics: res.data.items,
      titlePage: res.data.titlePage,
      breadCrumb: res.data.breadCrumb,
      pagination: res.data.params.pagination,
    }),
  });
}
