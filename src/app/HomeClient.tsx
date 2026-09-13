"use client";

import ComicGrid from "@/components/comic/ComicGrid";
import Pagination from "@/components/ui/Pagination";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { useHomePageController } from "@/features/home/hooks/useHomePageController";
import type { HomeResponse } from "@/types/response";

interface HomeClientProps {
  initialData?: HomeResponse;
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const { page, setPage, data, isLoading, isFetching } = useHomePageController(initialData);
  const { home } = useDictionary();

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang chủ */}
      <div className="text-center py-6 px-4 bg-gradient-to-b from-gray-800/30 to-transparent rounded-2xl border border-gray-700/30">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {home.title}
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          {data?.totalPages
            ? formatMessage(home.subtitleWithPages, { pages: data.totalPages })
            : home.subtitle}
        </p>
        <div className="w-20 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mt-3" />
      </div>

      {/* Danh sách mờ nhẹ trong lúc đổi trang */}
      <div className={`transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-70" : "opacity-100"}`}>
        <ComicGrid
          comics={data?.comics}
          cdnUrl=""
          isLoading={isLoading}
          skeletonCount={15}
        />
      </div>

      {/* Phân trang */}
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
