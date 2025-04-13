import { Comic } from "@/app/types/comic";
import ComicCard from "../ComicCard";
import SkeletonComicGrid from "./SkeletonComicGrid";

interface ComicGridProps {
  comics?: Comic[];
  isLoading?: boolean;
}

const ComicGrid = ({ comics, isLoading }: ComicGridProps) => {
  if (isLoading || !comics) {
    return <SkeletonComicGrid />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
      {comics.map((comic) => (
        <ComicCard
          key={comic._id}
          comic={comic}
          baseImageUrl={`https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`}
        />
      ))}
    </div>
  );
};

export default ComicGrid;