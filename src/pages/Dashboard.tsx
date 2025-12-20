"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  Package,
  MapPin,
  Shield,
  LogOut,
  ArrowLeft,
  Download,
  Star,
  Upload,
  User,
} from "lucide-react";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { ProductCard } from "@/components/common/ProductCard";
import { productsData } from "@/data/product";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

// Shared Sidebar Component
const SharedSidebar = ({ activeTab, setActiveTab, sidebarItems }) => {
  const navigate = useNavigate();
  const{logout} = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return(
  <div className="w-72 bg-white border-r">
    <div className="p-5 border-b">
      <p className="text-sm text-gray-600">Hello, Dear</p>
      <p className="text-sm font-medium text-gray-900">+91 8888899999</p>
    </div>
    <div>
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-6 py-4 border-b text-sm ${
            activeTab === item.id
              ? "bg-orange-500 text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </button>
      ))}
      <button 
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-6 py-4 text-sm text-gray-700 hover:bg-gray-50">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  </div>
);
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductForRating, setSelectedProductForRating] =
    useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editingAddress, setEditingAddress] = useState(null);

  // Form states for add/edit address
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    pinCode: "",
    country: "",
    state: "",
    city: "",
    addressType: "Home",
    isDefault: false,
  });

  // Sample data
  const orders = [
    {
      id: "120011",
      date: "12-Nov-2024, 12:15Pm",
      product: {
        name: "Black LIVA Straight Printed 2 Piece Set",
        image: "/product-3.jpg",
        quantity: 2,
        amount: 1900,
      },
      trackingNo: "101201201110010",
      status: "processing",
    },
    {
      id: "120011",
      date: "12-Nov-2024, 12:15Pm",
      product: {
        name: "Black LIVA Straight Printed 2 Piece Set",
        image: "/product-1.jpg",
        quantity: 2,
        amount: 1900,
      },
      trackingNo: "101201201110010",
      status: "delivered",
      deliveredDate: "12-10-2025",
    },
    {
      id: "120011",
      date: "12-Nov-2024, 12:15Pm",
      product: {
        name: "Black LIVA Straight Printed 2 Piece Set",
        image: "/product-2.jpg",
        quantity: 2,
        amount: 1900,
      },
      trackingNo: "101201201110010",
      status: "processing",
    },
  ];

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      firstName: "Ram",
      lastName: "Kumar",
      address: "Flat Govind Marg Jaipur - 302004",
      relation: "Relative",
      mobile: "9417941436",
      pinCode: "302004",
      country: "India",
      state: "Rajasthan",
      city: "Jaipur",
      addressType: "Home",
      isDefault: true,
    },
  ]);

  const sidebarItems = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "address", label: "Address Book", icon: MapPin },
    { id: "favorites", label: "My Favorite", icon: Heart },
    { id: "privacy", label: "Privacy And Policy", icon: Shield },
  ];

  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentView("track-order");
  };

  const handleBackToDashboard = () => {
    setSelectedOrderId(null);
    setSelectedProductForRating(null);
    setEditingAddress(null);
    setCurrentView("dashboard");
    // Reset form
    setAddressForm({
      firstName: "",
      lastName: "",
      address: "",
      pinCode: "",
      country: "",
      state: "",
      city: "",
      addressType: "Home",
      isDefault: false,
    });
  };

  const handleRateProduct = (product) => {
    setSelectedProductForRating(product);
    setCurrentView("rate-product");
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      pinCode: address.pinCode,
      country: address.country,
      state: address.state,
      city: address.city,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });
    setCurrentView("add-address");
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? {
                ...addressForm,
                id: editingAddress.id,
                mobile: editingAddress.mobile,
                relation: editingAddress.relation,
              }
            : addr
        )
      );
    } else {
      // Add new address
      const newAddress = {
        ...addressForm,
        id: Date.now(),
        mobile: "9417941436", // Default mobile
        relation: "Self",
      };
      setAddresses((prev) => [...prev, newAddress]);
    }
    handleBackToDashboard();
  };

  const handleRemoveAddress = (addressId) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Rate Product Page
  const RateProductPage = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="flex justify-center">
        <div className="w-[80%] bg-white flex">
          <SharedSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarItems={sidebarItems}
          />

          <div className="flex-1 p-6">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="bg-white border rounded-lg p-6">
              <div className="flex gap-4 mb-6">
                <img
                  src={selectedProductForRating?.image || "/product-image.png"}
                  className="w-20 h-20 rounded object-cover"
                  alt="Product"
                />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Black LIVA Straight Printed 2 Piece Set
                  </h3>
                  <p className="text-sm text-gray-600">Amount Paid: ₹ 1900</p>
                  <p className="text-sm text-gray-600">Total QTY : 02</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rate US</h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Add Product Photos (Max 5 Images)
                </h4>
                <div className="flex gap-4">
                  <img
                    src="/rate-us.webp"
                    className="w-24 h-24 rounded border object-cover"
                    alt="Product photo"
                  />
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Upload className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Write Your Review Here
                </h4>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Enter Write Your Review Here"
                  className="w-full h-32 p-3 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-orange-500"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  300 Characters max
                </p>
              </div>

              <div className="flex justify-end">
                <button className="w-[200px] bg-[#FF8A18] text-white py-3 rounded-md font-medium">
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add/Edit Address Page
  const AddAddressPage = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="flex justify-center">
        <div className="w-[80%] bg-white flex">
          <SharedSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarItems={sidebarItems}
          />

          <div className="flex-1 p-6">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              {editingAddress ? "Edit Address" : "Add Address"}
            </button>

            <div className="bg-white max-w-2xl">
              <h3 className="font-semibold text-gray-900 mb-6 text-lg">
                Deliver To
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <input
                    placeholder="Enter First Name"
                    value={addressForm.firstName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    placeholder="Enter Last Name"
                    value={addressForm.lastName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="mb-4 relative">
                <input
                  placeholder="Enter Address"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <input
                    placeholder="Enter Pin Code"
                    value={addressForm.pinCode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pinCode: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-3 py-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <select
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-500 text-sm"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <select
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-500 text-sm"
                  >
                    <option value="">Select State</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                <div>
                  <select
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-500 text-sm"
                  >
                    <option value="">Select City</option>
                    <option value="Jaipur">Jaipur</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Save This Address As (Optional)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setAddressForm({ ...addressForm, addressType: "Home" })
                      }
                      className={`px-4 py-2 rounded text-sm ${
                        addressForm.addressType === "Home"
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 text-gray-700"
                      }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() =>
                        setAddressForm({
                          ...addressForm,
                          addressType: "Office",
                        })
                      }
                      className={`px-4 py-2 rounded text-sm ${
                        addressForm.addressType === "Office"
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 text-gray-700"
                      }`}
                    >
                      Office
                    </button>
                    <button
                      onClick={() =>
                        setAddressForm({ ...addressForm, addressType: "Other" })
                      }
                      className={`px-4 py-2 rounded text-sm ${
                        addressForm.addressType === "Other"
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300 text-gray-700"
                      }`}
                    >
                      Other
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    Save As Default
                  </p>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          isDefault: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Yes</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveAddress}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Track Order Page
  const TrackOrderPage = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      {/* Breadcrumb */}
      <div className="w-[80%] mx-auto bg-white ">
        <div className="flex ">
          <div className="px-6 py-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Account › My Orders › Track Order › Id123456
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className=" px-6">
            {/* Order Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Delivery Address */}
              <div className="bg-[#FAF6F2] border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Delivery Address
                </h3>
                <p className="text-sm text-gray-800 font-medium mb-2">
                  Name Customer Here Show
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Shop no 9-10, Ram mandir, Govind Marg, near DISCOUNT Fashion
                  Hub, opp. Dashera Maidan, Raja Park, Jaipur, Rajasthan 302004
                </p>
                <p className="font-medium text-gray-800 text-sm mb-1">
                  Phone Number
                </p>
                <p className="text-sm text-gray-600">+91 8912345678</p>
              </div>

              {/* Order Info */}
              <div className="bg-[#FAF6F2]  border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking No. :</span>
                    <span className="font-medium text-gray-900">12001220</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ship By :</span>
                    <span className="font-medium text-gray-900">DHL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID :</span>
                    <span className="font-medium text-gray-900">12001220</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date :</span>
                    <span className="font-medium text-gray-900">
                      12-Nov-2024, 12:10 Pm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment :</span>
                    <span className="font-medium text-gray-900">Done</span>
                  </div>
                </div>
              </div>

              {/* More Actions */}
              <div className="bg-[#FAF6F2]  border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  More Actions
                </h3>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <Download className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Download Invoice
                  </span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 border border-orange-500 text-orange-500 rounded py-2 text-sm hover:bg-orange-50">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>

            {/* Products + Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
              {/* Products */}
              <div className="bg-white border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Products Details
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <img
                        src="/product-1.jpg"
                        className="w-16 h-20 rounded object-cover"
                        alt="Product"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Black LIVA Straight Printed 2 Piece Set
                        </p>
                        <p className="text-xs text-gray-600">
                          Amount Paid: ₹ 1900
                        </p>
                        <p className="text-xs text-gray-600">Total QTY : 02</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track Order */}
              <div className="bg-white border rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Track Order
                </h3>
                <div className="bg-[#FAF6F2] py-1 px-3 text-base rounded-md mb-5">
                  <p>
                    Tracking No.: <span className="font-medium">12001220</span>
                  </p>
                  <p>
                    Ship By: <span className="font-medium">DHL</span>
                  </p>
                </div>

                {/* Timeline */}
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />

                  {[
                    {
                      label: "Order Confirmed",
                      date: "Fri, 3rd Nov 2024, 12:30PM",
                      done: true,
                    },
                    {
                      label: "Shipped",
                      date: "Fri, 3rd Nov 2024, 12:30PM",
                      done: true,
                    },
                    { label: "Out For Delivery", date: "-------", done: false },
                    { label: "Delivery", date: "-------", done: false },
                  ].map((step, idx) => (
                    <div key={idx} className="relative mb-8 last:mb-0">
                      <div
                        className={`absolute -left-6 w-4 h-4 rounded-full border-2 border-white shadow ${
                          step.done ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            step.done ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p
                          className={`text-xs ${
                            step.done ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // renderTabContent function to handle all tab views
  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="flex-1 p-6">
            <div className="bg-white mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">All Orders</h2>
                <p className="text-sm text-gray-600">From Anytime</p>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search In Order"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((o, index) => (
                <div
                  key={`${o.id}-${index}`}
                  className="bg-white border-[2px] border-[#D2CABD] rounded-md overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-5 border-b text-sm text-gray-700">
                    <span className="bg-[#F5F5F5] py-2 px-6 font-semibold rounded-md">
                      Order ID: {o.id}
                    </span>
                    <span className="text-black text-base">
                      Order Placed: {o.date}
                    </span>
                  </div>
                  <div className="p-5 flex gap-4">
                    <img
                      src={o.product.image || "/placeholder.svg"}
                      className="w-20 h-20 rounded object-cover"
                      alt="Product"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm mb-2">
                        {o.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Amount Paid: ₹ {o.product.amount}
                      </p>
                      <p className="text-xs text-gray-600">
                        Total QTY :{" "}
                        {o.product.quantity.toString().padStart(2, "0")}
                      </p>
                      {o.deliveredDate && (
                        <p className="text-xs text-gray-600">
                          Delivered : {o.deliveredDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-col border rounded-md gap-2 px-4 py-2">
                        <p className="text-sm text-gray-600">
                          Tracking No. {o.trackingNo}
                        </p>

                        {o.status === "delivered" && (
                          <p className="text-xs text-gray-500">
                            Delivered : {o.deliveredDate}
                          </p>
                        )}

                        {/* Hide Track Order if this is 2nd card (index === 1) */}
                        {index !== 1 && (
                          <p
                            onClick={() => handleTrackOrder(o.id)}
                            className="inline-block text-green-600 text-sm font-semibold cursor-pointer border-b border-green-600 w-fit"
                          >
                            Track Order
                          </p>
                        )}
                      </div>

                      {/* Right-align Rate Us */}
                      {o.status === "delivered" && (
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() => handleRateProduct(o.product)}
                            className="px-10 py-[6px] bg-[#FF8A18] text-white rounded-xl text-base"
                          >
                            Rate Us
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "address":
        return (
          <div className="flex-1 p-6">
            <div className="bg-white  rounded  mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">My Address Book</h2>
              <button
                onClick={() => setCurrentView("add-address")}
                className="bg-transparent border-orange-500 border px-4 py-2 rounded-xl text-sm font-medium"
              >
                + Add New Address
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white border rounded-lg p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm">
                        📍
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {address.firstName} {address.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {address.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          Relation: {address.relation}
                        </p>
                        <p className="text-sm text-gray-600">
                          Mobile: {address.mobile}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleRemoveAddress(address.id)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm bg-[#E0DDD7]"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="px-8 py-2 bg-[#FF8A18] hover:bg-orange-600 text-white rounded-lg text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "favorites":
        return (
          <div className="flex-1 p-6">
            <div className="bg-white rounded mb-5">
              <h2 className="font-semibold text-gray-900">My Favorite</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productsData.map((product) => (
                <ProductCard key={product.id} product={product} />               
              ))}
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="flex-1 p-6">
            <div className="bg-white rounded">
              <h2 className="font-semibold text-gray-900 mb-6">
                Privacy And Policy
              </h2>
              <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                <p>
                  Lorem Ipsum Is Simply Dummy Text Of The Printing And
                  Typesetting Industry. Lorem Ipsum Has Been The Industry's
                  Standard Dummy Text Ever Since The 1500s, When An Unknown
                  Printer Took A Galley Of Type And Scrambled It To Make A Type
                  Specimen Book. It Has Survived Not Only Five Centuries, But
                  Also The Leap Into Electronic Typesetting, Remaining
                  Essentially Unchanged. It Was Popularised In The 1960s With
                  The Release Of Letraset Sheets Containing Lorem Ipsum
                  Passages, And More Recently With Desktop Publishing Software
                  Like Aldus PageMaker Including Versions Of Lorem Ipsum
                </p>

                <div className="bg-orange-50 p-4 rounded">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And
                    Typesetting Industry. Lorem
                  </h3>
                  <p>
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And
                    Typesetting Industry. Lorem Ipsum Has Been The Industry's
                    Standard Dummy Text Ever Since The 1500s, When An Unknown
                    Printer Took A Galley Of Type And Scrambled It To Make A
                    Type Specimen Book. It Has Survived Not Only Five Centuries,
                    But Also The Leap Into Electronic Typesetting, Remaining
                    Essentially Unchanged. It Was Popularised In The 1960s With
                    The Release Of Letraset Sheets Containing Lorem Ipsum
                    Passages, And More Recently With Desktop Publishing Software
                    Like Aldus PageMaker Including Versions Of Lorem Ipsum
                  </p>
                </div>

                <p>
                  Lorem Ipsum Is Simply Dummy Text Of The Printing And
                  Typesetting Industry. Lorem Ipsum Has Been The Industry's
                  Standard Dummy Text Ever Since The 1500s, When An Unknown
                  Printer Took A Galley Of Type And Scrambled It To Make A Type
                  Specimen Book. It Has Survived Not Only Five Centuries, But
                  Also The Leap Into Electronic Typesetting, Remaining
                  Essentially Unchanged. It Was Popularised In The 1960s With
                  The Release Of Letraset Sheets Containing Lorem Ipsum
                  Passages, And More Recently With Desktop Publishing Software
                  Like Aldus PageMaker Including Versions Of Lorem Ipsum
                </p>

                <p>
                  Lorem Ipsum Is Simply Dummy Text Of The Printing And
                  Typesetting Industry. Lorem Ipsum Has Been The Industry's
                  Standard Dummy Text Ever Since The 1500s, When An Unknown
                  Printer Took A Galley Of Type And Scrambled It To Make A Type
                  Specimen Book. It Has Survived Not Only Five Centuries, But
                  Also The Leap Into Electronic Typesetting, Remaining
                  Essentially Unchanged. It Was Popularised In The 1960s With
                  The Release Of Letraset Sheets Containing Lorem Ipsum
                  Passages, And More Recently With Desktop Publishing Software
                  Like Aldus PageMaker Including Versions Of Lorem Ipsum
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Main Dashboard Page
  const MainDashboard = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="flex justify-center">
        <div className="w-[80%] bg-white flex">
          <SharedSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarItems={sidebarItems}
          />
          {renderTabContent()}
        </div>
      </div>
    </div>
  );

  if (currentView === "track-order") return <TrackOrderPage />;
  if (currentView === "add-address") return <AddAddressPage />;
  if (currentView === "rate-product") return <RateProductPage />;
  return <MainDashboard />;
};

export default Dashboard;
