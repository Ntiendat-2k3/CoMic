import { Category, Chapter, ChapterServer } from "./common";

export interface Comic {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  content: string;
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  author: string[];
  category: Category[];
  chapters: ChapterServer[];
  chaptersLatest: Chapter[];
  updatedAt: string;
}
export interface SEOSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  image: string;
  director?: string;
}
export interface ComicSEO {
  og_type?: string;
  titleHead?: string;
  descriptionHead?: string;
  og_image?: string[];
  updated_time?: number;
  og_url?: string;
  seoSchema?: SEOSchema;
}

export interface ComicDetailParams {
  slug: string;
  crawl_check_url: string;
}