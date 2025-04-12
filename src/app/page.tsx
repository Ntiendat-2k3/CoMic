import ComicCard from "./components/ComicCard";
import LayoutMain from "./layouts/LayoutMain";
import OTruyenService from "./services/otruyen.service";

export default async function Home() {
  const { data } = await OTruyenService.getHomeData();

  // console.log("🚀 ~ Home ~ data:", data)
  return (
    <LayoutMain>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-primary-dark p-3 mb-8 rounded-lg shadow-lg border-animation">
          <h1 className="text-xl font-semibold text-white marquee-container">
            <span
              className="marquee-content"
              data-content={data.seoOnPage.titleHead}
            >
              {data.seoOnPage.titleHead}
            </span>
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {data.items.map((comic) => (
            <ComicCard
              key={comic._id}
              comic={comic}
              baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
            />
          ))}
        </div>

        {/* SEO Metadata */}
        <div className="hidden">
          <meta property="og:title" content={data.seoOnPage.titleHead} />
          <meta
            property="og:description"
            content={data.seoOnPage.descriptionHead}
          />
          <meta property="og:type" content={data.seoOnPage.og_type} />
          {data.seoOnPage.og_image.map((img, index) => (
            <meta
              key={index}
              property="og:image"
              content={`https://img.otruyenapi.com${img}`}
            />
          ))}
        </div>
      </div>
    </LayoutMain>
  );
}
