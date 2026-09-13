"use client";

import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { useSearchBoxController } from "@/features/search/hooks/useSearchBoxController";
import { useDictionary } from "@/i18n/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import { resolveCoverUrl } from "@/domain/comic/resolve-cover-url";

export default function SearchBox() {
  const controller = useSearchBoxController();
  const { search } = useDictionary();

  return (
    <div ref={controller.containerRef} className="relative w-full max-w-lg">
      <form onSubmit={controller.submit} className="relative">
        <SearchIcon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={controller.input}
          onChange={(e) => {
            controller.setInput(e.target.value);
            controller.setOpen(true);
          }}
          onFocus={() => controller.setOpen(true)}
          placeholder={search.globalPlaceholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700/60 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-pink-500/60 transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {controller.isFetching && <Loader2 size={16} className="text-pink-400 animate-spin" />}
          {!controller.isFetching && controller.input && (
            <button type="button" onClick={controller.clear}>
              <X size={16} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          )}
        </div>
      </form>

      {controller.open && controller.input.length >= 2 && (
        <div className="absolute top-full mt-2 inset-x-0 bg-gray-900/95 border border-gray-700/60 rounded-xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {controller.results.length === 0 && !controller.isFetching && (
            <p className="py-4 text-center text-sm text-gray-500">
              {search.noSuggestions}
            </p>
          )}

          {controller.results.slice(0, 8).map((comic) => (
            <Link
              key={comic._id || comic.slug}
              href={`/truyen-tranh/${comic.slug}`}
              onClick={() => controller.setOpen(false)}
              className="flex items-center gap-3 p-3 hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 last:border-0"
            >
              <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-700/50">
                <Image
                  src={resolveCoverUrl(comic.thumb_url)}
                  alt={comic.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{comic.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {comic.category.slice(0, 2).map((c) => c.name).join(" · ")}
                </p>
              </div>
            </Link>
          ))}

          {controller.results.length > 0 && (
            <button
              onClick={controller.submit}
              className="w-full py-2.5 text-center text-sm text-pink-400 hover:text-pink-300 hover:bg-gray-800/50 transition-colors font-medium"
            >
              {formatMessage(search.viewAllResults, {
                count: controller.results.length,
              })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
