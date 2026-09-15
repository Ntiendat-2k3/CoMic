import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ComicDetailSections from "@/components/comic-detail/ComicDetailSections";
import ComicDetailHero from "@/components/comic-detail/ComicDetailHero";
import { ComicDetailHeader } from "@/components/comic-detail/ComicDetailParts";
import RelatedComicStrip from "@/components/comic-detail/RelatedComicStrip";
import LayoutMain from "@/components/layout/LayoutMain";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";
import { getDictionary } from "@/i18n/dictionaries";
import ComicCatalogService from "@/services/comic-catalog.service";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getComicDetail = cache((slug: string) =>
  ComicCatalogService.getComicDetail(slug, { includeRelated: true }),
);

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { comic: copy } = getDictionary();
  try {
    const { slug } = await props.params;
    const { data } = await getComicDetail(slug);
    return {
      title: data.seoOnPage.titleHead,
      description: data.seoOnPage.descriptionHead,
      openGraph: {
        images: data.seoOnPage.og_image?.map((url) => ({ url })),
      },
    };
  } catch {
    return { title: copy.notFound };
  }
}

/* Không gọi API ngoài trong lúc build; trang chi tiết được dựng khi có yêu cầu. */
export async function generateStaticParams() {
  return [];
}

export default async function ComicDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const { data } = await getComicDetail(slug);
  const {
    item: comic,
    relatedItems,
    APP_DOMAIN_CDN_IMAGE: cdnUrl,
    breadCrumb,
  } = data;

  if (!comic) return notFound();

  console.log("[ComicDetail] Thông tin bộ truyện:", comic);

  const sortedChapters = comic.chapters
    .flatMap((server) => server.server_data)
    .toSorted(
      (left, right) =>
        Number.parseFloat(left.chapter_name ?? "0") -
        Number.parseFloat(right.chapter_name ?? "0"),
    );
  const firstChapterSlug =
    sortedChapters[0]?.chapter_slug ?? sortedChapters[0]?.chapter_name ?? "";
  const thumbSrc = resolveCoverUrl(comic.thumb_url, cdnUrl);
  const chapterCount = sortedChapters.length;

  return (
    <LayoutMain hideMobileNavigation>
      <div className="min-h-screen bg-[#0b0e17] pb-10">
        <ComicDetailHeader comic={comic} cdnUrl={cdnUrl} />

        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-8">
          <div className="mb-4 hidden rounded-xl border border-white/5 bg-white/[0.035] px-4 py-3 md:block">
            <Breadcrumb items={breadCrumb} />
          </div>

          <ComicDetailHero
            comic={comic}
            cdnUrl={cdnUrl}
            firstChapterSlug={firstChapterSlug}
            thumbSrc={thumbSrc}
          />

          <div className="mt-7 space-y-8 px-1 sm:px-0">
            <ComicDetailSections comic={comic} chapterCount={chapterCount} />
            <RelatedComicStrip comics={relatedItems} cdnUrl={cdnUrl} />
          </div>
        </div>
      </div>
    </LayoutMain>
  );
}
