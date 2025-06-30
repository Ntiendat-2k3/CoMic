import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import LayoutMain from "@/app/layouts/LayoutMain";
import OTruyenService from "@/app/services/otruyen.service";
import ChapterNav from "@/app/components/ChapterNav";
import ChapterImage from "@/app/components/ChapterImage";

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

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  try {
    const { slug, chapter } = await props.params;
    const { data } = await OTruyenService.getComicDetail(slug);
    return { title: `${data.item.name} – Chapter ${chapter}` };
  } catch {
    return { title: "Chapter không tồn tại" };
  }
}

async function getChapterImages(apiUrl: string): Promise<string[]> {
  try {
    const res = await OTruyenService.getChapterData(apiUrl);
    const raw = (res.data?.data ?? res.data) as ChapterApiResponse;
    if ("images" in raw) return raw.images;

    const { domain_cdn, item } = raw;
    if (!item.chapter_image.length) return [];
    return item.chapter_image
      .sort((a, b) => a.image_page - b.image_page)
      .map((img) => `${domain_cdn}/${item.chapter_path}/${img.image_file}`);
  } catch (e) {
    console.error("getChapterImages error", e);
    return [];
  }
}

export default async function ChapterPage(props: PageProps) {
  const { slug, chapter } = await props.params;

  // 1. Lấy info truyện + danh sách chương
  const { data } = await OTruyenService.getComicDetail(slug);
  const comic = data.item;
  if (!comic) return notFound();

  // 2. Build serverList + prev/next
  const serverList =
    comic.chapters[0]?.server_data.filter(isChapterMeta) ?? [];
  const idx = serverList.findIndex((c) => c.chapter_name === chapter);
  if (idx < 0) return notFound();
  const prev = serverList[idx - 1];
  const next = serverList[idx + 1];

  // 3. Lấy ảnh
  const chapterImages = await getChapterImages(
    serverList[idx].chapter_api_data
  );

  // 4. Danh sách chapter cho dropdown
  const chapterNames = serverList.map((c) => c.chapter_name);

  return (
    <LayoutMain>
      <div className="mx-auto max-w-4xl lg:px-4 lg:py-6">
        {/* breadcrumb */}
        <nav className="mb-4 text-sm text-white/70 p-4 lg:p-0">
          <Link href="/">Trang chủ</Link>
          {" / "}
          <Link
            href={`/truyen-tranh/${slug}`}
            className="text-[#38BDF8]"
          >
            {comic.name}
          </Link>
          {" / "}
          <span>Chapter {chapter}</span>
        </nav>

        {/* nav trên */}
        <ChapterNav
          slug={slug}
          chapters={chapterNames}
          current={chapter}
          prevSlug={prev?.chapter_name}
          nextSlug={next?.chapter_name}
        />

        {/* ảnh */}
        <div className="space-y-0">
          {chapterImages.map((src, i) => (
            <ChapterImage key={i} src={src} index={i} />
          ))}
        </div>

        {/* nav dưới */}
        <ChapterNav
          slug={slug}
          chapters={chapterNames}
          current={chapter}
          prevSlug={prev?.chapter_name}
          nextSlug={next?.chapter_name}
        />
      </div>
    </LayoutMain>
  );
}
