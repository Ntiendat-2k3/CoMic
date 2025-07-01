interface ComicMetadataProps {
  comic: {
    name: string
    origin_name: string[]
    author?: string[]
    status: string
    updatedAt: string
  }
}

const ComicMetadata = ({ comic }: ComicMetadataProps) => (
  <div className="space-y-4">
    {/* Main Title */}
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{comic.name}</h1>
      <h2 className="text-lg lg:text-xl text-gray-300">{comic.origin_name[0]}</h2>
    </div>

    {/* Metadata Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Author */}
      <div className="bg-gray-700 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-lg">✍️</span>
          <div>
            <span className="text-gray-400 text-sm block">Tác giả</span>
            <span className="text-white font-medium">{comic.author?.join(", ") || "Đang cập nhật"}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-700 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-lg">📊</span>
          <div>
            <span className="text-gray-400 text-sm block">Trạng thái</span>
            <span className="text-white font-medium capitalize">{comic.status}</span>
          </div>
        </div>
      </div>

      {/* Update */}
      <div className="bg-gray-700 rounded-lg p-3 md:col-span-2">
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 text-lg">🕒</span>
          <div>
            <span className="text-gray-400 text-sm block">Cập nhật lần cuối</span>
            <span className="text-white font-medium">
              {new Date(comic.updatedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default ComicMetadata
