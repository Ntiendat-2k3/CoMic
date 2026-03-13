import { QueryClient } from "@tanstack/react-query";

// Tạo QueryClient với cấu hình tối ưu cho app truyện tranh
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 phút - data vẫn còn "tươi" trong 5 phút
        staleTime: 5 * 60 * 1000,
        // Cache: 10 phút - giữ trong bộ nhớ 10 phút sau khi component unmount
        gcTime: 10 * 60 * 1000,
        // Retry 1 lần khi lỗi
        retry: 1,
        // Refetch khi focus lại tab
        refetchOnWindowFocus: false,
      },
    },
  });
}

// Singleton cho browser (tránh tạo lại khi re-render)
let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: luôn tạo mới để tránh shared state
    return makeQueryClient();
  }
  // Browser: dùng singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
