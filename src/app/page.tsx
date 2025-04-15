import { Suspense } from "react";
import LayoutMain from "./layouts/LayoutMain";
import HomeContentClient from "./components/home/HomeContentClient";
import dynamic from "next/dynamic";

const SkeletonComicGrid = dynamic(
  () => import("./components/home/SkeletonComicGrid"),
  {
    ssr: true,
  }
);

export default function Home() {
  return (
    <LayoutMain>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-primary-dark p-3 mb-8 rounded-lg shadow-lg border-animation">
          <h1 className="text-xl font-semibold text-white marquee-container">
            <span className="marquee-content">
              Trang cập nhật truyện nhanh nhất. Mỗi ngày nhiều truyện mới
            </span>
          </h1>
        </div>

        <Suspense fallback={<SkeletonComicGrid />}>
          <HomeContentClient />
        </Suspense>
      </div>
    </LayoutMain>
  );
}
