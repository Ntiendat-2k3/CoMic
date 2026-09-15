import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import ComicGrid from "@/components/comic/ComicGrid";
import { getDictionary } from "@/i18n/dictionaries";
import type { Comic } from "@/types/comic";

interface RelatedComicStripProps {
  comics: Comic[];
  cdnUrl: string;
}

/** Trình bày các truyện chung thể loại được MangaDex trả về, không dùng dữ liệu mẫu. */
export default function RelatedComicStrip({ comics, cdnUrl }: RelatedComicStripProps) {
  if (comics.length === 0) return null;

  const { comic: copy } = getDictionary();

  return (
    <section aria-labelledby="related-comics-heading">
      <header className="mb-3 flex items-center gap-3">
        <Flame size={22} className="fill-pink-500/20 text-pink-400" aria-hidden="true" />
        <h2 id="related-comics-heading" className="text-lg font-extrabold text-white">
          {copy.relatedHeading}
        </h2>
        <Link href="/the-loai" className="ml-auto flex items-center gap-1 text-xs font-semibold text-pink-400">
          {copy.viewMore}<ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      <ComicGrid comics={comics} cdnUrl={cdnUrl} layout="related" />
    </section>
  );
}
