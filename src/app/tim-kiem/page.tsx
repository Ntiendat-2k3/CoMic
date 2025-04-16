import LayoutMain from "../layouts/LayoutMain";
import OTruyenService from "../services/otruyen.service";
import dynamic from "next/dynamic";

const SearchClient = dynamic(() => import("../components/search/SearchClient"), {
  ssr: true,
  loading: () => <div className="min-h-screen">Loading search...</div>,
});

interface PageProps {
  searchParams: Promise<{ [keyword: string]: string | undefined }>;
}

async function getSearchResults(keyword: string) {
  if (!keyword?.trim()) return { comics: [], error: "" };

  try {
    const response = await OTruyenService.searchComics(keyword);
    return {
      comics: response.data.data.items,
      error: "",
      revalidate: 3600  //1h
    };
  } catch (err) {
    console.error("Error fetching search results:", err);
    return {
      comics: [],
      error: "Không thể tải kết quả tìm kiếm",
    };
  }
}

export async function generateMetadata(props: PageProps) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword || "";
  
  return {
    title: keyword ? `Tìm kiếm: "${keyword}"` : 'Tìm truyện',
    description: `Kết quả tìm kiếm cho từ khóa "${keyword}"`,
  };
}

export default async function SearchPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword || "";
  const { comics, error } = await getSearchResults(keyword);
  console.log("🚀 ~ SearchPage ~ comics:", comics)

  return (
    <LayoutMain>
      <SearchClient
        initialKeyword={keyword}
        initialComics={comics}
        initialError={error}
      />
    </LayoutMain>
  );
}