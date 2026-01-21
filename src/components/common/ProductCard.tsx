import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import { useAuthStore } from "@/store/authStore";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {isLogin} = useAuthStore();
  //  console.log(product, 'newarivalvdsafadsfdasfadsfs')
  const goToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div
        className="relative bg-gray-50 cursor-pointer"
        onClick={goToDetails}
      >
        {/* Badge */}
        {product.isNew === 1 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded-md text-[11px] font-semibold">
            New Arrivals
          </div>
        )}

        {/* Hover Buttons */}
        {isLogin && (

        <div className="absolute z-50 top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <WishlistButton productId={product.id} isWish={product.isWish} />
        </div>
        )}

        {/* Product Image */}
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Details */}
      <div className="p-3">
        {/* Title */}
        <h3
          className="text-[13px] text-gray-800 font-medium mb-2 line-clamp-2 leading-snug cursor-pointer hover:text-orange-500"
          onClick={goToDetails}
        >
          {product.title}
        </h3>

        {/* Colors */}
        <div className="flex gap-1.5 mb-2">
          {product?.colors?.map((color, index) => (
            <div
              key={index}
              className="w-3.5 h-3.5 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[15px] font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-[12px] text-gray-500 line-through">
            ₹{product.originalPrice}
          </span>
          <span className="text-[11px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">
            Save {product.discount}%
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={goToDetails}
          className="w-full py-1.5 border border-orange-500 text-orange-500 font-medium rounded-md hover:bg-orange-50 transition-colors text-[13px]"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
