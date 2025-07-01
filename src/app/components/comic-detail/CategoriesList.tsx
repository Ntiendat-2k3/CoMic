import type { Category } from "@/app/types/common"
import Link from "next/link"

interface CategoriesListProps {
  categories: Category[]
}

const CategoriesList = ({ categories }: CategoriesListProps) => (
  <div className="flex flex-wrap gap-1 sm:gap-2">
    {categories.slice(0, 6).map((cat) => (
      <Link
        key={`category-${cat._id}-${cat.slug}`}
        href={`/the-loai/${cat.slug}`}
        className="px-2 sm:px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-xs sm:text-sm text-white transition-colors touch-manipulation"
      >
        {cat.name}
      </Link>
    ))}
    {categories.length > 6 && (
      <span className="px-2 sm:px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-400">
        +{categories.length - 6}
      </span>
    )}
  </div>
)

export default CategoriesList
