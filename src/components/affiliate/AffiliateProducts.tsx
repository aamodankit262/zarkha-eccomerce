import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useAffiliate } from "@/contexts/AffiliateContext";

const AffiliateProducts = () => {
  const { affiliate } = useAffiliate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Products" },
    { id: "sarees", name: "Sarees" },
    { id: "lehengas", name: "Lehengas" },
    { id: "kurtis", name: "Kurtis" },
    { id: "suits", name: "Salwar Suits" },
    { id: "accessories", name: "Accessories" },
  ];

  const products = [
    {
      id: 1,
      name: "Banarasi Silk Saree",
      category: "sarees",
      price: 4999,
      commission: 15,
      image: "/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png",
      rating: 4.8
    },
    {
      id: 2,
      name: "Designer Lehenga Choli",
      category: "lehengas",
      price: 8999,
      commission: 18,
      image: "/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png",
      rating: 4.9
    },
    {
      id: 3,
      name: "Embroidered Anarkali Kurti",
      category: "kurtis",
      price: 2499,
      commission: 12,
      image: "/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png",
      rating: 4.6
    },
    {
      id: 4,
      name: "Chanderi Cotton Suit",
      category: "suits",
      price: 3499,
      commission: 14,
      image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
      rating: 4.7
    },
    {
      id: 5,
      name: "Patola Silk Saree",
      category: "sarees",
      price: 6999,
      commission: 16,
      image: "/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png",
      rating: 4.9
    },
    {
      id: 6,
      name: "Heavy Bridal Lehenga",
      category: "lehengas",
      price: 15999,
      commission: 20,
      image: "/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png",
      rating: 4.8
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyProductLink = (productId: number) => {
    const link = `${window.location.origin}/product/${productId}?ref=${affiliate?.referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Product link copied!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground">Browse and promote products to earn commission</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-600 text-xs sm:text-sm">
                {product.commission}% Commission
              </Badge>
            </div>
            <CardContent className="p-3 sm:p-4">
              <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-base sm:text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">⭐ {product.rating}</span>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 mb-2 sm:mb-3">
                <p className="text-xs text-muted-foreground">Your Earning</p>
                <p className="font-bold text-green-600 text-sm sm:text-base">
                  ₹{Math.round(product.price * product.commission / 100).toLocaleString()} per sale
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => copyProductLink(product.id)}
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Copy Link
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm" asChild>
                  <Link to={`/product/${product.id}?ref=${affiliate?.referralCode}`}>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    View Product
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateProducts;
