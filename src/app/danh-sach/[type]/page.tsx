import { Metadata } from "next"
import LayoutMain from "@/components/layout/LayoutMain"
import ComicCatalogService, { ComicListStatus } from "@/services/comic-catalog.service"
import ComicGrid from "@/components/comic/ComicGrid"
import Pagination from "@/components/ui/Pagination"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { getDictionary } from "@/i18n/dictionaries"
import { formatMessage } from "@/i18n/format-message"
import { cache } from "react"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ type: ComicListStatus }>
  searchParams: Promise<{ page?: string }>
}

const getComicList = cache((type: ComicListStatus, page = 1) =>
  ComicCatalogService.getComicList(type, page),
)

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { type } = await props.params
  const data = await getComicList(type, 1)
  return {
    title: data.data.seoOnPage.titleHead,
    description: data.data.seoOnPage.descriptionHead,
  }
}

export default async function StatusListPage(props: PageProps) {
  const dictionary = getDictionary()
  const { type } = await props.params
  const { page } = await props.searchParams
  const currentPage = Number(page) || 1

  const response = await getComicList(type, currentPage)
  const { data } = response
  const pageCount = Math.ceil(
    data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage
  )
  const CDN = ""

  return (
    <LayoutMain>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Breadcrumb items={data.breadCrumb} />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-white">{data.titlePage}</h1>
          <span className="text-sm text-gray-400">
            {formatMessage(dictionary.common.comicCount, {
              count: data.params.pagination.totalItems,
            })}
          </span>
        </div>

        {data.items.length > 0 ? (
          <>
            <ComicGrid comics={data.items} cdnUrl={CDN} />
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              basePath={`/danh-sach/${type}`}
            />
          </>
        ) : (
          <div className="py-20 text-center text-gray-400">
            {dictionary.listing.empty}
          </div>
        )}
      </div>
    </LayoutMain>
  )
}
