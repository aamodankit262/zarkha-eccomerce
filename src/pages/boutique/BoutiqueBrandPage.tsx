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
import { useBoutique } from "@/contexts/BoutiqueContext";

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
  { id: '1', name: 'Embroidered Silk Kurta Set', category: 'Kurta Sets', adminPrice: 1800, sellingPrice: 2499, mrp: 3500, image: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', discount: 29, rating: 4.5, reviews: 45, inStock: true, priceUpdated: '2024-01-15' },
  { id: '2', name: 'Printed Cotton Anarkali', category: 'Anarkalis', adminPrice: 1200, sellingPrice: 1799, mrp: 2500, image: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png', discount: 28, rating: 4.3, reviews: 32, inStock: true, priceUpdated: '2024-01-18' },
  { id: '3', name: 'Designer Lehenga Choli', category: 'Lehengas', adminPrice: 4500, sellingPrice: 6499, mrp: 9000, image: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png', discount: 28, rating: 4.7, reviews: 67, inStock: true, priceUpdated: '2024-01-20' },
  { id: '4', name: 'Banarasi Silk Saree', category: 'Sarees', adminPrice: 3200, sellingPrice: 4500, mrp: 6000, image: '/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png', discount: 25, rating: 4.6, reviews: 89, inStock: true, priceUpdated: '2024-01-22' },
  { id: '5', name: 'Palazzo Suit Set', category: 'Palazzo Sets', adminPrice: 1500, sellingPrice: 2200, mrp: 3000, image: '/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png', discount: 27, rating: 4.4, reviews: 23, inStock: false, priceUpdated: '2024-01-10' },
  { id: '6', name: 'Festive Salwar Kameez', category: 'Salwar Suits', adminPrice: 2000, sellingPrice: 2800, mrp: 3800, image: '/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png', discount: 26, rating: 4.5, reviews: 56, inStock: true, priceUpdated: '2024-01-25' },
];

const BoutiqueBrandPage = () => {
  const { boutiqueId } = useParams();
  const { toast } = useToast();
  const { productPrices } = useBoutique();
  const [activeTab, setActiveTab] = useState("about");
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

  // Get visible products (only those with displayOnBrandPage = true)
  const visibleProducts = catalogProducts.filter(p => {
    const priceInfo = productPrices.find(pp => pp.productId === p.id);
    // If no price set, don't show on brand page
    // If price is set, check displayOnBrandPage flag
    return priceInfo && priceInfo.displayOnBrandPage !== false;
  }).map(p => {
    const priceInfo = productPrices.find(pp => pp.productId === p.id);
    return {
      ...p,
      sellingPrice: priceInfo?.sellingPrice || p.sellingPrice,
      priceUpdated: priceInfo?.lastUpdated || p.priceUpdated
    };
  });

  const filteredProducts = visibleProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesPrice = p.sellingPrice >= priceRange[0] && p.sellingPrice <= priceRange[1];
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
      case "price-low": return a.sellingPrice - b.sellingPrice;
      case "price-high": return b.sellingPrice - a.sellingPrice;
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
                <p className="text-2xl font-bold">{visibleProducts.length}</p>
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
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="about" className="gap-2">
              <Store className="h-4 w-4 hidden sm:block" />About
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
