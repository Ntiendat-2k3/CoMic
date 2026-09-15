import type { Metadata } from "next";
import Link from "next/link";
import { Shapes } from "lucide-react";
import LayoutMain from "@/components/layout/LayoutMain";
import { getDictionary } from "@/i18n/dictionaries";
import ComicCatalogService from "@/services/comic-catalog.service";

const dictionary = getDictionary();

export const revalidate = 3600;

export const metadata: Metadata = {
  title: dictionary.listing.categoriesIndexTitle,
  description: dictionary.listing.categoriesIndexDescription,
};

export default async function CategoriesIndexPage() {
  const categories = await ComicCatalogService.getCategories().catch(() => []);

  return (
    <LayoutMain>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="max-w-2xl">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-pink-400/25 bg-pink-500/10 text-pink-300">
            <Shapes size={21} aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {dictionary.listing.categoriesIndexTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            {dictionary.listing.categoriesIndexDescription}
          </p>
        </header>

        {categories.length > 0 ? (
          <nav
            className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            aria-label={dictionary.navigation.categories}
          >
            {categories.map((category) => (
              <Link
                key={category._id || category.slug}
                href={`/the-loai/${category.slug}`}
                className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-gray-300 transition-colors hover:border-pink-400/30 hover:bg-pink-500/[0.07] hover:text-pink-200"
              >
                <span className="truncate">{category.name}</span>
                <span className="size-1.5 flex-none rounded-full bg-gray-700 transition-colors group-hover:bg-pink-400" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        ) : (
          <p className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-sm text-gray-400">
            {dictionary.listing.emptyCategories}
          </p>
        )}
      </div>
    </LayoutMain>
  );
}
