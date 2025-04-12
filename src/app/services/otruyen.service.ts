import { AxiosResponse } from "axios";
import apiClient from "../lib/api-client";
import { CategoryListResponse, HomeResponse, SearchResponse } from "../types/response";
import { Category } from "../types/common";

// type ComicListType =
//   | "truyen-moi"
//   | "sap-ra-mat"
//   | "dang-phat-hanh"
//   | "hoan-thanh";

const OTruyenService = {
  // Trang chủ
  getHomeData: async (): Promise<HomeResponse> => {
    const response = await apiClient.get<HomeResponse>("/home");
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
  // getComicDetail: async (slug: string): Promise<Comic> => {
  //   const response = await apiClient.get<ApiListResponse>(`/truyen-tranh/${slug}`);
  //   return response.data.items[0];
  // },

  // Tìm kiếm
  searchComics: async (keyword: string): Promise<AxiosResponse<SearchResponse>> => {
    return apiClient.get<SearchResponse>(
      `/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=10`
    );
  }
};

export default OTruyenService;