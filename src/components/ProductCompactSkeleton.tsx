import Skeleton from "react-loading-skeleton";

export const ProductCompactSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border p-4 flex gap-4">
      <Skeleton width={120} height={150} />

      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="80%" />
        <Skeleton height={14} width="60%" />

        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} circle width={16} height={16} />
          ))}
        </div>

        <Skeleton width={120} height={18} />
        <Skeleton height={32} />
      </div>
    </div>
  );
};
