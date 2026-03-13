"use client";

import { useState } from "react";
import { useHomeQuery } from "@/hooks/queries/useHomeQuery";
import ComicGrid from "@/components/comic/ComicGrid";
import Pagination from "@/components/ui/Pagination";

const DEFAULT_CDN = "https://img.otruyenapi.com";

export default function HomeClient() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useHomeQuery(page);

  return (
    <div className="space-y-6">
      {/* Phần header section */}
      <div className="text-center py-6 px-4 bg-gradient-to-b from-gray-800/30 to-transparent rounded-2xl border border-gray-700/30">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
          Truyện mới cập nhật
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          Cập nhật hàng ngày · {data?.totalPages ? `${data.totalPages} trang` : ""}
        </p>
        <div className="w-20 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mt-3" />
      </div>

      {/* Grid với loading overlay khi đổi trang */}
      <div className={`transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-70" : "opacity-100"}`}>
        <ComicGrid
          comics={data?.comics}
          cdnUrl={DEFAULT_CDN}
          isLoading={isLoading}
          skeletonCount={15}
        />
      </div>

      {/* Pagination */}
      {data && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
