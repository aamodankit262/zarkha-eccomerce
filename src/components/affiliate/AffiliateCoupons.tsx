import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Tag, Plus, Percent, Calendar, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { useApi } from "@/hooks/useApi";
import { affiliateService } from "@/services/affiliateService";
import dayjs from "dayjs";

const AffiliateCoupons = () => {
  const { affiliate } = useAffiliate();
  const { data: couponListData, request: getCouponList } = useApi(affiliateService.getCouponList);
  console.log(affiliate?.affiliate_id, "Affiliate Data in Coupons Component");
  useEffect(() => {
    getCouponList(affiliate?.affiliate_id);
  }, [])
  const coupons = couponListData?.body || [];
  console.log("Affiliate Coupons Data:", coupons);
  // const coupons = [
  //   {
  //       id: 1,
  //       code: `${affiliate?.referralCode}10`,
  //       discount: 10,
  //       type: "percentage",
  //       uses: 45,
  //       maxUses: 100,
  //       expiresAt: "2025-01-31",
  //       status: "active",
  //       earnings: 4500
  //   },
  //   {
  //     id: 2,
  //     code: `${affiliate?.referralCode}15`,
  //     discount: 15,
  //     type: "percentage",
  //     uses: 28,
  //     maxUses: 50,
  //     expiresAt: "2025-02-15",
  //     status: "active",
  //     earnings: 6720
  //   },
  //   {
  //     id: 3,
  //     code: `${affiliate?.referralCode}500`,
  //     discount: 500,
  //     type: "fixed",
  //     uses: 12,
  //     maxUses: 30,
  //     expiresAt: "2025-01-20",
  //     status: "active",
  //     earnings: 1800
  //   },
  //   {
  //     id: 4,
  //     code: `${affiliate?.referralCode}FESTIVE`,
  //     discount: 20,
  //     type: "percentage",
  //     uses: 100,
  //     maxUses: 100,
  //     expiresAt: "2024-12-31",
  //     status: "expired",
  //     earnings: 15000
  //   },
  //   {
  //     id: 5,
  //     code: `${affiliate?.referralCode}NEW`,
  //     discount: 25,
  //     type: "percentage",
  //     uses: 0,
  //     maxUses: 50,
  //     expiresAt: "2025-03-01",
  //     status: "active",
  //     earnings: 0
  //   }
  // ];

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  // const totalEarningsFromCoupons = coupons.reduce((sum, c) => sum + c.earnings, 0);
  // const totalUses = coupons.reduce((sum, c) => sum + c.uses, 0);
  // const activeCoupons = coupons.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Coupons</h2>
          <p className="text-muted-foreground">Manage your referral discount codes</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Request New Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Tag className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{coupons?.activeCoupons?? 0}</p>
            <p className="text-sm text-muted-foreground">Active Coupons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{coupons?.totalUses?? 0}</p>
            <p className="text-sm text-muted-foreground">Total Uses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Percent className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">₹{coupons?.totalEarnings?? 0}</p>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <div className="grid gap-4">
        {coupons?.map((coupon:any) => (
          <Card key={coupon?._id} className={coupon?.status === "expired" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg text-foreground">{coupon?.coupon_code}</span>
                      <button onClick={() => copyCoupon(coupon?.coupon_code)} className="text-muted-foreground hover:text-primary">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {coupon?.discount_type === "percentage" ? `${coupon?.discount_value}% off` : `₹${coupon?.discount_value} off`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {dayjs(coupon?.end_date).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Uses</p>
                    <p className="font-semibold">{coupon?.uses ?? 0}/{coupon?.maxUses ?? 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="font-semibold text-green-600">₹{coupon?.earnings ?? 0}</p>
                  </div>
                  <Badge variant={coupon?.status === "active" ? "default" : "secondary"}>
                    {coupon?.status === "active" ? "Active" : "Expired"}
                  </Badge>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Usage Progress</span>
                  <span>{Math.round((coupon?.uses ?? 0 / (coupon?.maxUses ?? 1)) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(coupon?.uses ?? 0 / (coupon?.maxUses ?? 1)) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AffiliateCoupons;
