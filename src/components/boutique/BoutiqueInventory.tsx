import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Search,
  Warehouse,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  IndianRupee,
  Filter,
  X,
  BoxIcon,
  RefreshCw,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useBoutique, type BoutiqueOrder } from "@/contexts/BoutiqueContext";
import { useBoutiqueCart } from "@/contexts/BoutiqueCartContext";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { industryService } from "@/services/industryService";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { NO_IMAGE } from "@/api/endpoints";
import { boutiqueProducts } from "@/data/product";
// import { AddInventoryPayload } from "@/types";
import { logger } from "@/helper/logger";
import Pagination from "../ecommerce/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  adminPrice: number;
  mrp: number;
  image: string;
  stock: number;
  discount: number;
}

// interface InventoryItem {
//   productId: string;
//   productName: string;
//   productImage: string;
//   category: string;
//   subcategory?: string;
//   totalPurchased: number;
//   totalSold: number;
//   currentStock: number;
//   totalInvestment: number;
//   avgBuyingPrice: number;
//   sellingPrice: number;
//   lastPurchaseDate: string;
//   status: "in_stock" | "low_stock" | "out_of_stock";
//   orders: BoutiqueOrder[];
// }

interface BoutiqueInventoryProps {
  products: Product[];
}

const BoutiqueInventory = ({ products }: BoutiqueInventoryProps) => {
  const { isLoggedIn, orders, sales, getProductPrice, placeOrder } =
    useBoutique();
  const { addItem } = useBoutiqueCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubCategoryFilter] = useState("all");
  const debouncedSearch = useDebounce(searchQuery, 500);
  // Reorder dialog state
  const [showReorderDialog, setShowReorderDialog] = useState(false);
  // const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [reorderQty, setReorderQty] = useState(10);

  // Add product dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(5);
  // const [addSellingPrice, setAddSellingPrice] = useState(null);
  const [addSellingPrice, setAddSellingPrice] = useState<string | null>(null);
  const { data: categories, request: fetchCategories } = useApi(
    industryService.getCat,
  );
  const { data: subcategories, request: fetchSubCategories } = useApi(
    industryService.getSubCat,
  );
  const { data: inventoryRes, request: fetchInventory } = useApi(
    boutiqueService.getInventoryList,
  );
  const [page, setPage] = useState(1);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const limit = 10;
  const InventoryLimit = 10;
  const { data: productRes, request: fetchProducts } = useApi(
    boutiqueService.productList,
  );
  // const categories = [...new Set(products.map(p => p.category))];
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchInventory({
      page: inventoryPage,
      limit: InventoryLimit,
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      category_id: categoryFilter === "all" ? undefined : categoryFilter,
    });
  }, [debouncedSearch, statusFilter, categoryFilter, inventoryPage]);

  const getSummary = inventoryRes?.summary || {};
  const inventoryBody = inventoryRes?.body || [];
  useEffect(() => {
    if (!isLoggedIn) return;

    fetchProducts({
      page,
      limit,
      category_id: categoryFilter !== "all" ? categoryFilter : undefined,
      subcategory_id:
        subcategoryFilter !== "all" ? subcategoryFilter : undefined,
    });
  }, [page, categoryFilter, subcategoryFilter, isLoggedIn]);
  useEffect(() => {
    if (!productRes?.body) return;

    const newProducts = boutiqueProducts(productRes.body) || [];

    if (page === 1) {
      setAllProducts(newProducts);
    } else {
      setAllProducts((prev) => [...prev, ...newProducts]);
    }

    // check if more pages exist
    if (productRes.current_page >= productRes.total_pages) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setLoadingMore(false);
  }, [productRes]);
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [categoryFilter, subcategoryFilter]);

  useEffect(() => {
    if (categoryFilter !== "all") fetchSubCategories(categoryFilter);
  }, [categoryFilter]);

  // const handleReorder = (item: InventoryItem) => {
  //   setReorderItem(item);
  //   setReorderQty(10);
  //   setShowReorderDialog(true);
  // };

  // const confirmReorder = () => {
  //   if (!reorderItem) return;
  //   const product = products.find((p) => p.id === reorderItem.productId);
  //   if (!product) return;

  //   placeOrder({
  //     productId: product.id,
  //     productName: product.name,
  //     productImage: product.image,
  //     quantity: reorderQty,
  //     buyingPrice: product.adminPrice,
  //     sellingPrice: reorderItem.sellingPrice,
  //     isBulkOrder: reorderQty >= 5,
  //   });

  //   toast({
  //     title: "Reorder Placed!",
  //     description: `${reorderQty} x ${reorderItem.productName} reordered from Zarkha.`,
  //   });
  //   setShowReorderDialog(false);
  //   setReorderItem(null);
  // };
  const handleAddProduct = async () => {
    logger.log(addProductId, "addproductid");
    if (!addProductId) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        product_id: addProductId,
        quantity: addQty,
        selling_price: Number(addSellingPrice),
      };
      const res: any = await boutiqueService.addInventory(payload);
      const { success, message, body } = res;
      if (success) {
        toast({
          title: `${message}` || "Product Added to Inventory!",
          description: `${body?.quantity} x ${body?.product_title} ordered from Zarkha.`,
          // description: `${addQty} x ${.name} ordered from Zarkha.`,
        });
        setShowAddDialog(false);
        setAddProductId("");
        setAddQty(5);
        setAddSellingPrice("");
        fetchInventory({
          page: inventoryPage,
          limit: InventoryLimit,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // const handleQuickReorderAll = () => {
  //   const lowItems = inventory.filter(
  //     (i) => i.status === "low_stock" || i.status === "out_of_stock",
  //   );
  //   if (lowItems.length === 0) {
  //     toast({
  //       title: "All stocked!",
  //       description: "No low or out-of-stock items.",
  //     });
  //     return;
  //   }

  //   lowItems.forEach((item) => {
  //     const product = products.find((p) => p.id === item.productId);
  //     if (!product) return;

  //     addItem({
  //       productId: product.id,
  //       variantId: product.itemCodeId,
  //       size: product.size,
  //       quantity: 1,
  //     })
  //   });

  //   toast({
  //     title: "Added to Cart!",
  //     description: `${lowItems.length} low-stock items added to bulk order cart.`,
  //   });
  // };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            In Stock
          </Badge>
        );
      case "low_stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        );
      case "out_of_stock":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <TrendingDown className="h-3 w-3 mr-1" />
            Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-orange/10 rounded-lg">
                <Warehouse className="h-4 w-4 text-brand-orange" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock Value</p>
                <p className="text-base md:text-lg font-bold">
                  ₹{getSummary?.stock_value ?? 0}
                </p>
                {/* <p className="text-base md:text-lg font-bold">₹{totalStockValue.toLocaleString()}</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ArrowDownToLine className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Purchased</p>
                <p className="text-base md:text-lg font-bold">
                  {getSummary?.purchased_pcs ?? 0} pcs
                </p>
                {/* <p className="text-base md:text-lg font-bold">{totalPurchased} pcs</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpFromLine className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sold</p>
                <p className="text-base md:text-lg font-bold">
                  {getSummary?.sold_pcs ?? 0} pcs
                </p>
                {/* <p className="text-base md:text-lg font-bold">{totalSold} pcs</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IndianRupee className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Invested</p>
                <p className="text-base md:text-lg font-bold">
                  ₹{getSummary?.invested ?? 0}
                </p>
                {/* <p className="text-base md:text-lg font-bold">₹{totalInvestment.toLocaleString()}</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts + Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap gap-2">
          {/* {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs sm:text-sm text-yellow-700">
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{lowStockCount} low</span>
            </div>
          )} */}
          {getSummary?.out_of_stock_count > 0 && (
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-700">
              <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{getSummary?.out_of_stock_count} out</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
          {/* {(getSummary?.low_stock_count > 0 ||
            getSummary?.out_of_stock_count > 0) && (
            <Button
              variant="brand"
              size="sm"
              onClick={handleQuickReorderAll}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" /> Reorder
              Low
            </Button>
          )} */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" /> Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BoxIcon className="h-5 w-5 text-brand-orange" />
                Boutique Stock Inventory
              </CardTitle>
              <Badge variant="outline">
                {inventoryBody?.length ?? 0} items
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                {categories?.length > 0 && (
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat?.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {inventoryBody?.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Warehouse className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-muted-foreground">
                No inventory found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {inventoryBody?.length === 0
                  ? "Purchase products from Zarkha to build your inventory"
                  : "Try adjusting your filters"}
              </p>
              {inventoryBody?.length === 0 && (
                <Button
                  variant="brand"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {inventoryBody?.map((item) => {
                const stockPercentage = item?.stock_percentage ?? 0;
                // const stockPercentage = item.totalPurchased > 0
                //   ? Math.round((item.currentStock / item.totalPurchased) * 100)
                //   : 0;
                const potentialProfit = item?.potential_profit ?? 0;
                // const potentialProfit = item.currentStock * (item.sellingPrice - item.avgBuyingPrice);
                const pendingOrders = item?.pending_orders ?? 0;
                // const pendingOrders = item.orders.filter(o => o.status !== 'delivered');
                // const pendingQty = pendingOrders.reduce((sum, o) => sum + o.quantity, 0);
                const pendingQty = item?.orders_in_transit;

                return (
                  <div
                    key={item._id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.image || NO_IMAGE}
                        alt={item.product_title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm md:text-base line-clamp-1">
                              {item.product_title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {item.category}
                              {item.subcategory ? ` > ${item.subcategory}` : ""}
                            </p>
                          </div>
                          {/* <div className="flex items-center gap-2">
                            {getStatusBadge(item.stock_status)}
                            {(item.stock_status === "low_stock" ||
                              item.stock_status === "out_of_stock") && (
                              <Button
                                variant="brand"
                                size="sm"
                                // onClick={() => handleReorder(item)}
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />{" "}
                                Reorder
                              </Button>
                            )}
                          </div> */}
                        </div>

                        {/* Stock Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Stock Level
                            </span>
                            <span className="font-medium">
                              {item.sold_pcs ?? 0} / {item.bought_pcs ?? 0} pcs
                              ({item?.stockPercentage}%)
                            </span>
                            {/* <span className="font-medium">{item.currentStock} / {item.totalPurchased} units ({stockPercentage}%)</span> */}
                          </div>
                          <Progress
                            value={item?.stockPercentage ?? 0}
                            className={`h-2 ${item?.stockPercentage <= 20 ? "[&>div]:bg-red-500" : item?.stockPercentage <= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"}`}
                          />
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">
                              Bought
                            </p>
                            <p className="text-sm font-semibold">
                              {item.bought_pcs ?? 0} pcs
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @ ₹{Math.round(item.bought_at_per_pc ?? 0)}/pc
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">
                              Sold
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              {item.sold_pcs ?? 0} pcs
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @ ₹{item.sold_at_per_pc ?? 0}/pc
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">
                              Investment
                            </p>
                            <p className="text-sm font-semibold text-brand-orange">
                              ₹{item.invested ?? 0}
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">
                              Potential Profit
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              ₹{item.potential_profit ?? 0}
                            </p>
                          </div>
                        </div>

                        {/* Pending Orders */}
                        {pendingQty > 0 && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                            <Package className="h-3.5 w-3.5" />
                            <span>
                              {pendingQty} units in transit (
                              {pendingOrders.length} order
                              {pendingOrders.length > 1 ? "s" : ""})
                            </span>
                          </div>
                        )}

                        {/* Purchase History */}
                        {item?.purchase_history?.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Purchase History
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item?.purchase_history?.map((order) => (
                                <div
                                  key={order._id}
                                  className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded text-xs"
                                >
                                  {order.status === "delivered" ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Package className="h-3 w-3 text-blue-500" />
                                  )}
                                  <span>{order?._id}</span>
                                  <span className="text-muted-foreground">
                                    • {order.quantity ?? 0}pcs
                                  </span>
                                  <span className="text-muted-foreground">
                                    • {order.orderDate ?? "01 jan 2026"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {inventoryRes?.total_pages > 1 && (
          <Pagination
            currentPage={inventoryRes?.current_page}
            totalPages={inventoryRes?.total_pages}
            onPageChange={setInventoryPage}
          />
        )}
      </Card>

      {/* Reorder Dialog */}
      {/* <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brand-orange" />
              Reorder from Zarkha
            </DialogTitle>
          </DialogHeader>
          {reorderItem && (
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <img
                  src={reorderItem.productImage}
                  alt={reorderItem.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {reorderItem.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reorderItem.category}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(reorderItem.status)}
                    <span className="text-xs text-muted-foreground">
                      Current: {reorderItem.currentStock} pcs
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reorder Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setReorderQty(Math.max(1, reorderQty - 5))}
                  >
                    -5
                  </Button>
                  <Input
                    type="number"
                    value={reorderQty}
                    onChange={(e) =>
                      setReorderQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-24 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setReorderQty(reorderQty + 5)}
                  >
                    +5
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Unit Price (Zarkha)
                  </span>
                  <span className="font-medium">
                    ₹{reorderItem.avgBuyingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{reorderQty} pcs</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total Cost</span>
                  <span className="text-brand-orange">
                    ₹
                    {(reorderItem.avgBuyingPrice * reorderQty).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-green-600">
                  <span>Expected Profit (per unit)</span>
                  <span>
                    ₹
                    {(
                      reorderItem.sellingPrice - reorderItem.avgBuyingPrice
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReorderDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="brand" onClick={confirmReorder}>
              <ShoppingCart className="h-4 w-4 mr-1" /> Place Reorder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Add Product to Inventory Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-orange" />
              Add Product to Inventory
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Category from Zarkha</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat?.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Sub-Category from Zarkha</Label>
              <Select
                value={subcategoryFilter}
                onValueChange={setSubCategoryFilter}
                disabled={categoryFilter === "all"}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      categoryFilter === "all"
                        ? "Select category first"
                        : "All Subcategories"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subcategories?.map((sub) => (
                    <SelectItem key={sub?.id} value={sub.id}>
                      {sub?.subcategory_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Product from Zarkha</Label>
              <Select value={addProductId} onValueChange={setAddProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent
                  className="max-h-60 overflow-y-auto"
                  onScroll={(e) => {
                    const target = e.currentTarget;

                    const bottom =
                      target.scrollHeight - target.scrollTop <=
                      target.clientHeight + 10;

                    if (bottom && hasMore && !loadingMore) {
                      setLoadingMore(true);
                      setPage((prev) => prev + 1);
                    }
                  }}
                >
                  {allProducts
                    .filter((p) => p.stock > 0)
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ₹{p.adminPrice}
                          </span>
                        </div>
                      </SelectItem>
                    ))}

                  {/* 👇 Loader AFTER map */}
                  {loadingMore && (
                    <div className="p-2 text-center text-xs text-muted-foreground">
                      Loading more...
                    </div>
                  )}

                  {!hasMore && allProducts.length > 0 && (
                    <div className="p-2 text-center text-xs text-muted-foreground">
                      No more products
                    </div>
                  )}
                  {/* {productRes?.total_count && (
                    <div className="text-xs text-muted-foreground px-2 pb-1">
                      Showing {allProducts.length} / {productRes.total_count}{" "}
                      products
                    </div>
                  )} */}
                </SelectContent>
              </Select>
              {/* {productsNotInInventory.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {productsNotInInventory.length} product
                  {productsNotInInventory.length > 1 ? "s" : ""} not yet in your
                  inventory
                </p>
              )} */}
            </div>

            {addProductId &&
              (() => {
                const product = products.find((p) => p.id === addProductId);
                if (!product) return null;
                return (
                  <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                      <p className="text-sm font-medium text-brand-orange mt-1">
                        Zarkha Price: ₹{product.adminPrice}
                      </p>
                    </div>
                  </div>
                );
              })()}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={addQty}
                  onChange={(e) =>
                    setAddQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Your Selling Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 2499"
                  value={addSellingPrice}
                  onChange={(e) => setAddSellingPrice(e.target.value)}
                />
              </div>
            </div>

            {addProductId &&
              (() => {
                const product = allProducts.find((p) => p.id === addProductId);
                if (!product) return null;
                const sp = addSellingPrice
                  ? parseFloat(addSellingPrice)
                  : product.mrp;
                return (
                  <>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Investment
                        </span>
                        <span className="font-bold text-brand-orange">
                          ₹{(product.adminPrice * addQty).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Profit per unit</span>
                        <span className="font-medium">
                          {/* ₹{product?.profit} */}₹
                          {(sp - product.adminPrice).toLocaleString() ?? 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Total Potential Profit</span>
                        <span className="font-bold">
                          ₹
                          {(
                            (sp - product.adminPrice) *
                            addQty
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleAddProduct}
              disabled={!addProductId}
            >
              <Plus className="h-4 w-4 mr-1" /> Add to Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoutiqueInventory;
