import { Metadata } from "next"
import { unstable_cache } from "next/cache"
import LayoutMain from "@/components/layout/LayoutMain"
import ComicCatalogService from "@/services/comic-catalog.service"
import ComicGrid from "@/components/comic/ComicGrid"
import Pagination from "@/components/ui/Pagination"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { getDictionary } from "@/i18n/dictionaries"
import { formatMessage } from "@/i18n/format-message"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

const getCachedData = unstable_cache(
  async (slug: string, page: number) => {
    const { data } = await ComicCatalogService.getComicsByCategory(slug, page)
    return data
  },
  ["category-data"],
  { revalidate: 3600, tags: ["comics", "categories"] }
)

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { listing } = getDictionary()
  const { slug } = await props.params
  const data = await getCachedData(slug, 1)
  return {
    title: formatMessage(listing.categoryMetaTitle, { title: data.titlePage }),
    description: formatMessage(listing.categoryMetaDescription, { category: slug }),
  }
}

export default async function CategoryPage(props: PageProps) {
  const { listing } = getDictionary()
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
        {/* Đường dẫn phân cấp */}
        <Breadcrumb items={data.breadCrumb} />

        {/* Tiêu đề danh mục */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-white">{data.titlePage}</h1>
          <span className="text-sm text-gray-400">
            {formatMessage(listing.categorySummary, {
              comics: data.params.pagination.totalItems,
              current: currentPage,
              total: pageCount,
            })}
          </span>
        </div>

        {/* Danh sách truyện */}
        <ComicGrid
          comics={data.items}
          cdnUrl={data.APP_DOMAIN_CDN_IMAGE}
        />

        {/* Phân trang */}
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          basePath={`/the-loai/${slug}`}
        />
      </div>
    </LayoutMain>
  )
}
