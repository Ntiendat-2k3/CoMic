import { Comic, ComicDetailParams, ComicSEO } from "./comic";
import { BaseResponse, BreadCrumb, Category, HomeParams, Pagination } from "./common";

export interface HomeResponse extends BaseResponse {
  status: string;
  message: string;
  items?: Comic[];
  data: {
    seoOnPage: ComicSEO;
    items: Comic[];
    params?: HomeParams;
  };
}

export interface CategoryListResponse extends BaseResponse {
  data: {
    items: Category[];
    params: {
      type_slug: string;
      filterCategory: string[];
      sortField: string;
      sortType: string;
      pagination: Pagination;
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface SearchResponse extends BaseResponse {
  data: {
    seoOnPage: ComicSEO & { og_url: string };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Comic[];
  };
}

export interface ComicDetailResponse extends BaseResponse {
  data: {
    seoOnPage: ComicSEO;
    breadCrumb: BreadCrumb[];
    item: Comic;
    params: ComicDetailParams;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface StatusComicListResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Comic[];
    params: {
      pagination: Pagination;
    };
  };
}

export interface CategoryPageResponse {
  status: string;
  message: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: BreadCrumb[];
    titlePage: string;
    items: Comic[];
    params: {
      type_slug: string;
      slug: string;
      filterCategory: string[];
      sortField: string;
      sortType: string;
      pagination: Pagination;
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}
