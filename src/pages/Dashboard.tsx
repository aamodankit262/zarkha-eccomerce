import { useEffect, useState } from "react";
import {
  Search,
  Heart,
  Package,
  MapPin,
  Shield,
  LogOut,
  ArrowLeft,
  Download,
  Star,
  Upload,
  Menu,
  X,
  Check,
  ShoppingBag,
} from "lucide-react";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { ProductCard } from "@/components/common/ProductCard";
import { productsData } from "@/data/product";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import {
  createAddress,
  deleteAddress,
  getAddressList,
  getCityList,
  getStateList,
  updateAddress,
} from "@/services/address.service";
// import { useCms } from "@/hooks/useCms";
// import { CMS_TYPES } from "@/services/cms.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SavedAddress } from "@/types";
import TrackOrderPage from "./dashboard/TrackOrderPage";
import RateProductPage from "./dashboard/RateProductPage";
import { orderService } from "@/services/orderService";
import { NO_IMAGE } from "@/api/endpoints";
import { useWishlistStore } from "@/store/wishlistStore";

type AddressType = "Home" | "Office" | "Other";

interface AddressForm {
  firstName: string;
  lastName: string;
  address: string;
  pinCode: string;
  email: string;
  country: string;
  state: string; // stateId
  city: string; // cityId
  addressType: AddressType;
  isDefault: boolean;
}

// Shared Sidebar Component
const SharedSidebar = ({
  activeTab,
  setActiveTab,
  sidebarItems,
  isOpen,
  onClose,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarItems: Array<{ id: string; label: string; icon: any }>;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { logout, userDetails } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-5 border-b lg:hidden">
          <p className="font-medium">My Account</p>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 border-b">
          <p className="text-sm text-gray-600">Hello, {userDetails?.name || "Dear"}</p>
          <p className="text-sm font-medium text-gray-900">+91 {userDetails?.phone}</p>
        </div>

        <div>
          {sidebarItems?.map((item) => (
            <button
              key={item?.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-6 py-4 border-b text-sm ${activeTab === item.id
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
            className="w-full flex items-center gap-3 px-6 py-4 text-sm text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

// Extracted: Add / Edit Address Page
const AddAddressPage = ({
  onBack,
  addressForm,
  setAddressForm,
  states,
  cities,
  editingAddress,
  onSave,
}: {
  onBack: () => void;
  addressForm: AddressForm;
  setAddressForm: React.Dispatch<React.SetStateAction<AddressForm>>;
  states: any[];
  cities: any[];
  editingAddress: SavedAddress | null;
  onSave: () => Promise<void>;
}) => {
  const handleInputChange = <K extends keyof AddressForm>(
    key: K,
    value: AddressForm[K]
  ) => {
    setAddressForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {editingAddress ? "Edit Address" : "Add New Address"}
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-8">Deliver To</h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name *"
                value={addressForm.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
              <Input
                placeholder="Last Name *"
                value={addressForm.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Full Address *"
                value={addressForm.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email *"
                value={addressForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Pin Code *"
                value={addressForm.pinCode}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    handleInputChange("pinCode", e.target.value);
                  }
                }}
              />
              <Select value={addressForm.country} onValueChange={(v) => handleInputChange("country", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Select value={addressForm.state} onValueChange={(v) => handleInputChange("state", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="State *" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={addressForm.city}
                onValueChange={(v) => handleInputChange("city", v)}
                disabled={!addressForm.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="City *" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city._id} value={city._id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Address Type</p>
              <div className="flex gap-2">
                {(["Home", "Office", "Other"] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={addressForm.addressType === type ? "default" : "outline"}
                    onClick={() => handleInputChange("addressType", type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={addressForm.isDefault}
                onCheckedChange={(v) => handleInputChange("isDefault", v === true)}
              />
              <span className="text-sm">Set as default</span>
            </div>

            <div className="flex justify-end">
              <Button onClick={onSave} className="px-8 py-3">
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const sidebarItems = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "address", label: "Address Book", icon: MapPin },
  { id: "favorites", label: "My Favorite", icon: Heart },
];
// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentView, setCurrentView] = useState<"dashboard" | "add-address" | "track-order" | "rate-product">(
    "dashboard"
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedProductForRating, setSelectedProductForRating] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const { token, userDetails } = useAuthStore();
  const { data: addressList, request: fetchAddressList } = useApi(getAddressList);
  // const { data: cmsData } = useCms(CMS_TYPES.PRIVACY);

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  const [addressForm, setAddressForm] = useState<AddressForm>({
    firstName: "",
    lastName: "",
    address: "",
    pinCode: "",
    email: "",
    country: "India",
    state: "",
    city: "",
    addressType: "Home",
    isDefault: false,
  });
  // const { data: orderList, request: fettchOrders, loading: orderLoading } = useApi(orderService.getOrderList);
  // const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  // const wishlistItems = useWishlistStore((s) => s.items);
  const {
    items,
    loading,
    page: wishpage,
    totalPages: wishtotalPages,
    fetchWishlist,
    setPage: setWishPage,
  } = useWishlistStore();
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     setPage(1); // reset page on new search
  //     fetchOrders();
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [searchQuery]);

  useEffect(() => {
    if (!token) return;
    getStateList().then((res) => setStates(res?.data || []));
  }, [token]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!addressForm.state || !token) {
      setCities([]);
      return;
    }
    getCityList(addressForm.state).then((res) => setCities(res?.data || []));
  }, [addressForm.state, token]);

  // Fetch addresses
  useEffect(() => {
    if (activeTab === "address" && token) {
      fetchAddressList();
    }
  }, [activeTab, token]);
  useEffect(() => {
    if (activeTab === "orders") {
      // fettchOrders({ page: 1, limit: 10 });
      fetchOrders();
    }
  }, [activeTab, page]);
  useEffect(() => {
    if (activeTab === "favorites") {
      fetchWishlist();
    }
  }, [activeTab]);

  // const orders = orderList?.body || [];
  // Update local addresses
  useEffect(() => {
    if (addressList?.body) {
      setAddresses(addressList.body);
    }
  }, [addressList]);
  const fetchOrders = async () => {
    try {
      setOrderLoading(true);

      const res = await orderService.getOrderList({
        page,
        limit,
        search: searchQuery,
      });
      console.log(res, "order list response...");
      const data: any = res;
      setOrders(data.body || []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
    } finally {
      setOrderLoading(false);
    }
  };

  const resetFormAndView = () => {
    setCurrentView("dashboard");
    setEditingAddress(null);
    setSelectedOrderId(null);
    setSelectedProductForRating(null);
    setAddressForm({
      firstName: "",
      lastName: "",
      address: "",
      pinCode: "",
      email: "",
      country: "India",
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
  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.first_name,
      lastName: address.last_name,
      address: address.address,
      pinCode: address.pin_code,
      email: address.email,
      country: address.country ?? "India",
      state: address.stateId._id || "",
      city: address.cityId._id || "",
      addressType: (address.addressType as AddressType) ?? "Home",
      isDefault: address.is_default ?? false,
    });
    setCurrentView("add-address");
  };

  const handleSaveAddress = async () => {
    const { firstName, lastName, address, pinCode, state, city, email } = addressForm;

    if (!firstName || !lastName || !address || !pinCode || !state || !city || !email) {
      toast.info("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        user_id: userDetails.id,
        first_name: firstName,
        last_name: lastName,
        address,
        pin_code: pinCode,
        email: email,
        country: addressForm.country,
        stateId: state,
        cityId: city,
        addressType: addressForm.addressType,
        is_default: addressForm.isDefault,
      };

      if (editingAddress) {
        await updateAddress({ ...payload, id: editingAddress._id });
        toast.success("Address updated successfully.");
      } else {
        await createAddress(payload);
        toast.success("New address saved.");
      }

      await fetchAddressList();
      resetFormAndView();
    } catch (error) {
      toast.error("Failed to save address.");
      console.error(error);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      toast.success("Address removed");
      fetchAddressList();
    } catch {
      toast.error("Failed to delete address");
    }
  };


  const handleTrackOrder = (orderId) => {
    console.log(orderId, "orderId...");
    setSelectedOrderId(orderId);
    setCurrentView("track-order");
  };
  // Render logic for main dashboard tabs (unchanged except minor cleanups)
  const renderTabContent = () => {

    switch (activeTab) {
      case "orders":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold">All Orders</h2>
                <p className="text-sm text-gray-600">From anytime</p>
              </div>
              {/* <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div> */}
            </div>
            {/* Loading */}
            {orderLoading && <p className="text-center">Loading orders...</p>}

            {/* Empty */}
            {!orderLoading && orders.length === 0 && (
              <p className="text-center text-gray-500">No orders found</p>
            )}
            <div className="space-y-6">
              {orders?.map((order, idx) => (
                <div
                  key={order._id}
                  className="bg-white border-2 border-[#D2CABD] rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <span className="bg-[#F5F5F5] px-6 py-2 rounded-md font-semibold">
                      Order ID: {order.order_id}
                    </span>
                    <span className="text-sm">Placed on {dayjs(order.ordered_at).format("DD/MM/YYYY")}</span>
                    {/* <span className="text-sm">Placed on {new Date(order.ordered_at).toLocaleDateString()}</span> */}
                  </div>

                  <div className="p-6 flex flex-col lg:flex-row gap-6">
                    <img
                      src={order.first_item.image || NO_IMAGE}
                      alt={order.first_item.product_title}
                      className="w-24 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium mb-3">{order.first_item.product_title}</h4>
                      <p className="text-sm text-gray-600">Amount: ₹{order.total_amount}</p>
                      <p className="text-sm text-gray-600">Quantity: {order.items_count}</p>
                      <p
                        className={`mt-2 text-sm font-medium ${order.order_status === "pending"
                          ? "text-orange-600"
                          : "text-green-600"
                          }`}
                      >
                        Order Status: {order.order_status}
                      </p>

                      <p className="text-sm text-gray-600">
                        Payment: {order.payment_method.toUpperCase()} (
                        {order.payment_status})
                      </p>
                      {order?.deliveredDate && (
                        <p className="text-sm text-green-600 mt-2">
                          Delivered on {order?.deliveredDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <p className="text-gray-600">Tracking No.</p>
                        <p className="font-medium">{order?.trackingNo || "N/A"}</p>
                        {/* {idx !== 1 && ( */}
                        <button
                          onClick={() => handleTrackOrder(order?.order_id)}
                          className="text-green-600 font-medium mt-2 block hover:underline"
                        >
                          Track Order →
                        </button>
                        {/* )} */}
                      </div>

                      {order.order_status === "delivered" && (
                        <button
                          onClick={() => handleRateProduct(order?.first_item)}
                          className="w-full bg-[#FF8A18] text-white py-3 rounded-lg font-medium hover:bg-orange-600"
                        >
                          Rate Product
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        );
      case "address":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">My Address Book</h2>
              <button
                onClick={() => setCurrentView("add-address")}
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50"
              >
                + Add New Address
              </button>
            </div>
            {addresses.length === 0 && (
              <p className="text-center text-gray-500">No Address found</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses?.map((addr) => (
                <div key={addr._id} className="bg-white border rounded-xl p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                      📍
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {addr.first_name} {addr.last_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                      <p className="text-sm text-gray-600">
                        {addr.city}, {addr.state}, {addr.country} - {addr.pin_code}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Mobile: +91 {userDetails?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => handleRemoveAddress(addr._id)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="px-8 py-2 bg-[#FF8A18] text-white rounded-lg text-sm hover:bg-orange-600"
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
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-semibold mb-8">My Favorites</h2>
            {productsData(items)?.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding items you love to your wishlist by clicking the heart icon on products.
                </p>
                <Button onClick={() => window.location.href = "/"} className="bg-primary hover:bg-primary/90">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {productsData(items)?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {wishtotalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                      disabled={wishpage === 1 || loading}
                      onClick={() => setWishPage(wishpage - 1)}
                      className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>

                    <span className="text-sm">
                      Page {wishpage} of {wishtotalPages}
                    </span>

                    <button
                      disabled={wishpage === wishtotalPages || loading}
                      onClick={() => setWishPage(wishpage + 1)}
                      className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}

              </>

            )}
          </div>
        );
      default:
        return null;
    }
  };

  const MainDashboard = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />
      <div className="lg:hidden flex items-center gap-4 px-4 py-4 bg-white border-b">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">My Account</h1>
      </div>

      <div className="flex">
        <SharedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarItems={sidebarItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 bg-[#FAF6F2] min-h-screen">{renderTabContent()}</main>
      </div>
    </div>
  );

  // Conditional rendering with extracted stable components
  if (currentView === "add-address") {
    return (
      <AddAddressPage
        onBack={resetFormAndView}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        states={states}
        cities={cities}
        editingAddress={editingAddress}
        onSave={handleSaveAddress}
      />
    );
  }

  if (currentView === "track-order") {
    // You can extract TrackOrderPage and RateProductPage similarly
    return <TrackOrderPage onBack={resetFormAndView} orderId={selectedOrderId} />;
  }
  if (currentView === "rate-product") {
    return <RateProductPage onBack={resetFormAndView} productRating={selectedProductForRating} />;
  }

  return <MainDashboard />;
};

export default Dashboard;