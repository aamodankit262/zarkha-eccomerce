import { NO_IMAGE } from "@/api/endpoints";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { useApi } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";
import { orderService } from "@/services/orderService";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import RateProductPage from "./RateProductPage";
// [
//   {
//     label: "Order Confirmed",
//     date: formatDate(orderDetails?.confirmed_at),
//     done: !!orderDetails?.confirmed_at,
//   },
//   {
//     label: "Shipped",
//     date: formatDate(orderDetails?.shipped_at),
//     done: !!orderDetails?.shipped_at,
//   },
//   {
//     label: "Out For Delivery",
//     date: formatDate(orderDetails?.out_for_delivery_at, "Expected soon"),
//     done: !!orderDetails?.out_for_delivery_at,
//   },
//   {
//     label: "Delivered",
//     date: formatDate(orderDetails?.delivered_at),
//     done: !!orderDetails?.delivered_at,
//   },
// ]
const TrackOrderPage = ({ onBack, orderId }) => {
  const { data: orderResp, request: fetchOrderDetails, loading: orderderLoading } = useApi(orderService.getOrderDetails);
  const { userDetails } = useAuthStore();
  const [selectedProductForRating, setSelectedProductForRating] = useState<any>(null);
  const [currentView, setCurrentView] = useState<"dashboard" | "add-address" | "track-order" | "rate-product">(
    "dashboard"
  );
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    };
  }, [orderId]);
  const handleRateProduct = (product) => {
    setSelectedProductForRating(product);
    setCurrentView("rate-product");

  };
  console.log("Order Details:", orderResp);
  const orderDetails = orderResp?.body || {};
  const getShippingAddress = orderDetails.shipping_address || {};
  const getItems = orderDetails.items || [];
  const getTimestatms = orderDetails?.tracking_timeline || [];
  const resetFormAndView = () => {
    setCurrentView("track-order");
    setSelectedProductForRating(null);

  };
  if (orderderLoading) return <p>Loading order details...</p>;
  if (currentView === "rate-product") {
    return <RateProductPage onBack={resetFormAndView} productRating={selectedProductForRating} orderId={orderId} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Address */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">Delivery Address</h3>
            <p className="font-medium mb-2">{getShippingAddress?.first_name} {getShippingAddress?.last_name}</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {/* Shop no 9-10, Ram mandir, Govind Marg, near DISCOUNT Fashion Hub,
              opp. Dashera Maidan, Raja Park, Jaipur, Rajasthan 302004 */}
              {getShippingAddress?.address}, {getShippingAddress?.city}, {getShippingAddress?.state} - {getShippingAddress?.pin_code}
            </p>
            <p className="text-sm text-gray-600 mt-4">+91 {userDetails.phone}</p>
          </div>

          {/* Order Info */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status</span>
                <span className="font-medium">{orderDetails?.order_status || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking No.</span>
                <span className="font-medium">{orderDetails?.tracking_number || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ship By</span>
                <span className="font-medium">{orderDetails?.courier_name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{orderId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">{new Date(orderDetails?.ordered_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-green-600">{orderDetails?.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{orderDetails?.payment_method || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Charge</span>
                <span className="font-medium">₹ {orderDetails?.shipping_charge || "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">₹ {orderDetails?.total_amount || "0"}</span>
              </div>
            </div>

          </div>

          {/* More Actions */}
          {/* <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">More Actions</h3>
            <button className="w-full flex items-center justify-center gap-3 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50">
              <Download className="h-5 w-5" />
              Download Invoice
            </button>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-6">Product Details</h3>
            <div className="space-y-6">
              {getItems?.map((i) => (
                <div
                  key={i._id}
                  className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0"
                >
                  {/* Product Image */}
                  <img
                    src={i.image || NO_IMAGE}
                    alt={i.product_title || "Product Image"}
                    className="w-20 h-24 object-cover rounded"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-medium mb-1">
                      {i.product_title || "Product Title"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount Paid: ₹ {i.final_price || i.discount_price}
                    </p>
                    <p className="text-sm text-gray-600">QTY: {i.quantity}</p>
                  </div>
                  <div>
                    {orderDetails.order_status === "delivered" && (
                      <button
                        onClick={() => handleRateProduct(i)}
                        className="sm:ml-auto px-4 py-2 text-sm bg-[#FF8A18] text-white rounded-md hover:bg-orange-600 transition"
                      >
                        Rate Product
                      </button>
                    )}
                  </div>

                  {/* Rate Button */}

                </div>
              ))}
            </div>

          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-6">Track Order</h3>
            <div className="bg-[#FAF6F2] rounded-md p-4 mb-6">
              <p>
                <strong>Tracking No.:</strong> {orderDetails?.tracking_number || "N/A"}
              </p>
              <p>
                <strong>Ship By:</strong> {orderDetails?.courier_name || "N/A"}
              </p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300" />
              {
                getTimestatms?.map((step, i) => (
                  <div key={step.key || i} className="relative mb-8 last:mb-0">
                    <div
                      className={`absolute -left-9 w-5 h-5 rounded-full border-4 border-white ${step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                        }`}
                    />
                    <p className={`font-medium ${step.status === "completed" ? "text-gray-900" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                    <p className={`text-sm ${step.status === "completed" ? "text-gray-600" : "text-gray-400"}`}>
                      {step.formatted}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TrackOrderPage