"use client"

import { Search, Loader2 } from "lucide-react"
import ComicGrid from "@/components/comic/ComicGrid"
import AdvancedFilter from "@/components/search/AdvancedFilter"
import { useSearchPageController } from "@/features/search/hooks/useSearchPageController"
import { useDictionary } from "@/i18n/I18nProvider"
import { formatMessage } from "@/i18n/format-message"

interface SearchPageClientProps {
  initialKeyword: string
}

export default function SearchPageClient({ initialKeyword }: SearchPageClientProps) {
  const {
    input,
    setInput,
    debouncedKeyword,
    results,
    isLoading,
    isFetching,
    isError,
    showUnsupportedFilters,
  } = useSearchPageController(initialKeyword)
  const { search } = useDictionary()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">{search.title}</h1>
        <p className="text-gray-400 text-sm">{search.description}</p>
      </div>

      <AdvancedFilter />

      <div className="relative max-w-xl mx-auto">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={search.inputPlaceholder}
          autoFocus
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-800/70 border border-gray-700/60 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/60 transition-colors text-base"
        />
        {isFetching && (
          <Loader2
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 animate-spin"
          />
        )}
      </div>

      {showUnsupportedFilters && (
        <div className="text-center py-6 text-yellow-500 glass-panel rounded-xl mt-4">
          <p>{search.unsupportedCombinedFilters}</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-400">
          {search.loadError}
        </div>
      )}

      {!isLoading && !isError && debouncedKeyword && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            {results.length > 0
              ? formatMessage(search.resultCount, { count: results.length })
              : search.noFilteredResults}
          </span>
        </div>
      )}

      <ComicGrid
        comics={results}
        cdnUrl=""
        isLoading={isLoading && Boolean(debouncedKeyword)}
        skeletonCount={10}
      />

      {!debouncedKeyword && !isLoading && !showUnsupportedFilters && (
        <div className="text-center py-16 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p>{search.emptyPrompt}</p>
        </div>
      )}
    </div>
  )
}
