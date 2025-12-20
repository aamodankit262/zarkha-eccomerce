const FilterSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Section Title */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-4" />

      {/* Checkbox items */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Checkbox */}
            <div className="w-4 h-4 bg-gray-200 rounded" />

            {/* Label */}
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSkeleton;

