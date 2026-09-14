import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type {
  MangaDexAtHomeResponse,
  MangaDexChapter,
  MangaDexCollectionResponse,
  MangaDexEntityResponse,
  MangaDexManga,
  MangaDexTag,
} from "./mangadex.types";
import { MANGADEX_API_URL } from "./mangadex.config";

export { MANGADEX_API_URL } from "./mangadex.config";

const TRANSLATED_LANGUAGES = ["en", "vi"] as const;
const CONTENT_RATINGS = ["safe", "suggestive", "erotica"] as const;
const MAX_MANGA_PAGE_SIZE = 100;
const MAX_CHAPTER_PAGE_SIZE = 500;
const MAX_NETWORK_RETRIES = 2;
const RETRYABLE_ERROR_CODES = new Set([
  "ECONNABORTED",
  "ECONNREFUSED",
  "ECONNRESET",
  "EAI_AGAIN",
  "ETIMEDOUT",
]);
export const MANGADEX_MAX_OFFSET = 10_000;

const mangaDexHttpClient = axios.create({
  baseURL: MANGADEX_API_URL,
  timeout: 20_000,
  headers: { Accept: "application/json" },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  mangaDexRetryCount?: number;
}

function isRetryableRequest(error: AxiosError) {
  const status = error.response?.status;
  return (
    error.config?.method?.toUpperCase() === "GET" &&
    (RETRYABLE_ERROR_CODES.has(error.code ?? "") ||
      status === 429 ||
      (typeof status === "number" && status >= 500))
  );
}

/** Thử lại GET khi MangaDex đóng kết nối hoặc tạm thời quá tải. */
mangaDexHttpClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || !isRetryableRequest(error)) {
    return Promise.reject(error);
  }

  const config = error.config as RetryableRequestConfig | undefined;
  const retryCount = config?.mangaDexRetryCount ?? 0;
  if (!config || retryCount >= MAX_NETWORK_RETRIES) {
    return Promise.reject(error);
  }

  config.mangaDexRetryCount = retryCount + 1;
  await new Promise((resolve) =>
    setTimeout(resolve, 300 * 2 ** retryCount),
  );

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[MangaDex] Thử lại GET ${config.url} (${config.mangaDexRetryCount}/${MAX_NETWORK_RETRIES})`,
      error.code ?? error.response?.status,
    );
  }

  return mangaDexHttpClient.request(config);
});

export interface MangaDexMangaQuery {
  page?: number;
  limit?: number;
  title?: string;
  includedTag?: string;
  status?: MangaDexManga["attributes"]["status"];
}

function appendMany(
  params: URLSearchParams,
  key: string,
  values: readonly string[],
) {
  values.forEach((value) => params.append(`${key}[]`, value));
}

function createMangaQueryParams(query: MangaDexMangaQuery) {
  const limit = Math.min(Math.max(query.limit ?? 20, 1), MAX_MANGA_PAGE_SIZE);
  const page = Math.max(query.page ?? 1, 1);
  const offset = Math.min((page - 1) * limit, MANGADEX_MAX_OFFSET);
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  appendMany(params, "availableTranslatedLanguage", TRANSLATED_LANGUAGES);
  appendMany(params, "contentRating", CONTENT_RATINGS);
  appendMany(params, "includes", ["cover_art", "author", "artist"]);

  if (query.title?.trim()) {
    params.set("title", query.title.trim());
    params.set("order[relevance]", "desc");
  } else {
    params.set("order[latestUploadedChapter]", "desc");
  }

  if (query.includedTag) params.append("includedTags[]", query.includedTag);
  if (query.status) params.append("status[]", query.status);

  return params;
}

/** Lấy metadata node MangaDex@Home bằng HTTP client có retry dùng chung. */
async function getAtHomeServer(chapterId: string) {
  const { data } = await mangaDexHttpClient.get<MangaDexAtHomeResponse>(
    `/at-home/server/${encodeURIComponent(chapterId)}`,
  );
  return data;
}

/** Gọi các endpoint đọc công khai của MangaDex và giữ JSON thô trong tầng hạ tầng. */
export const mangaDexClient = {
  getAtHomeServer,

  async getMangaList(query: MangaDexMangaQuery = {}) {
    const { data } = await mangaDexHttpClient.get<
      MangaDexCollectionResponse<MangaDexManga>
    >("/manga", { params: createMangaQueryParams(query) });
    return data;
  },

  async getTags() {
    const { data } = await mangaDexHttpClient.get<
      MangaDexCollectionResponse<MangaDexTag>
    >("/manga/tag");
    return data.data;
  },

  async getManga(id: string) {
    const params = new URLSearchParams();
    appendMany(params, "includes", ["cover_art", "author", "artist"]);
    const { data } = await mangaDexHttpClient.get<
      MangaDexEntityResponse<MangaDexManga>
    >(`/manga/${encodeURIComponent(id)}`, { params });
    return data.data;
  },

  async getMangaChapters(id: string) {
    const chapters: MangaDexChapter[] = [];
    let offset = 0;
    let total = 0;

    do {
      const params = new URLSearchParams({
        limit: String(MAX_CHAPTER_PAGE_SIZE),
        offset: String(offset),
        "order[volume]": "desc",
        "order[chapter]": "desc",
      });
      appendMany(params, "translatedLanguage", TRANSLATED_LANGUAGES);
      appendMany(params, "includes", ["scanlation_group"]);

      const { data } = await mangaDexHttpClient.get<
        MangaDexCollectionResponse<MangaDexChapter>
      >(`/manga/${encodeURIComponent(id)}/feed`, { params });

      chapters.push(
        ...data.data.filter((chapter) => !chapter.attributes.externalUrl),
      );
      total = data.total;
      offset += data.limit;
    } while (offset < total && offset < MANGADEX_MAX_OFFSET);

    return chapters;
  },

  async getChapterImages(chapterId: string) {
    const data = await getAtHomeServer(chapterId);
    const baseUrl = data.baseUrl.replace(/\/$/, "");
    return data.chapter.data.map(
      (fileName) => `${baseUrl}/data/${data.chapter.hash}/${fileName}`,
    );
  },
};
