import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, ShoppingCart, DollarSign, Calendar, Package } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { affiliateService } from "@/services/affiliateService";

const AffiliateSales = () => {
  const [period, setPeriod] = useState("this-month");
  const { data: salesListData, request: getSalesList } = useApi(affiliateService.getSalesList);
  useEffect(() => {
    getSalesList();
  }, [])
  console.log("Sales List Data:", salesListData);
  const salesData = salesListData?.body || [];
  // const salesData = [
  //   {
  //     id: "ORD001",
  //     date: "2024-12-23",
  //     product: "Banarasi Silk Saree",
  //     customer: "Priya S.",
  //     amount: 4999,
  //     commission: 750,
  //     status: "completed",
  //     couponUsed: "JOH8K2M10"
  //   },
  //   {
  //     id: "ORD002",
  //     date: "2024-12-22",
  //     product: "Designer Lehenga Choli",
  //     customer: "Meera K.",
  //     amount: 8999,
  //     commission: 1620,
  //     status: "completed",
  //     couponUsed: "JOH8K2M15"
  //   },
  //   {
  //     id: "ORD003",
  //     date: "2024-12-21",
  //     product: "Embroidered Anarkali Kurti",
  //     customer: "Anita R.",
  //     amount: 2499,
  //     commission: 300,
  //     status: "pending",
  //     couponUsed: "JOH8K2M10"
  //   },
  //   {
  //     id: "ORD004",
  //     date: "2024-12-20",
  //     product: "Chanderi Cotton Suit",
  //     customer: "Deepa M.",
  //     amount: 3499,
  //     commission: 490,
  //     status: "completed",
  //     couponUsed: "JOH8K2M15"
  //   },
  //   {
  //     id: "ORD005",
  //     date: "2024-12-19",
  //     product: "Kundan Jewelry Set",
  //     customer: "Rekha B.",
  //     amount: 1999,
  //     commission: 200,
  //     status: "completed",
  //     couponUsed: "JOH8K2M10"
  //   },
  //   {
  //     id: "ORD006",
  //     date: "2024-12-18",
  //     product: "Patola Silk Saree",
  //     customer: "Sunita P.",
  //     amount: 6999,
  //     commission: 1120,
  //     status: "refunded",
  //     couponUsed: "JOH8K2M500"
  //   }
  // ];

  // const totalSales = salesData.reduce((sum, s) => s.status !== "refunded" ? sum + s.amount : sum, 0);
  // const totalCommission = salesData.reduce((sum, s) => s.status !== "refunded" ? sum + s.commission : sum, 0);
  // const completedOrders = salesData.filter(s => s.status === "completed").length;
  // const pendingOrders = salesData.filter(s => s.status === "pending").length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "refunded": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sales Analytics</h2>
          <p className="text-muted-foreground">Track sales generated through your referrals</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold text-foreground">{salesData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                {/* <p className="text-xl font-bold text-foreground">₹{totalSales.toLocaleString()}</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-xl font-bold text-green-600">₹0</p>
                {/* <p className="text-xl font-bold text-green-600">₹{totalCommission.toLocaleString()}</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-foreground">0</p>
                {/* <p className="text-xl font-bold text-foreground">{pendingOrders}</p> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Coupon</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Commission</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData?.map((sale:any) => (
                  <tr key={sale.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-2 font-mono text-sm">{sale.order_id}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{sale.date}</td>
                    <td className="py-3 px-2 text-sm font-medium">{sale.product.slice(0, 20)}{sale.product.length > 20 ? '...' : ''}</td>
                    <td className="py-3 px-2 text-sm">{sale.customer}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {sale.coupon || "N/A"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-right font-medium">₹{sale.amount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm text-right font-semibold text-green-600">
                      +₹{sale.commission.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                        {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateSales;
