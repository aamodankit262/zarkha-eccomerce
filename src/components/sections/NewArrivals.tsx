// import { productsData } from "@/data/product";
import { productsData } from "@/data/product";
import { ProductCard } from "../common/ProductCard";
import { useNavigate } from "react-router-dom";
// import { useCart } from "@/contexts/CartContext";

export default function NewArrivals({ products }: any) {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          New Arrivals
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="px-3 py-1.5 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium"
        >
          View All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {productsData(products)?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
