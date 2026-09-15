import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ComicDetailSections from "@/components/comic-detail/ComicDetailSections";
import {
  ActionButtons,
  CategoriesList,
  ComicDetailHeader,
  ComicMetadata,
  ComicThumbnail,
} from "@/components/comic-detail/ComicDetailParts";
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
  const { comic: copy } = getDictionary();
  const { slug } = await props.params;
  const { data } = await getComicDetail(slug);
  const {
    item: comic,
    relatedItems,
    APP_DOMAIN_CDN_IMAGE: cdnUrl,
    breadCrumb,
  } = data;

  if (!comic) return notFound();

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

          <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-pink-300/20 bg-[#121620] shadow-[0_28px_80px_rgba(0,0,0,.38)]">
            <Image
              src={thumbSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-20 scale-110 object-cover object-center blur-2xl saturate-125"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,13,22,.97)_0%,rgba(10,13,22,.86)_54%,rgba(10,13,22,.7)_100%),linear-gradient(0deg,rgba(10,13,22,.98),transparent_72%)]" />

            <div className="p-3 sm:p-7 lg:p-10">
              <div className="grid grid-cols-[minmax(8.25rem,42%)_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-7 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
                <ComicThumbnail src={thumbSrc} alt={comic.name} />

                <div className="min-w-0 self-center">
                  <ComicMetadata comic={comic} />
                  {comic.category.length > 0 ? (
                    <div className="mt-3">
                      <h2 className="sr-only">{copy.categoriesHeading}</h2>
                      <CategoriesList categories={comic.category} />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 sm:ml-[14.75rem] lg:ml-[19.5rem]">
                <ActionButtons
                  comic={comic}
                  cdnUrl={cdnUrl}
                  firstChapterSlug={firstChapterSlug}
                />
              </div>
            </div>
          </section>

          <div className="mt-7 space-y-8 px-1 sm:px-0">
            <ComicDetailSections comic={comic} chapterCount={chapterCount} />
            <RelatedComicStrip comics={relatedItems} cdnUrl={cdnUrl} />
          </div>
        </div>
      </div>
    </LayoutMain>
  );
}
