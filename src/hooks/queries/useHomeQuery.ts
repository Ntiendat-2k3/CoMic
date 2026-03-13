import { useQuery, keepPreviousData } from "@tanstack/react-query";
import OTruyenService from "@/services/otruyen.service";
import { queryKeys } from "./queryKeys";

const ITEMS_PER_PAGE = 15;

export function useHomeQuery(page: number) {
  return useQuery({
    queryKey: queryKeys.home(page),
    queryFn: () => OTruyenService.getHomeData(page, ITEMS_PER_PAGE),
    // Giữ data cũ khi chuyển trang (không bị blank)
    placeholderData: keepPreviousData,
    // Stale 5 phút - trang chủ update thường xuyên
    staleTime: 5 * 60 * 1000,
    select: (response) => ({
      comics: response.data.items,
      seoData: response.data.seoOnPage,
      totalPages: response.data.params?.pagination?.totalItems
        ? Math.ceil(response.data.params.pagination.totalItems / ITEMS_PER_PAGE)
        : 1,
      currentPage: response.data.params?.pagination?.currentPage ?? page,
    }),
  });
}
