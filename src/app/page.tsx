import { Suspense } from "react"
import LayoutMain from "@/components/layout/LayoutMain"
import HomeClient from "./HomeClient"
import ComicCardSkeleton from "@/components/comic/ComicCardSkeleton"
import ComicCatalogService from "@/services/comic-catalog.service"
import { unstable_cache } from "next/cache"

const getInitialHomeData = unstable_cache(
  () => ComicCatalogService.getHomeData(1, 15),
  ["home-page-initial-data"],
  { revalidate: 300, tags: ["comics"] },
)

function GridSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 15 }, (_, i) => (
        <ComicCardSkeleton key={i} />
      ))}
    </div>
  )
}

async function HomeContent() {
  try {
    return <HomeClient initialData={await getInitialHomeData()} />
  } catch {
    return <HomeClient />
  }
}

export default function HomePage() {
  return (
    <LayoutMain>
      <Suspense
        fallback={(
          <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
            <GridSkeleton />
          </div>
        )}
      >
        <HomeContent />
      </Suspense>
    </LayoutMain>
  )
}
