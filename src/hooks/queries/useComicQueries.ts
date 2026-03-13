import { useQuery, keepPreviousData } from "@tanstack/react-query";
import OTruyenService, { ComicListStatus } from "@/services/otruyen.service";
import { queryKeys } from "./queryKeys";

/* ──────────────────────────────────────────────
   Comic Detail
────────────────────────────────────────────── */
export function useComicDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.comicDetail(slug),
    queryFn: () => OTruyenService.getComicDetail(slug),
    staleTime: 10 * 60 * 1000, // 10 phút - chi tiết truyện ít thay đổi
    select: (res) => ({
      comic: res.data.item,
      cdnUrl: res.data.APP_DOMAIN_CDN_IMAGE,
      breadCrumb: res.data.breadCrumb,
      seoData: res.data.seoOnPage,
    }),
  });
}

/* ──────────────────────────────────────────────
   Chapter Images
────────────────────────────────────────────── */
interface ChapterApiLegacy {
  images: string[];
}

interface ChapterApiNew {
  domain_cdn: string;
  item: {
    chapter_image: Array<{ image_page: number; image_file: string }>;
    chapter_path: string;
  };
}

type ChapterApiResponse = ChapterApiLegacy | ChapterApiNew;

function parseChapterImages(raw: ChapterApiResponse): string[] {
  if ("images" in raw) return raw.images;
  const { domain_cdn, item } = raw;
  return item.chapter_image
    .sort((a, b) => a.image_page - b.image_page)
    .map((img) => `${domain_cdn}/${item.chapter_path}/${img.image_file}`);
}

export function useChapterImages(chapterApiUrl: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.chapter(chapterApiUrl),
    queryFn: async () => {
      const res = await OTruyenService.getChapterData(chapterApiUrl);
      const raw = (res.data?.data ?? res.data) as ChapterApiResponse;
      return parseChapterImages(raw);
    },
    enabled: Boolean(chapterApiUrl) && enabled,
    staleTime: 30 * 60 * 1000, // 30 phút - ảnh chapter không đổi
    gcTime: 60 * 60 * 1000,    // Giữ cache 1 tiếng
  });
}

/* ──────────────────────────────────────────────
   Categories
────────────────────────────────────────────── */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => OTruyenService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 giờ - thể loại rất ít khi thay đổi
    gcTime: 2 * 60 * 60 * 1000,
  });
}

/* ──────────────────────────────────────────────
   Comics by Category
────────────────────────────────────────────── */
export function useComicsByCategory(slug: string, page: number) {
  return useQuery({
    queryKey: queryKeys.comicsByCategory(slug, page),
    queryFn: () => OTruyenService.getComicsByCategory(slug, page),
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
   Comics by Status (truyen-moi, hoan-thanh, ...)
────────────────────────────────────────────── */
export function useComicsByStatus(type: ComicListStatus, page: number) {
  return useQuery({
    queryKey: queryKeys.comicsByStatus(type, page),
    queryFn: () => OTruyenService.getComicList(type, page),
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

/* ──────────────────────────────────────────────
   Search
────────────────────────────────────────────── */
export function useSearchQuery(keyword: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search(keyword),
    queryFn: async () => {
      const res = await OTruyenService.searchComics(keyword);
      return res.data.data.items;
    },
    enabled: Boolean(keyword.trim()) && enabled,
    staleTime: 2 * 60 * 1000, // Search cache 2 phút
    gcTime: 5 * 60 * 1000,
  });
}
