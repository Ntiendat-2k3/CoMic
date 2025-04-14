import { notFound } from "next/navigation";
import OTruyenService from "@/app/services/otruyen.service";
import LayoutMain from "@/app/layouts/LayoutMain";
import {
  Breadcrumb,
  CategoriesList,
  ChapterServer,
  ComicMetadata,
  Description,
  SEOComic,
  Thumbnail,
} from "@/app/components/comic-detail";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ComicDetailPage({ params }: PageProps) {
    const { slug } = params;
  
    const response = await OTruyenService.getComicDetail(slug);
    
    const { 
      item: comic,
      APP_DOMAIN_CDN_IMAGE: cdnUrl,
      breadCrumb,
      seoOnPage 
    } = response.data;
  
  if (!comic) return notFound();

  return (
    <LayoutMain>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <SEOComic seoData={seoOnPage} cdnUrl={cdnUrl} />

        <Breadcrumb items={breadCrumb} />

        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <Thumbnail
            src={`${cdnUrl}/uploads/comics/${comic.thumb_url}`}
            alt={comic.name}
          />

          <div className="lg:w-2/3 w-full space-y-6">
            <ComicMetadata comic={comic} />
            <CategoriesList categories={comic.category} />
            <Description content={comic.content} />
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-800">
          <h3 className="text-2xl font-bold text-white mb-6">
            Danh sách chương
          </h3>
          {comic.chapters.map((server, serverIndex) => (
            <ChapterServer
              key={`server-${serverIndex}-${server.server_name}`}
              server={server}
              comicSlug={comic.slug}
              serverIndex={serverIndex}
            />
          ))}
        </div>
      </div>
    </LayoutMain>
  );
}
