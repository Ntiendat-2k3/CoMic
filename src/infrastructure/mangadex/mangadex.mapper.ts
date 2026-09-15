import type { Category, Chapter, ChapterServer } from "@/types/common";
import type { Comic } from "@/types/comic";
import type {
  MangaDexChapter,
  MangaDexLocalizedString,
  MangaDexManga,
  MangaDexMangaStatistics,
  MangaDexRelationship,
  MangaDexTag,
} from "./mangadex.types";
import { MANGADEX_COVER_BASE_URL } from "./mangadex.config";

const PREFERRED_LANGUAGES = ["vi", "en"] as const;

function firstLocalizedValue(
  localized: MangaDexLocalizedString,
  originalLanguage?: string,
) {
  for (const language of [...PREFERRED_LANGUAGES, originalLanguage]) {
    if (language && localized[language]) return localized[language];
  }
  return Object.values(localized).find(Boolean) ?? "";
}

function relationshipName(relationship: MangaDexRelationship) {
  const attributes = relationship.attributes;
  if (!attributes || typeof attributes !== "object") return "";
  const name = (attributes as Record<string, unknown>).name;
  return typeof name === "string" ? name : "";
}

function getCoverUrl(manga: MangaDexManga) {
  const cover = manga.relationships.find(
    (relationship) => relationship.type === "cover_art",
  );
  const fileName = cover?.attributes?.fileName;
  if (typeof fileName !== "string") return "/assets/logo.png";
  return `${MANGADEX_COVER_BASE_URL}/${manga.id}/${fileName}.512.jpg`;
}

function mapTag(tag: MangaDexTag): Category {
  return {
    _id: tag.id,
    slug: tag.id,
    name: firstLocalizedValue(tag.attributes.name),
  };
}

function mapChapter(chapter: MangaDexChapter): Chapter {
  const groupNames = chapter.relationships
    .filter((relationship) => relationship.type === "scanlation_group")
    .map(relationshipName)
    .filter(Boolean);
  const titleParts = [chapter.attributes.title, ...groupNames].filter(Boolean);

  return {
    filename: chapter.id,
    chapter_name: chapter.attributes.chapter ?? undefined,
    chapter_title: titleParts.join(" · "),
    chapter_api_data: chapter.id,
    chapter_slug: chapter.id,
    translated_language: chapter.attributes.translatedLanguage,
    published_at: chapter.attributes.publishAt,
  };
}

function mapChapterServers(chapters: MangaDexChapter[]): ChapterServer[] {
  return PREFERRED_LANGUAGES.flatMap((language) => {
    const serverData = chapters
      .filter(
        (chapter) => chapter.attributes.translatedLanguage === language,
      )
      .map(mapChapter);
    return serverData.length > 0
      ? [{ server_name: language, server_data: serverData }]
      : [];
  });
}

/** Chuyển thực thể MangaDex thành model trung lập mà UI đang sử dụng. */
export function mapMangaDexManga(
  manga: MangaDexManga,
  chapters: MangaDexChapter[] = [],
  statistics?: MangaDexMangaStatistics,
  latestChapter?: string | null,
): Comic {
  const attributes = manga.attributes;
  const name = firstLocalizedValue(attributes.title, attributes.originalLanguage);
  const alternativeTitles = [
    ...Object.values(attributes.title),
    ...attributes.altTitles.flatMap((title) => Object.values(title)),
  ].filter((title, index, titles) => title && title !== name && titles.indexOf(title) === index);
  const authors = manga.relationships
    .filter((relationship) => ["author", "artist"].includes(relationship.type))
    .map(relationshipName)
    .filter((author, index, list) => author && list.indexOf(author) === index);

  return {
    _id: manga.id,
    name,
    slug: manga.id,
    origin_name: alternativeTitles,
    content: firstLocalizedValue(attributes.description, attributes.originalLanguage),
    status: attributes.status,
    thumb_url: getCoverUrl(manga),
    author: authors,
    category: attributes.tags.map(mapTag),
    chapters: mapChapterServers(chapters),
    updatedAt: attributes.updatedAt,
    year: attributes.year ?? undefined,
    originalLanguage: attributes.originalLanguage,
    publicationDemographic: attributes.publicationDemographic,
    contentRating: attributes.contentRating,
    latestChapter: latestChapter ?? undefined,
    statistics: statistics
      ? {
          rating: statistics.rating.average ?? statistics.rating.bayesian,
          follows: statistics.follows,
          comments: statistics.comments?.repliesCount,
        }
      : undefined,
  };
}

export function mapMangaDexTags(tags: MangaDexTag[]) {
  return tags
    .map(mapTag)
    .toSorted((left, right) => left.name.localeCompare(right.name, "vi"));
}
