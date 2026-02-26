import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  ShoppingCart, Plus, Minus, Trash2, X, Package, MapPin, User
} from "lucide-react";
import { BoutiqueCartItem, useBoutiqueCart } from "@/contexts/BoutiqueCartContext";
import { useBoutique } from "@/contexts/BoutiqueContext";
// import { useToast } from "@/hooks/use-toast";
import { NO_IMAGE } from "@/api/endpoints";
import { boutiqueProducts } from "@/data/product";
import { useNavigate } from "react-router-dom";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { toast } from "sonner";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

interface BoutiqueCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const BoutiqueCart = ({ isOpen, onClose }: BoutiqueCartProps) => {
  // const { toast } = useToast();
  const { placeBulkOrder } = useBoutique();
  const {
    items,
    fetchCart,
    customerInfo,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    updateQuantity,
    updateSellingPrice,
    removeItem,
    clearCart,
    setCustomerInfo,
    setShippingAddress,
    setBillingAddress,
    setSameAsShipping,
    getTotalItems,
    getTotalCost,
    getExpectedRevenue,
    getExpectedProfit,
    totalPrice,
  } = useBoutiqueCart();
  // const navigate = useNavigate();
  const { Razorpay } = useRazorpay();

 
  const cartItems = items?.map((i: any) => {
    return {
      id: i.product_id,
      itemCodeId: i.item_id,
      itemCode: i.item_code,
      name: i.product_title,
      image: i.image,
      colors: i?.color, // FIXED
      size: i?.size, // FIXED
      quantity: i?.quantity, // FIXED
      adminPrice: i?.price, // FIXED
      sellingPrice: i?.sellingPrice

    }
  })
  // const handleQuantityChange = (
  //   productId: string,
  //   variantId: string,
  //   change: number
  // ) => {
  //   const item = cartItems.find(
  //     (i) =>
  //       i.id === productId &&
  //       i.itemCodeId === variantId
  //   );

  //   if (!item) return;

  //   const newQty = item.quantity + change;

  //   if (newQty <= 0) {
  //     removeItem(productId);
  //   } else {
  //     updateQuantity(productId, variantId, newQty);
  //   }
  // };
  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Cart is empty");
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Customer details required");
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error("Shipping address required");
      return;
    }

    try {
      const payload = {
        amount: totalPrice,
        //   cart_id: cartId,

      };
      
      const res = await boutiqueService.createPaymentOrder(payload);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      const { razorpay_order_id, key_id, razorpay_amount, razorpay_currency } = res.body;
      const options: RazorpayOrderOptions = {
        key: key_id,
        amount: razorpay_amount,
        currency: "INR",
        name: "Zarkha",
        description: "Boutique Order Payment",
        order_id : razorpay_order_id,

        handler: async (response) => {
          try {
            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cartItems?.map((item) => ({
                product_id: item.id,
                item_id: item.itemCodeId,
                quantity: item.quantity,
                selling_price: item.sellingPrice ?? 0,
              })),
              // total_amount: totalPrice,
              customer: {
                name: customerInfo.name,
                phone: customerInfo.phone,
                email: customerInfo.email,
              },

              shipping_address: {
                first_name: shippingAddress.name?.split(" ")[0] || "",
                last_name: shippingAddress.name?.split(" ")[1] || shippingAddress.name?.split(" ")[0],
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pin_code: shippingAddress.pincode,
                country: "India",
                phone: shippingAddress.phone,
              },

              customer_notes: "Bulk boutique order",
            };

            const verifyRes = await boutiqueService.verifyPayment(payload);

            if (verifyRes?.success) {
              const { order } = verifyRes.body;

              // setOrderDetail(order);
              // setOrderId(order?.order_id);
              // placeBulkOrder(order)
              toast.success(verifyRes.message || "Payment successful");
              // setShowSuccessModal(true);

              await fetchCart(); 
            } else {
              toast.error(verifyRes.message || "Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification error");
          }
        },

        prefill: {
          name: customerInfo.name,
          contact: customerInfo.phone,
        },

        theme: { color: "#ed8936" },

        modal: {
          ondismiss: () => toast.info("Payment cancelled"),
        },
      };

      // const options : RazorpayOrderOptions = new window.Razorpay({
      //   key: key_id,
      //   amount,
      //   currency: "INR",
      //   name: "Zarkha",
      //   description: "Boutique Order Payment",
      //   order_id,

      //   handler: async (response: any) => {
      //     const verifyRes = await boutiqueService.verifyPayment({
      //       razorpay_order_id: response.razorpay_order_id,
      //       razorpay_payment_id: response.razorpay_payment_id,
      //       razorpay_signature: response.razorpay_signature,
      //     });

      //     if (verifyRes.success) {
      //       toast.success("Payment successful");
      //       clearCart();
      //       onClose();
      //     } else {
      //       toast.error("Payment verification failed");
      //     }
      //   },

      //   prefill: {
      //     name: customerInfo.name,
      //     contact: customerInfo.phone,
      //   },

      //   theme: { color: "#ed8936" },
      // });
      const razorpay = new Razorpay(options);

      razorpay.open();

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Payment failed");
    }
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
            {/* Cart Items */}
            {items.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Products</Label>
                  <Button variant="ghost" 
                  size="sm" 
                  onClick={() => clearCart(true)} 
                  className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Clear All
                  </Button>
                </div>
                {cartItems?.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex gap-3">
                      <img src={item?.image || NO_IMAGE} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Buying: ₹{item.adminPrice}</p>
                            <p className="text-xs text-muted-foreground">Size: ₹{item.size}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id, item.itemCodeId, false)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 items-center">
                          {/* <Input 
                            type="number"
                            placeholder="Selling ₹"
                            value={item.sellingPrice || ""}
                            onChange={(e) => updateSellingPrice(item.id, parseFloat(e.target.value) || 0)}
                            className="h-8 w-24 text-sm"
                          /> */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.itemCodeId, item.quantity - 1)}
                              // onClick={() => handleQuantityChange(item.id, item.itemCodeId, 1)}

                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.itemCodeId, item.quantity + 1)}
                              // onClick={() => handleQuantityChange(item.id, item.itemCodeId, -1)}

                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {/* {item.sellingPrice > 0 && (
                          <p className="text-xs text-green-600">
                            Profit: ₹{((item.sellingPrice - item.adminPrice) * item.quantity).toLocaleString()}
                          </p>
                        )} */}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <>
                <Separator />

                {/* Customer Info */}
                <div className="space-y-3">
                  <Label className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> Customer Information
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
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
                      className="col-span-2"
                    />
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-3">
                  <Label className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Shipping Address
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
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
                      className="col-span-2"
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
                {/* <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="sameAsShippingCart"
                      checked={sameAsShipping}
                      onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                    />
                    <Label htmlFor="sameAsShippingCart" className="text-sm">Billing same as shipping</Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="grid grid-cols-2 gap-3">
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
                        className="col-span-2"
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

                <Separator /> */}

                {/* Order Summary */}
                <Card className="bg-muted">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Products:</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Quantity:</span>
                      <span className="font-medium">{getTotalItems()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span>Total Cost:</span>
                      <span className="font-semibold">₹{totalPrice ?? 0}</span>
                      {/* <span className="font-semibold">₹{getTotalCost().toLocaleString()}</span> */}
                    </div>
                    {/* <div className="flex justify-between text-sm text-green-600">
                      <span>Expected Revenue:</span>
                      <span className="font-semibold">₹{getExpectedRevenue().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-700 font-medium">
                      <span>Expected Profit:</span>
                      <span>₹{getExpectedProfit().toLocaleString()}</span>
                    </div> */}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
            <Button variant="brand" className="w-full" onClick={handlePlaceOrder}>
              Place Bulk Order
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BoutiqueCart;
