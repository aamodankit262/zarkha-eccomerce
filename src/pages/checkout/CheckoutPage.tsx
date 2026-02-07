import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import OrderSuccess from "./OrderSuccess";
import AddressSection from "./AddressSection";
import OrderItems from "./OrderItems";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/contexts/CartContext";
import { useApi } from "@/hooks/useApi";
import {
    createAddress,
    deleteAddress,
    getAddressList,
    getCityList,
    getStateList,
    updateAddress,
} from "@/services/address.service";
import { SavedAddress } from "@/types";
import { Input } from "@/components/ui/input";
import { Check, Percent, Phone, Tag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CouponModal from "./CouponModal";
import { Checkbox } from "@/components/ui/checkbox";
import { applyCoupon, getCouponList, removeCoupon } from "@/services/coupon.service";
import { orderService } from "@/services/orderService";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Layout } from "@/components";
import { set } from "date-fns";
import { paymentService } from "@/services/paymentService";
export interface Coupon {
    code: string;
    _id: string;
    discount_value: number;
    discount_type: "percentage" | "fixed";
    description: string;
    min_cart_value: number;
    max_discount_amount?: number;
}


const CheckoutPage = () => {
    const navigate = useNavigate();
    // const { items, getTotalPrice } = useCart();
    const { sendOtp, verifyOtp, otpSent, isLoading, error, isLogin, userDetails, token } = useAuthStore()
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [loader, setLoading] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [orderDetail, setOrderDetail] = useState<any>("");

    /* ---------------- ADDRESS STATE ---------------- */
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
        null
    );
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [couponList, setCouponList] = useState<any[]>([]);

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

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

    /* ---------------- COUPON STATE ---------------- */
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

    /* ---------------- UI STATE ---------------- */
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    /* ---------------- API ---------------- */
    const { data, request, loading } = useApi(getAddressList);
    const { request: applyCouponRequest, loading: applyCouponLoading } = useApi(applyCoupon);
    const { request: removeCouponApi } = useApi(removeCoupon);
    // const { request: createOrder, loading: createOrderLoading } = useApi(orderService.createOrder);
    
    const { Razorpay } = useRazorpay();
    const { cartId, fetchCart, items, getTotalPrice } = useCart()
    console.log(items, 'items')
//    useEffect(() => {
//     if(items.length === 0){
//         navigate(-1);
//     }
//    },[items.length, navigate])
// useEffect(() => {
//   if (!items || items.length === 0) {
//     navigate("/", { replace: true });
//   }
// }, [items, navigate]);
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

    useEffect(() => {
        if (!token) return;
        getCouponList().then((res) => {
            // console.log(res, 'coupons')
            setCouponList(res?.body || []);
        });
    }, [token]);
    useEffect(() => {
        if (!token) return;
        getStateList().then((res) => {
            setStates(res?.data || []);
        });
    }, [token]);

    useEffect(() => {
        if (!formData.state && !token) return;

        getCityList(formData.state).then((res) => {
            setCities(res?.data || []);
        });
    }, [formData.state]);

    useEffect(() => {
        if (token) request();
    }, [token]);

    useEffect(() => {
        if (!data?.body) return;
        setSavedAddresses(data.body);
        const defaultAddress = data.body.find(
            (addr: any) => addr.is_default === true
        );

        if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id);
        }
    }, [data]);

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
    /* ---------------- PRICE CALC ---------------- */
    const subtotal = getTotalPrice();
    const deliveryCharges = 0;

    const couponDiscount = appliedCoupon
        ? appliedCoupon.discount_type === "percentage"
            ? Math.min(
                (subtotal * appliedCoupon.discount_value) / 100,
                appliedCoupon.max_discount_amount ?? Infinity
            )
            : appliedCoupon.discount_value
        : 0;

    const totalAmount = subtotal - couponDiscount + deliveryCharges;

    /* ---------------- ADDRESS HANDLERS ---------------- */
    const handleInputChange = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
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
        console.log(address, 'editaddress..')
        console.log(address.stateId, address.cityId);
        setEditingAddressId(address._id);
        setFormData({
            ...formData,
            firstName: address.first_name,
            lastName: address.last_name,
            address: address.address,
            pinCode: address.pin_code,
            city: address.cityId?._id || "",
            state: address.stateId?._id || "",
            country: address.country,
            addressType: address.addressType,
            isDefault: address.is_default
        });
        setIsEditingAddress(true);
    };

    const handleSaveAddress = async () => {
        if (!formData.firstName || !formData.lastName || !formData.address || !formData.pinCode || !formData.state || !formData.city) {
            toast.info("Please fill in all required fields.");

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
                stateId: formData.state,
                cityId: formData.city,
                addressType: formData.addressType,
                home: formData.addressType === "Home" ? "true" : "",
                office: formData.addressType === "Office" ? "true" : "",
                other: formData.addressType === "Other" ? "true" : "",
                is_default: formData.isDefault,
            }
            console.log(payload, 'payload... ')
            let savedAddress: SavedAddress;
            if (editingAddressId) {
                // Update existing address
                const res = await updateAddress({
                    ...payload,
                    id: editingAddressId,
                })
                savedAddress = res.body;
                toast.info("Your address has been updated successfully.");
            } else {
                const res = await createAddress(payload);
                savedAddress = res.body;
                toast.info("Your new address has been saved.");
            }
            await request();
            // if (savedAddress.is_default) {
            //     setSelectedAddressId(savedAddress._id);
            // }
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


    /* ---------------- COUPON HANDLERS ---------------- */
    const handleApplyCoupon = async (coupon: Coupon) => {
        if (subtotal < coupon.min_cart_value) {

            toast.success(`Add items worth ₹${coupon.min_cart_value - subtotal} more to use this coupon.`)
            return;
        }
        try {
            const payload = {
                coupon_code: coupon.code,
                amount: subtotal,
                cart_id: cartId,              // from cart context
                // user_id: userDetails?.id
            }
            const res = await applyCouponRequest(payload)
            console.log(res, 'apply cou...')
            if (res?.success) {
                setAppliedCoupon(coupon);
                setCouponCode(coupon.code);
                setShowCouponModal(false);

                toast.success(res.message || "Coupon applied successfully");
                toast.success(`${coupon.code} - ${coupon.description}`)

            } else {
                toast.error(res?.message || "Failed to apply coupon");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Invalid or expired coupon"
            );
        }
        // setAppliedCoupon(coupon);
        // setCouponCode(coupon.code);
        // setShowCouponModal(false);

        // toast.success(`${coupon.code} - ${coupon.description}`)
    };
    const handleRemoveCoupon = async () => {
        try {
            await removeCouponApi(cartId, userDetails?.id);

            setAppliedCoupon(null);
            setCouponCode("");

            toast.success("Coupon has been removed from your order.");
        } catch (err: any) {
            toast.error(err?.message || "Failed to remove coupon");
        }
    };
    const handleManualCouponApply = () => {
        const coupon = couponList.find(
            (c) => c.code === couponCode
        );
        if (!coupon) {
            toast.error("Invalid coupon code");
            return;
        }
        if (subtotal < coupon.minOrder) {
            toast.error(`Add ₹${coupon.minOrder - subtotal} more`);
            return;
        }
        setAppliedCoupon(coupon);
    };

    /* ---------------- PAYMENT ---------------- */
    const handlePayment = async () => {
        if (!isOtpVerified) {
            toast.error("Please varify your mobile number");
            return;
        }
        if (!selectedAddressId) {
            toast.error("Please select delivery address");
            return;
        }
        if (!items.length) {
            toast.error("Please add product in you cart ");
            return;
        }

        try {
            const res = await paymentService.createPaymentOrder({
                amount: totalAmount,
                cart_id: cartId,
            });
            console.log(res, 'payment create')
            const {
                order_id,
                key_id,
                amount
            } = res.body;
            // setOrderId(order_id);
            const options: RazorpayOrderOptions = {
                key: key_id,
                amount, // in paise
                currency: "INR",
                name: "Zarkha",
                description: "Order Payment",
                order_id: order_id,

                handler: async (response) => {
                    console.log("Payment handler", response);

                    // 3️⃣ Verify payment API (backend)
                    const res = await paymentService.verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        address_id: selectedAddressId,
                        cart_id: cartId,
                        customer_notes: "Please deliver between 10 AM - 6 PM",
                    });
                    // setOrderDetail()
                    const { verified, order } = res?.body
                    if (res?.success) {
                        setOrderDetail(order)
                        setOrderId(order?.order_id)
                        toast.success(res.message || "Payment successful");
                        setShowSuccessModal(true);
                        await fetchCart(cartId);
                    }

                },

                prefill: {
                    name: userDetails?.name || "",
                    contact: userDetails?.phone || "",
                },

                theme: {
                    color: "#ed8936",
                },

                modal: {
                    ondismiss: () => {
                        toast.info("Payment cancelled");
                    },
                },
            };

            // 4️⃣ Open Razorpay
            const razorpay = new Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error(error);
            toast.error("Payment failed");
        }
    };


    return (
        // <Layout></Layout>
        <div className="min-h-screen bg-background">
            <HeaderOtherPages />

            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT */}
                {/* Customer Information */}
                <div className="lg:col-span-2 space-y-6">
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
                                        disabled={loading}
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
                    {isLogin && (

                        <AddressSection
                            savedAddresses={savedAddresses}
                            selectedAddressId={selectedAddressId}
                            isEditingAddress={isEditingAddress}
                            formData={formData}
                            setSelectedAddressId={setSelectedAddressId}
                            handleAddNewAddress={handleAddNewAddress}
                            handleEditAddress={handleEditAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            handleSaveAddress={handleSaveAddress}
                            handleCancelEdit={handleCancelEdit}
                            handleInputChange={handleInputChange}
                            setFormData={setFormData}
                            states={states}
                            cities={cities}
                        />
                    )}

                    <OrderItems
                        items={items}
                        subtotal={subtotal}
                        onEditCart={() => navigate("/cart")}
                    />
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 lg:sticky lg:top-4">
                        <h2 className="text-base sm:text-lg font-semibold text-foreground">Price Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">Total MRP</span>
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

                            {/* <div className="flex justify-between text-sm sm:text-base">
                                <span className="text-muted-foreground">Delivery Charges</span>
                                <span className={deliveryCharges === 0 ? "text-green-600 font-medium" : "font-medium text-foreground"}>
                                    {deliveryCharges === 0 ? "Free" : `₹${deliveryCharges}`}
                                </span>
                            </div> */}

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



                        {/* {currentStep === "address" && ( */}
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
                                onClick={handlePayment}
                                disabled={!acceptTerms}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
                            >
                                {/* {isLogin ? "Proceed to checkout" : "Continue to Mobile Verification"} */}
                                Proceed to checkout
                            </Button>
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <OrderSuccess
                    isOpen
                    onClose={() => {
                        setShowSuccessModal(false);
                        navigate("/dashboard");
                    }}
                    orderId={orderId}
                />
            )}
            <CouponModal
                open={showCouponModal}
                onOpenChange={setShowCouponModal}
                coupons={couponList}
                subtotal={subtotal}
                onApplyCoupon={handleApplyCoupon}
            />
        </div>
    );
};

export default CheckoutPage;
