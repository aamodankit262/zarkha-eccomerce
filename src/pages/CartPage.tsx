import { useState } from "react";
import {
  Plus,
  Minus,
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";

const CartPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Black LIVA Straight Printed 2 Piece Set",
      size: "38",
      color: "Black",
      price: 1600,
      quantity: 1,
      image: "/black-liva.webp",
    },
    {
      id: 2,
      name: "Black LIVA Straight Printed 2 Piece Set",
      size: "38",
      color: "Black",
      price: 1600,
      quantity: 1,
      image: "/black-liva.webp",
    },
  ]);

  const availableCoupons = [
    {
      code: "Zar123",
      discount: 500,
      minPurchase: 4999,
      expiryDate: "30th April 2024 | 11:59 PM",
    },
    {
      code: "Zar456",
      discount: 500,
      minPurchase: 4999,
      expiryDate: "30th April 2024 | 11:59 PM",
    },
  ];

  const handleQuantityChange = (id, change) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 400;
  const deliveryCharges = 0;
  const totalAmount = subtotal - discount + deliveryCharges;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderOtherPages />

      {/* Cart Header with Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-0">Cart</h1>

            {/* Desktop Progress Steps */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <span className="font-medium text-orange-500">
                  Shopping Cart
                </span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <span className="text-gray-400">Payment And Delivery</span>
              </div>
              <div className="text-gray-400">→</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <span className="text-gray-400">Order Received</span>
              </div>
            </div>

            {/* Mobile Progress Steps */}
            <div className="flex lg:hidden justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <span className="text-sm font-medium text-orange-500">Cart</span>
              </div>
              <div className="text-gray-400 text-sm">→</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-sm text-gray-400">Payment</span>
              </div>
              <div className="text-gray-400 text-sm">→</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 text-gray-400 rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="text-sm text-gray-400">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Desktop Header Row */}
              <div className="hidden lg:block bg-[#FAF6F2] px-6 py-4 border-b">
                <div className="grid grid-cols-12 font-medium text-gray-700 text-sm">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Sub Total</div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 lg:px-6 lg:py-6">
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-12 items-center gap-4">
                      {/* Product */}
                      <div className="col-span-5 flex items-start gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.size}, Color: {item.color}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="font-semibold text-gray-900">
                          ₹{item.price}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden h-9 w-[88px]">
                          <div className="flex-1 flex items-center justify-center text-sm font-medium text-gray-900">
                            {item.quantity.toString().padStart(2, "0")}
                          </div>
                          <div className="flex flex-col border-l border-gray-400 h-full w-[34px]">
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs border-t border-gray-400"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-3 text-right font-bold text-lg">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-2">
                            Size: {item.size}, Color: {item.color}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-900">
                                ₹{item.price}
                              </span>
                              
                              {/* Mobile Quantity Control */}
                              <div className="flex items-center border border-gray-400 rounded overflow-hidden h-8">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <div className="px-3 py-1 text-sm font-medium text-gray-900 border-x border-gray-400">
                                  {item.quantity}
                                </div>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="font-bold text-lg text-right">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden lg:sticky lg:top-4">
              <div className="bg-[#FAF6F2] px-4 lg:px-6 py-3 lg:py-4 border-b">
                <h2 className="font-semibold text-gray-900">Price Details</h2>
              </div>

              <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm lg:text-base">
                    Price ({cartItems.length} items)
                  </span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm lg:text-base">Discount (AB1234)</span>
                    <button className="text-xs text-gray-500 underline">
                      Remove
                    </button>
                  </div>
                  <span className="text-green-600 font-medium">
                    - ₹{discount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm lg:text-base">Delivery Charges</span>
                  <span className="font-medium">₹{deliveryCharges}</span>
                </div>

                <div className="border-t pt-3 lg:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-base lg:text-lg">
                      Total Amount
                    </span>
                    <span className="font-semibold text-gray-900 text-base lg:text-lg">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-medium text-center text-sm lg:text-base"
                >
                  Proceed to Secure Checkout
                </button>

                {/* Coupon Section */}
                <div className="border-t pt-4 lg:pt-6 space-y-3 lg:space-y-4">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 lg:px-4 py-2 rounded text-sm font-medium">
                      Apply
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      6 Coupons Available
                    </span>
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Coupon →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Apply Coupon
              </h2>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 lg:p-6 space-y-4">
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 lg:px-4 py-2 rounded text-sm font-medium">
                  Apply
                </button>
              </div>

              <div className="space-y-3">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="border border-orange-200 rounded-lg p-3 lg:p-4 bg-orange-50"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCoupon === coupon.code}
                        onChange={() =>
                          setSelectedCoupon(
                            selectedCoupon === coupon.code ? "" : coupon.code
                          )
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                            {coupon.code}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Save ₹{coupon.discount}
                        </h3>
                        <p className="text-xs text-gray-600">
                          Rs. {coupon.discount} Off On Minimum Purchase Of Rs.{" "}
                          {coupon.minPurchase}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires On: {coupon.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm font-medium text-gray-700">
                  Maximum Savings
                </span>
                <span className="text-lg font-bold text-gray-900">₹ 500</span>
              </div>

              <button
                onClick={() => {
                  if (selectedCoupon) {
                    setCouponCode(selectedCoupon);
                  }
                  setShowCouponModal(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-medium"
              >
                Re-Try
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;