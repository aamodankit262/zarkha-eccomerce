import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Store, MapPin, Phone, Mail, Star, Package, Search, 
  Filter, X, Instagram, Facebook, Globe, Heart, Share2,
  ArrowLeft, ShoppingBag, Percent
} from "lucide-react";

// Mock boutique data - in real app this would come from API
const boutiques = [
  {
    id: 'elegance-boutique',
    name: 'Elegance Boutique',
    owner: 'Priya Sharma',
    category: 'Women Ethnic Wear',
    description: 'Welcome to Elegance Boutique, your one-stop destination for premium ethnic wear. We specialize in handcrafted designer pieces that blend traditional aesthetics with modern elegance.',
    address: '123 Fashion Street, Linking Road, Mumbai - 400050',
    phone: '+91 9876543210',
    email: 'hello@eleganceboutique.com',
    rating: 4.8,
    reviews: 256,
    since: '2018',
    socialLinks: {
      instagram: 'https://instagram.com/eleganceboutique',
      facebook: 'https://facebook.com/eleganceboutique',
      website: 'https://eleganceboutique.com'
    },
    coverImage: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png',
    logo: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png',
    highlights: ['Free Alterations', 'Same Day Delivery', 'Custom Designs', '100% Authentic']
  }
];

const catalogProducts = [
  { id: '1', name: 'Embroidered Silk Kurta Set', category: 'Kurta Sets', price: 2499, mrp: 3500, image: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', discount: 29, rating: 4.5, reviews: 45 },
  { id: '2', name: 'Printed Cotton Anarkali', category: 'Anarkalis', price: 1799, mrp: 2500, image: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png', discount: 28, rating: 4.3, reviews: 32 },
  { id: '3', name: 'Designer Lehenga Choli', category: 'Lehengas', price: 6499, mrp: 9000, image: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png', discount: 28, rating: 4.7, reviews: 67 },
  { id: '4', name: 'Banarasi Silk Saree', category: 'Sarees', price: 4500, mrp: 6000, image: '/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png', discount: 25, rating: 4.6, reviews: 89 },
  { id: '5', name: 'Palazzo Suit Set', category: 'Palazzo Sets', price: 2200, mrp: 3000, image: '/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png', discount: 27, rating: 4.4, reviews: 23 },
  { id: '6', name: 'Festive Salwar Kameez', category: 'Salwar Suits', price: 2800, mrp: 3800, image: '/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png', discount: 26, rating: 4.5, reviews: 56 },
];

const BoutiqueStorefront = () => {
  const { boutiqueId } = useParams();
  const [activeTab, setActiveTab] = useState("catalogue");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [discountFilter, setDiscountFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Find boutique or use default
  const boutique = boutiques.find(b => b.id === boutiqueId) || boutiques[0];
  
  const categories = [...new Set(catalogProducts.map(p => p.category))];

  const filteredProducts = catalogProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesDiscount = discountFilter === "all" || 
                            (discountFilter === "10" && p.discount >= 10) ||
                            (discountFilter === "20" && p.discount >= 20) ||
                            (discountFilter === "30" && p.discount >= 30);
    return matchesSearch && matchesCategory && matchesPrice && matchesDiscount;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "discount": return b.discount - a.discount;
      case "rating": return b.rating - a.rating;
      default: return b.reviews - a.reviews; // popular
    }
  });

  const clearFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, 10000]);
    setDiscountFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/boutique" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Boutiques</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img 
          src={boutique.coverImage} 
          alt={boutique.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Boutique Info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
              <img src={boutique.logo} alt={boutique.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-warm-brown">{boutique.name}</h1>
                <Badge variant="outline" className="w-fit">{boutique.category}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-foreground">{boutique.rating}</span>
                  <span>({boutique.reviews} reviews)</span>
                </div>
                <span>•</span>
                <span>Since {boutique.since}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {boutique.highlights.map((highlight, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{highlight}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {boutique.socialLinks.instagram && (
                <Button variant="outline" size="icon" asChild>
                  <a href={boutique.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {boutique.socialLinks.facebook && (
                <Button variant="outline" size="icon" asChild>
                  <a href={boutique.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {boutique.socialLinks.website && (
                <Button variant="outline" size="icon" asChild>
                  <a href={boutique.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="about" className="gap-2">
              <Store className="h-4 w-4 hidden sm:block" />About
            </TabsTrigger>
            <TabsTrigger value="catalogue" className="gap-2">
              <ShoppingBag className="h-4 w-4 hidden sm:block" />Catalogue
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About Us</h3>
                  <p className="text-muted-foreground leading-relaxed">{boutique.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-brand-orange mt-0.5" />
                      <p className="text-muted-foreground">{boutique.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-brand-orange" />
                      <a href={`tel:${boutique.phone}`} className="text-brand-orange hover:underline">{boutique.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-brand-orange" />
                      <a href={`mailto:${boutique.email}`} className="text-brand-orange hover:underline">{boutique.email}</a>
                    </div>
                  </div>
                  <Button variant="brand" className="w-full mt-4">
                    <Phone className="h-4 w-4 mr-2" /> Contact Boutique
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Catalogue Tab */}
          <TabsContent value="catalogue">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="discount">Highest Discount</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Filters</span>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="h-4 w-4 mr-1" /> Clear All
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            min={0}
                            max={10000}
                            step={100}
                            className="mt-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Discount</Label>
                          <Select value={discountFilter} onValueChange={setDiscountFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any Discount" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any Discount</SelectItem>
                              <SelectItem value="10">10% and above</SelectItem>
                              <SelectItem value="20">20% and above</SelectItem>
                              <SelectItem value="30">30% and above</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground mb-4">{sortedProducts.length} products found</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <Badge className="absolute top-2 left-2 bg-green-600">
                      <Percent className="h-3 w-3 mr-1" />{product.discount}% off
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-brand-orange">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BoutiqueStorefront;
