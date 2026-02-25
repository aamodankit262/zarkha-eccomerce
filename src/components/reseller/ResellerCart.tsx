import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2, X, Package, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReseller } from "@/contexts/contexts/ResellerContext";
import { useResellerCart } from "@/contexts/contexts/ResellerCartContext";

interface ResellerCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResellerCart = ({ isOpen, onClose }: ResellerCartProps) => {
  const { toast } = useToast();
  const { placeBulkOrder } = useReseller();
  const {
    items, customerInfo, shippingAddress, billingAddress, sameAsShipping,
    updateQuantity, updateSellingPrice, removeItem, clearCart,
    setCustomerInfo, setShippingAddress, setBillingAddress, setSameAsShipping,
    getTotalItems, getTotalCost, getExpectedRevenue, getExpectedProfit
  } = useResellerCart();

  const handlePlaceOrder = () => {
    if (items.length === 0) { toast({ title: "Error", description: "Cart is empty", variant: "destructive" }); return; }
    if (items.some(p => !p.sellingPrice)) { toast({ title: "Error", description: "Please set selling price for all products", variant: "destructive" }); return; }
    if (!customerInfo.name || !customerInfo.phone) { toast({ title: "Error", description: "Please fill customer information", variant: "destructive" }); return; }
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) { toast({ title: "Error", description: "Please fill shipping address", variant: "destructive" }); return; }

    const orderItems = items.map(p => ({
      productId: p.id, productName: p.name, productImage: p.image,
      quantity: p.quantity, buyingPrice: p.adminPrice, sellingPrice: p.sellingPrice,
      customerInfo, shippingAddress, billingAddress: sameAsShipping ? shippingAddress : billingAddress, isBulkOrder: true
    }));

    placeBulkOrder(orderItems);
    toast({ title: "Order Placed!", description: `${items.length} products ordered successfully.` });
    clearCart();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Bulk Order Cart ({getTotalItems()} items)
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Products</Label>
                  <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Clear All
                  </Button>
                </div>
                {items.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Buying: ₹{item.adminPrice}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Input type="number" placeholder="Selling ₹" value={item.sellingPrice || ""} onChange={(e) => updateSellingPrice(item.id, parseFloat(e.target.value) || 0)} className="h-8 w-24 text-sm" />
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                        </div>
                        {item.sellingPrice > 0 && (
                          <p className="text-xs text-green-600">Profit: ₹{((item.sellingPrice - item.adminPrice) * item.quantity).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Customer Information</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Customer Name *" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
                    <Input placeholder="Phone *" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                    <Input type="email" placeholder="Email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} className="col-span-2" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4" /> Shipping Address</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Recipient Name *" value={shippingAddress.name} onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})} />
                    <Input placeholder="Phone *" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} />
                    <Input placeholder="Address *" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} className="col-span-2" />
                    <Input placeholder="City *" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} />
                    <Input placeholder="State *" value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} />
                    <Input placeholder="Pincode *" value={shippingAddress.pincode} onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="sameAsShippingReseller" checked={sameAsShipping} onCheckedChange={(checked) => setSameAsShipping(checked as boolean)} />
                    <Label htmlFor="sameAsShippingReseller" className="text-sm">Billing same as shipping</Label>
                  </div>
                  {!sameAsShipping && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Name *" value={billingAddress.name} onChange={(e) => setBillingAddress({...billingAddress, name: e.target.value})} />
                      <Input placeholder="Phone *" value={billingAddress.phone} onChange={(e) => setBillingAddress({...billingAddress, phone: e.target.value})} />
                      <Input placeholder="Address *" value={billingAddress.address} onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})} className="col-span-2" />
                      <Input placeholder="City *" value={billingAddress.city} onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})} />
                      <Input placeholder="State *" value={billingAddress.state} onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})} />
                      <Input placeholder="Pincode *" value={billingAddress.pincode} onChange={(e) => setBillingAddress({...billingAddress, pincode: e.target.value})} />
                    </div>
                  )}
                </div>
                <Separator />
                <Card className="bg-muted">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span>Total Products:</span><span className="font-medium">{items.length}</span></div>
                    <div className="flex justify-between text-sm"><span>Total Quantity:</span><span className="font-medium">{getTotalItems()}</span></div>
                    <Separator />
                    <div className="flex justify-between text-sm"><span>Total Cost:</span><span className="font-semibold">₹{getTotalCost().toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm text-green-600"><span>Expected Revenue:</span><span className="font-semibold">₹{getExpectedRevenue().toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm text-green-700 font-medium"><span>Expected Profit:</span><span>₹{getExpectedProfit().toLocaleString()}</span></div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <Button variant="brand" className="w-full" onClick={handlePlaceOrder}>Place Bulk Order</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ResellerCart;