import { getDictionary } from "@/i18n/dictionaries";
import {
  MANGADEX_API_URL,
  MANGADEX_COVER_BASE_URL,
} from "@/infrastructure/mangadex/mangadex.config";
import {
  MANGADEX_MAX_OFFSET,
  mangaDexClient,
  type MangaDexMangaQuery,
} from "@/infrastructure/mangadex/mangadex.client";
import {
  mapMangaDexManga,
  mapMangaDexTags,
} from "@/infrastructure/mangadex/mangadex.mapper";
import type { Category } from "@/types/common";
import type {
  CategoryPageResponse,
  ComicDetailResponse,
  HomeResponse,
  SearchResponse,
  StatusComicListResponse,
} from "@/types/response";

export type ComicListStatus =
  | "truyen-moi"
  | "dang-phat-hanh"
  | "hoan-thanh"
  | "tam-ngung";

const DEFAULT_PAGE_SIZE = 20;
const CATEGORY_CACHE_TTL = 60 * 60 * 1000;

interface CategoryCache {
  value: Category[];
  expiresAt: number;
}

declare global {
  var _mangaDexCategoryCache: CategoryCache | undefined;
}

const statusFilters: Record<
  ComicListStatus,
  MangaDexMangaQuery["status"] | undefined
> = {
  "truyen-moi": undefined,
  "dang-phat-hanh": "ongoing",
  "hoan-thanh": "completed",
  "tam-ngung": "hiatus",
};

function createPagination(total: number, limit: number, offset: number) {
  const accessibleTotal = Math.min(total, MANGADEX_MAX_OFFSET + limit);
  return {
    totalItems: accessibleTotal,
    totalItemsPerPage: limit,
    currentPage: Math.floor(offset / limit) + 1,
    pageRanges: Math.ceil(accessibleTotal / limit),
  };
}

function createSeo(title: string, description: string, images: string[] = []) {
  return {
    og_type: "website",
    titleHead: title,
    descriptionHead: description,
    og_image: images,
    og_url: MANGADEX_API_URL,
  };
}

function createBreadcrumb(title: string) {
  const { navigation } = getDictionary();
  return [
    { name: navigation.home, slug: "/", isCurrent: false, position: 1 },
    { name: title, isCurrent: true, position: 2 },
  ];
}

function mapMangaPage(
  response: Awaited<ReturnType<typeof mangaDexClient.getMangaList>>,
) {
  return response.data.map((manga) => mapMangaDexManga(manga));
}

/** Điều phối use case catalog và không để contract MangaDex rò rỉ sang UI. */
const ComicCatalogService = {
  async getHomeData(page = 1, limit = 15): Promise<HomeResponse> {
    const { home } = getDictionary();
    const response = await mangaDexClient.getMangaList({ page, limit });
    const items = mapMangaPage(response);
    const pagination = createPagination(
      response.total,
      response.limit,
      response.offset,
    );

    return {
      status: "success",
      message: "OK",
      items,
      data: {
        seoOnPage: createSeo(home.title, home.subtitle),
        items,
        params: {
          type_slug: "truyen-moi",
          filterCategory: [],
          sortField: "latestUploadedChapter",
          pagination,
          itemsUpdateInDay: 0,
        },
      },
    };
  },

  async getComicList(
    type: ComicListStatus,
    page = 1,
  ): Promise<StatusComicListResponse> {
    const { catalog } = getDictionary();
    const response = await mangaDexClient.getMangaList({
      page,
      limit: DEFAULT_PAGE_SIZE,
      status: statusFilters[type],
    });
    const title = catalog.statusTitles[type];
    const description = catalog.statusDescriptions[type];

    return {
      status: "success",
      message: "OK",
      data: {
        seoOnPage: createSeo(title, description),
        breadCrumb: createBreadcrumb(title),
        titlePage: title,
        items: mapMangaPage(response),
        params: {
          pagination: createPagination(
            response.total,
            response.limit,
            response.offset,
          ),
        },
      },
    };
  },

  async getCategories(): Promise<Category[]> {
    const cached = globalThis._mangaDexCategoryCache;
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    const categories = mapMangaDexTags(await mangaDexClient.getTags());
    globalThis._mangaDexCategoryCache = {
      value: categories,
      expiresAt: Date.now() + CATEGORY_CACHE_TTL,
    };
    return categories;
  },

  async getComicsByCategory(
    categoryId: string,
    page = 1,
  ): Promise<CategoryPageResponse> {
    const { listing } = getDictionary();
    const [response, categories] = await Promise.all([
      mangaDexClient.getMangaList({
        page,
        limit: DEFAULT_PAGE_SIZE,
        includedTag: categoryId,
      }),
      this.getCategories(),
    ]);
    const categoryName =
      categories.find((category) => category._id === categoryId)?.name ??
      categoryId;
    const description = listing.categoryMetaDescription.replace(
      "{category}",
      categoryName,
    );

    return {
      status: "success",
      message: "OK",
      data: {
        seoOnPage: createSeo(categoryName, description),
        breadCrumb: createBreadcrumb(categoryName),
        titlePage: categoryName,
        items: mapMangaPage(response),
        params: {
          type_slug: "the-loai",
          slug: categoryId,
          filterCategory: [categoryId],
          sortField: "latestUploadedChapter",
          sortType: "desc",
          pagination: createPagination(
            response.total,
            response.limit,
            response.offset,
          ),
        },
        type_list: "category",
        APP_DOMAIN_FRONTEND: "",
        APP_DOMAIN_CDN_IMAGE: MANGADEX_COVER_BASE_URL,
      },
    };
  },

  async getComicDetail(id: string): Promise<ComicDetailResponse> {
    const [manga, chapters] = await Promise.all([
      mangaDexClient.getManga(id),
      mangaDexClient.getMangaChapters(id),
    ]);
    const comic = mapMangaDexManga(manga, chapters);

    return {
      status: "success",
      message: "OK",
      data: {
        seoOnPage: createSeo(comic.name, comic.content, [comic.thumb_url]),
        breadCrumb: createBreadcrumb(comic.name),
        item: comic,
        params: { slug: id, crawl_check_url: MANGADEX_API_URL },
        APP_DOMAIN_CDN_IMAGE: MANGADEX_COVER_BASE_URL,
      },
    };
  },

  async searchComics(keyword: string): Promise<SearchResponse> {
    const { catalog } = getDictionary();
    const response = await mangaDexClient.getMangaList({
      title: keyword,
      limit: 30,
    });
    const title = catalog.searchTitle.replace("{keyword}", keyword);

    return {
      status: "success",
      message: "OK",
      data: {
        seoOnPage: {
          ...createSeo(title, catalog.searchDescription),
          og_url: MANGADEX_API_URL,
        },
        breadCrumb: createBreadcrumb(title),
        titlePage: title,
        items: mapMangaPage(response),
      },
    };
  },

  getChapterImages(chapterId: string): Promise<string[]> {
    return mangaDexClient.getChapterImages(chapterId);
  },
};

export default ComicCatalogService;
