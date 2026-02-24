import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, ShoppingCart, DollarSign, Calendar, Package } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { affiliateService } from "@/services/affiliateService";
import Pagination from "../ecommerce/Pagination";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   return (
//     <div className="flex items-center justify-center gap-2 mt-6">
//       {/* Prev */}
//       <button
//         disabled={currentPage === 1}
//         onClick={() => onPageChange(currentPage - 1)}
//         className="px-3 py-1 text-sm border rounded
//           disabled:opacity-50 disabled:cursor-not-allowed
//           hover:bg-gray-100"
//       >
//         Prev
//       </button>

//       {/* Page Numbers */}
//       {Array.from({ length: totalPages }, (_, i) => {
//         const page = i + 1;
//         return (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`px-3 py-1 text-sm border rounded
//               ${page === currentPage
//                 ? "bg-primary text-white"
//                 : "hover:bg-gray-100"
//               }`}
//           >
//             {page}
//           </button>
//         );
//       })}

//       {/* Next */}
//       <button
//         disabled={currentPage === totalPages}
//         onClick={() => onPageChange(currentPage + 1)}
//         className="px-3 py-1 text-sm border rounded
//           disabled:opacity-50 disabled:cursor-not-allowed
//           hover:bg-gray-100"
//       >
//         Next
//       </button>
//     </div>
//   );
// };
const AffiliateSales = () => {
  const [period, setPeriod] = useState("this-month");
  const [page, setPage] = useState(1);
  const { data: salesListData, request: getSalesList } = useApi(affiliateService.getSalesList);
  const limit = 20;

  useEffect(() => {
    getSalesList({ page, limit, period });
  }, [page, period])
  // console.log("Sales List Data:", salesListData);
  const getbodyData = salesListData?.body || {};
  const salesData = getbodyData?.recent_sales || [];
  const salesSummary = getbodyData?.summary || {};
  const pagination = salesListData?.pagination || {};
  // console.log("Pagination Info:", pagination);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "refunded": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
const handlePeriodChange = (value: string) => {
  setPeriod(value);
  setPage(1); // reset to first page
};
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Sales Analytics</h2>
            <p className="text-muted-foreground">Track sales generated through your referrals</p>
          </div>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="today">Today</SelectItem> */}
              {/* <SelectItem value="this-week">This Week</SelectItem> */}
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
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
                  <p className="text-xl font-bold text-foreground">{salesSummary?.total_orders ?? 0}</p>
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
                  <p className="text-xl font-bold text-foreground">₹{salesSummary?.total_sales ?? 0}</p>
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
                  <p className="text-xl font-bold text-green-600">₹{salesSummary?.commission ?? 0}</p>

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
                  <p className="text-xl font-bold text-foreground">{salesSummary?.pending_orders ?? 0}</p>
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
                  {salesData?.map((sale: any) => (
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
          {salesData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No sales found
              </p>
            </div>
          )}
          {pagination?.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            // onPageChange={(p) => setPage(p)}
            />
          )}
        </Card>

      </div>
    </>
  );
};

export default AffiliateSales;
