import { ChapterServer as ServerType } from "@/app/types/common";
import ChapterItem from "./ChapterItem";

interface ChapterServerProps {
  server: ServerType;
  comicSlug: string;
  serverIndex: number;
}

const ChapterServer = ({
  server,
  comicSlug,
  serverIndex,
}: ChapterServerProps) => {
  return (
    <div
      key={`server-${serverIndex}-${server.server_name}-${comicSlug}`}
      className="mb-8 last:mb-0"
    >
      <h4 className="text-lg font-semibold text-gray-300 mb-4">
        {server.server_name}
      </h4>
      <div className="max-h-[600px] overflow-y-auto thin-scrollbar pr-4">
        <div className="grid gap-2">
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
  );
};

export default ChapterServer;