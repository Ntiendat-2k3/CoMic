import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LayoutMain from "@/components/layout/LayoutMain";
import OTruyenService from "@/services/otruyen.service";
import ChapterNav from "@/components/chapter/ChapterNav";
import ChapterImage from "@/components/chapter/ChapterImage";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ReadingProgress from "@/components/chapter/ReadingProgress";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

interface ChapterApiLegacy {
  images: string[];
}
interface ChapterApiNew {
  domain_cdn: string;
  item: {
    chapter_image: Array<{ image_page: number; image_file: string }>;
    chapter_path: string;
  };
}
type ChapterApiResponse = ChapterApiLegacy | ChapterApiNew;

interface ChapterMeta {
  chapter_name: string;
  chapter_api_data: string;
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
    const res = await OTruyenService.getChapterData(apiUrl);
    const raw = (res.data?.data ?? res.data) as ChapterApiResponse;
    if ("images" in raw) return raw.images;
    const { domain_cdn, item } = raw;
    return item.chapter_image
      .sort((a, b) => a.image_page - b.image_page)
      .map((img) => `${domain_cdn}/${item.chapter_path}/${img.image_file}`);
  } catch {
    return [];
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  try {
    const { slug, chapter } = await props.params;
    const { data } = await OTruyenService.getComicDetail(slug);
    return { title: `${data.item.name} – Chapter ${chapter}` };
  } catch {
    return { title: "Chapter không tồn tại" };
  }
}

export default async function ChapterPage(props: PageProps) {
  const { slug, chapter } = await props.params;

  const { data } = await OTruyenService.getComicDetail(slug);
  const comic = data.item;
  if (!comic) return notFound();

  const serverList = comic.chapters[0]?.server_data.filter(isChapterMeta) ?? [];
  const idx = serverList.findIndex((c) => c.chapter_name === chapter);
  if (idx < 0) return notFound();

  const prev = serverList[idx - 1];
  const next = serverList[idx + 1];
  const chapterImages = await getChapterImages(
    serverList[idx].chapter_api_data,
  );
  const chapterNames = serverList.map((c) => c.chapter_name);

  return (
    <LayoutMain>
      <ReadingProgress />
      <div className="max-w-4xl mx-auto lg:px-4 lg:py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-white/60 p-4 lg:p-0 mb-2 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link
            href={`/truyen-tranh/${slug}`}
            className="text-pink-400 hover:text-pink-300 transition-colors truncate max-w-[200px]"
          >
            {comic.name}
          </Link>
          <span>/</span>
          <span className="text-white">Chapter {chapter}</span>
        </nav>

        {/* Top nav */}
        <ChapterNav
          slug={slug}
          comicName={comic.name}
          thumbUrl={comic.thumb_url}
          cdnUrl={data.APP_DOMAIN_CDN_IMAGE}
          chapters={chapterNames}
          current={chapter}
          prevChapter={prev?.chapter_name}
          nextChapter={next?.chapter_name}
        />

        {/* Chapter images */}
        {chapterImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <p className="text-lg">Không tải được ảnh chương này</p>
            <Link
              href={`/truyen-tranh/${slug}`}
              className="flex items-center gap-2 text-pink-400 hover:text-pink-300"
            >
              <ChevronLeft size={16} />
              Quay lại trang truyện
            </Link>
          </div>
        ) : (
          <div className="space-y-0">
            {chapterImages.map((src, i) => (
              <ChapterImage key={`${src}-${i}`} src={src} index={i} />
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <ChapterNav
          slug={slug}
          comicName={comic.name}
          thumbUrl={comic.thumb_url}
          cdnUrl={data.APP_DOMAIN_CDN_IMAGE}
          chapters={chapterNames}
          current={chapter}
          prevChapter={prev?.chapter_name}
          nextChapter={next?.chapter_name}
        />
      </div>
    </LayoutMain>
  );
}
