import type { MetadataRoute } from "next";
import { getDictionary } from "@/i18n/dictionaries";

/** Tạo manifest từ cùng nguồn nội dung với metadata và giao diện. */
export default function manifest(): MetadataRoute.Manifest {
  const { brand, locale } = getDictionary();

  return {
    name: brand.manifestName,
    short_name: brand.name,
    description: brand.manifestDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#ec4899",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["entertainment", "books"],
    lang: locale,
    dir: "ltr",
  };
}
