import LayoutMain from "@/components/layout/LayoutMain"
import FavoritesClient from "./FavoritesClient"

export const metadata = {
  title: "Truyện yêu thích",
  description: "Danh sách truyện bạn đã đánh dấu yêu thích",
}

export default function FavoritesPage() {
  return (
    <LayoutMain>
      <FavoritesClient />
    </LayoutMain>
  )
}
