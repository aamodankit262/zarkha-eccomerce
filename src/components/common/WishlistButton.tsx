import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";

interface Props {
  productId: string;
  className?: string;
  isWish?: 0 | 1; // 0 = not wishlisted, 1 = wishlisted
}

const WishlistButton = ({ productId, className, isWish = 0 }: Props) => {
  const [liked, setLiked] = useState(isWish === 1);

  const {
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
  } = useWishlistStore();

  /**
   * Sync if API value changes (safety)
   */
  useEffect(() => {
    setLiked(isWish === 1);
  }, [isWish]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const nextState = !liked;
    setLiked(nextState); // 🔥 instant UI feedback

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
