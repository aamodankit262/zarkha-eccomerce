import { useEffect, useState } from "react";
import { Search, Heart, Package, MapPin, Shield, LogOut, ArrowLeft, Download, Star, Upload, User, Menu, X, Check, } from "lucide-react";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { ProductCard } from "@/components/common/ProductCard";
import { productsData } from "@/data/product";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { createAddress, deleteAddress, getAddressList, getCityList, getStateList, updateAddress } from "@/services/address.service";
import { useCms } from "@/hooks/useCms";
import { CMS_TYPES } from "@/services/cms.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SavedAddress } from "@/types";
type AddressType = "Home" | "Office" | "Other";
interface AddressForm {
  firstName: string;
  lastName: string;
  address: string;
  pinCode: string;
  country: string;
  state: string;   // stateId
  city: string;    // cityId
  addressType: AddressType;
  isDefault: boolean;
}

const SharedSidebar = ({ activeTab, setActiveTab, sidebarItems, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout, userDetails } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
          <p className="text-sm text-gray-600">
            Hello, {userDetails.name || "Dear"}
          </p>
          <p className="text-sm font-medium text-gray-900">
            +91 {userDetails.phone}
          </p>
        </div>

        <div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
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
const AddAddressPage = ({ 
  onBack, 
  addressForm, 
  handleInputChange, 
  states, 
  cities, 
  editingAddress, 
  handleSaveAddress 
}) => (
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
                onChange={(e) =>
                  handleInputChange("firstName", e.target.value)
                }
              />
              <Input
                placeholder="Last Name *"
                value={addressForm.lastName}
                onChange={(e) =>
                  handleInputChange("lastName", e.target.value)
                }
              />
            </div>

            <Input
              placeholder="Full Address *"
              value={addressForm.address}
              onChange={(e) =>
                handleInputChange("address", e.target.value)
              }
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Pin Code *"
                value={addressForm.pinCode}
                onChange={(e) =>
                  handleInputChange("pinCode", e.target.value)
                }
              />
              <Select
                value={addressForm.country}
                onValueChange={(v) =>
                  handleInputChange("country", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Select
                value={addressForm.state}
                onValueChange={(v) =>
                  handleInputChange("state", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="State *" />
                </SelectTrigger>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state._id} value={state._id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={addressForm.city}
                onValueChange={(v) =>
                  handleInputChange("city", v)
                }
                disabled={!addressForm.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="City *" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city._id} value={city._id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address Type */}
            <div>
              <p className="text-sm font-medium mb-2">Address Type</p>
              <div className="flex gap-2">
                {(["Home", "Office", "Other"] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={
                      addressForm.addressType === type
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleInputChange("addressType", type)
                    }
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveAddress} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              {/* <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button> */}
            </div>
          </div>
        </div>
      </div>
  </div>
);
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductForRating, setSelectedProductForRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editingAddress, setEditingAddress] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  // const { data, loading, request } = useApi(getAddressList);
  const { token, userDetails } = useAuthStore();
  const {
    data: addressList,
    loading: addressLoading,
    request: fetchAddressList,
  } = useApi(getAddressList);

  const {
    data: cmsData,
    loading: cmsLoading,
    error: cmsError,
  } = useCms(CMS_TYPES.PRIVACY);

  // if (addressLoading || cmsLoading) {
  //   return <div>Loading...</div>;
  // }
  const [addressForm, setAddressForm] = useState<AddressForm>({
    firstName: "",
    lastName: "",
    address: "",
    pinCode: "",
    country: "India",
    state: "",
    city: "",
    addressType: "Home",
    isDefault: false,
  });
  const handleInputChange = <K extends keyof AddressForm>(
    key: K,
    value: AddressForm[K]
  ) => {
    setAddressForm((prev) => ({ ...prev, [key]: value }));
  };
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    if (!token) return;
    getStateList().then((res) => {
      setStates(res?.data || []);
    });
  }, [token]);

  useEffect(() => {
    if (!addressForm.state && !token) return;

    getCityList(addressForm.state).then((res) => {
      setCities(res?.data || []);
    });
  }, [addressForm.state, token]);
  useEffect(() => {
    if (!token) return;
    fetchAddressList();
  }, [token]);

  useEffect(() => {
    if (addressList?.body) {
      setAddresses(addressList.body);
    }
  }, [addressList]);

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
      id: "120012",
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
      id: "120013",
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
    setAddressForm({
      firstName: "",
      lastName: "",
      address: "",
      pinCode: "",
      country: "",
      state: "",
      city: "",
      addressType: "Home" as "Home" | "Office" | "Other",
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
      country: address.country ?? "India",
      state: address.stateId,
      city: address.cityId,
      addressType: address.addressType ?? "Home",
      isDefault: address.is_default ?? false,
    });
    setCurrentView("add-address");
  };
  const handleSaveAddress = async () => {
    const {
      firstName,
      lastName,
      address,
      pinCode,
      state,
      city,
    } = addressForm;

    if (!firstName || !lastName || !address || !pinCode || !state || !city) {
      toast.info("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        user_id: userDetails.id,
        first_name: addressForm.firstName,
        last_name: addressForm.lastName,
        address: addressForm.address,
        pin_code: addressForm.pinCode,
        country: addressForm.country,
        stateId: addressForm.state,
        cityId: addressForm.city,
        addressType: addressForm.addressType,
        is_default: addressForm.isDefault,
      };

      let savedAddress: SavedAddress;

      if (editingAddress) {
        const res = await updateAddress({
          ...payload,
          id: editingAddress._id,
        });
        savedAddress = res.body;
        // handleBackToDashboard()
        toast.info("Your address has been updated successfully.");
      } else {
        const res = await createAddress(payload);
        savedAddress = res.body;
        toast.info("Your new address has been saved.");
      }
      handleBackToDashboard()
      await fetchAddressList();
      setEditingAddress(null);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSaveAddress = () => {
  //   if (editingAddress) {
  //     setAddresses((prev) =>
  //       prev.map((addr) =>
  //         addr._id === editingAddress._id
  //           ? { ...addressForm, _id: editingAddress._id }
  //           : addr
  //       )
  //     );
  //   } else {
  //     const newAddress = {
  //       ...addressForm,
  //       _id: Date.now().toString(),
  //     };
  //     setAddresses((prev) => [...prev, newAddress]);
  //   }
  //   handleBackToDashboard();
  // };

  const handleRemoveAddress = async (addressId: string) => {
  try {
    await deleteAddress(addressId);
    toast.success("Address removed");
    fetchAddressList();
  } catch {
    toast.error("Failed to delete address");
  }
};
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Sub-views
  const RateProductPage = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
          {/* Product info and rating form */}
          <div className="flex gap-6 mb-8 flex-col sm:flex-row">
            <img
              src={selectedProductForRating?.image || "/product-image.png"}
              className="w-32 h-32 rounded object-cover"
              alt="Product"
            />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Black LIVA Straight Printed 2 Piece Set
              </h3>
              <p className="text-sm text-gray-600">Amount Paid: ₹ 1900</p>
              <p className="text-sm text-gray-600">Total QTY: 02</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">Rate US</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star
                    className={`h-10 w-10 ${star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">
              Add Product Photos (Max 5 Images)
            </h4>
            <div className="flex gap-4 flex-wrap">
              <img
                src="/rate-us.webp"
                className="w-24 h-24 rounded border object-cover"
                alt="Review"
              />
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <Upload className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">Write Your Review</h4>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              maxLength={300}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {300 - reviewText.length} characters remaining
            </p>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 bg-[#FF8A18] text-white rounded-md font-medium hover:bg-orange-600">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
 
  // const AddAddressPage = () => (
  //   <div className="min-h-screen bg-[#FAF6F2]">
  //     <HeaderOtherPages />

  //     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  //       <button
  //         onClick={handleBackToDashboard}
  //         className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
  //       >
  //         <ArrowLeft className="h-4 w-4" />
  //         {editingAddress ? "Edit Address" : "Add New Address"}
  //       </button>

  //       <div className="bg-white rounded-lg shadow-sm p-6">
  //         <h3 className="text-xl font-semibold mb-8">Deliver To</h3>

  //         <div className="space-y-4">
  //           <div className="grid md:grid-cols-2 gap-4">
  //             <Input
  //               placeholder="First Name *"
  //               value={addressForm.firstName}
  //               onChange={(e) =>
  //                 handleInputChange("firstName", e.target.value)
  //               }
  //             />
  //             <Input
  //               placeholder="Last Name *"
  //               value={addressForm.lastName}
  //               onChange={(e) =>
  //                 handleInputChange("lastName", e.target.value)
  //               }
  //             />
  //           </div>

  //           <Input
  //             placeholder="Full Address *"
  //             value={addressForm.address}
  //             onChange={(e) =>
  //               handleInputChange("address", e.target.value)
  //             }
  //           />

  //           <div className="grid md:grid-cols-2 gap-4">
  //             <Input
  //               placeholder="Pin Code *"
  //               value={addressForm.pinCode}
  //               onChange={(e) =>
  //                 handleInputChange("pinCode", e.target.value)
  //               }
  //             />
  //             <Select
  //               value={addressForm.country}
  //               onValueChange={(v) =>
  //                 handleInputChange("country", v)
  //               }
  //             >
  //               <SelectTrigger>
  //                 <SelectValue placeholder="Country" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 <SelectItem value="India">India</SelectItem>
  //               </SelectContent>
  //             </Select>
  //           </div>

  //           <div className="grid md:grid-cols-2 gap-4">
  //             <Select
  //               value={addressForm.state}
  //               onValueChange={(v) =>
  //                 handleInputChange("state", v)
  //               }
  //             >
  //               <SelectTrigger>
  //                 <SelectValue placeholder="State *" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {states?.map((state) => (
  //                   <SelectItem key={state._id} value={state._id}>
  //                     {state.name}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>

  //             <Select
  //               value={addressForm.city}
  //               onValueChange={(v) =>
  //                 handleInputChange("city", v)
  //               }
  //               disabled={!addressForm.state}
  //             >
  //               <SelectTrigger>
  //                 <SelectValue placeholder="City *" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {cities?.map((city) => (
  //                   <SelectItem key={city._id} value={city._id}>
  //                     {city.name}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>

  //           {/* Address Type */}
  //           <div>
  //             <p className="text-sm font-medium mb-2">Address Type</p>
  //             <div className="flex gap-2">
  //               {(["Home", "Office", "Other"] as const).map((type) => (
  //                 <Button
  //                   key={type}
  //                   size="sm"
  //                   variant={
  //                     addressForm.addressType === type
  //                       ? "default"
  //                       : "outline"
  //                   }
  //                   onClick={() =>
  //                     handleInputChange("addressType", type)
  //                   }
  //                 >
  //                   {type}
  //                 </Button>
  //               ))}
  //             </div>
  //           </div>

  //           <div className="flex items-center gap-2">
  //             <Checkbox
  //               checked={addressForm.isDefault}
  //               onCheckedChange={(v) =>
  //                 setAddressForm((prev) => ({
  //                   ...prev,
  //                   isDefault: v === true,
  //                 }))
  //               }
  //             />
  //             <span className="text-sm">Set as default</span>
  //           </div>

  //           <div className="flex gap-3">
  //             <Button onClick={handleSaveAddress} className="flex-1">
  //               <Check className="w-4 h-4 mr-2" />
  //               Save
  //             </Button>
  //             {/* <Button
  //               variant="outline"
  //               onClick={handleCancelEdit}
  //               className="flex-1"
  //             >
  //               Cancel
  //             </Button> */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const TrackOrderPage = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Address */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">Delivery Address</h3>
            <p className="font-medium mb-2">Name Customer Here</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Shop no 9-10, Ram mandir, Govind Marg, near DISCOUNT Fashion Hub,
              opp. Dashera Maidan, Raja Park, Jaipur, Rajasthan 302004
            </p>
            <p className="text-sm text-gray-600 mt-4">+91 8912345678</p>
          </div>

          {/* Order Info */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking No.</span>
                <span className="font-medium">12001220</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ship By</span>
                <span className="font-medium">DHL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">12001220</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">12-Nov-2024, 12:10 Pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium text-green-600">Done</span>
              </div>
            </div>
          </div>

          {/* More Actions */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">More Actions</h3>
            <button className="w-full flex items-center justify-center gap-3 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50">
              <Download className="h-5 w-5" />
              Download Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-6">Product Details</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 pb-6 border-b last:border-0">
                  <img
                    src="/product-1.jpg"
                    alt="Product"
                    className="w-20 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium mb-2">
                      Black LIVA Straight Printed 2 Piece Set
                    </p>
                    <p className="text-sm text-gray-600">Amount Paid: ₹ 1900</p>
                    <p className="text-sm text-gray-600">QTY: 02</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-6">Track Order</h3>
            <div className="bg-[#FAF6F2] rounded-md p-4 mb-6">
              <p>
                <strong>Tracking No.:</strong> 12001220
              </p>
              <p>
                <strong>Ship By:</strong> DHL
              </p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300" />
              {[
                { label: "Order Confirmed", date: "Fri, 3rd Nov 2024, 12:30PM", done: true },
                { label: "Shipped", date: "Fri, 3rd Nov 2024, 12:30PM", done: true },
                { label: "Out For Delivery", date: "Expected soon", done: false },
                { label: "Delivered", date: "Pending", done: false },
              ].map((step, i) => (
                <div key={i} className="relative mb-8 last:mb-0">
                  <div
                    className={`absolute -left-9 w-5 h-5 rounded-full border-4 border-white ${step.done ? "bg-green-500" : "bg-gray-300"
                      }`}
                  />
                  <p className={`font-medium ${step.done ? "text-gray-900" : "text-gray-500"}`}>
                    {step.label}
                  </p>
                  <p className={`text-sm ${step.done ? "text-gray-600" : "text-gray-400"}`}>
                    {step.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="bg-white border-2 border-[#D2CABD] rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <span className="bg-[#F5F5F5] px-6 py-2 rounded-md font-semibold">
                      Order ID: {order.id}
                    </span>
                    <span className="text-sm">Placed on {order.date}</span>
                  </div>

                  <div className="p-6 flex flex-col lg:flex-row gap-6">
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-24 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium mb-3">{order.product.name}</h4>
                      <p className="text-sm text-gray-600">Amount: ₹{order.product.amount}</p>
                      <p className="text-sm text-gray-600">Quantity: {order.product.quantity}</p>
                      {order.deliveredDate && (
                        <p className="text-sm text-green-600 mt-2">
                          Delivered on {order.deliveredDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <p className="text-gray-600">Tracking No.</p>
                        <p className="font-medium">{order.trackingNo}</p>
                        {idx !== 1 && (
                          <button
                            onClick={() => handleTrackOrder(order.id)}
                            className="text-green-600 font-medium mt-2 block hover:underline"
                          >
                            Track Order →
                          </button>
                        )}
                      </div>

                      {order.status === "delivered" && (
                        <button
                          onClick={() => handleRateProduct(order.product)}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
            <h2 className="text-2xl font-semibold mb-8">{cmsData?.title}</h2>
            <div className="prose text-gray-600 space-y-6">
              {/* Your privacy content here */}
              {cmsData?.content && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: cmsData.content }}
                />
              )}
              {/* <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit...
              </p> */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const MainDashboard = () => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-4 bg-white border-b">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
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

        <main className="flex-1 bg-[#FAF6F2] min-h-screen">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );

  if (currentView === "track-order") return <TrackOrderPage />;
  if (currentView === "add-address") {
  return (
    <AddAddressPage
      onBack={handleBackToDashboard}
      addressForm={addressForm}
      handleInputChange={handleInputChange}
      states={states}
      cities={cities}
      editingAddress={editingAddress}
      handleSaveAddress={handleSaveAddress}
    />
  );
}
  if (currentView === "rate-product") return <RateProductPage />;

  return <MainDashboard />;
};

export default Dashboard;