export interface BaseResponse {
  status: string;
  message: string;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  basePath?: string;
}

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

export interface ChapterServer {
  server_name: string;
  server_data: Chapter[];
}

export interface HomeParams {
  type_slug: string;
  filterCategory: Category[];
  sortField: string;
  pagination: Pagination;
  itemsUpdateInDay: number;
}