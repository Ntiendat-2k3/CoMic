import { notFound } from "next/navigation";
import OTruyenService from "@/app/services/otruyen.service";
import LayoutMain from "@/app/layouts/LayoutMain";
import {
  ActionButtons,
  Breadcrumb,
  CategoriesList,
  ChapterServer,
  ComicMetadata,
  Description,
  SEOComic,
  Thumbnail,
} from "@/app/components/comic-detail";
import { Metadata } from "next";
import { Suspense } from "react";
import { ComicDetailSkeleton } from "@/app/components/loading/ComicDetailSkeleton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ------------------- SEO ------------------- */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  try {
    const { slug } = await props.params;
    const { data } = await OTruyenService.getComicDetail(slug);
    return {
      title: data.seoOnPage.titleHead,
      description: data.seoOnPage.descriptionHead,
      openGraph: {
        images: data.seoOnPage.og_image?.map((i) => ({
          url: `${data.APP_DOMAIN_CDN_IMAGE}${i}`,
          width: 800,
          height: 600,
        })),
      },
    };
  } catch {
    return {
      title: "Không tìm thấy truyện",
      description: "Trang truyện không tồn tại hoặc đã bị xóa",
    };
  }
}

/* ------------- ISR danh sách 50 truyện hot ------------- */
export async function generateStaticParams() {
  try {
    const { data } = await OTruyenService.getHomeData(1, 50);
    return data.items.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

/* ------------------- PAGE ------------------- */
export default async function ComicDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const { data } = await OTruyenService.getComicDetail(slug);

  const {
    item: comic,
    APP_DOMAIN_CDN_IMAGE: cdnUrl,
    breadCrumb,
    seoOnPage,
  } = data;

  if (!comic) return notFound();

  // ----- Tính slug của chapter đầu tiên (nhỏ nhất) -----
  const rawChaps = comic.chapters[0]?.server_data ?? [];
  // sort theo số (có thể parseFloat nếu là số, hoặc parseInt)
  const sortedAsc = [...rawChaps].sort((a, b) =>
    parseFloat(a.chapter_name ?? "0") - parseFloat(b.chapter_name ?? "0")
  );
  const firstChapterSlug = sortedAsc[0]?.chapter_name ?? "";

  return (
    <LayoutMain>
      <Suspense fallback={<ComicDetailSkeleton />}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* SEO hidden tags */}
          <SEOComic seoData={seoOnPage} cdnUrl={cdnUrl} />

          <Breadcrumb items={breadCrumb} />

          {/* ---------------- THUMB + INFO ---------------- */}
          <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr] 2xl:grid-cols-[350px_1fr]">
            <Thumbnail
              src={`${cdnUrl}/uploads/comics/${comic.thumb_url}`}
              alt={comic.name}
            />

            <div className="flex flex-col space-y-6">
              <ComicMetadata comic={comic} />
              <CategoriesList categories={comic.category} />
              <ActionButtons
                comicSlug={comic.slug}
                firstChapterSlug={firstChapterSlug}
              />
              <Description content={comic.content} />
            </div>

            {/* Chạy quảng cáo  div cha: xl:grid-cols-[280px_1fr_240px] */}
            {/* <div className="hidden 2xl:block" /> */}
          </div>

          {/* ---------------- CHAPTER LIST ---------------- */}
          <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900 shadow-xl">
            <h3 className="border-b border-gray-700 px-4 py-3 text-lg font-bold text-white sm:text-2xl">
              Danh sách chương
            </h3>

            {comic.chapters.map((server, idx) => (
              <div
                key={server.server_name}
                className="overflow-x-auto px-2 lg:px-4"
              >
                <ChapterServer
                  server={server}
                  comicSlug={comic.slug}
                  serverIndex={idx}
                />
              </div>
            ))}
          </div>
        </div>
      </Suspense>
    </LayoutMain>
  );
}
