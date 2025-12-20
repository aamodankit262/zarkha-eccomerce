import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  MapPin, 
  User, 
  Phone, 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle, 
  Package, 
  Clock 
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

type CheckoutStep = "address" | "mobile-verification" | "payment";

// Main Checkout Component
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    pinCode: "",
    country: "India",
    state: "",
    city: "",
    mobileNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Mock cart data
  const subtotal = 1800;
  const discount = 400;
  const deliveryCharges = 0;
  const totalAmount = subtotal - discount + deliveryCharges;

  const validateForm = () => {
    if (currentStep === "address") {
      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                      getStepNumber(currentStep) > index + 1
                        ? "bg-green-500 text-white"
                        : getStepNumber(currentStep) === index + 1
                        ? "bg-orange-500 text-white"
                        : "border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {getStepNumber(currentStep) > index + 1 ? "✓" : index + 1}
                  </div>
                  <span
                    className={`font-medium text-sm ${
                      getStepNumber(currentStep) >= index + 1
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
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs ${
                      getStepNumber(currentStep) > index + 1
                        ? "bg-green-500 text-white"
                        : getStepNumber(currentStep) === index + 1
                        ? "bg-orange-500 text-white"
                        : "border-2 border-gray-300 text-gray-400"
                    }`}
                  >
                    {getStepNumber(currentStep) > index + 1 ? "✓" : index + 1}
                  </div>
                  <span
                    className={`font-medium text-sm ${
                      getStepNumber(currentStep) >= index + 1
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
                <div className="bg-card rounded-lg p-4 lg:p-6 border">
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
                </div>

                {/* Customer Information */}
                <div className="bg-card rounded-lg p-4 lg:p-6 border">
                  <h2 className="text-base lg:text-lg font-semibold text-foreground mb-4">
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Enter Email Address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="Enter Mobile Number"
                        value={formData.mobileNumber}
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
                    </div>
                  </div>
                </div>

                {/* Deliver To Section */}
                <div className="bg-card rounded-lg p-4 lg:p-6 border">
                  <h2 className="text-base lg:text-lg font-semibold text-foreground mb-4">
                    Deliver To
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input
                          placeholder="Enter First Name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                        />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Enter Last Name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                        />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        placeholder="Enter Address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                      />
                      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input
                          placeholder="Enter Pin Code"
                          value={formData.pinCode}
                          onChange={(e) =>
                            handleInputChange("pinCode", e.target.value)
                          }
                          className="pl-4 pr-10 h-10 lg:h-12 border-gray-200 text-sm lg:text-base"
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                      </div>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleInputChange("country", value)
                        }
                      >
                        <SelectTrigger className="h-10 lg:h-12 border-gray-200 text-sm lg:text-base">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
                      >
                        <SelectTrigger className="h-10 lg:h-12 border-gray-200 text-sm lg:text-base">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                      >
                        <SelectTrigger className="h-10 lg:h-12 border-gray-200 text-sm lg:text-base">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                          <SelectItem value="Bangalore">Bangalore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Save Address Options */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-3">
                          Save this address as (optional)
                        </p>
                        <div className="flex flex-wrap gap-2 lg:gap-3">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs lg:text-sm px-3 py-1.5 lg:px-4 lg:py-2"
                          >
                            Home
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:bg-gray-50 text-xs lg:text-sm px-3 py-1.5 lg:px-4 lg:py-2"
                          >
                            Office
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:bg-gray-50 text-xs lg:text-sm px-3 py-1.5 lg:px-4 lg:py-2"
                          >
                            Other
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="save-default" />
                        <label
                          htmlFor="save-default"
                          className="text-sm text-gray-600"
                        >
                          Save as Default
                        </label>
                      </div>
                    </div>
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
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="bg-card rounded-lg p-4 lg:p-6 border space-y-4 lg:space-y-6 lg:sticky lg:top-4">
              <h2 className="text-base lg:text-lg font-semibold text-foreground">
                Price Details
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm lg:text-base">
                  <span className="text-gray-600">Price (2 items)</span>
                  <span className="font-medium text-foreground">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm lg:text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Discount (AB1234)</span>
                    <button className="text-red-500 text-xs hover:underline">
                      Remove
                    </button>
                  </div>
                  <span className="text-red-500 font-medium">
                    - ₹{discount}
                  </span>
                </div>

                <div className="flex justify-between text-sm lg:text-base">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-medium text-foreground">
                    ₹{deliveryCharges}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground text-sm lg:text-base">
                      Total Amount
                    </span>
                    <span className="font-bold text-base lg:text-lg text-foreground">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {currentStep === "address" && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) =>
                        setAcceptTerms(checked === true)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs lg:text-sm text-gray-600 leading-relaxed"
                    >
                      I Confirm I Am Accept The{" "}
                      <a
                        href="/terms"
                        className="text-orange-500 hover:underline cursor-pointer"
                      >
                        Terms & Conditions
                      </a>{" "}
                      And{" "}
                      <a
                        href="/privacy-policy"
                        className="text-orange-500 hover:underline cursor-pointer"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  <Button
                    onClick={handleProceedToMobileVerification}
                    disabled={!acceptTerms}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 lg:py-3 font-medium text-sm lg:text-base h-10 lg:h-12"
                  >
                    Proceed to Secure Checkout
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
    </div>
  );
};

export default CheckoutPage;