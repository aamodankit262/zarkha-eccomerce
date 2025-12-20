import { useState } from "react";
import { Heart, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
// import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/common/Layout";
import ProductCard from "@/components/ecommerce/ProductCard";
import { useAuthStore } from "@/store/authStore";

const Wishlist = () => {
  const { isLogin } = useAuthStore();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Mock wishlist data - in real app, this would come from API/database
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      title: "Traditional Ethnic Kurta Set",
      price: "₹2,999",
      originalPrice: "₹4,999",
      discount: "40% OFF",
      rating: 4.5,
      reviews: 123,
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
      category: "Kurtas"
    },
    {
      id: 2,
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      title: "Designer Anarkali Dress",
      price: "₹3,499",
      originalPrice: "₹5,999",
      discount: "42% OFF",
      rating: 4.3,
      reviews: 89,
      colors: ["#E74C3C", "#F39C12"],
      category: "Dresses"
    }
  ]);

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(items => items.filter(item => item.id !== productId));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist."
    });
  };

  const moveToCart = (product) => {
    const cartItem = {
      id: product.id.toString(),
      name: product.title,
      image: product.image,
      size: "M",
      color: "Default",
      quantity: 1,
      price: parseInt(product.price.replace(/[₹,]/g, ''))
    };
    
    addItem(cartItem);
    removeFromWishlist(product.id);
    
    toast({
      title: "Added to Cart",
      description: "Item moved from wishlist to cart successfully."
    });
  };

  if (!isLogin) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground">Please sign in to save and view your favorite items.</p>
            <Button className="bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding items you love to your wishlist by clicking the heart icon on products.
              </p>
              <Button onClick={() => window.location.href = "/"} className="bg-primary hover:bg-primary/90">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    id={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    rating={product.rating}
                    reviews={product.reviews}
                    colors={product.colors}
                  />
                  
                  {/* Wishlist Actions */}
                  <div className="absolute top-2 right-2 space-y-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => moveToCart(product)}
                      className="w-full bg-primary hover:bg-primary/90 text-sm"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Move to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;