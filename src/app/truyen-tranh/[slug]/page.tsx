import { notFound } from "next/navigation"
import OTruyenService from "@/app/services/otruyen.service"
import LayoutMain from "@/app/layouts/LayoutMain"
import {
  ActionButtons,
  Breadcrumb,
  CategoriesList,
  ChapterServer,
  ComicMetadata,
  Description,
  SEOComic,
  Thumbnail,
} from "@/app/components/comic-detail"
import type { Metadata } from "next"
import { Suspense } from "react"
import { ComicDetailSkeleton } from "@/app/components/loading/ComicDetailSkeleton"

interface PageProps {
  params: Promise<{ slug: string }>
}

/* ------------------- SEO ------------------- */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  try {
    const { slug } = await props.params
    const { data } = await OTruyenService.getComicDetail(slug)
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
    }
  } catch {
    return {
      title: "Không tìm thấy truyện",
      description: "Trang truyện không tồn tại hoặc đã bị xóa",
    }
  }
}

/* ------------- ISR danh sách 50 truyện hot ------------- */
export async function generateStaticParams() {
  try {
    const { data } = await OTruyenService.getHomeData(1, 50)
    return data.items.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

/* ------------------- PAGE ------------------- */
export default async function ComicDetailPage(props: PageProps) {
  const { slug } = await props.params
  const { data } = await OTruyenService.getComicDetail(slug)

  const { item: comic, APP_DOMAIN_CDN_IMAGE: cdnUrl, breadCrumb, seoOnPage } = data

  if (!comic) return notFound()

  // ----- Tính slug của chapter đầu tiên (nhỏ nhất) -----
  const rawChaps = comic.chapters[0]?.server_data ?? []
  // sort theo số (có thể parseFloat nếu là số, hoặc parseInt)
  const sortedAsc = [...rawChaps].sort(
    (a, b) => Number.parseFloat(a.chapter_name ?? "0") - Number.parseFloat(b.chapter_name ?? "0"),
  )
  const firstChapterSlug = sortedAsc[0]?.chapter_name ?? ""

  return (
    <LayoutMain>
      <div className="min-h-screen bg-gray-900">
        <Suspense fallback={<ComicDetailSkeleton />}>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* SEO hidden tags */}
            <SEOComic seoData={seoOnPage} cdnUrl={cdnUrl} />

            {/* Breadcrumb */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <Breadcrumb items={breadCrumb} />
            </div>

            {/* Main Content Container */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              {/* ---------------- THUMB + INFO ---------------- */}
              <div className="grid gap-8 lg:grid-cols-[300px_1fr] 2xl:grid-cols-[400px_1fr]">
                <div>
                  <Thumbnail src={`${cdnUrl}/uploads/comics/${comic.thumb_url}`} alt={comic.name} />
                </div>

                <div className="flex flex-col space-y-6">
                  <ComicMetadata comic={comic} />

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Thể loại</h3>
                    <CategoriesList categories={comic.category} />
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Hành động</h3>
                    <ActionButtons comicSlug={comic.slug} firstChapterSlug={firstChapterSlug} />
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <Description content={comic.content} />
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- CHAPTER LIST ---------------- */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-700 border-b border-gray-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                    <span className="text-blue-400">📚</span>
                    Danh sách chương
                  </h3>
                  <div className="bg-gray-600 px-3 py-1 rounded text-sm text-gray-300">
                    {comic.chapters[0]?.server_data?.length || 0} chương
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="p-6">
                {comic.chapters.map((server, idx) => (
                  <div key={server.server_name} className="mb-8 last:mb-0">
                    <ChapterServer server={server} comicSlug={comic.slug} serverIndex={idx} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </LayoutMain>
  )
}
