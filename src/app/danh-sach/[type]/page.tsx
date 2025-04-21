import ComicGrid from "@/app/components/home/ComicGrid";
import Breadcrumb from "@/app/components/status/Breadcrumb";
import LayoutMain from "@/app/layouts/LayoutMain";
import OTruyenService, {
  ComicListStatus,
} from "@/app/services/otruyen.service";
import Pagination from "@/app/utils/Pagination";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ type: ComicListStatus }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return ["truyen-moi", "sap-ra-mat", "dang-phat-hanh", "hoan-thanh"].map(
    (type) => ({ type })
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { type } = await props.params;
  const { data } = await OTruyenService.getComicList(type);

  return {
    title: data.seoOnPage.titleHead,
    description: data.seoOnPage.descriptionHead,
    openGraph: {
      images: data.seoOnPage.og_image.map(
        (img) => `https://img.otruyenapi.com${img}`
      ),
      url: `https://yourdomain.com/danh-sach/${type}`,
      type: "website",
    },
  };
}

export default async function StatusListPage(props: PageProps) {
  const { params, searchParams } = props;
  const { page } = await searchParams;
  const { type } = await params;

  const currentPage = Number(page) || 1;
  const { data } = await OTruyenService.getComicList(type, currentPage);

  const pageCount = Math.ceil(
    data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage
  );

  return (
    <LayoutMain>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={data.breadCrumb} />

        <h1 className="text-3xl font-bold mb-8 text-white">{data.titlePage}</h1>

        {data.items.length > 0 ? (
          <>
            <ComicGrid comics={data.items} />

            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              basePath={`/danh-sach/${type}`}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            Hiện chưa có truyện nào trong danh mục này
          </div>
        )}
      </div>
    </LayoutMain>
  );
}
