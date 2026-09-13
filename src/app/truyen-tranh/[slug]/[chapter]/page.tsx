import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LayoutMain from "@/components/layout/LayoutMain";
import ComicCatalogService from "@/services/comic-catalog.service";
import ChapterNav from "@/components/chapter/ChapterNav";
import ChapterImage from "@/components/chapter/ChapterImage";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ReadingProgress from "@/components/chapter/ReadingProgress";
import { getDictionary } from "@/i18n/dictionaries";
import { formatMessage } from "@/i18n/format-message";
import { cache } from "react";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

const getComicDetail = cache((slug: string) =>
  ComicCatalogService.getComicDetail(slug),
);

interface ChapterMeta {
  chapter_name: string;
  chapter_api_data: string;
  chapter_slug?: string;
}
function isChapterMeta(c: unknown): c is ChapterMeta {
  if (typeof c !== "object" || c === null) return false;
  const obj = c as Record<string, unknown>;
  return (
    typeof obj.chapter_name === "string" &&
    typeof obj.chapter_api_data === "string"
  );
}

async function getChapterImages(apiUrl: string): Promise<string[]> {
  try {
    return ComicCatalogService.getChapterImages(apiUrl);
  } catch {
    return [];
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { chapter: copy } = getDictionary();
  try {
    const { slug, chapter } = await props.params;
    const { data } = await getComicDetail(slug);
    const selectedChapter = data.item.chapters
      .flatMap((server) => server.server_data)
      .find((item) => (item.chapter_slug ?? item.chapter_name) === chapter);
    return {
      title: formatMessage(copy.metadataTitle, {
        comic: data.item.name,
        chapter: selectedChapter?.chapter_name ?? chapter,
      }),
    };
  } catch {
    return { title: copy.notFound };
  }
}

export default async function ChapterPage(props: PageProps) {
  const { common, navigation, chapter: copy } = getDictionary();
  const { slug, chapter } = await props.params;

  const { data } = await getComicDetail(slug);
  const comic = data.item;
  if (!comic) return notFound();

  const activeServer = comic.chapters.find((server) =>
    server.server_data.some(
      (item) => (item.chapter_slug ?? item.chapter_name) === chapter,
    ),
  );
  const serverList = activeServer?.server_data.filter(isChapterMeta) ?? [];
  const idx = serverList.findIndex(
    (item) => (item.chapter_slug ?? item.chapter_name) === chapter,
  );
  if (idx < 0) return notFound();

  const prev = serverList[idx - 1];
  const next = serverList[idx + 1];
  const chapterImages = await getChapterImages(
    serverList[idx].chapter_api_data,
  );
  const currentChapterName = serverList[idx].chapter_name;

  return (
    <LayoutMain>
      <ReadingProgress />
      <div className="max-w-4xl mx-auto lg:px-4 lg:py-6">
        {/* Đường dẫn phân cấp */}
        <nav className="text-sm text-white/60 p-4 lg:p-0 mb-2 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            {navigation.home}
          </Link>
          <span>/</span>
          <Link
            href={`/truyen-tranh/${slug}`}
            className="text-pink-400 hover:text-pink-300 transition-colors truncate max-w-[200px]"
          >
            {comic.name}
          </Link>
          <span>/</span>
          <span className="text-white">
            {formatMessage(common.chapter, { chapter: currentChapterName })}
          </span>
        </nav>

        {/* Điều hướng đầu chương */}
        <ChapterNav
          slug={slug}
          comicName={comic.name}
          thumbUrl={comic.thumb_url}
          cdnUrl={data.APP_DOMAIN_CDN_IMAGE}
          chapters={serverList}
          current={chapter}
          prevChapter={prev}
          nextChapter={next}
        />

        {/* Ảnh chương */}
        {chapterImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <p className="text-lg">{copy.imageLoadError}</p>
            <Link
              href={`/truyen-tranh/${slug}`}
              className="flex items-center gap-2 text-pink-400 hover:text-pink-300"
            >
              <ChevronLeft size={16} />
              {copy.backToComic}
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {chapterImages.map((src, i) => (
              <ChapterImage key={`${src}-${i}`} src={src} index={i} />
            ))}
          </div>
        )}

        {/* Điều hướng cuối chương */}
        <ChapterNav
          slug={slug}
          comicName={comic.name}
          thumbUrl={comic.thumb_url}
          cdnUrl={data.APP_DOMAIN_CDN_IMAGE}
          chapters={serverList}
          current={chapter}
          prevChapter={prev}
          nextChapter={next}
        />
      </div>
    </LayoutMain>
  );
}
