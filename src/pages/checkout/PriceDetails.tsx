import {
  Tag,
  Check,
  X,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Coupon {
  code: string;
  description: string;
}

interface PriceDetailsProps {
  subtotal: number;
  deliveryCharges: number;
  couponDiscount: number;
  totalAmount: number;

  couponCode: string;
  appliedCoupon: Coupon | null;

  isLogin: boolean;
  acceptTerms: boolean;

  setCouponCode: (value: string) => void;
  setAcceptTerms: (value: boolean) => void;

  handleManualCouponApply: () => void;
  handleRemoveCoupon: () => void;
  handleProceedCheckout: () => void;
  onViewCoupons?: () => void;
}

const PriceDetails = ({
  subtotal,
  deliveryCharges,
  couponDiscount,
  totalAmount,

  couponCode,
  appliedCoupon,

  isLogin,
  acceptTerms,

  setCouponCode,
  setAcceptTerms,

  handleManualCouponApply,
  handleRemoveCoupon,
  handleProceedCheckout,
  onViewCoupons,
}: PriceDetailsProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6 lg:sticky lg:top-4">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">
        Price Details
      </h2>

      {/* Coupon Section */}
      <div className="border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">
            Apply Coupon
          </span>
        </div>

        {appliedCoupon ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <div>
                  <span className="font-semibold text-green-700">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-xs text-green-600">
                    {appliedCoupon.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-green-700 mt-2 font-medium">
              You save ₹{couponDiscount}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(e.target.value.toUpperCase())
                }
                className="flex-1 text-sm"
              />
              <Button
                size="sm"
                disabled={!couponCode}
                onClick={handleManualCouponApply}
              >
                Apply
              </Button>
            </div>

            {onViewCoupons && (
              <button
                onClick={onViewCoupons}
                className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
              >
                <Percent className="w-3 h-3" />
                View Available Coupons
              </button>
            )}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="font-medium">Subtotal</span>
          <span className="font-medium">
            ₹{subtotal.toLocaleString()}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                Coupon Discount ({appliedCoupon.code})
              </span>
              <button
                onClick={handleRemoveCoupon}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
            <span className="text-green-600 font-medium">
              - ₹{couponDiscount}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-muted-foreground">
            Delivery Charges
          </span>
          <span
            className={
              deliveryCharges === 0
                ? "text-green-600 font-medium"
                : "font-medium"
            }
          >
            {deliveryCharges === 0
              ? "Free"
              : `₹${deliveryCharges}`}
          </span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm sm:text-base">
              Total Amount
            </span>
            <span className="font-bold text-lg">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          {appliedCoupon && (
            <p className="text-xs text-green-600 text-right mt-1">
              You save ₹{couponDiscount} on this order
            </p>
          )}
        </div>
      </div>

      {/* Checkout Action */}
      <div className="space-y-4">
        {!isLogin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You'll need to login or
              create an account before placing your order.
            </p>
          </div>
        )}

        <div className="flex items-start space-x-2">
          <Checkbox
            checked={acceptTerms}
            onCheckedChange={(v) =>
              setAcceptTerms(v === true)
            }
          />
          <label className="text-sm text-muted-foreground leading-relaxed">
            I accept the{" "}
            <a
              href="/terms"
              className="text-primary hover:underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <Button
          disabled={!acceptTerms}
          onClick={handleProceedCheckout}
          className="w-full py-3 font-medium"
        >
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
};

export default PriceDetails;
