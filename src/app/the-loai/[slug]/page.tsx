import { Metadata } from "next"
import { unstable_cache } from "next/cache"
import LayoutMain from "@/components/layout/LayoutMain"
import OTruyenService from "@/services/otruyen.service"
import ComicGrid from "@/components/comic/ComicGrid"
import Pagination from "@/components/ui/Pagination"
import Breadcrumb from "@/components/ui/Breadcrumb"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

const getCachedData = unstable_cache(
  async (slug: string, page: number) => {
    const { data } = await OTruyenService.getComicsByCategory(slug, page)
    return data
  },
  ["category-data"],
  { revalidate: 3600, tags: ["comics", "categories"] }
)

export async function generateStaticParams() {
  const popularCategories = ["action", "romance", "comedy", "drama"]
  return popularCategories.map((slug) => ({ slug }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params
  const data = await getCachedData(slug, 1)
  return {
    title: `Thể loại: ${data.titlePage}`,
    description: `Danh sách truyện thể loại ${slug}`,
  }
}

export default async function CategoryPage(props: PageProps) {
  const { slug } = await props.params
  const { page } = await props.searchParams
  const currentPage = Number(page) || 1

  const data = await getCachedData(slug, currentPage)
  const pageCount = Math.ceil(
    data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage
  )

  return (
    <LayoutMain>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={data.breadCrumb} />

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-white">{data.titlePage}</h1>
          <span className="text-sm text-gray-400">
            {data.params.pagination.totalItems} truyện · Trang {currentPage}/{pageCount}
          </span>
        </div>

        {/* Grid */}
        <ComicGrid
          comics={data.items}
          cdnUrl={data.APP_DOMAIN_CDN_IMAGE}
        />

        {/* Pagination */}
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          basePath={`/the-loai/${slug}`}
        />
      </div>
    </LayoutMain>
  )
}
