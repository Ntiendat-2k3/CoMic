const LoadingSkeletonSearch = () => {
  return (
    <div className="space-y-3 p-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="w-10 h-15 bg-primary-light/20 rounded-sm" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-primary-light/20 rounded w-3/4" />
            <div className="h-3 bg-primary-light/20 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeletonSearch;
