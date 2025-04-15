import Link from "next/link";
import { Comic } from "../types/comic";
import ImageFallback from "../utils/ImageFallback";

interface ComicCardProps {
  comic: Comic;
  baseImageUrl: string;
}

const ComicCard = ({ comic, baseImageUrl }: ComicCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 duration-300">
      <Link href={`/truyen-tranh/${comic.slug}`}>
        <div className="w-full h-[400px] relative">
          <ImageFallback
            src={baseImageUrl}
            alt={comic.name}
            width={600}
            height={800}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg truncate">{comic.name}</h3>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {comic.category.map((cat) => (
              <span 
                key={cat.slug}
                className="px-2 py-1 bg-primary/80 text-xs rounded-full"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {comic.chaptersLatest && comic.chaptersLatest.length > 0 && (
            <div className="mt-2 text-sm">
              Chapter {comic.chaptersLatest[0].chapter_name}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ComicCard;