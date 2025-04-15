import { notFound } from "next/navigation";
import OTruyenService from "@/app/services/otruyen.service";
import LayoutMain from "@/app/layouts/LayoutMain";
import {
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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  try {
    const { slug } = await props.params;
    const { data } = await OTruyenService.getComicDetail(slug);

    return {
      title: data.seoOnPage.titleHead,
      description: data.seoOnPage.descriptionHead,
      openGraph: {
        images: data.seoOnPage.og_image?.map((img) => ({
          url: `${data.APP_DOMAIN_CDN_IMAGE}${img}`,
          width: 800,
          height: 600,
        })),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Không tìm thấy truyện",
      description: "Trang truyện không tồn tại hoặc đã bị xóa",
    };
  }
}

// Pre-render 50 item dể tăng tốc độ load trang chi tiết
export async function generateStaticParams() {
  try {
    const { data } = await OTruyenService.getHomeData(1, 50);
    return data.items.map((comic) => ({
      slug: comic.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ComicDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const response = await OTruyenService.getComicDetail(slug);

  const {
    item: comic,
    APP_DOMAIN_CDN_IMAGE: cdnUrl,
    breadCrumb,
    seoOnPage,
  } = response.data;

  if (!comic) return notFound();

  return (
    <LayoutMain>
      <Suspense fallback={<ComicDetailSkeleton />}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <SEOComic seoData={seoOnPage} cdnUrl={cdnUrl} />

          <Breadcrumb items={breadCrumb} />

          {/* Thumbnail */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <Thumbnail
              src={`${cdnUrl}/uploads/comics/${comic.thumb_url}`}
              alt={comic.name}
            />

            {/* Content */}
            <div className="lg:w-2/3 w-full space-y-6">
              <ComicMetadata comic={comic} />
              <CategoriesList categories={comic.category} />
              <Description content={comic.content} />
            </div>
          </div>

          {/* Chapter */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">
              Danh sách chương
            </h3>
            {comic.chapters.map((server, serverIndex) => (
              <ChapterServer
                key={`server-${serverIndex}-${server.server_name}`}
                server={server}
                comicSlug={comic.slug}
                serverIndex={serverIndex}
              />
            ))}
          </div>
        </div>
      </Suspense>
    </LayoutMain>
  );
}
