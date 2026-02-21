import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Store, Package, ShoppingCart, TrendingUp, User,
  LogOut, Search, Plus, Minus, Eye, EyeOff, IndianRupee, Calendar,
  CheckCircle, Clock, Truck, Filter, X, ChevronRight, Percent,
  MapPin, UserCheck, Ticket, Warehouse,
  BarChart3, Download, ExternalLink, Share2, Edit, Image, Layers,
  ShoppingBag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { useBoutiqueCart } from "@/contexts/BoutiqueCartContext";
import BoutiqueCart from "@/components/boutique/BoutiqueCart";
import RMSupport from "@/components/boutique/RMSupport";
import TicketSystem from "@/components/boutique/TicketSystem";
import SalesAnalytics from "@/components/boutique/SalesAnalytics";
import BoutiqueProfile from "@/components/boutique/BoutiqueProfile";
import BoutiqueCurations from "@/components/boutique/BoutiqueCurations";
import BoutiqueInventory from "@/components/boutique/BoutiqueInventory";
import { logoImage, NO_IMAGE } from "@/api/endpoints";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { useDebounce } from "@/hooks/useDebounce";
import { boutiqueProducts } from "@/data/product";
import dayjs from "dayjs";
import Pagination from "@/components/ecommerce/Pagination";
import { useMegaMenuStores } from "@/store/megaMenuStore";
import { industryService } from "@/services/industryService";

const SUBCATEGORIES: Record<string, string[]> = {
  "Kurta Sets": ["Cotton Kurta", "Silk Kurta", "Embroidered Kurta", "Printed Kurta"],
  "Anarkalis": ["Floor Length", "Short Anarkali", "Net Anarkali", "Georgette Anarkali"],
  "Lehengas": ["Bridal Lehenga", "Party Wear", "A-Line Lehenga", "Circular Lehenga"],
  "Sarees": ["Banarasi", "Silk Saree", "Cotton Saree", "Chiffon Saree"],
  "Palazzo Sets": ["Printed Palazzo", "Plain Palazzo", "Embroidered Palazzo"],
  "Salwar Suits": ["Patiala", "Churidar", "Straight Suit", "Pakistani Suit"],
  "Gowns": ["Party Gown", "Evening Gown", "Indo-Western Gown"],
};

const BoutiqueDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user, orders, sales, logout, placeOrder, profile, setProfile, toggleProductDisplay } = useBoutique();
  const { data, request: fetchProfile, loading } = useApi(boutiqueService.getProfile);
  const { addItem, getTotalItems } = useBoutiqueCart();

  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [boutiquePrice, setBoutiquePrice] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Product Filters
  const [categoryFilter, setCategoryFilter] = useState<any>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [discountFilter, setDiscountFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  // const {
  //   industries,
  //   categories,
  //   fetchIndustries,
  //   fetchCategories,
  // } = useMegaMenuStores();


  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const limit = 20;
  const {
    data: productRes,
    request: fetchProducts,
  } = useApi(boutiqueService.productList);
  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  // Customer Info for single order
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "" });
  const [shippingAddress, setShippingAddress] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [billingAddress, setBillingAddress] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const { data: categories, request: fetchCategories } = useApi(industryService.getCat);
  const { data: subcategories, request: fetchSubCategories } = useApi(industryService.getSubCat);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/boutique/login');
    }
  }, [isLoggedIn, navigate]);
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);
  useEffect(() => {
    if (data?.body) {
      const b = data.body;
      setProfile(b);
    }
  }, [profile]);
  useEffect(() => {
    fetchCategories()
  }, [showFilters])
  useEffect(() => {
    if (categoryFilter !== "all") fetchSubCategories(categoryFilter);
  }, [categoryFilter]);
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, subcategoryFilter, debouncedSearch, discountFilter, stockFilter]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts({
        page,
        limit,
        category_id: categoryFilter === "all" ? undefined : categoryFilter,
        subcategory_id: subcategoryFilter === "all" ? undefined : subcategoryFilter,
        search: debouncedSearch || undefined,
        min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
        max_price: priceRange[1] < 10000 ? priceRange[1] : undefined,
        discount: discountFilter !== "all" ? discountFilter : undefined,
        stock_status: stockFilter !== "all" ? stockFilter : undefined,
      });
    }
  }, [page, categoryFilter, subcategoryFilter, debouncedSearch, discountFilter, stockFilter, isLoggedIn]);
  const body = productRes?.body || [];
  const products = boutiqueProducts(body) || [];
  // const products = [
  //   { id: '1', name: 'Embroidered Silk Kurta Set', category: 'Kurta Sets', subcategory: 'Silk Kurta', adminPrice: 1800, mrp: 2500, image: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', stock: 50, discount: 28 },
  //   { id: '2', name: 'Printed Cotton Anarkali', category: 'Anarkalis', subcategory: 'Floor Length', adminPrice: 1200, mrp: 1800, image: '/lovable-uploads/8e7b5ac5-809f-4968-9838-2b60e5952347.png', stock: 35, discount: 33 },
  //   { id: '3', name: 'Designer Lehenga Choli', category: 'Lehengas', subcategory: 'Bridal Lehenga', adminPrice: 4500, mrp: 6500, image: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png', stock: 20, discount: 31 },
  //   { id: '4', name: 'Banarasi Silk Saree', category: 'Sarees', subcategory: 'Banarasi', adminPrice: 3200, mrp: 4500, image: '/lovable-uploads/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png', stock: 25, discount: 29 },
  //   { id: '5', name: 'Palazzo Suit Set', category: 'Palazzo Sets', subcategory: 'Printed Palazzo', adminPrice: 1500, mrp: 2200, image: '/lovable-uploads/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png', stock: 40, discount: 32 },
  //   { id: '6', name: 'Festive Salwar Kameez', category: 'Salwar Suits', subcategory: 'Straight Suit', adminPrice: 2000, mrp: 2800, image: '/lovable-uploads/15ff49d2-e060-4344-956a-c6030caf0a58.png', stock: 30, discount: 29 },
  //   { id: '7', name: 'Bridal Lehenga Set', category: 'Lehengas', subcategory: 'Bridal Lehenga', adminPrice: 8500, mrp: 12000, image: '/lovable-uploads/beea47d5-6ae4-460a-a065-76f4befc19cb.png', stock: 8, discount: 29 },
  //   { id: '8', name: 'Party Wear Gown', category: 'Gowns', subcategory: 'Party Gown', adminPrice: 3500, mrp: 5000, image: '/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', stock: 0, discount: 30 }
  // ];

  // const categories = [...new Set(products?.map(p => p.category))];
  // console.log(categories,  'categories')

  // const availableSubcategories = categoryFilter !== "all" ? (SUBCATEGORIES[categoryFilter] || []) : [];

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "See you soon!" });
    navigate('/boutique');
  };

  const handleUpdatePrice = (product: any) => {
    setSelectedProduct(product);
    // const existingPrice = getProductPrice(product?.id);
    setBoutiquePrice(product?.sellingPrice?.toString() || "");
    setShowPriceDialog(true);
  };

  const handleSavePrice = async () => {
    if (!selectedProduct || !boutiquePrice) {
      toast({ title: "Error", description: "Please enter a selling price", variant: "destructive" });
      return;
    }
    try {
      const response: any = await boutiqueService.getSetPrice(selectedProduct.id, parseFloat(boutiquePrice));
      console.log("Set Price Response:", response);
      const { success, message, body } = response;
      if (success) {
        // updateProductPrice(selectedProduct.id, parseFloat(body?.selling_price || boutiquePrice));
        fetchProducts({ page, limit });
        toast({
          title: "Price Updated!",
          description: `Selling price for ${selectedProduct.name} set to ₹${body?.selling_price || boutiquePrice}`
        });
        setShowPriceDialog(false);
        setSelectedProduct(null);
      } else {
        toast({ title: "Error", description: message || "Failed to update selling price", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "Failed to update selling price", variant: "destructive" });

    } finally {
      setShowPriceDialog(false);
      setSelectedProduct(null);
    }
  };

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast({ title: "Out of Stock", description: "This product is currently unavailable.", variant: "destructive" });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      adminPrice: product.adminPrice,
      mrp: product.mrp,
      discount: product.discount,
      stock: product.stock
    });
    toast({ title: "Added to Cart!", description: `${product.name} added to bulk order cart.` });
  };

  const handleDownloadImage = (product: any) => {
    const link = document.createElement('a');
    link.href = product.image;
    link.download = `${product.product_title.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: "Product image is being downloaded." });
  };

  const handleShareProduct = async (product: any) => {
    // const priceInfo = getProductPrice(product._id);
    const shareData = {
      title: product.product_title,
      text: `Check out ${product.product_title} - Selling Price: ₹${product.sellingPrice || product.mrp}`,
      url: window.location.origin + `/shop/${user?.shop_name?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {
        navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link Copied!", description: "Share it with your customers." });
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast({ title: "Link Copied!", description: "Share it with your customers." });
    }
  };

  const handleDownloadCatalogue = () => {
    toast({ title: "Downloading Catalogue...", description: "Your product catalogue PDF is being generated." });
  };

  const handleSetPrice = (product: any) => {
    setSelectedProduct(product);
    setBoutiquePrice("");
    setOrderQuantity(1);
    setCustomerInfo({ name: "", phone: "", email: "" });
    setShippingAddress({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setBillingAddress({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
    setSameAsShipping(true);
    setShowOrderDialog(true);
  };

  const handlePlaceOrder = () => {
    if (!selectedProduct || !boutiquePrice) {
      toast({ title: "Error", description: "Please set your selling price", variant: "destructive" });
      return;
    }
    if (!customerInfo.name || !customerInfo.phone) {
      toast({ title: "Error", description: "Please fill customer information", variant: "destructive" });
      return;
    }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      toast({ title: "Error", description: "Please fill shipping address", variant: "destructive" });
      return;
    }
    placeOrder({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      quantity: orderQuantity,
      buyingPrice: selectedProduct.adminPrice,
      sellingPrice: parseFloat(boutiquePrice),
      customerInfo,
      shippingAddress,
      billingAddress: sameAsShipping ? shippingAddress : billingAddress
    });
    toast({ title: "Order Placed!", description: `${orderQuantity} x ${selectedProduct.name} ordered successfully.` });
    setShowOrderDialog(false);
    setSelectedProduct(null);
  };

  // const filteredProducts = products.filter(p => {
  //   const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
  //   const matchesSubcategory = subcategoryFilter === "all" || p.subcategory === subcategoryFilter;
  //   const matchesPrice = p.adminPrice >= priceRange[0] && p.adminPrice <= priceRange[1];
  //   const matchesDiscount = discountFilter === "all" ||
  //     (discountFilter === "10" && p.discount >= 10) ||
  //     (discountFilter === "20" && p.discount >= 20) ||
  //     (discountFilter === "30" && p.discount >= 30);
  //   const matchesStock = stockFilter === "all" ||
  //     (stockFilter === "in_stock" && p.stock > 0) ||
  //     (stockFilter === "low_stock" && p.stock > 0 && p.stock <= 10) ||
  //     (stockFilter === "out_of_stock" && p.stock === 0);
  //   return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice && matchesDiscount && matchesStock;
  // });

  // const sortedProducts = [...filteredProducts].sort((a, b) => {
  //   switch (sortBy) {
  //     case "price-low": return a.adminPrice - b.adminPrice;
  //     case "price-high": return b.adminPrice - a.adminPrice;
  //     case "discount": return b.discount - a.discount;
  //     case "stock": return b.stock - a.stock;
  //     default: return 0;
  //   }
  // });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.customerInfo?.name.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    const matchesType = orderTypeFilter === "all" ||
      (orderTypeFilter === "bulk" && order.isBulkOrder) ||
      (orderTypeFilter === "single" && !order.isBulkOrder);
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalSales = sales.reduce((acc, sale) => acc + (sale.sellingPrice * sale.quantity), 0);
  const totalProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'confirmed': return <Package className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const clearFilters = () => {
    setCategoryFilter("all");
    setSubcategoryFilter("all");
    setPriceRange([0, 10000]);
    setDiscountFilter("all");
    setStockFilter("all");
    setSearchQuery("");
    setSortBy("popular");
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 md:py-4 flex items-center justify-between">
          {/* <div className="flex items-center gap-2 min-w-0">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-brand-orange flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-sm sm:text-lg md:text-xl font-bold text-warm-brown truncate block">{user?.shopName}</span>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user?.category}</p>
            </div>
          </div> */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              {/* <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Ethnic Store</span> */}
              <img
                // src={profile?.brand_logo || logoImage}
                src={logoImage}
                alt="Zarkha"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate("/")}
              />
            </Link>

            <Badge variant="secondary" className="hidden sm:flex">{profile?.store_name || "Boutique Partner"}</Badge>
            {/* <Badge variant="secondary" className="hidden sm:flex">Boutique Partner</Badge> */}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="relative" onClick={() => setShowCart(true)}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cart</span>
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-brand-orange">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 md:py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-3">
                <div className="p-1.5 sm:p-2 bg-brand-orange/10 rounded-lg">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-brand-orange" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Sales</p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold">₹{totalSales.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Profit</p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold">₹{totalProfit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2 sm:p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Orders</p>
                  <p className="text-sm sm:text-lg md:text-xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Desktop tabs */}
          <TabsList className="w-full hidden md:grid md:grid-cols-8 mb-6">
            <TabsTrigger value="products" className="text-sm">
              <Package className="h-4 w-4 mr-1" />Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">
              <ShoppingCart className="h-4 w-4 mr-1" />Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-sm">
              <Warehouse className="h-4 w-4 mr-1" />Stock
            </TabsTrigger>
            <TabsTrigger value="curations" className="text-sm">
              <Layers className="h-4 w-4 mr-1" />Curations
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">
              <BarChart3 className="h-4 w-4 mr-1" />Analytics
            </TabsTrigger>
            <TabsTrigger value="brand" className="text-sm">
              <ExternalLink className="h-4 w-4 mr-1" />Brand
            </TabsTrigger>
            <TabsTrigger value="support" className="text-sm">
              <Ticket className="h-4 w-4 mr-1" />Support
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-sm">
              <User className="h-4 w-4 mr-1" />Profile
            </TabsTrigger>
          </TabsList>

          {/* Mobile tabs - scrollable */}
          <div className="md:hidden mb-4 -mx-3 px-3">
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { value: "products", icon: Package, label: "Products" },
                { value: "orders", icon: ShoppingCart, label: "Orders" },
                { value: "inventory", icon: Warehouse, label: "Stock" },
                { value: "curations", icon: Layers, label: "Curations" },
                { value: "analytics", icon: BarChart3, label: "Analytics" },
                { value: "brand", icon: ExternalLink, label: "Brand" },
                { value: "support", icon: Ticket, label: "Support" },
                { value: "profile", icon: User, label: "Profile" },
              ].map(tab => (
                <Button
                  key={tab.value}
                  variant={activeTab === tab.value ? "brand" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.value)}
                  className="flex-shrink-0 text-xs h-8 px-3"
                >
                  <tab.icon className="h-3.5 w-3.5 mr-1" />{tab.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <CardTitle className="text-lg">Product Catalog</CardTitle>
                    <p className="text-sm text-muted-foreground">{products?.length} products</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                      {/* <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Popular</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="discount">Highest Discount</SelectItem>
                          <SelectItem value="stock">Stock Available</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Filters with Subcategory */}
                  {showFilters && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Filters</span>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="h-4 w-4 mr-1" /> Clear All
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          {/* <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setSubcategoryFilter("all"); }}> */}
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories?.map((cat: any) => <SelectItem key={cat.id} value={cat.id}>{cat?.category_name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Subcategory</Label>
                          <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter} disabled={categoryFilter === "all"}>
                            <SelectTrigger><SelectValue placeholder={categoryFilter === "all" ? "Select category first" : "All Subcategories"} /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Subcategories</SelectItem>
                              {subcategories?.map(sub => <SelectItem key={sub?.id} value={sub.id}>{sub?.subcategory_name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Price: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
                          <Slider value={priceRange}
                            onValueChange={setPriceRange}
                            onValueCommit={(value) => {
                              fetchProducts({
                                page: 1,
                                limit,
                                min_price: value[0],
                                max_price: value[1],

                              })
                            }}
                            min={0}
                            max={10000}
                            step={100}
                            className="mt-2" />
                        </div>
                        <div className="space-y-2">
                          <Label>Discount</Label>
                          <Select value={discountFilter} onValueChange={setDiscountFilter}>
                            <SelectTrigger><SelectValue placeholder="Any Discount" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any Discount</SelectItem>
                              <SelectItem value="10">10% and above</SelectItem>
                              <SelectItem value="20">20% and above</SelectItem>
                              <SelectItem value="30">30% and above</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Stock Status</Label>
                          <Select value={stockFilter} onValueChange={setStockFilter}>
                            <SelectTrigger><SelectValue placeholder="All Stock" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Products</SelectItem>
                              <SelectItem value="in_stock">In Stock</SelectItem>
                              <SelectItem value="low_stock">Low Stock (≤10)</SelectItem>
                              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{products?.length} products</p>
                  <Button variant="outline" size="sm" onClick={handleDownloadCatalogue}>
                    <Download className="h-4 w-4 mr-2" /> Download Catalogue
                  </Button>
                </div> */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                  {products.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">No products available</p>
                  ) : null}
                  {products.map((product) => {
                    // const priceInfo = getProductPrice(product.id);
                    const priceInfo = product.sellingPrice > 0;
                    return (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square relative group">
                          <Link to={`/product/${product?.id}`}>
                          <img src={product.image || NO_IMAGE} alt={product.name} className="w-full h-full object-cover" />
                          </Link>
                          <Badge className="absolute top-2 right-2 bg-warm-brown">{product.category}</Badge>
                          <Badge className="absolute top-2 left-2 bg-green-600">
                            <Percent className="h-3 w-3 mr-1" />{product.discount ?? 0}% off
                          </Badge>
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive">Out of Stock</Badge>
                            </div>
                          )}
                          {product.stock > 0 && product.stock <= 10 && (
                            <Badge className="absolute bottom-2 left-2 bg-yellow-500">Only {product.stock} left</Badge>
                          )}
                          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleDownloadImage(product)}>
                              <Image className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleShareProduct(product)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-2 sm:p-3 md:p-4">
                          <Link to={`/product/${product?.id}`} >
                          <h3 className="font-semibold text-warm-brown mb-1 text-xs sm:text-sm md:text-base line-clamp-2">{product.name}</h3>
                          </Link>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">{product?.subcategory ?? "No Subcategory"}</p>
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <div>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">Your Price</p>
                              <p className="text-sm sm:text-lg font-bold text-brand-orange">₹{product?.adminPrice ?? 0}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] sm:text-xs">Stock: {product?.stock ?? 0}</Badge>
                          </div>
                          {priceInfo ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-green-700">Selling Price</p>
                                  <p className="text-base font-bold text-green-700">₹{product?.sellingPrice ?? 0}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-green-600">Profit</p>
                                  <p className="text-sm font-semibold text-green-700">₹{product?.profit ?? 0}</p>
                                  {/* <p className="text-sm font-semibold text-green-700">₹{priceInfo?.sellingPrice - product?.adminPrice}</p> */}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3 inline mr-1" />Updated: {dayjs(product?.lastUpdated).format("DD MMM YYYY")}
                                {/* <Calendar className="h-3 w-3 inline mr-1" />Updated: {dayjs(product?.lastUpdated).format("DD MMM YYYY")} */}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
                              <p className="text-xs text-yellow-700">Set selling price to show on brand page</p>
                            </div>
                          )}
                          <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-2">
                            <Button variant={priceInfo ? "outline" : "brand"} size="sm" className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-3" onClick={() => handleUpdatePrice(product)}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" /> <span className="hidden sm:inline">{priceInfo ? "Update Price" : "Set Price"}</span><span className="sm:hidden">{priceInfo ? "Price" : "Set"}</span>
                            </Button>
                            <Button
                              variant="brand"
                              size="sm"
                              className="flex-1 text-[10px] sm:text-xs h-7 sm:h-8 px-1.5 sm:px-3"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Cart</span>
                            </Button>
                          </div>
                          {priceInfo && (
                            <Button
                              variant={priceInfo ? "default" : "outline"}
                              size="sm" className="w-full"
                              onClick={() => toggleProductDisplay(product.id)}
                            >
                              {priceInfo ? (
                                <><Eye className="h-4 w-4 mr-1" />Visible on Brand Page</>
                              ) : (
                                <><EyeOff className="h-4 w-4 mr-1" />Hidden from Brand Page</>
                              )}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

              </CardContent>
              {productRes?.total_pages > 1 && (
                <Pagination
                  currentPage={productRes?.current_page}
                  totalPages={productRes?.total_pages}
                  onPageChange={setPage}
                // onPageChange={(page) => setPage(page)}
                />
              )}
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order History</CardTitle>
                    <Badge variant="outline">{filteredOrders.length} orders</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by order ID, product, or customer..." value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)} className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                      <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                        <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                        <SelectTrigger className="w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="single">Single Order</SelectItem>
                          <SelectItem value="bulk">Bulk Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer" onClick={() => navigate(`/boutique/order/${order.id}`)}>
                      <div className="flex gap-3 flex-1">
                        {order.productImage ? (
                          <img src={order.productImage} alt={order.productName} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(order.status)}
                            <span className="font-semibold text-sm">{order.productName}</span>
                            {order.isBulkOrder && <Badge variant="outline" className="text-xs">Bulk</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Order ID: {order.id}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div><p className="text-muted-foreground">Quantity</p><p className="font-medium">{order.quantity} pcs</p></div>
                            <div><p className="text-muted-foreground">Buying</p><p className="font-medium">₹{order.buyingPrice}</p></div>
                            <div><p className="text-muted-foreground">Selling</p><p className="font-medium text-brand-orange">₹{order.sellingPrice}</p></div>
                            <div><p className="text-muted-foreground">Profit</p><p className="font-medium text-green-600">₹{(order.sellingPrice - order.buyingPrice) * order.quantity}</p></div>
                          </div>
                          {order.customerInfo && (
                            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                              <span>Customer: {order.customerInfo.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2">
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">{order.status}</Badge>
                        <span className="text-xs text-muted-foreground">{order.orderDate}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <BoutiqueInventory products={products} />
          </TabsContent>

          {/* Curations Tab */}
          <TabsContent value="curations">
            <BoutiqueCurations products={products} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          {/* RM Tab (hidden, accessible via support) */}
          <TabsContent value="rm">
            <RMSupport />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <TicketSystem />
          </TabsContent>

          {/* Brand Page Tab */}
          <TabsContent value="brand">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">Your Brand Page</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Share your unique brand page with customers</p>
                  </div>
                  <Button variant="brand" onClick={() => navigate(`/shop/${user?.shop_name?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> View Page
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm text-muted-foreground">Your Brand Link</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input readOnly value={`${window.location.origin}/shop/${user?.shop_name?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`} className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/shop/${user?.shop_name?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`);
                      toast({ title: "Link Copied!", description: "Share it with your customers." });
                    }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-5 w-5 text-green-600" /></div>
                    <div>
                      <p className="font-medium">Page Views</p>
                      <p className="text-sm text-muted-foreground">1,234 this month</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("analytics")}>
                    <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <BoutiqueProfile />
          </TabsContent>
        </Tabs>
      </div>

      {/* Single Order Dialog */}
      <Dialog open={showOrderDialog && !!selectedProduct} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Quick Order</DialogTitle></DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h4 className="font-semibold">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">Buying: ₹{selectedProduct.adminPrice}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Selling Price (₹)</Label>
                  <Input type="number" placeholder="Enter selling price" value={boutiquePrice} onChange={(e) => setBoutiquePrice(e.target.value)} />
                  {boutiquePrice && <p className="text-sm text-green-600">Profit/piece: ₹{parseFloat(boutiquePrice) - selectedProduct.adminPrice}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}><Minus className="h-4 w-4" /></Button>
                    <span className="text-lg font-semibold w-12 text-center">{orderQuantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setOrderQuantity(orderQuantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base font-semibold">Customer Information</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Customer Name *" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
                  <Input placeholder="Phone *" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
                  <Input type="email" placeholder="Email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} className="sm:col-span-2" />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base font-semibold">Shipping Address</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Recipient Name *" value={shippingAddress.name} onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} />
                  <Input placeholder="Phone *" value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                  <Input placeholder="Address *" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="sm:col-span-2" />
                  <Input placeholder="City *" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                  <Input placeholder="State *" value={shippingAddress.state} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
                  <Input placeholder="Pincode *" value={shippingAddress.pincode} onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })} />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="sameAsShippingSingle" checked={sameAsShipping} onCheckedChange={(checked) => setSameAsShipping(checked as boolean)} />
                  <Label htmlFor="sameAsShippingSingle" className="text-sm">Billing same as shipping</Label>
                </div>
                {!sameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input placeholder="Name *" value={billingAddress.name} onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })} />
                    <Input placeholder="Phone *" value={billingAddress.phone} onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })} />
                    <Input placeholder="Address *" value={billingAddress.address} onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })} className="sm:col-span-2" />
                    <Input placeholder="City *" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
                    <Input placeholder="State *" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
                    <Input placeholder="Pincode *" value={billingAddress.pincode} onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm"><span>Quantity:</span><span className="font-medium">{orderQuantity} pcs</span></div>
                <div className="flex justify-between text-sm"><span>Total Cost:</span><span className="font-semibold">₹{(selectedProduct.adminPrice * orderQuantity).toLocaleString()}</span></div>
                {boutiquePrice && (
                  <>
                    <div className="flex justify-between text-sm text-green-600"><span>Expected Revenue:</span><span className="font-semibold">₹{(parseFloat(boutiquePrice) * orderQuantity).toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm text-green-700 font-medium"><span>Expected Profit:</span><span>₹{((parseFloat(boutiquePrice) - selectedProduct.adminPrice) * orderQuantity).toLocaleString()}</span></div>
                  </>
                )}
              </div>
              <Button variant="brand" className="w-full" onClick={handlePlaceOrder}>Place Order</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Order Cart */}
      <BoutiqueCart isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Update Price Dialog */}
      <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Update Selling Price</DialogTitle></DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h4 className="font-semibold text-sm">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Your Price:</span>
                    <span className="text-sm font-semibold text-brand-orange">₹{selectedProduct.adminPrice}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">MRP:</span>
                    <span className="text-sm line-through text-muted-foreground">₹{selectedProduct.mrp ?? 0}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Your Selling Price (₹)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  placeholder="Enter your selling price"
                  value={boutiquePrice}
                  onChange={(e) => setBoutiquePrice(e.target.value)}
                  className="text-lg"
                />
                {boutiquePrice && parseFloat(boutiquePrice) > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Profit per piece:</span>
                      <span className="font-bold text-green-700">₹{(parseFloat(boutiquePrice) - selectedProduct.adminPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-green-700">Profit margin:</span>
                      <span className="font-bold text-green-700">{(((parseFloat(boutiquePrice) - selectedProduct.adminPrice) / parseFloat(boutiquePrice)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                )}
                {boutiquePrice && parseFloat(boutiquePrice) <= selectedProduct.adminPrice && (
                  <p className="text-xs text-destructive">Selling price should be higher than your cost (₹{selectedProduct.adminPrice})</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">This price will be displayed on your brand page for customers.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowPriceDialog(false)}>Cancel</Button>
                <Button variant="brand" className="flex-1" onClick={handleSavePrice} disabled={!boutiquePrice || parseFloat(boutiquePrice) <= selectedProduct.adminPrice}>Save Price</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoutiqueDashboard;
