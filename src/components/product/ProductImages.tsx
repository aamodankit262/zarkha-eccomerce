import { useAuthStore } from "@/store/authStore";
import WishlistButton from "../common/WishlistButton";

interface ProductImagesProps {
  images: { url: string; alt_text?: string }[];
  activeIndex: number;
  onChange: (index: number) => void;
  productId: string;
  isWishList?: boolean;
  isNew?: number;
}

const ProductImages = ({
  images,
  activeIndex,
  onChange,
  productId,
  isWishList,
  isNew,
}: ProductImagesProps) => {
  const { isLogin } = useAuthStore();

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <img
          src={images?.[activeIndex]?.url || "/assets/no_image.jpg"}
          alt={images?.[activeIndex]?.alt_text || "Product image"}
          className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
        />

        {/* New Arrivals Badge */}
        {isNew === 1 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded">
            New Arrivals
          </div>
        )}

        {/* Wishlist */}
        {isLogin && (
          <div className="absolute top-4 right-4">
            <WishlistButton
              productId={productId}
              isWish={isWishList}
            />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => onChange(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
              activeIndex === index
                ? "border-orange-500"
                : "border-gray-200"
            }`}
          >
            <img
              src={image.url || "/assets/no_image.jpg"}
              alt={image.alt_text || "Thumbnail"}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
