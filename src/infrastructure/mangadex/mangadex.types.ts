export type MangaDexLocalizedString = Record<string, string>;

export interface MangaDexRelationship<TAttributes = Record<string, unknown>> {
  id: string;
  type: string;
  attributes?: TAttributes;
}

export interface MangaDexTagAttributes {
  name: MangaDexLocalizedString;
  description: MangaDexLocalizedString;
  group: string;
  version: number;
}

export interface MangaDexTag {
  id: string;
  type: "tag";
  attributes: MangaDexTagAttributes;
  relationships: MangaDexRelationship[];
}

export interface MangaDexMangaAttributes {
  title: MangaDexLocalizedString;
  altTitles: MangaDexLocalizedString[];
  description: MangaDexLocalizedString;
  originalLanguage: string;
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  tags: MangaDexTag[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MangaDexManga {
  id: string;
  type: "manga";
  attributes: MangaDexMangaAttributes;
  relationships: MangaDexRelationship[];
}

export interface MangaDexChapterAttributes {
  volume: string | null;
  chapter: string | null;
  title: string | null;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
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
