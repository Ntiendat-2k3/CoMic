// Centralized query keys - tránh magic strings rải rác trong code
export const queryKeys = {
  // Home page comics
  home: (page: number) => ["home", page] as const,

  // Comic detail
  comicDetail: (slug: string) => ["comic", slug] as const,

  // Chapter images
  chapter: (apiUrl: string) => ["chapter", apiUrl] as const,

  // Category list
  categories: () => ["categories"] as const,

  // Comics by category
  comicsByCategory: (slug: string, page: number) =>
    ["category", slug, page] as const,

  // Comics by status (truyen-moi, hoan-thanh, etc.)
  comicsByStatus: (type: string, page: number) =>
    ["status", type, page] as const,

  // Search
  search: (keyword: string) => ["search", keyword] as const,
} as const;
