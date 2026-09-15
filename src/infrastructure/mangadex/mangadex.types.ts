export type MangaDexLocalizedString = Record<string, string>;

export interface MangaDexRelationship<TAttributes = Record<string, unknown>> {
  id: string;
  type: string;
  attributes?: TAttributes;
}

export interface MangaDexTagAttributes {
  name: MangaDexLocalizedString;
  group?: string;
}

export interface MangaDexTag {
  id: string;
  type: "tag";
  attributes: MangaDexTagAttributes;
}

export interface MangaDexMangaAttributes {
  title: MangaDexLocalizedString;
  altTitles: MangaDexLocalizedString[];
  description: MangaDexLocalizedString;
  originalLanguage: string;
  publicationDemographic: "shounen" | "shoujo" | "josei" | "seinen" | null;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  year: number | null;
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  tags: MangaDexTag[];
  updatedAt: string;
  latestUploadedChapter: string | null;
}

export interface MangaDexMangaStatistics {
  comments?: {
    repliesCount: number;
  } | null;
  follows: number;
  rating: {
    average?: number | null;
    bayesian: number;
  };
}

export interface MangaDexStatisticsResponse {
  result: "ok" | "error";
  statistics: Record<string, MangaDexMangaStatistics>;
}

export interface MangaDexManga {
  id: string;
  type: "manga";
  attributes: MangaDexMangaAttributes;
  relationships: MangaDexRelationship[];
}

export interface MangaDexChapterAttributes {
  chapter: string | null;
  title: string | null;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt?: string;
}

export interface MangaDexChapter {
  id: string;
  type: "chapter";
  attributes: MangaDexChapterAttributes;
  relationships: MangaDexRelationship[];
}

export interface MangaDexCollectionResponse<T> {
  result: "ok" | "error";
  response: "collection";
  data: T[];
  limit: number;
  offset: number;
  total: number;
}

export interface MangaDexEntityResponse<T> {
  result: "ok" | "error";
  response: "entity";
  data: T;
}

export interface MangaDexAtHomeResponse {
  result: "ok" | "error";
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}
