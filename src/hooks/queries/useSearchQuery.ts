import { useQuery } from "@tanstack/react-query";
import { comicCatalogHttpClient } from "@/infrastructure/http/comic-catalog.http-client";
import { queryKeys } from "./queryKeys";

export function useSearchQuery(keyword: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search(keyword),
    queryFn: () => comicCatalogHttpClient.searchComics(keyword),
    enabled: Boolean(keyword.trim()) && enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
