import { Button } from "@/components/ui/button";
import ProductCard from "../ecommerce/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const TrendingSection = () => {
  const { products } = useProducts();
  
  // Get first 8 products for trending section
  const trendingProducts = products.slice(0, 8);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-warm-brown mb-4">
            Trending Now
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest fashion trends and bestselling pieces that everyone is talking about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white">
            View All Trending
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;