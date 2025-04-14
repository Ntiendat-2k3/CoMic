import { AxiosResponse } from "axios";
import apiClient from "../lib/api-client";
import { ApiListResponse, CategoryListResponse, ComicDetailResponse, HomeResponse, SearchResponse } from "../types/response";
import { Category } from "../types/common";
import { Comic } from "../types/comic";

// type ComicListType =
//   | "truyen-moi"
//   | "sap-ra-mat"
//   | "dang-phat-hanh"
//   | "hoan-thanh";

const OTruyenService = {
  // Trang chủ
  getHomeData: async (page: number = 1, limit: number = 15): Promise<HomeResponse> => {
    const response = await apiClient.get<HomeResponse>(`/danh-sach/truyen-moi?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Danh sách truyện theo type
  // getComicList: async (
  //   type: ComicListType = "truyen-moi",
  //   page: number = 1
  // ): Promise<ApiListResponse> => {
  //   return apiClient.get<ApiListResponse>(`/danh-sach/${type}?page=${page}`);
  // },

  // Thể loại truyện
    getCategories: async (): Promise<Category[]> => {
      const response = await apiClient.get<CategoryListResponse>("/the-loai");
      return response.data.data.items; 
    },

  // // Truyện theo thể loại
  // getComicsByCategory: async (
  //   slug: string,
  //   page: number = 1
  // ): Promise<ApiListResponse> => {
  //   return apiClient.get<ApiListResponse>(`/the-loai/${slug}?page=${page}`);
  // },

  // // Chi tiết truyện
  getComicDetail: async (slug: string): Promise<ComicDetailResponse> => {
    const response = await apiClient.get<ComicDetailResponse>(`/truyen-tranh/${slug}`);
    return response.data;
  },

  // Tìm kiếm
  searchComics: async (keyword: string): Promise<AxiosResponse<SearchResponse>> => {
    return apiClient.get<SearchResponse>(
      `/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=10`
    );
  }
};

export default OTruyenService;