import { AxiosResponse } from "axios";
import apiClient from "../lib/api-client";
import {
  CategoryListResponse,
  CategoryPageResponse,
  ComicDetailResponse,
  HomeResponse,
  SearchResponse,
  StatusComicListResponse,
} from "../types/response";
import { Category } from "../types/common";
import { LRUCache } from "lru-cache";

export type ComicListStatus =
  | "truyen-moi"
  | "sap-ra-mat"
  | "dang-phat-hanh"
  | "hoan-thanh";

/* eslint-disable no-var */
declare global {
  var _catCache: LRUCache<string, Category[]> | undefined;
}
const lru = 
  globalThis._catCache ??
  new LRUCache<string, Category[]>({ max: 1, ttl: 3600_000 });
globalThis._catCache = lru;

const OTruyenService = {
  // Trang chủ
  getHomeData: async (
    page: number = 1,
    limit: number = 15
  ): Promise<HomeResponse> => {
    const response = await apiClient.get<HomeResponse>(
      `/danh-sach/truyen-moi?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Danh sách truyện theo status
  getComicList: async (type: ComicListStatus, page: number = 1) => {
    const { data } = await apiClient.get<StatusComicListResponse>(
      `/danh-sach/${type}?page=${page}`
    );
    return data;
  },

  // Thể loại truyện
  getCategories: async (): Promise<Category[]> => {
    const key = "categories";
    const cached = lru.get(key);

    // console.log("🚀  getCategories – cache", cached ? "HIT" : "MISS / expired");

    if (cached) return cached;

    const res = await apiClient.get<CategoryListResponse>("/the-loai");
    const items = res.data.data.items;
    lru.set(key, items);
    return items;
  },

  // Truyện theo thể loại
  getComicsByCategory: async (
    slug: string,
    page: number = 1
  ): Promise<CategoryPageResponse> => {
    const response = await apiClient.get<CategoryPageResponse>(
      `/the-loai/${slug}?page=${page}`
    );
    return response.data;
  },

  // Chi tiết truyện
  getComicDetail: async (slug: string): Promise<ComicDetailResponse> => {
    const response = await apiClient.get<ComicDetailResponse>(
      `/truyen-tranh/${slug}`
    );
    return response.data;
  },

  // Tìm kiếm
  searchComics: async (
    keyword: string
  ): Promise<AxiosResponse<SearchResponse>> => {
    return apiClient.get<SearchResponse>(
      `/tim-kiem?keyword=${encodeURIComponent(keyword)}&nocache=${Date.now()}`
    );
  },

  async getChapterData(chapterApiUrl: string) {
    return apiClient.get<{
      data: { images: string[] };
      images: string[];
    }>(chapterApiUrl);
  },
};

export default OTruyenService;
