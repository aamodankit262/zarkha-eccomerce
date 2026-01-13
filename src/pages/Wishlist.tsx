import { useEffect } from "react";
import { Heart, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/common/Layout";
import { ProductCard } from "@/components/common/ProductCard";
// import ProductCard from "@/components/ecommerce/ProductCard";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { productsData } from "@/data/product";

const Wishlist = () => {
  const { isLogin } = useAuthStore();
  // const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const wishlistItems = useWishlistStore((s) => s.items);
  const {
  items,
  loading,
  page,
  totalPages,
  fetchWishlist,
  setPage,
} = useWishlistStore();

  useEffect(() => {
    if (isLogin) {
      fetchWishlist();
    }
  }, [isLogin, page]);

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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData(wishlistItems)?.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard key={product.id} product={product} />

                    {/* Wishlist Actions */}
                    {/* <div className="absolute top-2 right-2 space-y-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div> */}

                    {/* Quick Add to Cart */}
                    {/* <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => moveToCart(product)}
                      className="w-full bg-primary hover:bg-primary/90 text-sm"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Move to Cart
                    </Button>
                  </div> */}
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
  <div className="flex justify-center items-center gap-3 mt-10">
    <button
      disabled={page === 1 || loading}
      onClick={() => setPage(page - 1)}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Prev
    </button>

    <span className="text-sm">
      Page {page} of {totalPages}
    </span>

    <button
      disabled={page === totalPages || loading}
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;