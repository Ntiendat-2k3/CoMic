import LayoutMain from "@/components/layout/LayoutMain"
import HistoryClient from "./HistoryClient"
import { getDictionary } from "@/i18n/dictionaries"

const dictionary = getDictionary()

export const metadata = {
  title: dictionary.history.metadataTitle,
}

export default function HistoryPage() {
  return (
    <LayoutMain>
      <HistoryClient />
    </LayoutMain>
  )
}
