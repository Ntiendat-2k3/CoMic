import LayoutMain from "@/components/layout/LayoutMain"
import SearchPageClient from "./SearchPageClient"
import { getDictionary } from "@/i18n/dictionaries"
import { formatMessage } from "@/i18n/format-message"

interface PageProps {
  searchParams: Promise<{ keyword?: string }>
}

export async function generateMetadata(props: PageProps) {
  const { search } = getDictionary()
  const { keyword = "" } = await props.searchParams
  return {
    title: keyword
      ? formatMessage(search.metadataTitle, { keyword })
      : search.metadataDefaultTitle,
    description: formatMessage(search.metadataDescription, { keyword }),
  }
}

export default async function SearchPage(props: PageProps) {
  const { keyword = "" } = await props.searchParams
  return (
    <LayoutMain>
      <SearchPageClient initialKeyword={keyword} />
    </LayoutMain>
  )
}
