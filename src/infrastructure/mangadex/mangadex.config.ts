export const MANGADEX_API_URL =
  process.env.NEXT_PUBLIC_MANGADEX_API_URL ?? "https://api.mangadex.org";

export const MANGADEX_COVER_BASE_URL =
  process.env.NEXT_PUBLIC_MANGADEX_COVER_URL ??
  (MANGADEX_API_URL.includes("mangadex.dev")
    ? "https://uploads.mangadex.dev/covers"
    : "https://uploads.mangadex.org/covers");
