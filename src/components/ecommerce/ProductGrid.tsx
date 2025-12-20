import ProductCard from "./ProductCard";

import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

const ProductGrid = ({ products, title, className = "" }: ProductGridProps) => {
  return (
    <section className={`py-12 bg-background ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center text-warm-brown mb-8">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;