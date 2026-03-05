import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Star,
  Package,
  Search,
  Filter,
  X,
  Instagram,
  Facebook,
  Globe,
  Heart,
  Share2,
  ArrowLeft,
  ShoppingBag,
  Percent,
  Copy,
  Check,
  Download,
  Clock,
  Award,
  Users,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { NO_IMAGE } from "@/api/endpoints";
import { industryService } from "@/services/industryService";
import { logger } from "@/helper/logger";
import { useDebounce } from "@/hooks/useDebounce";
import { boutiqueProducts } from "@/data/product";
import Pagination from "@/components/ecommerce/Pagination";


const catalogProducts = [
  {
    id: "1",
    name: "Embroidered Silk Kurta Set",
    category: "Kurta Sets",
    adminPrice: 1800,
    sellingPrice: 2499,
    mrp: 3500,
    image: "/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png",
    discount: 29,
    rating: 4.5,
    reviews: 45,
    inStock: true,
  },
  {
    id: "2",
    name: "Printed Cotton Anarkali",
    category: "Anarkalis",
    adminPrice: 1200,
    sellingPrice: 1799,
    mrp: 2500,
    image: "/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png",
    discount: 28,
    rating: 4.3,
    reviews: 32,
    inStock: true,
  },
  {
    id: "3",
    name: "Designer Lehenga Choli",
    category: "Lehengas",
    adminPrice: 4500,
    sellingPrice: 6499,
    mrp: 9000,
    image: "/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png",
    discount: 28,
    rating: 4.7,
    reviews: 67,
    inStock: true,
  },
  {
    id: "4",
    name: "Banarasi Silk Saree",
    category: "Sarees",
    adminPrice: 3200,
    sellingPrice: 4500,
    mrp: 6000,
    image: "/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png",
    discount: 25,
    rating: 4.6,
    reviews: 89,
    inStock: true,
  },
  {
    id: "5",
    name: "Palazzo Suit Set",
    category: "Palazzo Sets",
    adminPrice: 1500,
    sellingPrice: 2200,
    mrp: 3000,
    image: "/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png",
    discount: 27,
    rating: 4.4,
    reviews: 23,
    inStock: false,
  },
  {
    id: "6",
    name: "Festive Salwar Kameez",
    category: "Salwar Suits",
    adminPrice: 2000,
    sellingPrice: 2800,
    mrp: 3800,
    image: "/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png",
    discount: 26,
    rating: 4.5,
    reviews: 56,
    inStock: true,
  },
];

const BoutiqueBrandPage = () => {
  const { boutiqueId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productPrices } = useBoutique();
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { data, request } = useApi(boutiqueService.brandPage);
  // const boutique = boutiques.find((b) => b.id === boutiqueId) || boutiques[0];
  const { data: categories, request: fetchCategories } = useApi(industryService.getCat);
  const { data: subcategories, request: fetchSubCategories } = useApi(industryService.getSubCat);
  const {
    data: productRes,
    request: fetchProducts,
  } = useApi(boutiqueService.brandProductList);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const limit = 10;
  // const categories = [...new Set(catalogProducts.map((p) => p.category))];

  useEffect(() => {
    request(boutiqueId);
  }, [boutiqueId]);
  useEffect(() => {
    if (activeTab === "products") {
      fetchCategories();
    }
  }, []);
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts(boutiqueId, {
        page,
        limit,
        category_id: categoryFilter === "all" ? undefined : categoryFilter,
        search: debouncedSearch || undefined,
        sort: sortBy,
      });
    }
  }, [page,
    categoryFilter,
    debouncedSearch,
    activeTab,
    sortBy,
  ]);
  logger.log("productRes:", productRes);
  const boutique = data?.body;
  // Only show products with display price set from product module
  const catalogProducts = boutiqueProducts(productRes?.body) || [];
  const pagination = productRes?.pagination;
  logger.log("pagination:", pagination);
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: boutique.boutique_name,
          text: `Check out ${boutique.boutique_name}`,
          url: shareUrl,
        });
      } catch {
        toast({
          title: "error",
          description: "",
          variant: 'destructive'
        })
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast({
      title: "Link Copied!",
      description: "Share this link with your customers.",
    });
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/boutique"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => toast({ title: "Added to Favorites!" })}
            >
              <Heart className="h-5 w-5" />
            </Button> */}
            <Button variant="ghost"
              size="icon"
              // onClick={handleShare}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Link Copied!" });
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={boutique?.cover_image ?? boutique?.brand_logo ?? NO_IMAGE}
          alt={boutique?.boutique_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Boutique Info */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative -mt-20 mb-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0 -mt-16 md:-mt-20">
                  <img
                    src={boutique?.brand_logo ?? NO_IMAGE}
                    alt={boutique?.boutique_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-warm-brown">
                      {boutique?.boutique_name ?? ''}
                    </h1>
                    <Badge variant="outline" className="w-fit">
                      {boutique?.category ?? ''}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground italic mb-3">
                    {boutique?.tagline ?? ""}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{boutique?.rating ?? 0}</span>
                      <span className="text-muted-foreground">
                        ({boutique?.review_count ?? 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Since {boutique?.establishment_year ?? ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {boutique?.customer_count ?? 0}+ Happy
                        Customers
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {boutique?.service_highlights?.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {h}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {boutique?.social_links?.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={boutique?.social_links?.instagram ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </a>
                      </Button>
                    )}
                    {boutique?.social_links?.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={boutique?.social_links?.facebook || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </a>
                      </Button>
                    )}
                    {boutique?.social_links?.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={boutique?.social_links?.website ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats - removed Orders */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-brand-orange/10 rounded-lg">
                <Package className="h-5 w-5 text-brand-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boutique?.products_count ?? 0}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{boutique?.rating ?? 0}</p>
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
                <p className="text-2xl font-bold">{boutique?.review_count ?? 0}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="h-4 w-4 hidden sm:block" />
              Products
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Store className="h-4 w-4 hidden sm:block" />
              About
            </TabsTrigger>
            <TabsTrigger value="specialties" className="gap-2">
              <Sparkles className="h-4 w-4 hidden sm:block" />
              Specialties
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            {/* Search & Sort */}
            <Card className="mb-6">
              <CardContent className="p-4">
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
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="discount">
                          Highest Discount
                        </SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground mb-4">
              {catalogProducts.length} products found
            </p>

            {catalogProducts?.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Products Listed Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Products will appear here once the boutique sets display
                    prices.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {catalogProducts?.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"

                    onClick={() =>
                      navigate(
                        `/shop/${boutiqueId}/product/${product.id}`,
                      )
                    }
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image || NO_IMAGE}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* {product.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <Percent className="h-3 w-3 mr-1" />
                          {product?.discount}% off
                        </Badge>
                      )} */}
                      {product.stock == 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-medium text-sm line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      {/* <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">
                          {product?.rating ?? 0}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({product?.review_count ?? 0})
                        </span>
                      </div> */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-brand-orange">
                          ₹{product?.sellingPrice ? product?.sellingPrice : 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {productRes?.total_pages > 1 && (
              <Pagination
                currentPage={productRes?.current_page}
                totalPages={productRes?.total_pages}
                onPageChange={setPage}
              // onPageChange={(page) => setPage(page)}
              />
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Store className="h-5 w-5 text-brand-orange" />
                    About Us
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {boutique?.about_us ?? "need to add descriptions"}
                  </p>
                  <Separator className="my-4" />
                  <h4 className="font-medium mb-2">Our Story</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {boutique?.our_story ?? "add story content"}
                  </p>
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
                      <p className="text-muted-foreground">
                        {boutique?.contact?.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`tel:${boutique?.contact?.phone ?? ''}`}
                        className="text-brand-orange hover:underline"
                      >
                        {boutique?.contact?.phone ?? ''}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`mailto:${boutique?.contact?.email ?? ''}`}
                        className="text-brand-orange hover:underline"
                      >
                        {boutique?.contact?.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        {boutique?.contact?.operating_hours ?? ''}
                      </p>
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
                  {boutique?.our_specialties?.length > 0 ? (

                    <div className="space-y-3">
                      {boutique?.our_specialties?.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-brand-orange" />
                          <span className="font-medium">{s}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No specialties added yet.</p>
                  )}

                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-brand-orange" />
                    Why Choose Us
                  </h3>
                  {boutique?.service_highlights?.length > 0 ? (
                    <div className="space-y-3">
                      {boutique?.service_highlights?.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                            <Check className="h-4 w-4 text-brand-orange" />
                          </div>
                          <span className="font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No service highlights added yet.</p>
                  )}
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
