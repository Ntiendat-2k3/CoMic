import LayoutMain from "@/components/layout/LayoutMain"
import FavoritesClient from "./FavoritesClient"
import { getDictionary } from "@/i18n/dictionaries"

const dictionary = getDictionary()

export const metadata = {
  title: dictionary.favorites.metadataTitle,
  description: dictionary.favorites.metadataDescription,
}

export default function FavoritesPage() {
  return (
    <LayoutMain>
      <FavoritesClient />
    </LayoutMain>
  )
}
