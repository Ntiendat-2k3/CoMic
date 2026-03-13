import LayoutMain from "@/components/layout/LayoutMain"
import SearchPageClient from "./SearchPageClient"

interface PageProps {
  searchParams: Promise<{ keyword?: string }>
}

export async function generateMetadata(props: PageProps) {
  const { keyword = "" } = await props.searchParams
  return {
    title: keyword ? `Tìm kiếm: "${keyword}"` : "Tìm truyện",
    description: `Kết quả tìm kiếm cho từ khóa "${keyword}"`,
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
