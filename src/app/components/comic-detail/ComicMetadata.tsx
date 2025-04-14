interface ComicMetadataProps {
    comic: {
      name: string;
      origin_name: string[];
      author?: string[];
      status: string;
      updatedAt: string;
    };
  }
  
   const ComicMetadata = ({ comic }: ComicMetadataProps) => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-white mb-2">{comic.name}</h1>
      <h2 className="text-2xl text-gray-300 font-medium">
        {comic.origin_name[0]}
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-gray-400 min-w-[100px]">Tác giả:</span>
            <span className="text-white font-medium">
              {comic.author?.join(", ") || "Đang cập nhật"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 min-w-[100px]">Trạng thái:</span>
            <span className="text-white font-medium capitalize">
              {comic.status}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 min-w-[100px]">Cập nhật:</span>
            <span className="text-white font-medium">
              {new Date(comic.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default ComicMetadata; 