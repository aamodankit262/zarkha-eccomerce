import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  Phone,
  Tag,
  Check,
  X,
  Percent,
  Trash2,
  Edit,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderSuccess from "./OrderSuccess";
import { MobileVerification } from "@/components/checkout";
import PaymentOptions from "@/components/checkout/PaymentOptions";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/contexts/CartContext";
import { SavedAddress } from "@/types";
import { useApi } from "@/hooks/useApi";
import { createAddress, deleteAddress, getAddressList, updateAddress } from "@/services/address.service";

type CheckoutStep = "address" | "mobile-verification" | "payment";
interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
  minOrder: number;
  maxDiscount?: number;
}
const availableCoupons: Coupon[] = [
  { code: "FIRST20", discount: 20, type: "percentage", description: "20% off on your first order", minOrder: 500, maxDiscount: 500 },
  { code: "FLAT200", discount: 200, type: "fixed", description: "Flat ₹200 off on orders above ₹1000", minOrder: 1000 },
  { code: "SAVE15", discount: 15, type: "percentage", description: "15% off on all products", minOrder: 800, maxDiscount: 300 },
  { code: "FREESHIP", discount: 100, type: "fixed", description: "Free shipping + ₹100 off", minOrder: 600 },
  { code: "NEWUSER", discount: 25, type: "percentage", description: "25% off for new users", minOrder: 1000, maxDiscount: 600 },
];
// Main Checkout Component
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loader, setLoading] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("1");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const { data, loading, request } = useApi(getAddressList)

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const { sendOtp, verifyOtp, otpSent, isLoading, error, isLogin, userDetails, token } = useAuthStore()
  const {
    items,
    getTotalPrice,
  } = useCart();
  useEffect(() => {
    if (!token) return;
    request();
  }, [token]);

  useEffect(() => {
    if (data?.body) {
      setSavedAddresses(data.body);
    }
  }, [data]);
  // console.log(userDetails, 'user')
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    address: "",
    pinCode: "",
    country: "India",
    state: "",
    city: "",
    mobileNumber: "",
    addressType: "Home" as "Home" | "Office" | "Other",
    otp: "",
    paymentMethod: "cod",
    isDefault: false

  });
  useEffect(() => {
    if (isLogin) {
      setFormData((prev) => ({
        ...prev,
        fullName: userDetails.name || "",
        mobileNumber: userDetails.phone || "",
      }));
      setIsOtpVerified(true);
      setShowOTP(false);
    }
  }, [userDetails]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSendOtp = async () => {
    if (formData.mobileNumber.length !== 10) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);
      await sendOtp(formData.fullName, formData.mobileNumber);
      setShowOTP(true);
      toast.success("OTP sent successfully");
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (formData.otp.length !== 4) {
      toast.error("Enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(formData.mobileNumber, formData.otp);
      toast.success("Mobile number verified");
      setIsOtpVerified(true);
      setShowOTP(false);
    } catch (err) {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  const handleAddNewAddress = () => {
    setEditingAddressId(null);
    setFormData({
      ...formData,
      firstName: "",
      lastName: "",
      address: "",
      pinCode: "",
      city: "",
      state: "",
      country: "India",
      addressType: "Home",
      isDefault: false
    });
    setIsEditingAddress(true);
  };
  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddressId(address._id);
    setFormData({
      ...formData,
      firstName: address.first_name,
      lastName: address.last_name,
      address: address.address,
      pinCode: address.pinCode,
      city: address.city,
      state: address.state,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.is_default
    });
    setIsEditingAddress(true);
  };
  const handleSaveAddress = async () => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.pinCode || !formData.state || !formData.city) {
      toast.info("Please fill in all required fields.");
      // toast.info({
      //   title: "Incomplete Address",
      //   description: "Please fill in all required fields.",
      //   variant: "destructive"
      // });
      return;
    }
    try {
      const payload = {
        user_id: userDetails.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        address: formData.address,
        pin_code: formData.pinCode,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        addressType: formData.addressType,
        home: formData.addressType === "Home" ? "true" : "",
        office: formData.addressType === "Office" ? "true" : "",
        other: formData.addressType === "Other" ? "true" : "",
        is_default: formData.isDefault,
      }
      if (editingAddressId) {
        // Update existing address
        await updateAddress({
          ...payload,
          id: editingAddressId,
        })
        // setSavedAddresses(prev => prev.map(addr =>
        //   addr._id === editingAddressId
        //     ? {
        //       ...addr,
        //       firstName: formData.firstName,
        //       lastName: formData.lastName,
        //       address: formData.address,
        //       pinCode: formData.pinCode,
        //       city: formData.city,
        //       state: formData.state,
        //       country: formData.country,
        //       addressType: formData.addressType,
        //       isDefault: formData.isDefault ? true : addr.is_default
        //     }
        //     : formData.isDefault ? { ...addr, isDefault: false } : addr
        // ));
        toast.info("Your address has been updated successfully.");
      } else {
        // Add new address
        // const newAddress: SavedAddress = {
        //   _id: Date.now().toString(),
        //   first_name: formData.firstName,
        //   last_name: formData.lastName,
        //   address: formData.address,
        //   pinCode: formData.pinCode,
        //   city: formData.city,
        //   state: formData.state,
        //   country: formData.country,
        //   addressType: formData.addressType,
        //   is_default: formData.isDefault || savedAddresses.length === 0
        // };
        await createAddress(payload);
        toast.info("Your new address has been saved.");

        // if (formData.isDefault) {
        //   setSavedAddresses(prev => [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress]);
        // } else {
        //   setSavedAddresses(prev => [...prev, newAddress]);
        // }
        // setSelectedAddressId(newAddress._id);
        // toast({ title: "Address Added", description: "Your new address has been saved." });
      }
      request();
      setIsEditingAddress(false);
      setEditingAddressId(null);
    } catch (error) {
      console.error(error);
    }

  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);

      if (selectedAddressId === addressId) {
        setSelectedAddressId("");
      }

      request(); // 🔥 reload addresses
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    setEditingAddressId(null);
  };

  const handleApplyCoupon = (coupon: Coupon) => {
    if (subtotal < coupon.minOrder) {
      // toast({
      //   title: "Minimum Order Required",
      //   description: `Add items worth ₹${coupon.minOrder - subtotal} more to use this coupon.`,
      //   variant: "destructive"
      // });
      toast.success(`Add items worth ₹${coupon.minOrder - subtotal} more to use this coupon.`)
      return;
    }
    setAppliedCoupon(coupon);
    setCouponCode(coupon.code);
    setShowCouponModal(false);
    // toast({
    //   title: "Coupon Applied!",
    //   description: `${coupon.code} - ${coupon.description}`,
    // });
    toast.success(`${coupon.code} - ${coupon.description}`)
  };
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    // toast({
    //   title: "Coupon Removed",
    //   description: "Coupon has been removed from your order.",
    // });
    toast.success("Coupon has been removed from your order.")
  };
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.type === "percentage") {
      const discountAmount = (subtotal * appliedCoupon.discount) / 100;
      return appliedCoupon.maxDiscount ? Math.min(discountAmount, appliedCoupon.maxDiscount) : discountAmount;
    }
    return appliedCoupon.discount;
  };
  const subtotal = getTotalPrice();
  // const discount = 400;
  const deliveryCharges = 0;
  // const totalAmount = subtotal - discount + deliveryCharges;
  const couponDiscount = calculateCouponDiscount();

  const totalAmount = subtotal - couponDiscount + deliveryCharges;



  const handleManualCouponApply = () => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (coupon) {
      handleApplyCoupon(coupon);
    } else {
      // toast({
      //   title: "Invalid Coupon",
      //   description: "The coupon code you entered is not valid.",
      //   variant: "destructive"
      // });
      toast.error("The coupon code you entered is not valid.")
    }
  };

  // Mock cart data


  const validateForm = () => {
    if (currentStep === "address") {
      if (
        !formData.email ||
        !formData.fullName ||
        !formData.address ||
        !formData.pinCode ||
        !formData.mobileNumber
      ) {
        return false;
      }
      if (!acceptTerms) {
        return false;
      }
    }
    return true;
  };

  const handleProceedToMobileVerification = () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields and accept terms");
      return;
    }
    setCurrentStep("mobile-verification");
  };

  const handleMobileVerified = () => {
    setIsMobileVerified(true);
    setCurrentStep("payment");
  };

  const handlePaymentComplete = () => {
    const newOrderId = "ORD" + Date.now().toString().slice(-6);
    setOrderId(newOrderId);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  const getStepNumber = (step: CheckoutStep) => {
    switch (step) {
      case "address": return 1;
      case "mobile-verification": return 2;
      case "payment": return 3;
      default: return 1;
    }
  };

  const getStepTitle = (step: CheckoutStep) => {
    switch (step) {
      case "address": return "Shopping Cart";
      case "mobile-verification": return "Payment And Delivery";
      case "payment": return "Order Received";
      default: return "Shopping Cart";
    }
  };

  const getStepTitleMobile = (step: CheckoutStep) => {
    switch (step) {
      case "address": return "Cart";
      case "mobile-verification": return "Payment";
      case "payment": return "Complete";
      default: return "Cart";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderOtherPages />

      {/* Progress Steps */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-0">Checkout</h1>

            {/* Desktop Progress Steps */}
            <div className="hidden lg:flex">
              {(["address", "mobile-verification", "payment"] as CheckoutStep[]).map((step, index) => (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${getStepNumber(currentStep) > index + 1
                      ? "bg-green-500 text-white"
                      : getStepNumber(currentStep) === index + 1
                        ? "bg-orange-500 text-white"
                        : "border-2 border-gray-300 text-gray-400"
                      }`}
                  >
                    {getStepNumber(currentStep) > index + 1 ? "✓" : index + 1}
                  </div>
                  <span
                    className={`font-medium text-sm ${getStepNumber(currentStep) >= index + 1
                      ? "text-orange-500"
                      : "text-gray-400"
                      }`}
                  >
                    {getStepTitle(step)}
                  </span>
                  {index < 2 && (
                    <div className="text-gray-400 text-sm mx-2">→</div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Progress Steps */}
            <div className="flex lg:hidden justify-between items-center">
              {(["address", "mobile-verification", "payment"] as CheckoutStep[]).map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${getStepNumber(currentStep) > index + 1
                      ? "bg-green-500 text-white"
                      : getStepNumber(currentStep) === index + 1
                        ? "bg-orange-500 text-white"
                        : "border-2 border-gray-300 text-gray-400"
                      }`}
                  >
                    {getStepNumber(currentStep) > index + 1 ? "✓" : index + 1}
                  </div>
                  <span
                    className={`font-medium text-sm ${getStepNumber(currentStep) >= index + 1
                      ? "text-orange-500"
                      : "text-gray-400"
                      }`}
                  >
                    {getStepTitleMobile(step)}
                  </span>
                  {index < 2 && (
                    <div className="text-gray-400 text-sm mx-1">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Left Column - Dynamic Content Based on Step */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {currentStep === "address" && (
              <>
                {/* Sign In Section */}
                {/* <div className="bg-card rounded-lg p-4 lg:p-6 border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-base lg:text-lg font-semibold text-foreground mb-2 sm:mb-0">
                      Sign In For Express Checkout
                    </h2>
                    <Button
                      variant="link"
                      className="text-orange-500 p-0 h-auto font-normal text-sm self-start"
                    >
                      Sign In / Sign Up
                    </Button>
                  </div>
                </div> */}

                {/* Customer Information */}
                <div className="bg-card rounded-lg p-4 lg:p-6 border">
                  <h2 className="text-base lg:text-lg font-semibold text-foreground mb-4">
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    <div className="relative ">
                      <Input
                        type="fullName"
                        placeholder="Enter Full Name"
                        value={formData.fullName}
                        disabled={isOtpVerified || otpSent}
                        readOnly={isOtpVerified}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                    </div>

                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="Enter Mobile Number"
                        value={formData.mobileNumber}
                        disabled={isOtpVerified || otpSent}
                        readOnly={isOtpVerified}
                        onChange={(e) =>
                          handleInputChange(
                            "mobileNumber",
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                        maxLength={10}
                      />
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      {!isOtpVerified && !showOTP && !isLogin && (
                        <Button
                          size="sm"
                          disabled={isLoading}
                          onClick={handleSendOtp}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs"
                        >
                          {isLoading ? "Sending..." : "Send OTP"}
                        </Button>
                      )}
                      {isOtpVerified && (
                        <span className="text-green-600 text-xs">✔ Verified</span>
                      )}
                    </div>
                    {showOTP && (
                      <div className="space-y-2">
                        <Input
                          type="tel"
                          placeholder="Enter OTP"
                          value={formData.otp}
                          onChange={(e) =>
                            handleInputChange(
                              "otp",
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          maxLength={4}
                          className="h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                        />

                        <Button
                          size="sm"
                          disabled={isLoading}
                          onClick={handleVerifyOtp}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                      </div>
                    )}

                  </div>
                </div>
                {/* Deliver To Section */}
                {/* Contact & Delivery Section */}
                {isLogin && (
                  <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground">Delivery Address</h2>
                      {!isEditingAddress && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddNewAddress}
                          className="text-primary hover:text-primary/80"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add New
                        </Button>
                      )}
                    </div>

                    {isEditingAddress ? (
                      /* Address Form */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Input
                              placeholder="Enter First Name *"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              className="pr-10"
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="relative">
                            <Input
                              placeholder="Enter Last Name *"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              className="pr-10"
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="relative">
                          <Input
                            placeholder="Enter Full Address *"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="pr-10"
                          />
                          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Input
                              placeholder="Enter Pin Code *"
                              value={formData.pinCode}
                              onChange={(e) => handleInputChange("pinCode", e.target.value)}
                              className="pr-10"
                            />
                            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          </div>
                          <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="USA">USA</SelectItem>
                              <SelectItem value="UK">UK</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select State *" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Karnataka">Karnataka</SelectItem>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select City *" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mumbai">Mumbai</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Bangalore">Bangalore</SelectItem>
                              <SelectItem value="Chennai">Chennai</SelectItem>
                              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Address Type */}
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Address Type</p>
                            <div className="flex gap-2">
                              {(["Home", "Office", "Other"] as const).map((type) => (
                                <Button
                                  key={type}
                                  variant={formData.addressType === type ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleInputChange("addressType", type)}
                                  className={formData.addressType === type ? "bg-primary hover:bg-primary/90" : ""}
                                >
                                  {type}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="save-default"
                              checked={formData.isDefault}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked === true }))}
                            />
                            <label htmlFor="save-default" className="text-sm text-muted-foreground">
                              Set as Default Address
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={handleSaveAddress}
                            className="flex-1 bg-primary hover:bg-primary/90"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Address
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Saved Addresses List */
                      <div className="space-y-3">
                        {savedAddresses.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed rounded-lg">
                            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground mb-3">No saved addresses</p>
                            <Button onClick={handleAddNewAddress} variant="outline">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Address
                            </Button>
                          </div>
                        ) : (
                          savedAddresses.map((address) => (
                            <div
                              key={address._id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address._id
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-muted-foreground/50'
                                }`}
                              onClick={() => setSelectedAddressId(address._id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedAddressId === address._id
                                    ? 'border-primary'
                                    : 'border-muted-foreground/50'
                                    }`}>
                                    {selectedAddressId === address._id && (
                                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-foreground">
                                        {address.first_name} {address.last_name}
                                      </p>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${address.addressType === 'Home'
                                        ? 'bg-green-100 text-green-800'
                                        : address.addressType === 'Office'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {address.addressType}
                                      </span>
                                      {address.is_default && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{address.address}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {address.city}, {address.state} {address.pinCode}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{address.country}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditAddress(address)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  {savedAddresses.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteAddress(address._id)}
                                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">
                      Order Items ({items.length})
                    </h2>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/cart")}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Cart
                    </Button> */}
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item._id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="w-20 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.product_image}
                            alt={item.product_title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2">{item.product_title}</h3>
                          <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
                            {item?.size && <span>Size: {item.size}</span>}
                            {item.color && <span>• Color: {item.color.name}</span>}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs sm:text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-semibold text-foreground">₹{(item.discount_price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-foreground">₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>

              </>
            )}

            {currentStep === "mobile-verification" && (
              <MobileVerification
                phoneNumber={formData.mobileNumber}
                onVerified={handleMobileVerified}
                onBack={() => setCurrentStep("address")}
              />
            )}

            {currentStep === "payment" && (
              <PaymentOptions
                onPaymentComplete={handlePaymentComplete}
                onBack={() => setCurrentStep("mobile-verification")}
                totalAmount={totalAmount}
              />
            )}
          </div>

          {/* Right Column - Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 lg:sticky lg:top-4">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Price Details</h2>

              {/* Coupon Section */}
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm text-foreground">Apply Coupon</span>
                </div>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <div>
                          <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
                          <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-green-700 mt-2 font-medium">You save ₹{couponDiscount}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 text-sm"
                      />
                      <Button
                        onClick={handleManualCouponApply}
                        disabled={!couponCode}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Apply
                      </Button>
                    </div>
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <Percent className="w-3 h-3" />
                      View Available Coupons
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  {/* <span className="text-muted-foreground">Price ({items.length} items)</span> */}
                  <span className="font-medium text-foreground">₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Coupon Discount ({appliedCoupon.code})</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="text-green-600 font-medium">- ₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className={deliveryCharges === 0 ? "text-green-600 font-medium" : "font-medium text-foreground"}>
                    {deliveryCharges === 0 ? "Free" : `₹${deliveryCharges}`}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground text-sm sm:text-base">Total Amount</span>
                    <span className="font-bold text-lg text-foreground">₹{totalAmount}</span>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-green-600 text-right mt-1">You save ₹{couponDiscount} on this order</p>
                  )}
                </div>
              </div>

              {currentStep === "address" && (
                <div className="space-y-4">
                  {!isLogin && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> You'll need to login or create an account before placing your order.
                      </p>
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I Confirm I Am Accept The{" "}
                      <a href="/terms" className="text-primary hover:underline cursor-pointer">Terms & Conditions</a>
                      {" "}And{" "}
                      <a href="/privacy-policy" className="text-primary hover:underline cursor-pointer">Privacy Policy</a>.
                    </label>
                  </div>

                  <Button
                    onClick={handleProceedToMobileVerification}
                    disabled={!acceptTerms}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
                  >
                    {/* {isLogin ? "Proceed to checkout" : "Continue to Mobile Verification"} */}
                    Proceed to checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <OrderSuccess
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
        // orderId={orderId}
        // totalAmount={totalAmount}
        />
      )}
      {/* Coupon Modal */}
      <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Available Coupons
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {availableCoupons.map((coupon) => {
              const isEligible = subtotal >= coupon.minOrder;
              return (
                <div
                  key={coupon.code}
                  className={`border rounded-lg p-4 ${isEligible ? 'hover:border-primary cursor-pointer' : 'opacity-60'}`}
                  onClick={() => isEligible && handleApplyCoupon(coupon)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 px-3 py-1 rounded">
                        <span className="font-bold text-primary text-sm">{coupon.code}</span>
                      </div>
                      {coupon.type === "percentage" ? (
                        <span className="text-sm font-semibold text-foreground">{coupon.discount}% OFF</span>
                      ) : (
                        <span className="text-sm font-semibold text-foreground">₹{coupon.discount} OFF</span>
                      )}
                    </div>
                    {isEligible && (
                      <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                        Apply
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{coupon.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. order: ₹{coupon.minOrder}
                    {coupon.maxDiscount && ` • Max discount: ₹${coupon.maxDiscount}`}
                  </p>
                  {!isEligible && (
                    <p className="text-xs text-red-500 mt-2">
                      Add ₹{coupon.minOrder - subtotal} more to unlock this coupon
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;