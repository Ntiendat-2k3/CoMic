import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Suspense } from "react"
import LayoutMain from "@/components/layout/LayoutMain"
import OTruyenService from "@/services/otruyen.service"
import Breadcrumb from "@/components/ui/Breadcrumb"
import {
  ComicThumbnail,
  ActionButtons,
  ComicMetadata,
  CategoriesList,
  Description,
} from "@/components/comic-detail/ComicDetailParts"
import VirtualChapterList from "@/components/chapter/VirtualChapterList"

interface PageProps {
  params: Promise<{ slug: string }>
}

/* ── SEO ── */
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
        })),
      },
    }
  } catch {
    return { title: "Không tìm thấy truyện" }
  }
}

/* ── Static Params (ISR 50 truyện hot) ── */
export async function generateStaticParams() {
  try {
    const { data } = await OTruyenService.getHomeData(1, 50)
    return data.items.map((c) => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export default async function ComicDetailPage(props: PageProps) {
  const { slug } = await props.params
  const { data } = await OTruyenService.getComicDetail(slug)
  const { item: comic, APP_DOMAIN_CDN_IMAGE: cdnUrl, breadCrumb } = data

  if (!comic) return notFound()

  // Sắp xếp chapter tăng dần → lấy chapter đầu tiên
  const serverData = comic.chapters[0]?.server_data ?? []
  const sortedChapters = [...serverData].sort(
    (a, b) => Number.parseFloat(a.chapter_name ?? "0") - Number.parseFloat(b.chapter_name ?? "0")
  )
  const firstChapterSlug = sortedChapters[0]?.chapter_name ?? ""
  const thumbSrc = `${cdnUrl}/uploads/comics/${comic.thumb_url}`

  return (
    <LayoutMain>
      <div className="min-h-screen">
        <Suspense fallback={<div className="h-screen animate-pulse bg-gray-800/20" />}>
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4">
            {/* Breadcrumb */}
            <div className="hidden sm:block bg-gray-800/60 rounded-xl px-4 py-3">
              <Breadcrumb items={breadCrumb} />
            </div>

            {/* Hero section: thumbnail + info */}
            <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-5 lg:gap-8">
                {/* Thumbnail */}
                <div className="w-36 sm:w-48 lg:w-64 flex-shrink-0 mx-auto sm:mx-0">
                  <ComicThumbnail src={thumbSrc} alt={comic.name} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <ComicMetadata comic={comic} />

                  {/* Categories */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Thể loại
                    </h3>
                    <CategoriesList categories={comic.category} />
                  </div>

                  {/* Actions */}
                  <ActionButtons
                    comic={comic}
                    cdnUrl={cdnUrl}
                    firstChapterSlug={firstChapterSlug}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Nội dung
                </h3>
                <Description content={comic.content} />
              </div>
            </div>

            {/* Chapter list */}
            <div className="bg-gray-800/60 rounded-2xl border border-gray-700/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-700/40 border-b border-gray-700/50">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="text-blue-400">📚</span>
                  Danh sách chương
                </h3>
                <span className="text-xs text-gray-400 bg-gray-700/60 px-2 py-1 rounded-full">
                  {serverData.length} chương
                </span>
              </div>

              <div className="p-3 sm:p-5">
                {comic.chapters.map((server, idx) => (
                  <div key={server.server_name} className={idx > 0 ? "mt-6" : ""}>
                    {comic.chapters.length > 1 && (
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {server.server_name}
                      </p>
                    )}
                    <VirtualChapterList
                      chapters={server.server_data}
                      comicSlug={comic.slug}
                    />
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
