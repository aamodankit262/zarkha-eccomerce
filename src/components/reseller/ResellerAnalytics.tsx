import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Package,
  Users, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, LineChart, Target
} from "lucide-react";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend
} from "recharts";

const salesData = [
  { month: 'Jan', sales: 35000, orders: 25, profit: 9500 },
  { month: 'Feb', sales: 42000, orders: 30, profit: 11200 },
  { month: 'Mar', sales: 38000, orders: 28, profit: 10100 },
  { month: 'Apr', sales: 51000, orders: 38, profit: 13800 },
  { month: 'May', sales: 45000, orders: 33, profit: 12200 },
  { month: 'Jun', sales: 57000, orders: 42, profit: 15500 },
  { month: 'Jul', sales: 62000, orders: 48, profit: 17100 },
];

const categoryData = [
  { name: 'Kurta Sets', value: 30, color: '#FF6B35' },
  { name: 'Lehengas', value: 25, color: '#4CAF50' },
  { name: 'Sarees', value: 22, color: '#2196F3' },
  { name: 'Anarkalis', value: 15, color: '#9C27B0' },
  { name: 'Others', value: 8, color: '#607D8B' },
];

const topProducts = [
  { name: 'Embroidered Silk Kurta Set', sales: 40, revenue: 99960, growth: 15 },
  { name: 'Designer Lehenga Choli', sales: 32, revenue: 207968, growth: 10 },
  { name: 'Banarasi Silk Saree', sales: 28, revenue: 126000, growth: -2 },
  { name: 'Printed Cotton Anarkali', sales: 22, revenue: 39578, growth: 18 },
  { name: 'Festive Salwar Kameez', sales: 18, revenue: 50400, growth: 7 },
];

const ResellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = {
    totalSales: 330000, salesGrowth: 12.8,
    totalOrders: 244, ordersGrowth: 7.2,
    totalProfit: 89400, profitGrowth: 10.5,
    avgOrderValue: 1352, aovGrowth: 5.1,
    totalCustomers: 165, customersGrowth: 18.3,
    conversionRate: 3.2, conversionGrowth: 0.4
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-xl font-bold">Sales Analytics</h2><p className="text-sm text-muted-foreground">Track your reseller performance</p></div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Time Range" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
        {[
          { icon: IndianRupee, value: `₹${(stats.totalSales / 1000).toFixed(0)}K`, label: 'Total Sales', growth: stats.salesGrowth },
          { icon: ShoppingCart, value: stats.totalOrders, label: 'Total Orders', growth: stats.ordersGrowth },
          { icon: TrendingUp, value: `₹${(stats.totalProfit / 1000).toFixed(0)}K`, label: 'Total Profit', growth: stats.profitGrowth },
          { icon: Package, value: `₹${stats.avgOrderValue}`, label: 'Avg. Order Value', growth: stats.aovGrowth },
          { icon: Users, value: stats.totalCustomers, label: 'Customers', growth: stats.customersGrowth },
          { icon: Target, value: `${stats.conversionRate}%`, label: 'Conversion Rate', growth: stats.conversionGrowth },
        ].map((stat, idx) => (
          <Card key={idx}><CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <Badge variant={stat.growth >= 0 ? "default" : "destructive"} className="text-xs">
                {stat.growth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stat.growth)}%
              </Badge>
            </div>
            <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><LineChart className="h-4 w-4 text-brand-orange" />Sales & Profit Trend</CardTitle></CardHeader>
          <CardContent><div className="h-[220px] sm:h-[280px]"><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="sales" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.2} name="Sales" />
              <Area type="monotone" dataKey="profit" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.2} name="Profit" />
            </AreaChart>
          </ResponsiveContainer></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><PieChart className="h-4 w-4 text-brand-orange" />Sales by Category</CardTitle></CardHeader>
          <CardContent><div className="h-[220px] sm:h-[280px]"><ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={({ value }) => `${value}%`}>
                {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie><Legend /><Tooltip formatter={(value) => [`${value}%`, 'Share']} />
            </RechartsPieChart>
          </ResponsiveContainer></div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-brand-orange" />Orders Trend</CardTitle></CardHeader>
          <CardContent><div className="h-[200px] sm:h-[250px]"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="orders" fill="#FF6B35" radius={[4, 4, 0, 0]} name="Orders" /></BarChart>
          </ResponsiveContainer></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-brand-orange" />Top Selling Products</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-sm font-bold text-brand-orange">{idx + 1}</div>
                  <div><p className="font-medium text-sm line-clamp-1">{product.name}</p><p className="text-xs text-muted-foreground">{product.sales} sold</p></div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">₹{(product.revenue/1000).toFixed(1)}K</p>
                  <div className="flex items-center gap-1 text-xs">
                    {product.growth >= 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                    <span className={product.growth >= 0 ? "text-green-500" : "text-red-500"}>{Math.abs(product.growth)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResellerAnalytics;