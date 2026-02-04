import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Store, Package, ShoppingCart, TrendingUp, CreditCard, User,
  LogOut, Search, Plus, Minus, Eye, IndianRupee, Calendar,
  CheckCircle, Clock, Truck, Filter, X, ChevronRight, Percent,
  FileText, MapPin, Phone, Mail, Headphones, UserCheck, Ticket,
  BarChart3, Download, ExternalLink, Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBoutiqueCart } from "@/contexts/BoutiqueCartContext";
import { useBoutique } from "@/contexts/BoutiqueContext";
import SalesAnalytics from "@/components/boutique/SalesAnalytics";
import RMSupport from "@/components/boutique/RMSupport";
import TicketSystem from "@/components/boutique/TicketSystem";
import BoutiqueCart from "@/components/boutique/BoutiqueCart";
import { logoImage } from "@/api/endpoints";


const BoutiqueDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user, orders, sales, payments, logout, placeOrder } = useBoutique();
  const { addItem, getTotalItems } = useBoutiqueCart();

  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [boutiquePrice, setBoutiquePrice] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Product Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [discountFilter, setDiscountFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderDateFilter, setOrderDateFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  // Customer Info for single order
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/boutique/login');
    }
  }, [isLoggedIn, navigate]);

  const products = [
    { id: '1', name: 'Embroidered Silk Kurta Set', category: 'Kurta Sets', adminPrice: 1800, mrp: 2500, image: '/assets/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', stock: 50, discount: 28 },
    { id: '2', name: 'Printed Cotton Anarkali', category: 'Anarkalis', adminPrice: 1200, mrp: 1800, image: '/assets/8e7b5ac5-809f-4968-9838-2b60e5952347.png', stock: 35, discount: 33 },
    { id: '3', name: 'Designer Lehenga Choli', category: 'Lehengas', adminPrice: 4500, mrp: 6500, image: '/assets/beea47d5-6ae4-460a-a065-76f4befc19cb.png', stock: 20, discount: 31 },
    { id: '4', name: 'Banarasi Silk Saree', category: 'Sarees', adminPrice: 3200, mrp: 4500, image: '/assets/a75cb8b8-9eaa-400c-b4bc-8e4201532a4c.png', stock: 25, discount: 29 },
    { id: '5', name: 'Palazzo Suit Set', category: 'Palazzo Sets', adminPrice: 1500, mrp: 2200, image: '/assets/18b38e61-a1b9-470b-b5f8-9440d6e07cbf.png', stock: 40, discount: 32 },
    { id: '6', name: 'Festive Salwar Kameez', category: 'Salwar Suits', adminPrice: 2000, mrp: 2800, image: '/assets/15ff49d2-e060-4344-956a-c6030caf0a58.png', stock: 30, discount: 29 },
    { id: '7', name: 'Bridal Lehenga Set', category: 'Lehengas', adminPrice: 8500, mrp: 12000, image: '/assets/beea47d5-6ae4-460a-a065-76f4befc19cb.png', stock: 8, discount: 29 },
    { id: '8', name: 'Party Wear Gown', category: 'Gowns', adminPrice: 3500, mrp: 5000, image: '/assets/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png', stock: 0, discount: 30 }
  ];

  const categories = [...new Set(products.map(p => p.category))];

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "See you soon!" });
    navigate('/boutique');
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

  const handleAddToCart = (product: any) => {
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
    toast({ title: "Added to Cart", description: `${product.name} added to bulk order cart.` });
  };

  const handlePlaceOrder = () => {
    if (!selectedProduct || !boutiquePrice) {
      toast({ title: "Error", description: "Please set your selling price", variant: "destructive" });
      return;
    }
    // if (!customerInfo.name || !customerInfo.phone) {
    //   toast({ title: "Error", description: "Please fill customer information", variant: "destructive" });
    //   return;
    // }
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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesPrice = p.adminPrice >= priceRange[0] && p.adminPrice <= priceRange[1];
    const matchesDiscount = discountFilter === "all" ||
      (discountFilter === "10" && p.discount >= 10) ||
      (discountFilter === "20" && p.discount >= 20) ||
      (discountFilter === "30" && p.discount >= 30);
    const matchesStock = stockFilter === "all" ||
      (stockFilter === "in_stock" && p.stock > 0) ||
      (stockFilter === "low_stock" && p.stock > 0 && p.stock <= 10) ||
      (stockFilter === "out_of_stock" && p.stock === 0);
    return matchesSearch && matchesCategory && matchesPrice && matchesDiscount && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.adminPrice - b.adminPrice;
      case "price-high": return b.adminPrice - a.adminPrice;
      case "discount": return b.discount - a.discount;
      case "stock": return b.stock - a.stock;
      default: return 0;
    }
  });

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
  const pendingPayment = payments.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'confirmed': return <Package className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const clearFilters = () => {
    setCategoryFilter("all");
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
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Store className="h-6 w-6 md:h-8 md:w-8 text-brand-orange" /> */}
            <Link to="#" className="flex items-center gap-2">
              <img
                src={logoImage}
                alt="Zarkha"
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
            <div className="hidden sm:block">
              <span className="text-lg md:text-xl font-bold text-warm-brown">{user?.shopName}</span>
              <p className="text-xs text-muted-foreground">{user?.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Cart
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

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-brand-orange/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                  <p className="text-lg md:text-xl font-bold">₹{totalSales.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IndianRupee className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Profit</p>
                  <p className="text-lg md:text-xl font-bold">₹{totalProfit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-lg md:text-xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/boutique/payment')}>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg md:text-xl font-bold">₹{pendingPayment.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 md:grid-cols-8 mb-6">
            <TabsTrigger value="products" className="text-xs md:text-sm">
              <Package className="h-4 w-4 mr-1 hidden sm:inline" />Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs md:text-sm">
              <ShoppingCart className="h-4 w-4 mr-1 hidden sm:inline" />Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              <BarChart3 className="h-4 w-4 mr-1 hidden sm:inline" />Analytics
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs md:text-sm">
              <CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />Payments
            </TabsTrigger>
            <TabsTrigger value="rm" className="text-xs md:text-sm hidden md:flex">
              <UserCheck className="h-4 w-4 mr-1 hidden sm:inline" />RM
            </TabsTrigger>
            <TabsTrigger value="support" className="text-xs md:text-sm hidden md:flex">
              <Ticket className="h-4 w-4 mr-1 hidden sm:inline" />Support
            </TabsTrigger>
            <TabsTrigger value="brand" className="text-xs md:text-sm hidden md:flex">
              <ExternalLink className="h-4 w-4 mr-1 hidden sm:inline" />Brand Page
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm hidden md:flex">
              <User className="h-4 w-4 mr-1 hidden sm:inline" />Profile
            </TabsTrigger>
          </TabsList>

          {/* Mobile tabs for RM, Support, Brand, Profile */}
          <div className="md:hidden grid grid-cols-4 gap-2 mb-4">
            <Button
              variant={activeTab === "rm" ? "brand" : "outline"}
              size="sm"
              onClick={() => setActiveTab("rm")}
            >
              <UserCheck className="h-4 w-4 mr-1" />RM
            </Button>
            <Button
              variant={activeTab === "support" ? "brand" : "outline"}
              size="sm"
              onClick={() => setActiveTab("support")}
            >
              <Ticket className="h-4 w-4 mr-1" />Support
            </Button>
            <Button
              variant={activeTab === "brand" ? "brand" : "outline"}
              size="sm"
              onClick={() => setActiveTab("brand")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />Brand
            </Button>
            <Button
              variant={activeTab === "profile" ? "brand" : "outline"}
              size="sm"
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4 mr-1" />Profile
            </Button>
          </div>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <CardTitle className="text-lg">Product Catalog</CardTitle>
                    <p className="text-sm text-muted-foreground">{sortedProducts.length} products</p>
                  </div>
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
                          <Label>Stock Status</Label>
                          <Select value={stockFilter} onValueChange={setStockFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Stock" />
                            </SelectTrigger>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <Badge className="absolute top-2 right-2 bg-warm-brown">{product.category}</Badge>
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          <Percent className="h-3 w-3 mr-1" />{product.discount}% off
                        </Badge>
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                          </div>
                        )}
                        {product.stock > 0 && product.stock <= 10 && (
                          <Badge className="absolute bottom-2 left-2 bg-yellow-500">
                            Only {product.stock} left
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <h3 className="font-semibold text-warm-brown mb-2 text-sm md:text-base line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-lg font-bold text-brand-orange">₹{product.adminPrice}</p>
                            <p className="text-xs text-muted-foreground line-through">MRP: ₹{product.mrp}</p>
                          </div>
                          {/* <Badge variant="outline">Stock: {product.stock}</Badge> */}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add to Cart
                          </Button>
                          <Button
                            variant="brand"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSetPrice(product)}
                            disabled={product.stock === 0}
                          >
                            {/* Quick Order */}
                            Update Price
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
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
                      <Input
                        placeholder="Search by order ID, product, or customer..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
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
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate(`/boutique/order/${order.id}`)}
                    >
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
                            {order.isBulkOrder && (
                              <Badge variant="outline" className="text-xs">Bulk</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Order ID: {order.id}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-medium">{order.quantity} pcs</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Buying</p>
                              <p className="font-medium">₹{order.buyingPrice}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Selling</p>
                              <p className="font-medium text-brand-orange">₹{order.sellingPrice}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Profit</p>
                              <p className="font-medium text-green-600">₹{(order.sellingPrice - order.buyingPrice) * order.quantity}</p>
                            </div>
                          </div>
                          {order.customerInfo && (
                            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                              <span>Customer: {order.customerInfo.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2">
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{order.orderDate}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Payment History</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/boutique/payment')}>
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-3">
                      <div>
                        <p className="font-semibold text-lg">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Period: {payment.period}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                        {payment.releaseDate && (
                          <span className="text-sm text-muted-foreground">Released: {payment.releaseDate}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RM Tab */}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Your Brand Page</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share your unique brand page with customers
                    </p>
                  </div>
                  <Button variant="brand" onClick={() => navigate(`/shop/${user?.shopName?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> View Page
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-sm text-muted-foreground">Your Brand Link</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/shop/${user?.shopName?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/shop/${user?.shopName?.toLowerCase().replace(/\s+/g, '-') || 'my-boutique'}`);
                        toast({ title: "Link Copied!", description: "Share it with your customers." });
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-brand-orange/10 rounded-lg">
                        <Package className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div>
                        <p className="font-medium">Product Catalogue</p>
                        <p className="text-sm text-muted-foreground">8 products listed</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Downloading Catalogue...",
                          description: "Your product catalogue PDF is being generated."
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" /> Download Catalogue
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Page Views</p>
                        <p className="text-sm text-muted-foreground">1,234 this month</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("analytics")}>
                      <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium mb-2">Tips to improve your brand page</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Add high-quality product images</li>
                    <li>• Keep your catalogue up to date</li>
                    <li>• Share your page on social media</li>
                    <li>• Add your brand story in the About section</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Boutique Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Shop Name</Label>
                      <p className="font-semibold">{user?.shopName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Owner Name</Label>
                      <p className="font-semibold">{user?.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="font-semibold">{user?.category}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="font-semibold">{user?.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="font-semibold">{user?.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Single Order Dialog */}
      <Dialog open={showOrderDialog && selectedProduct} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Order</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="flex gap-4">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h4 className="font-semibold">{selectedProduct.name}</h4>
                  <p className="text-sm text-muted-foreground">Buying: ₹{selectedProduct.adminPrice}</p>
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Selling Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter selling price"
                    value={boutiquePrice}
                    onChange={(e) => setBoutiquePrice(e.target.value)}
                  />
                  {boutiquePrice && (
                    <p className="text-sm text-green-600">
                      Profit/piece: ₹{parseFloat(boutiquePrice) - selectedProduct.adminPrice}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">{orderQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              {/* <div className="space-y-3">
                <Label className="text-base font-semibold">Customer Information</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Customer Name *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                  <Input
                    placeholder="Phone *"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="sm:col-span-2"
                  />
                </div>
              </div> */}

              <Separator />

              {/* Shipping Address */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Shipping Address</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Recipient Name *"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  />
                  <Input
                    placeholder="Phone *"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  />
                  <Input
                    placeholder="Address *"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="sm:col-span-2"
                  />
                  <Input
                    placeholder="City *"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  />
                  <Input
                    placeholder="State *"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  />
                  <Input
                    placeholder="Pincode *"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              {/* Billing Address */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sameAsShippingSingle"
                    checked={sameAsShipping}
                    onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                  />
                  <Label htmlFor="sameAsShippingSingle" className="text-sm">Billing same as shipping</Label>
                </div>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Name *"
                      value={billingAddress.name}
                      onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                    />
                    <Input
                      placeholder="Phone *"
                      value={billingAddress.phone}
                      onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                    />
                    <Input
                      placeholder="Address *"
                      value={billingAddress.address}
                      onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                      className="sm:col-span-2"
                    />
                    <Input
                      placeholder="City *"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                    />
                    <Input
                      placeholder="State *"
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                    />
                    <Input
                      placeholder="Pincode *"
                      value={billingAddress.pincode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, pincode: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quantity:</span>
                  <span className="font-medium">{orderQuantity} pcs</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Cost:</span>
                  <span className="font-semibold">₹{(selectedProduct.adminPrice * orderQuantity).toLocaleString()}</span>
                </div>
                {boutiquePrice && (
                  <>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Expected Revenue:</span>
                      <span className="font-semibold">₹{(parseFloat(boutiquePrice) * orderQuantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-700 font-medium">
                      <span>Expected Profit:</span>
                      <span>₹{((parseFloat(boutiquePrice) - selectedProduct.adminPrice) * orderQuantity).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              <Button variant="brand" className="w-full" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Order Cart */}
      <BoutiqueCart isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

export default BoutiqueDashboard;
