import SkeletonComicCard from "../loading/SkeletonComicCard";

const SkeletonComicGrid = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComicCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonComicGrid;