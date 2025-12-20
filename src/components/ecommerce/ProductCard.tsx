import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews?: number;
  colors?: string[];
}

const ProductCard = ({ 
  id, 
  image, 
  title, 
  price, 
  originalPrice, 
  discount, 
  rating, 
  reviews,
  colors = []
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? `${title} removed from your wishlist` : `${title} added to your wishlist`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: id.toString(),
      name: title,
      image: image,
      size: "M", // Default size
      color: colors[0] || "Default",
      price: parseInt(price.replace(/[₹,]/g, ''))
    });
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart`,
    });
  };

  return (
    <div 
      onClick={handleProductClick}
      className="group bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discount && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 bg-red-500 text-white"
          >
            {discount}
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Color Options */}
        {colors.length > 0 && (
          <div className="flex gap-1 mb-2">
            {colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{colors.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-brand-orange">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-foreground ml-1">
              {rating}
            </span>
          </div>
          {reviews && (
            <span className="text-sm text-muted-foreground">
              ({reviews} reviews)
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white transition-colors"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;