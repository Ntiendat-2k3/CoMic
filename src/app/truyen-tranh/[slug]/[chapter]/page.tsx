import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import LayoutMain from "@/components/layout/LayoutMain";
import ComicCatalogService from "@/services/comic-catalog.service";
import ChapterNav from "@/components/chapter/ChapterNav";
import MangaReader from "@/components/chapter/MangaReader";
import ReadingProgress from "@/components/chapter/ReadingProgress";
import { getDictionary } from "@/i18n/dictionaries";
import { formatMessage } from "@/i18n/format-message";
import { mangaDexClient } from "@/infrastructure/mangadex/mangadex.client";
import type { MangaDexAtHomeResponse } from "@/infrastructure/mangadex/mangadex.types";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

interface ChapterMeta {
  chapter_name: string;
  chapter_api_data: string;
  chapter_slug?: string;
}

function isChapterMeta(chapter: unknown): chapter is ChapterMeta {
  if (typeof chapter !== "object" || chapter === null) return false;
  const candidate = chapter as Record<string, unknown>;
  return (
    typeof candidate.chapter_name === "string" &&
    typeof candidate.chapter_api_data === "string"
  );
}

const getCachedComicDetail = unstable_cache(
  (slug: string) => ComicCatalogService.getComicDetail(slug),
  ["chapter-comic-detail"],
  { revalidate: 15 * 60, tags: ["comics", "comic-detail"] },
);

/** Kiểm tra danh sách chương đang được sắp xếp giảm dần theo số thứ tự chương hay không. */
function isDescendingChapters(list: ChapterMeta[]): boolean {
  for (let i = 0; i < list.length - 1; i += 1) {
    const a = Number.parseFloat(list[i].chapter_name);
    const b = Number.parseFloat(list[i + 1].chapter_name);
    if (!Number.isNaN(a) && !Number.isNaN(b) && a !== b) {
      return a > b;
    }
  }
  // Mặc định dữ liệu từ MangaDex trả về theo thứ tự giảm dần
  return true;
}

/**
 * Tìm chương liền kề theo hướng bước nhảy, tự động bỏ qua các bản dịch trùng số chương.
 */
function findAdjacentChapter(
  list: ChapterMeta[],
  startIndex: number,
  step: 1 | -1,
): ChapterMeta | undefined {
  const currentChapterName = list[startIndex]?.chapter_name;
  let idx = startIndex + step;
  while (idx >= 0 && idx < list.length) {
    if (!currentChapterName || list[idx].chapter_name !== currentChapterName) {
      return list[idx];
    }
    idx += step;
  }
  return undefined;
}

/** Chuẩn bị navigation và metadata mà không chặn reader bắt đầu tải At-Home. */
const getChapterContext = cache(async (slug: string, chapter: string) => {
  const { data } = await getCachedComicDetail(slug);
  const comic = data.item;
  const activeServer = comic.chapters.find((server) =>
    server.server_data.some(
      (item) => (item.chapter_slug ?? item.chapter_name) === chapter,
    ),
  );
  const chapters = activeServer?.server_data.filter(isChapterMeta) ?? [];
  const currentIndex = chapters.findIndex(
    (item) => (item.chapter_slug ?? item.chapter_name) === chapter,
  );

  if (currentIndex < 0) return null;

  const descending = isDescendingChapters(chapters);
  const previousStep = descending ? 1 : -1;
  const nextStep = descending ? -1 : 1;

  return {
    comic,
    cdnUrl: data.APP_DOMAIN_CDN_IMAGE,
    chapters,
    currentChapter: chapters[currentIndex],
    previousChapter: findAdjacentChapter(chapters, currentIndex, previousStep),
    nextChapter: findAdjacentChapter(chapters, currentIndex, nextStep),
  };
});

type ChapterContextPromise = ReturnType<typeof getChapterContext>;
type AtHomePromise = Promise<MangaDexAtHomeResponse | null>;

interface ChapterNavigationDataProps {
  slug: string;
  chapter: string;
  contextPromise: ChapterContextPromise;
  position: "top" | "bottom";
}

async function ChapterNavigationData({
  slug,
  chapter,
  contextPromise,
  position,
}: ChapterNavigationDataProps) {
  const { common, navigation, chapter: copy } = getDictionary();
  let context: Awaited<ChapterContextPromise>;

  try {
    context = await contextPromise;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[MangaReader] Không tải được dữ liệu điều hướng chương:", error);
    }

    if (position === "bottom") return null;

    return (
      <div className="mx-4 my-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 lg:mx-0">
        <span>{copy.navigationLoadError}</span>
        <Link href={`/truyen-tranh/${slug}`} className="text-pink-300 hover:text-pink-200">
          {copy.backToComic}
        </Link>
      </div>
    );
  }

  if (!context) notFound();

  const navigationElement = (
    <ChapterNav
      slug={slug}
      comicName={context.comic.name}
      thumbUrl={context.comic.thumb_url}
      cdnUrl={context.cdnUrl}
      chapters={context.chapters}
      current={chapter}
      prevChapter={context.previousChapter}
      nextChapter={context.nextChapter}
      sticky={position === "top"}
    />
  );

  if (position === "bottom") return navigationElement;

  return (
    <>
      <nav className="mb-2 flex flex-wrap items-center gap-1 p-4 text-sm text-white/60 lg:p-0">
        <Link href="/" className="transition-colors hover:text-white">
          {navigation.home}
        </Link>
        <span>/</span>
        <Link
          href={`/truyen-tranh/${slug}`}
          className="max-w-[200px] truncate text-pink-400 transition-colors hover:text-pink-300"
        >
          {context.comic.name}
        </Link>
        <span>/</span>
        <span className="text-white">
          {formatMessage(common.chapter, {
            chapter: context.currentChapter.chapter_name,
          })}
        </span>
      </nav>
      {navigationElement}
    </>
  );
}

function ChapterNavigationSkeleton({ sticky = false }: { sticky?: boolean }) {
  return (
    <div
      className={`h-[46px] animate-pulse bg-gray-800/70 sm:h-[62px] sm:rounded-xl ${
        sticky ? "sticky top-0 z-50 my-0 sm:my-4" : "mx-4 my-4 lg:mx-0"
      }`}
    />
  );
}

interface ChapterReaderDataProps {
  chapterId: string;
  comicSlug: string;
  atHomePromise: AtHomePromise;
}

/** Render reader ngay khi metadata At-Home sẵn sàng để trình duyệt thấy URL ảnh trước khi hydrate. */
async function ChapterReaderData({
  chapterId,
  comicSlug,
  atHomePromise,
}: ChapterReaderDataProps) {
  const initialAtHome = await atHomePromise;

  return (
    <MangaReader
      key={chapterId}
      chapterId={chapterId}
      comicSlug={comicSlug}
      initialAtHome={initialAtHome}
    />
  );
}

function ChapterReaderSkeleton() {
  const { chapter: copy } = getDictionary();

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-gray-400">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-pink-500" />
      <span className="sr-only">{copy.readerLoading}</span>
    </div>
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { chapter: copy } = getDictionary();
  try {
    const { slug, chapter } = await props.params;
    const context = await getChapterContext(slug, chapter);
    if (!context) return { title: copy.notFound };

    return {
      title: formatMessage(copy.metadataTitle, {
        comic: context.comic.name,
        chapter: context.currentChapter.chapter_name,
      }),
    };
  } catch {
    return { title: copy.notFound };
  }
}

export default async function ChapterPage(props: PageProps) {
  const { slug, chapter } = await props.params;
  const contextPromise = getChapterContext(slug, chapter);
  const atHomePromise = mangaDexClient.getAtHomeServer(chapter).catch((error) => {
    if (process.env.NODE_ENV === "development") {
      console.warn("[MangaReader] Không thể tải trước metadata At-Home trên server:", error);
    }
    return null;
  });

  return (
    <LayoutMain>
      <ReadingProgress />
      <div className="mx-auto max-w-4xl lg:px-4 lg:py-6">
        <Suspense fallback={<ChapterNavigationSkeleton sticky />}>
          <ChapterNavigationData
            slug={slug}
            chapter={chapter}
            contextPromise={contextPromise}
            position="top"
          />
        </Suspense>

        <Suspense fallback={<ChapterReaderSkeleton />}>
          <ChapterReaderData
            chapterId={chapter}
            comicSlug={slug}
            atHomePromise={atHomePromise}
          />
        </Suspense>

        <Suspense fallback={<ChapterNavigationSkeleton />}>
          <ChapterNavigationData
            slug={slug}
            chapter={chapter}
            contextPromise={contextPromise}
            position="bottom"
          />
        </Suspense>
      </div>
    </LayoutMain>
  );
}
