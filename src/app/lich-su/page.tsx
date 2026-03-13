import LayoutMain from "@/components/layout/LayoutMain"
import HistoryClient from "./HistoryClient"

export const metadata = {
  title: "Lịch sử đọc truyện",
}

export default function HistoryPage() {
  return (
    <LayoutMain>
      <HistoryClient />
    </LayoutMain>
  )
}
