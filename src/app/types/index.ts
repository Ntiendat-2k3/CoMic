export interface Category {
  _id: string;
  slug: string;
  name: string;
}

export interface Chapter {
  filename?: string;
  chapter_name?: string;
  chapter_title?: string;
  chapter_api_data?: string;
}

export interface Comic {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  category: Category[];
  updatedAt: string;
  chaptersLatest?: Chapter[];
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}

export interface ApiListResponse {
  status: string;
  message: string;
  data: {
    items: Comic[];
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

export interface HomeResponse {
  data: {
    seoOnPage: {
      titleHead: string;
      descriptionHead: string;
      og_type: string;
      og_image: string[];
    };
    items: Comic[];
  };
  items: Comic[];
}

export interface CategoryListResponse {
  status: string;
  message: string;
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

export interface SearchResponse {
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
    breadCrumb: Array<{
      name: string;
      isCurrent: boolean;
      position: number;
    }>;
    titlePage: string;
    items: Comic[];
  };
}