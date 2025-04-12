const SkeletonComicCard = () => {
    return (
      <div className="group relative overflow-hidden rounded-lg shadow-lg animate-pulse">
        <div className="w-full h-[330px] bg-gray-300 rounded-lg" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          <div className="h-5 bg-gray-400 rounded-full w-3/4" />
          
          <div className="flex gap-2">
            <div className="h-4 bg-gray-400 rounded-full w-16" />
            <div className="h-4 bg-gray-400 rounded-full w-16" />
          </div>
  
          <div className="h-4 bg-gray-400 rounded-full w-1/2" />
        </div>
  
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    );
  };
  
  export default SkeletonComicCard;