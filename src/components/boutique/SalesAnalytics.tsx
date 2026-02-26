import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Package,
  Users, Calendar, ArrowUpRight, ArrowDownRight, BarChart3,
  PieChart, LineChart, Target
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend
} from "recharts";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { logger } from "@/helper/logger";

// const salesData = ;
// const salesData = [
//   { month: 'Jan', sales: 45000, orders: 32, profit: 12500 },
//   { month: 'Feb', sales: 52000, orders: 38, profit: 14200 },
//   { month: 'Mar', sales: 48000, orders: 35, profit: 13100 },
//   { month: 'Apr', sales: 61000, orders: 45, profit: 16800 },
//   { month: 'May', sales: 55000, orders: 40, profit: 15200 },
//   { month: 'Jun', sales: 67000, orders: 52, profit: 18500 },
//   { month: 'Jul', sales: 72000, orders: 58, profit: 20100 },
// ];

const categoryData = [
  { name: 'Lehengas', value: 35, color: '#FF6B35' },
  { name: 'Sarees', value: 25, color: '#4CAF50' },
  { name: 'Kurta Sets', value: 20, color: '#2196F3' },
  { name: 'Anarkalis', value: 12, color: '#9C27B0' },
  { name: 'Others', value: 8, color: '#607D8B' },
];

const topProducts = [
  { name: 'Designer Lehenga Choli', sales: 45, revenue: 292455, growth: 12 },
  { name: 'Banarasi Silk Saree', sales: 38, revenue: 171000, growth: 8 },
  { name: 'Embroidered Kurta Set', sales: 35, revenue: 87465, growth: -3 },
  { name: 'Printed Cotton Anarkali', sales: 28, revenue: 50372, growth: 15 },
  { name: 'Festive Salwar Kameez', sales: 22, revenue: 61600, growth: 5 },
];

const SalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const { data, request } = useApi(boutiqueService.getAnalyticsSales)
  const { isLoggedIn } = useBoutique()
  useEffect(() => {
    if (isLoggedIn) {

      request();
    }
  }, [isLoggedIn])

  const salesBody = data?.body;
  const stats = salesBody?.kpis;
  const salesData = salesBody?.sales_profit_trend || [];
  // const salesData = salesBody?.sales_profit_trend?.map(item => ({
  //   month: item.date,
  //   sales: item.sales,
  //   profit: item.profit
  // })) || [];
  const orderTrend = salesBody?.orders_trend || [];
  const categoryData = salesBody?.sales_by_category || [];
  const topProducts = salesBody?.top_selling_products || [];
  const insights = salesBody?.quick_insights;
  // const orderTre
  logger.log(stats, 'sales body');
  // const stats = {
  //   totalSales: 400000,
  //   salesGrowth: 15.2,
  //   totalOrders: 285,
  //   ordersGrowth: 8.5,
  //   totalProfit: 110400,
  //   profitGrowth: 12.3,
  //   avgOrderValue: 1404,
  //   aovGrowth: 6.2,
  //   totalCustomers: 198,
  //   customersGrowth: 22.1,
  //   conversionRate: 3.8,
  //   conversionGrowth: 0.5
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Sales Analytics</h2>
          <p className="text-sm text-muted-foreground">Track your boutique performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="12m">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            {/* <div className="flex items-center justify-between mb-2">
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
              <Badge variant={stats.salesGrowth >= 0 ? "default" : "destructive"} className="text-xs">
                {stats.salesGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stats.salesGrowth)}%
              </Badge>
            </div> */}
            <p className="text-2xl font-bold">₹{((stats?.total_sales ?? 0) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Total Sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              {/* <Badge variant={stats?.ordersGrowth >= 0 ? "default" : "destructive"} className="text-xs">
                {stats.ordersGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stats.ordersGrowth)}%
              </Badge> */}
            </div>
            <p className="text-2xl font-bold">{stats?.total_orders}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              {/* <Badge variant={stats.profitGrowth >= 0 ? "default" : "destructive"} className="text-xs">
                {stats.profitGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stats.profitGrowth)}%
              </Badge> */}
            </div>
            <p className="text-2xl font-bold">₹{(stats?.total_profit / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Total Profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {/* <Badge variant={stats.aovGrowth >= 0 ? "default" : "destructive"} className="text-xs">
                {stats.aovGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stats.aovGrowth)}%
              </Badge> */}
            </div>
            <p className="text-2xl font-bold">₹{stats?.avg_order_value}</p>
            <p className="text-xs text-muted-foreground">Avg. Order Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {/* <Badge variant={stats.customersGrowth >= 0 ? "default" : "destructive"} className="text-xs">
                {stats.customersGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stats.customersGrowth)}%
              </Badge> */}
            </div>
            <p className="text-2xl font-bold">{stats?.customers}</p>
            <p className="text-xs text-muted-foreground">Customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              {/* <Badge variant={stats.conversionGrowth >= 0 ? "default" : "destructive"} className="text-xs">
                {stats.conversionGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(stats.conversionGrowth)}%
              </Badge> */}
            </div>
            <p className="text-2xl font-bold">{stats?.conversion_rate}%</p>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <LineChart className="h-4 w-4 text-brand-orange" />
                Sales & Profit Trend
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(value) => `₹${value / 1000}K`} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                    labelStyle={{ color: '#333' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#FF6B35"
                    fill="#FF6B35"
                    fillOpacity={0.2}
                    name="Sales"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    fillOpacity={0.2}
                    name="Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-brand-orange" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    // label={({ name, category_name }) => `${value}%`}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Trend & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-brand-orange" />
              Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#FF6B35" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-brand-orange" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-sm font-bold text-brand-orange">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{(product.revenue / 1000).toFixed(1)}K</p>
                    <div className="flex items-center gap-1 text-xs">
                      {product.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={product.growth >= 0 ? "text-green-500" : "text-red-500"}>
                        {Math.abs(product.growth)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Best Day</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {insights?.best_day?.day || "—"}
              </p>
              <p className="text-xs text-green-700">
                {insights?.best_day?.percentage ?? 0}% of sales
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Top Category</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{insights?.top_category?.category_name}</p>
              <p className="text-xs text-blue-700">{insights?.top_category?.percentage ?? 0}% of total sales</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Repeat Customers</span>
              </div>
              <p className="text-lg font-bold text-purple-900">{insights?.repeat_customers?.percentage ?? 0}%</p>
              <p className="text-xs text-purple-700">Return within 90 days</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">  
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Monthly Target</span>
              </div>
              <p className="text-lg font-bold text-orange-900">{insights?.monthly_target?.percentage ?? 0}%</p>
              <p className="text-xs text-orange-700">₹56K more to goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAnalytics;
