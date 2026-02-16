import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Clock, CheckCircle, Download, CreditCard, Calendar, ArrowUpRight } from "lucide-react";
import { useAffiliate } from "@/contexts/AffiliateContext";
import { useApi } from "@/hooks/useApi";
import { affiliateService } from "@/services/affiliateService";
import { useEffect } from "react";

const AffiliateEarnings = () => {
  const { affiliate } = useAffiliate();
  const { data: earningsRes, request: getEarningsList } = useApi(affiliateService.getEarningsList);
  console.log(affiliate, 'Affiliate Data');
  useEffect(() => {
    getEarningsList();
  }, []);
  
  const earningsData = earningsRes?.body || [];
  const summary = earningsData?.summary || {};
  const pendingEarnings = earningsData?.pending_earnings || [];
  const paymentHistory = earningsData?.payment_history || []; 
  // console.log("Earnings List Data:", earningsData);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Earnings & Payments</h2>
          <p className="text-muted-foreground">Track your earnings and payment history</p>
        </div>
        {/* <Button className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Download Statement
        </Button> */}
      </div>

      {/* Earnings Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Total Earned</p>
                <p className="text-2xl font-bold text-green-800">₹{summary.total_earned ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700">Pending Payout</p>
                <p className="text-2xl font-bold text-orange-800">₹{summary.pending_payout ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Total Paid Out</p>
                <p className="text-2xl font-bold text-blue-800">₹{summary.total_paid_out ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Earnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingEarnings?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No pending earnings at the moment</p>
          )}
          {pendingEarnings?.map((earning, index) => (
            <div key={earning._id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{earning.period || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Expected: {earning.expected_date || "N/A"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">₹{earning.amount || 0}</p>
                <Badge variant={earning.status === "processing" ? "default" : "secondary"}>
                  {earning.status === "processing" ? "Processing" : "Pending"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No payment history available</p>
            )}
            {paymentHistory?.map((payment) => (
              <div key={payment._id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payment.date || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">{payment.details ?? "No details available"}</p>
                    {/* <p className="text-sm text-muted-foreground">{payment.method} • {payment.reference}</p> */}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">+₹{payment?.amount ?? 0}</p>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {payment.status === "completed" ? "Completed" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Bank Details Info */}
      {/* <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Payment Method: Bank Transfer</p>
                <p className="text-sm text-muted-foreground">HDFC Bank •••• 4521</p>
              </div>
            </div>
            <Button variant="outline">Update Bank Details</Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AffiliateEarnings;
