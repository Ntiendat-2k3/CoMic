import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";
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

      <div className="-mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
        {comics.map((comic) => (
          <Link
            key={comic.slug}
            href={`/truyen-tranh/${comic.slug}`}
            className="group w-[8.5rem] flex-none snap-start overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141824] transition-colors hover:border-pink-400/35 sm:w-auto"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={resolveCoverUrl(comic.thumb_url, cdnUrl)}
                alt={comic.name}
                fill
                sizes="(max-width: 639px) 136px, (max-width: 1023px) 33vw, 180px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#10131d] to-transparent" aria-hidden="true" />
            </div>
            <h3 className="line-clamp-2 min-h-[2.75rem] px-2.5 py-2 text-xs font-semibold leading-5 text-gray-100">
              {comic.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
