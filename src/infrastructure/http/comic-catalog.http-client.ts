import type { Comic } from "@/types/comic";
import type { HomeResponse } from "@/types/response";

interface SearchApiResponse {
  comics: Comic[];
  error: string;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/** Truy cập catalog qua API cùng origin để UI không phụ thuộc trực tiếp vào MangaDex. */
export const comicCatalogHttpClient = {
  getHomeData(page: number, limit: number) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return getJson<HomeResponse>(`/api/home?${params}`);
  },

  async searchComics(keyword: string) {
    const params = new URLSearchParams({ keyword });
    const response = await getJson<SearchApiResponse>(`/api/search?${params}`);
    if (response.error) throw new Error(response.error);
    return response.comics;
  },
};
