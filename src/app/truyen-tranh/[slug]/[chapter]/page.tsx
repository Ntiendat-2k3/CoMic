import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LayoutMain from "@/app/layouts/LayoutMain";
import OTruyenService from "@/app/services/otruyen.service";
import ChapterNav from "@/app/components/ChapterNav";
import ChapterImage from "@/app/components/ChapterImage";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

/* ------------------- Types for Chapter API response ------------------- */
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

/* ------------------- Types for chapter metadata ------------------- */
interface ChapterMeta {
  chapter_name: string;
  chapter_api_data: string;
}

function isChapterMeta(c: unknown): c is ChapterMeta {
  // Narrow unknown to object with string properties without using 'any'
  if (typeof c !== "object" || c === null) return false;
  const obj = c as Record<string, unknown>;
  return (
    typeof obj.chapter_name === "string" &&
    typeof obj.chapter_api_data === "string"
  );
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

/* ---------------- Helper: lấy danh sách ảnh ---------------- */
async function getChapterImages(apiUrl: string): Promise<string[]> {
  try {
    const res = await OTruyenService.getChapterData(apiUrl);
    const raw = (res.data?.data ?? res.data) as unknown as ChapterApiResponse;

    // Format cũ: { images: string[] }
    if ("images" in raw) return raw.images;

    // Format mới
    const { domain_cdn, item } = raw;
    if (!item?.chapter_image?.length) return [];

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
  /* 1. Thông tin truyện + danh sách chương */
  const { data } = await OTruyenService.getComicDetail(slug);
  const comic = data.item;
  if (!comic) return notFound();

  // chunk raw chapters
  const rawChaps = comic.chapters[0]?.server_data ?? [];
  const serverData: ChapterMeta[] = rawChaps.filter(isChapterMeta);
  const current = serverData.find((c) => c.chapter_name === chapter);
  if (!current) return notFound();

  /* 2. Xác định prev / next (mảng DESC) */
  const idx = serverData.findIndex((c) => c.chapter_name === chapter);
  const prev = serverData[idx - 1];
  const next = serverData[idx + 1];

  /* 3. Danh sách ảnh */
  const chapterImages = await getChapterImages(current.chapter_api_data || "");

  /* 4. Danh sách tất cả chapter (để render dropdown) */
  const chapterNames: string[] = serverData.map((c) => c.chapter_name);

  return (
    <LayoutMain>
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* nav top */}
        <ChapterNav
          slug={slug}
          chapters={chapterNames}
          current={chapter}
          prevSlug={prev?.chapter_name}
          nextSlug={next?.chapter_name}
        />

        {/* images */}
        <div className="space-y-0">
          {chapterImages.map((src, i) => (
            <ChapterImage key={i} src={src} index={i} />
          ))}
        </div>

        {/* nav bottom */}
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