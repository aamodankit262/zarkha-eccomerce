import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, CreditCard, IndianRupee, Calendar, Download,
  CheckCircle, Clock, RefreshCw, Filter, Search, TrendingUp
} from "lucide-react";
import { useBoutique } from "@/contexts/BoutiqueContext";

const BoutiquePayment = () => {
  const navigate = useNavigate();
  const { payments, isLoggedIn, sales } = useBoutique();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isLoggedIn) {
    navigate('/boutique/login');
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesSearch = payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalReleased = payments.filter(p => p.status === 'released').reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0);
  const totalProcessing = payments.filter(p => p.status === 'processing').reduce((a, p) => a + p.amount, 0);
  const totalSales = sales.reduce((acc, sale) => acc + (sale.sellingPrice * sale.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/boutique/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-warm-brown">Payments</h1>
            <p className="text-sm text-muted-foreground">Manage your earnings</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-orange/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                  <p className="text-lg font-bold">₹{totalSales.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Released</p>
                  <p className="text-lg font-bold">₹{totalReleased.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Processing</p>
                  <p className="text-lg font-bold">₹{totalProcessing.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold">₹{totalPending.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment History
              </CardTitle>
              <span className="text-sm text-muted-foreground">{filteredPayments.length} payments</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-4">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payments found</p>
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">ID: {payment.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {payment.period}
                        </div>
                      </div>
                    </div>
                    
                    {payment.releaseDate && (
                      <>
                        <Separator className="my-3" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Released on</span>
                          <span className="font-medium">{payment.releaseDate}</span>
                        </div>
                      </>
                    )}

                    {payment.status === 'released' && (
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download Receipt
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Details Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <IndianRupee className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Payment Information</p>
                <p className="text-sm text-blue-700 mt-1">
                  Payments are processed every 15 days. Pending amounts will be credited to your registered bank account within 3-5 business days after processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoutiquePayment;
