"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { saveProgress } from "@/store/slices/readingSlice";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";
import type { Chapter } from "@/types/common";

interface ChapterNavigationInput {
  slug: string;
  comicName: string;
  thumbUrl: string;
  cdnUrl: string;
  chapters: Chapter[];
}

/** Lưu tiến độ trước khi điều hướng và chuẩn hóa danh sách chương. */
export function useChapterNavigationController(input: ChapterNavigationInput) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const uniqueChapters = useMemo(
    () => Array.from(
      new Map(
        input.chapters.map((chapter) => [
          chapter.chapter_slug ?? chapter.chapter_name,
          chapter,
        ]),
      ).values(),
    ),
    [input.chapters],
  );
  const navigate = useCallback((chapterSlug: string) => {
    const chapter = uniqueChapters.find(
      (item) => (item.chapter_slug ?? item.chapter_name) === chapterSlug,
    );
    if (!chapter) return;

    dispatch(
      saveProgress({
        slug: input.slug,
        chapterName: chapter.chapter_name ?? chapterSlug,
        chapterSlug,
        comicName: input.comicName,
        thumbUrl: resolveCoverUrl(input.thumbUrl, input.cdnUrl),
      }),
    );
    router.push(`/truyen-tranh/${input.slug}/${chapterSlug}`);
  }, [dispatch, input.cdnUrl, input.comicName, input.slug, input.thumbUrl, router, uniqueChapters]);

  return { uniqueChapters, navigate };
}
