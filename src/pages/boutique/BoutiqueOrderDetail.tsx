import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, 
  Phone, Mail, User, Calendar, IndianRupee, FileText
} from "lucide-react";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { logger } from "@/helper/logger";

const BoutiqueOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, isLoggedIn } = useBoutique();
  
  if (!isLoggedIn) {
    navigate('/boutique/login');
    return null;
  }
logger.log(orders,'orders')
  const order = orders.find(o => o.id === orderId);

  // if (!order) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <Card className="max-w-md w-full mx-4">
  //         <CardContent className="p-6 text-center">
  //           <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
  //           <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
  //           <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
  //           <Button onClick={() => navigate('/boutique/dashboard')}>
  //             Back to Dashboard
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-blue-500" />;
      case 'confirmed': return <Package className="h-5 w-5 text-purple-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const totalCost = order?.buyingPrice * order?.quantity;
  const totalRevenue = order?.sellingPrice * order?.quantity;
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/boutique/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-warm-brown">Order Details</h1>
            <p className="text-sm text-muted-foreground">{order?.id ?? "0"}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Order Status */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(order?.status)}
                <div>
                  <p className="font-semibold text-lg capitalize">{order?.status}</p>
                  <p className="text-sm text-muted-foreground">
                    {order?.status === 'delivered' ? 'Order delivered successfully' :
                     order?.status === 'shipped' ? 'Order is on the way' :
                     order?.status === 'confirmed' ? 'Order confirmed by admin' :
                     'Awaiting confirmation'}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(order?.status)}>
                {order?.status.charAt(0).toUpperCase() + order?.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-muted-foreground">{order?.orderDate}</p>
                </div>
              </div>
              {order?.status !== 'pending' && (
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Confirmed</p>
                    <p className="text-xs text-muted-foreground">{order?.orderDate}</p>
                  </div>
                </div>
              )}
              {(order?.status === 'shipped' || order?.status === 'delivered') && (
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Shipped</p>
                    <p className="text-xs text-muted-foreground">{order?.orderDate}</p>
                  </div>
                </div>
              )}
              {order?.status === 'delivered' && (
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Delivered</p>
                    <p className="text-xs text-muted-foreground">{order?.orderDate}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" /> Product Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="flex gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-warm-brown mb-2">{order?.productName}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order?.quantity} pcs</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Buying Price</p>
                    <p className="font-medium">₹{order?.buyingPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Selling Price</p>
                    <p className="font-medium text-brand-orange">₹{order?.sellingPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit/Piece</p>
                    <p className="font-medium text-green-600">₹{order?.sellingPrice - order?.buyingPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        {order?.customerInfo && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{order?.customerInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order?.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order?.customerInfo.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shipping & Billing Address */}
        {order?.shippingAddress && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">{order?.shippingAddress.name}</p>
                    <p>{order?.shippingAddress.address}</p>
                    <p>{order?.shippingAddress.city}, {order?.shippingAddress.state} - {order?.shippingAddress.pincode}</p>
                    <p className="mt-1">Phone: {order?.shippingAddress.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order?.billingAddress && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">{order?.billingAddress.name}</p>
                      <p>{order?.billingAddress.address}</p>
                      <p>{order?.billingAddress.city}, {order?.billingAddress.state} - {order?.billingAddress.pincode}</p>
                      <p className="mt-1">Phone: {order?.billingAddress.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4" /> Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Buying Price ({order?.quantity} x ₹{order?.buyingPrice})</span>
                <span>₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Selling Revenue ({order?.quantity} x ₹{order?.sellingPrice})</span>
                <span>₹{totalRevenue.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-semibold">₹{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Expected Profit</span>
                <span className="font-semibold">₹{totalProfit.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory & Stock Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" /> Inventory Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Ordered Qty</p>
                <p className="text-lg font-bold">{order?.quantity} pcs</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Unit Cost</p>
                <p className="text-lg font-bold">₹{order?.buyingPrice}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Total Investment</p>
                <p className="text-lg font-bold text-brand-orange">₹{totalCost.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Stock Status</p>
                <p className={`text-lg font-bold ${order?.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order?.status === 'delivered' ? 'In Stock' : 'In Transit'}
                </p>
              </div>
            </div>
            {order?.isBulkOrder && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Bulk Order</p>
                <p className="text-xs text-blue-600">This is a bulk stock purchase of {order?.quantity} units for inventory.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/boutique/dashboard')}>
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueOrderDetail;
