import { productsData } from "@/data/product";
import { Eye, Heart } from "lucide-react";
import { ProductCard } from "../common/ProductCard";
import { useNavigate } from "react-router-dom";

export default function BestSellers({products}: any) {
  const productsData = products?.map((product: any) => {
    const discount =
      product.mrp && product.product_price
        ? Math.round(
          ((product.mrp - product.product_price) / product.mrp) * 100
        )
        : 0;

    return {
      id: product._id,
      title: product.name,
      price: product.product_price,
      originalPrice: product.mrp,
      discount, // percentage
      image: product?.images?.[0]?.url || "/assets/no_image.jpg",
      isNew: true,
      colors: product.color ? [product.color] : [], // FIXED
      size: product.size,
      variantId: product.item_code_ids?.[0]
    };
  });

  const navigate = useNavigate()
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Best Sellers
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
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
