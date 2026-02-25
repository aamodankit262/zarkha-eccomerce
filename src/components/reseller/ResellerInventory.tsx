import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Package, Search, Warehouse, TrendingDown, TrendingUp,
  AlertTriangle, CheckCircle, ArrowDownToLine, ArrowUpFromLine,
  IndianRupee, BoxIcon, RefreshCw, Plus, ShoppingCart
} from "lucide-react";
// import { useReseller, type ResellerOrder } from "@/contexts/ResellerContext";
// import { useResellerCart } from "@/contexts/ResellerCartContext";
import { useToast } from "@/hooks/use-toast";
import { useResellerCart } from "@/contexts/contexts/ResellerCartContext";
import { useReseller , type ResellerOrder} from "@/contexts/contexts/ResellerContext";

interface Product {
  id: string; name: string; category: string; subcategory?: string;
  adminPrice: number; mrp: number; image: string; stock: number; discount: number;
}

interface InventoryItem {
  productId: string; productName: string; productImage: string; category: string;
  totalPurchased: number; totalSold: number; currentStock: number;
  totalInvestment: number; avgBuyingPrice: number; sellingPrice: number;
  lastPurchaseDate: string; status: 'in_stock' | 'low_stock' | 'out_of_stock';
  orders: ResellerOrder[];
}

interface ResellerInventoryProps { products: Product[]; }

const ResellerInventory = ({ products }: ResellerInventoryProps) => {
  const { orders, sales, getProductPrice, placeOrder } = useReseller();
  const { addItem } = useResellerCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showReorderDialog, setShowReorderDialog] = useState(false);
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [reorderQty, setReorderQty] = useState(10);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addProductId, setAddProductId] = useState("");
  const [addQty, setAddQty] = useState(5);
  const [addSellingPrice, setAddSellingPrice] = useState("");

  const categories = [...new Set(products.map(p => p.category))];

  const inventory: InventoryItem[] = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    orders.forEach(order => {
      const product = products.find(p => p.id === order.productId);
      if (!product) return;
      const existing = map.get(order.productId);
      if (existing) {
        existing.totalPurchased += order.quantity;
        existing.totalInvestment += order.buyingPrice * order.quantity;
        existing.avgBuyingPrice = existing.totalInvestment / existing.totalPurchased;
        existing.orders.push(order);
        if (order.orderDate > existing.lastPurchaseDate) existing.lastPurchaseDate = order.orderDate;
      } else {
        map.set(order.productId, {
          productId: order.productId, productName: order.productName,
          productImage: order.productImage || product.image, category: product.category,
          totalPurchased: order.quantity, totalSold: 0, currentStock: 0,
          totalInvestment: order.buyingPrice * order.quantity, avgBuyingPrice: order.buyingPrice,
          sellingPrice: order.sellingPrice, lastPurchaseDate: order.orderDate,
          status: 'in_stock', orders: [order]
        });
      }
    });
    sales.forEach(sale => {
      const item = Array.from(map.values()).find(i => i.orders.some(o => o.id === sale.orderId));
      if (item) item.totalSold += sale.quantity;
    });
    map.forEach(item => {
      const deliveredQty = item.orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.quantity, 0);
      item.currentStock = deliveredQty - item.totalSold;
      const priceInfo = getProductPrice(item.productId);
      if (priceInfo) item.sellingPrice = priceInfo.sellingPrice;
      if (item.currentStock <= 0) { item.status = 'out_of_stock'; item.currentStock = Math.max(0, item.currentStock); }
      else if (item.currentStock <= 5) item.status = 'low_stock';
      else item.status = 'in_stock';
    });
    return Array.from(map.values());
  }, [orders, sales, products, getProductPrice]);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalStockValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.avgBuyingPrice), 0);
  const totalPurchased = inventory.reduce((sum, item) => sum + item.totalPurchased, 0);
  const totalSold = inventory.reduce((sum, item) => sum + item.totalSold, 0);
  const totalInvestment = inventory.reduce((sum, item) => sum + item.totalInvestment, 0);
  const lowStockCount = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out_of_stock').length;
  const productsNotInInventory = products.filter(p => !inventory.some(i => i.productId === p.id) && p.stock > 0);

  const handleReorder = (item: InventoryItem) => { setReorderItem(item); setReorderQty(10); setShowReorderDialog(true); };

  const confirmReorder = () => {
    if (!reorderItem) return;
    const product = products.find(p => p.id === reorderItem.productId);
    if (!product) return;
    placeOrder({ productId: product.id, productName: product.name, productImage: product.image, quantity: reorderQty, buyingPrice: product.adminPrice, sellingPrice: reorderItem.sellingPrice, isBulkOrder: reorderQty >= 5 });
    toast({ title: "Reorder Placed!", description: `${reorderQty} x ${reorderItem.productName} reordered.` });
    setShowReorderDialog(false);
  };

  const handleAddProduct = () => {
    if (!addProductId) { toast({ title: "Error", description: "Please select a product", variant: "destructive" }); return; }
    const product = products.find(p => p.id === addProductId);
    if (!product) return;
    placeOrder({ productId: product.id, productName: product.name, productImage: product.image, quantity: addQty, buyingPrice: product.adminPrice, sellingPrice: addSellingPrice ? parseFloat(addSellingPrice) : product.mrp });
    toast({ title: "Product Added!", description: `${addQty} x ${product.name} ordered.` });
    setShowAddDialog(false); setAddProductId(""); setAddQty(5); setAddSellingPrice("");
  };

  const handleQuickReorderAll = () => {
    const lowItems = inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock');
    if (lowItems.length === 0) { toast({ title: "All stocked!", description: "No low or out-of-stock items." }); return; }
    lowItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;
      addItem({ id: product.id, name: product.name, image: product.image, category: product.category, adminPrice: product.adminPrice, mrp: product.mrp, discount: product.discount, stock: product.stock });
    });
    toast({ title: "Added to Cart!", description: `${lowItems.length} low-stock items added to cart.` });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />In Stock</Badge>;
      case 'low_stock': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><AlertTriangle className="h-3 w-3 mr-1" />Low</Badge>;
      case 'out_of_stock': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><TrendingDown className="h-3 w-3 mr-1" />Out</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3 md:p-4"><div className="flex items-center gap-2"><div className="p-2 bg-brand-orange/10 rounded-lg"><Warehouse className="h-4 w-4 text-brand-orange" /></div><div><p className="text-xs text-muted-foreground">Stock Value</p><p className="text-base md:text-lg font-bold">₹{totalStockValue.toLocaleString()}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-3 md:p-4"><div className="flex items-center gap-2"><div className="p-2 bg-blue-100 rounded-lg"><ArrowDownToLine className="h-4 w-4 text-blue-600" /></div><div><p className="text-xs text-muted-foreground">Purchased</p><p className="text-base md:text-lg font-bold">{totalPurchased} pcs</p></div></div></CardContent></Card>
        <Card><CardContent className="p-3 md:p-4"><div className="flex items-center gap-2"><div className="p-2 bg-green-100 rounded-lg"><ArrowUpFromLine className="h-4 w-4 text-green-600" /></div><div><p className="text-xs text-muted-foreground">Sold</p><p className="text-base md:text-lg font-bold">{totalSold} pcs</p></div></div></CardContent></Card>
        <Card><CardContent className="p-3 md:p-4"><div className="flex items-center gap-2"><div className="p-2 bg-purple-100 rounded-lg"><IndianRupee className="h-4 w-4 text-purple-600" /></div><div><p className="text-xs text-muted-foreground">Invested</p><p className="text-base md:text-lg font-bold">₹{totalInvestment.toLocaleString()}</p></div></div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap gap-2">
          {lowStockCount > 0 && <div className="flex items-center gap-2 px-2 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700"><AlertTriangle className="h-3.5 w-3.5" /><span>{lowStockCount} low</span></div>}
          {outOfStockCount > 0 && <div className="flex items-center gap-2 px-2 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700"><TrendingDown className="h-3.5 w-3.5" /><span>{outOfStockCount} out</span></div>}
        </div>
        <div className="flex gap-2 sm:ml-auto w-full sm:w-auto">
          {(lowStockCount > 0 || outOfStockCount > 0) && <Button variant="brand" size="sm" onClick={handleQuickReorderAll} className="flex-1 sm:flex-none text-xs sm:text-sm"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Reorder Low</Button>}
          <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)} className="flex-1 sm:flex-none text-xs sm:text-sm"><Plus className="h-3.5 w-3.5 mr-1" /> Add Product</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><BoxIcon className="h-5 w-5 text-brand-orange" />Reseller Stock Inventory</CardTitle>
              <Badge variant="outline">{filteredInventory.length} items</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search inventory..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Warehouse className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-muted-foreground">No inventory found</p>
              <p className="text-sm text-muted-foreground mt-1">{inventory.length === 0 ? "Purchase products from Zarkha to build your inventory" : "Try adjusting your filters"}</p>
              {inventory.length === 0 && <Button variant="brand" size="sm" className="mt-4" onClick={() => setShowAddDialog(true)}><Plus className="h-4 w-4 mr-1" /> Add Your First Product</Button>}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInventory.map(item => {
                const stockPercentage = item.totalPurchased > 0 ? Math.round((item.currentStock / item.totalPurchased) * 100) : 0;
                const potentialProfit = item.currentStock * (item.sellingPrice - item.avgBuyingPrice);
                const pendingQty = item.orders.filter(o => o.status !== 'delivered').reduce((sum, o) => sum + o.quantity, 0);
                return (
                  <div key={item.productId} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img src={item.productImage} alt={item.productName} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm md:text-base line-clamp-1">{item.productName}</h4>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.status)}
                            {(item.status === 'low_stock' || item.status === 'out_of_stock') && (
                              <Button variant="brand" size="sm" onClick={() => handleReorder(item)}><RefreshCw className="h-3.5 w-3.5 mr-1" /> Reorder</Button>
                            )}
                          </div>
                        </div>
                        <div><div className="flex justify-between text-xs mb-1"><span>Stock: {item.currentStock} / {item.totalPurchased}</span><span>{stockPercentage}%</span></div><Progress value={stockPercentage} className="h-2" /></div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div><p className="text-muted-foreground">Avg Buy</p><p className="font-medium">₹{Math.round(item.avgBuyingPrice)}</p></div>
                          <div><p className="text-muted-foreground">Sell At</p><p className="font-medium text-brand-orange">₹{item.sellingPrice}</p></div>
                          <div><p className="text-muted-foreground">Sold</p><p className="font-medium">{item.totalSold} pcs</p></div>
                          <div><p className="text-muted-foreground">Potential</p><p className="font-medium text-green-600">₹{potentialProfit.toLocaleString()}</p></div>
                        </div>
                        {pendingQty > 0 && <Badge variant="outline" className="text-xs"><Package className="h-3 w-3 mr-1" />{pendingQty} units in transit</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reorder Dialog */}
      <Dialog open={showReorderDialog} onOpenChange={setShowReorderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reorder Product</DialogTitle></DialogHeader>
          {reorderItem && (
            <div className="space-y-4">
              <div className="flex gap-3"><img src={reorderItem.productImage} alt={reorderItem.productName} className="w-16 h-16 object-cover rounded" /><div><h4 className="font-semibold text-sm">{reorderItem.productName}</h4><p className="text-xs text-muted-foreground">{reorderItem.category}</p></div></div>
              <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={reorderQty} onChange={(e) => setReorderQty(parseInt(e.target.value) || 1)} min={1} /></div>
              <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between"><span>Unit Cost:</span><span>₹{Math.round(reorderItem.avgBuyingPrice)}</span></div>
                <div className="flex justify-between font-medium"><span>Total:</span><span>₹{(reorderItem.avgBuyingPrice * reorderQty).toLocaleString()}</span></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setShowReorderDialog(false)}>Cancel</Button><Button variant="brand" onClick={confirmReorder}>Confirm Reorder</Button></DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Product to Inventory</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Select Product</Label>
              <Select value={addProductId} onValueChange={setAddProductId}>
                <SelectTrigger><SelectValue placeholder="Choose a product" /></SelectTrigger>
                <SelectContent>{productsNotInInventory.map(p => <SelectItem key={p.id} value={p.id}>{p.name} - ₹{p.adminPrice}</SelectItem>)}{productsNotInInventory.length === 0 && <SelectItem value="none" disabled>All products already in inventory</SelectItem>}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={addQty} onChange={(e) => setAddQty(parseInt(e.target.value) || 1)} min={1} /></div>
              <div className="space-y-2"><Label>Selling Price (₹)</Label><Input type="number" placeholder="Optional" value={addSellingPrice} onChange={(e) => setAddSellingPrice(e.target.value)} /></div>
            </div>
            {addProductId && addProductId !== 'none' && (() => {
              const p = products.find(pr => pr.id === addProductId);
              if (!p) return null;
              const sp = addSellingPrice ? parseFloat(addSellingPrice) : p.mrp;
              return (
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between"><span>Investment:</span><span>₹{(p.adminPrice * addQty).toLocaleString()}</span></div>
                  <div className="flex justify-between text-green-600"><span>Potential Revenue:</span><span>₹{(sp * addQty).toLocaleString()}</span></div>
                  <div className="flex justify-between text-green-700 font-medium"><span>Expected Profit:</span><span>₹{((sp - p.adminPrice) * addQty).toLocaleString()}</span></div>
                </div>
              );
            })()}
            <DialogFooter><Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button><Button variant="brand" onClick={handleAddProduct}>Add to Inventory</Button></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResellerInventory;