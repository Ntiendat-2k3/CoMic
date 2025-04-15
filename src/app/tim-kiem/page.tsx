import LayoutMain from "../layouts/LayoutMain";
import SearchResults from "../components/search/SearchResults";
import OTruyenService from "../services/otruyen.service";
import dynamic from "next/dynamic";

const HamsterLoading = dynamic(() => import("../components/loading/HamsterLoading"), {
  ssr: true,
});

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
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

  if (!keyword) {
    return (
      <LayoutMain>
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-100 my-20">
            Vui lòng nhập từ khóa tìm kiếm
          </h2>
          <HamsterLoading></HamsterLoading>
        </div>
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <SearchResults keyword={keyword} comics={comics} error={error} />
    </LayoutMain>
  );
}
