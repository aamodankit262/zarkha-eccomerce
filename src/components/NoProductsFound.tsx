export const NoProductsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img
        src="/no-products.svg" // optional
        alt="No products"
        className="w-40 h-40 mb-4 opacity-70"
      />

      <h2 className="text-lg font-semibold text-gray-900">
        No products found
      </h2>

      <p className="text-sm text-gray-500 mt-2 max-w-md">
        We couldn’t find any products matching your filters.
        Try changing or clearing some filters.
      </p>
    </div>
  );
};
