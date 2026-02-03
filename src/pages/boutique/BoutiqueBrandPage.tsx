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
import { Separator } from "@/components/ui/separator";
import { 
  Store, MapPin, Phone, Mail, Star, Package, Search, 
  Filter, X, Instagram, Facebook, Globe, Heart, Share2,
  ArrowLeft, ShoppingBag, Percent, Copy, Check, Download,
  Clock, Award, Users, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock boutique data - in real app this would come from API
const boutiques = [
  {
    id: 'elegance-boutique',
    name: 'Elegance Boutique',
    owner: 'Priya Sharma',
    category: 'Women Ethnic Wear',
    tagline: 'Where Tradition Meets Elegance',
    description: 'Welcome to Elegance Boutique, your one-stop destination for premium ethnic wear. We specialize in handcrafted designer pieces that blend traditional aesthetics with modern elegance. Every piece is carefully curated to ensure the finest quality and authentic craftsmanship.',
    story: 'Founded in 2018 by Priya Sharma, Elegance Boutique started as a small family-run shop in Mumbai. With a passion for preserving traditional Indian textile arts while making them accessible to modern women, we have grown into a trusted name for ethnic fashion. Our journey is driven by a commitment to quality, authenticity, and customer satisfaction.',
    address: '123 Fashion Street, Linking Road, Mumbai - 400050',
    phone: '+91 9876543210',
    email: 'hello@eleganceboutique.com',
    rating: 4.8,
    reviews: 256,
    since: '2018',
    totalOrders: 5420,
    happyCustomers: 3200,
    socialLinks: {
      instagram: 'https://instagram.com/eleganceboutique',
      facebook: 'https://facebook.com/eleganceboutique',
      website: 'https://eleganceboutique.com'
    },
    coverImage: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png',
    logo: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png',
    highlights: ['Free Alterations', 'Same Day Delivery', 'Custom Designs', '100% Authentic'],
    specialties: ['Bridal Lehengas', 'Designer Sarees', 'Party Wear', 'Festive Collections'],
    workingHours: 'Mon-Sat: 10AM - 8PM, Sun: 11AM - 6PM'
  }
];

const catalogProducts = [
  { id: '1', name: 'Embroidered Silk Kurta Set', category: 'Kurta Sets', price: 2499, mrp: 3500, image: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', discount: 29, rating: 4.5, reviews: 45, inStock: true },
  { id: '2', name: 'Printed Cotton Anarkali', category: 'Anarkalis', price: 1799, mrp: 2500, image: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png', discount: 28, rating: 4.3, reviews: 32, inStock: true },
  { id: '3', name: 'Designer Lehenga Choli', category: 'Lehengas', price: 6499, mrp: 9000, image: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png', discount: 28, rating: 4.7, reviews: 67, inStock: true },
  { id: '4', name: 'Banarasi Silk Saree', category: 'Sarees', price: 4500, mrp: 6000, image: '/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png', discount: 25, rating: 4.6, reviews: 89, inStock: true },
  { id: '5', name: 'Palazzo Suit Set', category: 'Palazzo Sets', price: 2200, mrp: 3000, image: '/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png', discount: 27, rating: 4.4, reviews: 23, inStock: false },
  { id: '6', name: 'Festive Salwar Kameez', category: 'Salwar Suits', price: 2800, mrp: 3800, image: '/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png', discount: 26, rating: 4.5, reviews: 56, inStock: true },
];

const BoutiqueBrandPage = () => {
  const { boutiqueId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("catalogue");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [discountFilter, setDiscountFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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
    const matchesStock = stockFilter === "all" || 
                         (stockFilter === "in_stock" && p.inStock) ||
                         (stockFilter === "out_of_stock" && !p.inStock);
    return matchesSearch && matchesCategory && matchesPrice && matchesDiscount && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "discount": return b.discount - a.discount;
      case "rating": return b.rating - a.rating;
      default: return b.reviews - a.reviews;
    }
  });

  const clearFilters = () => {
    setCategoryFilter("all");
    setPriceRange([0, 10000]);
    setDiscountFilter("all");
    setStockFilter("all");
    setSearchQuery("");
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: boutique.name,
      text: `Check out ${boutique.name} - ${boutique.tagline}`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast({ title: "Link Copied!", description: "Share this link with your customers." });
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleDownloadCatalogue = () => {
    // In real app, this would generate a PDF
    toast({ 
      title: "Catalogue Download Started", 
      description: "Your product catalogue PDF is being generated..." 
    });
    
    // Simulate download
    setTimeout(() => {
      toast({ 
        title: "Download Complete", 
        description: `${boutique.name} Catalogue downloaded successfully.` 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/boutique" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadCatalogue}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Download Catalogue</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toast({ title: "Added to Favorites!" })}>
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Logo */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img 
          src={boutique.coverImage} 
          alt={boutique.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Boutique Info Card */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-20 mb-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0 -mt-16 md:-mt-20">
                  <img src={boutique.logo} alt={boutique.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-warm-brown">{boutique.name}</h1>
                    <Badge variant="outline" className="w-fit">{boutique.category}</Badge>
                  </div>
                  <p className="text-muted-foreground italic mb-3">{boutique.tagline}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{boutique.rating}</span>
                      <span className="text-muted-foreground">({boutique.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Since {boutique.since}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{boutique.happyCustomers.toLocaleString()}+ Happy Customers</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {boutique.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{highlight}</Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {boutique.socialLinks.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={boutique.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4 mr-2" />Instagram
                        </a>
                      </Button>
                    )}
                    {boutique.socialLinks.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={boutique.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4 mr-2" />Facebook
                        </a>
                      </Button>
                    )}
                    {boutique.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={boutique.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />Website
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleCopyLink}>
                      {linkCopied ? (
                        <><Check className="h-4 w-4 mr-2" />Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-2" />Copy Link</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-brand-orange/10 rounded-lg">
                <Package className="h-5 w-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold">{catalogProducts.length}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boutique.totalOrders.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boutique.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boutique.reviews}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="about" className="gap-2">
              <Store className="h-4 w-4 hidden sm:block" />About
            </TabsTrigger>
            <TabsTrigger value="catalogue" className="gap-2">
              <ShoppingBag className="h-4 w-4 hidden sm:block" />Catalogue
            </TabsTrigger>
            <TabsTrigger value="specialties" className="gap-2">
              <Sparkles className="h-4 w-4 hidden sm:block" />Specialties
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Store className="h-5 w-5 text-brand-orange" />
                    About Us
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{boutique.description}</p>
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-2">Our Story</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{boutique.story}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-orange" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <p className="text-muted-foreground">{boutique.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a href={`tel:${boutique.phone}`} className="text-brand-orange hover:underline">{boutique.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a href={`mailto:${boutique.email}`} className="text-brand-orange hover:underline">{boutique.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <p className="text-muted-foreground">{boutique.workingHours}</p>
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
                        variant={showFilters ? "secondary" : "outline"}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <div className="space-y-2">
                          <Label>Availability</Label>
                          <Select value={stockFilter} onValueChange={setStockFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Products</SelectItem>
                              <SelectItem value="in_stock">In Stock</SelectItem>
                              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{sortedProducts.length} products found</p>
              <Button variant="outline" size="sm" onClick={handleDownloadCatalogue}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>

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
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
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

          {/* Specialties Tab */}
          <TabsContent value="specialties">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-orange" />
                    Our Specialties
                  </h3>
                  <div className="space-y-3">
                    {boutique.specialties.map((specialty, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-brand-orange" />
                        <span className="font-medium">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-brand-orange" />
                    Why Choose Us
                  </h3>
                  <div className="space-y-3">
                    {boutique.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                          <Check className="h-4 w-4 text-brand-orange" />
                        </div>
                        <span className="font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BoutiqueBrandPage;
