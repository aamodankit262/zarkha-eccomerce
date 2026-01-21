import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

interface Props {
  productId: string;
  className?: string;
  isWish?: boolean; // true = wishlisted, false = not wishlisted
}

const WishlistButton = ({ productId, className, isWish }: Props) => {
  const [liked, setLiked] = useState(isWish);
  const { isLogin } = useAuthStore();
  if (!isLogin) {
    return null;
  }
  const {
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
  } = useWishlistStore();

  /**
   * Sync if API value changes (safety)
   */
  useEffect(() => {
    setLiked(isWish === true);
  }, [isWish]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const nextState = !liked;
    setLiked(nextState); 

    try {
      if (nextState) {
        await addToWishlist(productId);
      } else {
        await removeFromWishlist(productId);
      }

      // optional – only if other screens depend on it
      await fetchWishlist();
    } catch (err) {
      // rollback on failure
      setLiked(!nextState);
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-50",
        className
      )}
    >
      <Heart
        className={cn(
          "w-3.5 h-3.5 transition-colors duration-200",
          liked
            ? "fill-red-500 text-red-500"
            : "text-gray-600"
        )}
      />
    </button>
  );
};

export default WishlistButton;
