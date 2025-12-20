import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface PriceRange {
  id: string;
  label: string;
  range: string;
  min: number;
  max: number;
}

const CategorySection = () => {
  const categories: Category[] = [
    {
      id: "lehengas",
      name: "Lehengas",
      image: "/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png",
      productCount: 120
    },
    {
      id: "salwar-suits", 
      name: "Salwar Suits",
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      productCount: 95
    },
    {
      id: "sarees",
      name: "Sarees", 
      image: "/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png",
      productCount: 80
    },
    {
      id: "ethnic-gowns",
      name: "Ethnic Gowns",
      image: "/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png", 
      productCount: 65
    }
  ];

  const priceRanges: PriceRange[] = [
    { id: "budget", label: "Under ₹2,000", range: "₹500 - ₹2,000", min: 500, max: 2000 },
    { id: "mid", label: "₹2,000 - ₹5,000", range: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
    { id: "premium", label: "₹5,000 - ₹10,000", range: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
    { id: "luxury", label: "Above ₹10,000", range: "₹10,000+", min: 10000, max: 50000 }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shop by Category */}
          <div>
            <h2 className="text-2xl font-bold text-warm-brown mb-6 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.productCount} Products</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="hidden lg:block">
            <div className="h-full flex items-center justify-center">
              <div className="w-px h-3/4 bg-border"></div>
            </div>
          </div>

          {/* Horizontal Separator for Mobile */}
          <div className="lg:hidden">
            <div className="w-full h-px bg-border my-8"></div>
          </div>

          {/* Shop by Price */}
          <div className="lg:-ml-8">
            <h2 className="text-2xl font-bold text-warm-brown mb-6 text-center">
              Shop by Price
            </h2>
            <div className="space-y-4">
              {priceRanges.map((priceRange) => (
                <Card key={priceRange.id} className="group cursor-pointer hover:shadow-md transition-all duration-300 border-l-4 border-l-brand-orange/20 hover:border-l-brand-orange">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-warm-brown group-hover:text-brand-orange transition-colors">
                          {priceRange.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {priceRange.range}
                        </p>
                      </div>
                      <div className="text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;