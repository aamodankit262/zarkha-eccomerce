import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { availableCoupons, Coupon } from "./CheckoutPage";

interface Props {
  subtotal: number;
  couponCode: string;
  setCouponCode: (v: string) => void;
  appliedCoupon: Coupon | null;
  onApply: (c: Coupon) => void;
  onRemove: () => void;
  showModal: boolean;
  setShowModal: (v: boolean) => void;
}

const CouponSection = ({
  subtotal,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApply,
  onRemove,
  showModal,
  setShowModal,
}: Props) => {
  return (
    <>
      <div className="bg-card rounded-lg p-4 mb-4">
        <h3 className="font-medium mb-2">Apply Coupon</h3>

        {appliedCoupon ? (
          <div>
            <p className="text-green-600">{appliedCoupon.code}</p>
            <Button size="sm" onClick={onRemove}>Remove</Button>
          </div>
        ) : (
          <>
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button onClick={() => setShowModal(true)}>View Coupons</Button>
          </>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          {availableCoupons.map((coupon) => (
            <div key={coupon.code} onClick={() => onApply(coupon)}>
              {coupon.code}
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CouponSection;
