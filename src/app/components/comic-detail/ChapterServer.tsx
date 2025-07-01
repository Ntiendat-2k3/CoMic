import type { ChapterServer as ServerType } from "@/app/types/common"
import ChapterItem from "./ChapterItem"

interface ChapterServerProps {
  server: ServerType
  comicSlug: string
  serverIndex: number
}

const ChapterServer = ({ server, comicSlug, serverIndex }: ChapterServerProps) => {
  return (
    <div key={`server-${serverIndex}-${server.server_name}-${comicSlug}`} className="space-y-3 sm:space-y-4">
      {/* Server Header */}
      <div className="bg-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">S{serverIndex + 1}</span>
            <span className="hidden sm:inline">{server.server_name}</span>
          </h4>
          <div className="bg-gray-600 px-2 py-1 rounded text-xs text-gray-300">{server.server_data.length}</div>
        </div>
      </div>

      {/* Chapter Grid - Mobile optimized */}
      <div className="max-h-80 sm:max-h-96 overflow-y-auto border border-gray-600 rounded-lg">
        <div className="p-2 sm:p-4">
          {/* Mobile: Single column, Desktop: Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {server.server_data.map((chapter, chapterIndex) => (
              <ChapterItem
                key={`chapter-${server.server_name}-${chapterIndex}-${chapter.chapter_name}-${comicSlug}`}
                chapter={chapter}
                comicSlug={comicSlug}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterServer
