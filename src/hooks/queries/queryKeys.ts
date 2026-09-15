export const queryKeys = {
  home: (page: number) => ["home", page] as const,
  search: (keyword: string) => ["search", keyword] as const,
} as const;
