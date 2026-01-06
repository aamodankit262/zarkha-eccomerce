import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { Coupon } from "@/pages/checkout/CheckoutPage"; // adjust path if needed

interface CouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupons: Coupon[];
  subtotal: number;
  onApplyCoupon: (coupon: Coupon) => void;
}

const CouponModal = ({
  open,
  onOpenChange,
  coupons,
  subtotal,
  onApplyCoupon,
}: CouponModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Available Coupons
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {coupons?.map((coupon) => {
            const isEligible = subtotal >= coupon.minOrder;

            return (
              <div
                key={coupon.code}
                className={`border rounded-lg p-4 transition ${
                  isEligible
                    ? "hover:border-primary cursor-pointer"
                    : "opacity-60"
                }`}
                onClick={() => isEligible && onApplyCoupon(coupon)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 px-3 py-1 rounded">
                      <span className="font-bold text-primary text-sm">
                        {coupon.code}
                      </span>
                    </div>

                    {coupon.type === "percentage" ? (
                      <span className="text-sm font-semibold text-foreground">
                        {coupon.discount}% OFF
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-foreground">
                        ₹{coupon.discount} OFF
                      </span>
                    )}
                  </div>

                  {isEligible && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Apply
                    </Button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {coupon.description}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  Min. order: ₹{coupon.minOrder}
                  {coupon.maxDiscount &&
                    ` • Max discount: ₹${coupon.maxDiscount}`}
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
  );
};

export default CouponModal;
