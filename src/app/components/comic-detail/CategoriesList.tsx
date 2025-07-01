import type { Category } from "@/app/types/common"
import Link from "next/link"

interface CategoriesListProps {
  categories: Category[]
}

const CategoriesList = ({ categories }: CategoriesListProps) => (
  <div className="flex flex-wrap gap-2">
    {categories.map((cat) => (
      <Link
        key={`category-${cat._id}-${cat.slug}`}
        href={`/the-loai/${cat.slug}`}
        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-full text-sm text-white transition-colors"
      >
        {cat.name}
      </Link>
    ))}
  </div>
)

export default CategoriesList
