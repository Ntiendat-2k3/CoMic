import Breadcrumb from "@/app/components/category/Breadcrumb";
import SkeletonComicGrid from "@/app/components/home/SkeletonComicGrid";
import LayoutMain from "@/app/layouts/LayoutMain";
import OTruyenService from "@/app/services/otruyen.service";
import Pagination from "@/app/utils/Pagination";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const ComicGrid = dynamic(() => import("@/app/components/home/ComicGrid"), {
  loading: () => <SkeletonComicGrid />,
  ssr: true,
});

// Data Cache Layer
const getCachedData = unstable_cache(
  async (slug: string, page: number) => {
    try {
      const { data } = await OTruyenService.getComicsByCategory(slug, page);
      return data;
    } catch (error) {
      console.error("Error fetching category data:", error);
      throw new Error("Failed to load category data");
    }
  },
  ["category-data"],
  {
    revalidate: 3600, // 1 hour
    tags: ["comics", "categories"],
  }
);

export async function generateStaticParams() {
  const popularCategories = ["action", "romance", "comedy", "drama"];
  return popularCategories.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getCachedData(slug, 1);

  return {
    title: `Truyện theo thể loại: ${data.seoOnPage.titleHead}`,
    description: `Danh sách truyện thể loại ${slug}`,
    openGraph: {
      images: data.seoOnPage.og_image.map(
        (img) => `https://img.otruyenapi.com${img}`
      ),
      url: `https://yourdomain.com/the-loai/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage(props: PageProps) {
  const { params, searchParams } = props;
  const { slug } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const data = await getCachedData(slug, currentPage);

  // Tính toán thông số phân trang
  const totalItems = data.params.pagination.totalItems;
  const itemsPerPage = data.params.pagination.totalItemsPerPage;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <LayoutMain>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={data.breadCrumb} className="mb-8" />

        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">{data.titlePage}</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">
              Tổng số truyện: {totalItems}
            </span>
            <span className="text-gray-400 text-sm">
              Trang {currentPage} / {pageCount}
            </span>
          </div>
        </div>

        {/* Comic Grid */}
        <ComicGrid comics={data.items} />

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            basePath={`/the-loai/${slug}`}
            marginPagesDisplayed={1} // Số trang hiển thị ở lề
            pageRangeDisplayed={3} // Số trang hiển thị quanh trang hiện tại
            className="mt-8 flex gap-3"
          />
        </div>
      </div>
    </LayoutMain>
  );
}
