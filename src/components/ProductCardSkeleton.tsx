import Skeleton from "react-loading-skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Image */}
      <Skeleton height={220} />

      <div className="p-3 space-y-2">
        {/* Title */}
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="70%" />

        {/* Colors */}
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} circle width={14} height={14} />
          ))}
        </div>

        {/* Price */}
        <div className="flex gap-2">
          <Skeleton width={80} height={18} />
          <Skeleton width={60} height={14} />
        </div>

        {/* Rating */}
        <Skeleton width={100} height={14} />

        {/* Button */}
        <Skeleton height={36} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
