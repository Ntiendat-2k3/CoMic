import { Category } from "@/app/types/common";
import Link from "next/link";

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList = ({ categories }: CategoriesListProps) => (
  <div className="flex flex-wrap gap-3">
    {categories.map((cat) => (
      <Link
        key={`category-${cat._id}-${cat.slug}`}
        href={`/the-loai/${cat.slug}`}
        className="px-4 py-2 bg-primary-dark rounded-lg text-sm font-medium 
          hover:bg-primary-accent transition-colors duration-200
          border border-gray-700 hover:border-primary-accent
          text-gray-300 hover:text-white"
      >
        {cat.name}
      </Link>
    ))}
  </div>
);
export default CategoriesList;