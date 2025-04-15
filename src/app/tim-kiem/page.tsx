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
    };
  } catch (err) {
    console.error("Error fetching search results:", err);
    return {
      comics: [],
      error: "Không thể tải kết quả tìm kiếm",
    };
  }
}

export default async function SearchPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword || "";
  const { comics, error } = await getSearchResults(keyword);

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