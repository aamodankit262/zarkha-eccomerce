import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, ShoppingCart, Heart, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logoImage from "/lovable-uploads/77d75687-0e00-4b74-8bf1-7c96b5fd6f5e.png";
import { useAuthStore } from "@/store/authStore";

const TrackOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { logout, isLogin } = useAuthStore();
  const { toast } = useToast();

  // Redirect if not logged in - track order requires authentication
  if (!isLogin) {
    toast({
      title: "Login Required",
      description: "Please login to track your orders.",
      variant: "destructive"
    });
    navigate("/");
    return null;
  }

  // Sample order data - in real app this would be fetched based on orderId
  const orderData = {
    id: orderId || "12001220",
    trackingNo: "12001220",
    shipBy: "DHL",
    orderDate: "12-Nov-2024, 12:10 Pm",
    payment: "Done",
    deliveryAddress: {
      name: "Name Customer Here Show",
      address: "Shop no 9-10, Ram mandir, Govind Marg, near DISCOUNT Fashion Hub, opp. Dashera Maidan, Raja Park, Jaipur, Rajasthan 302004",
      phone: "+91 8912345678"
    },
    products: [
      {
        id: 1,
        name: "Black LIVA Straight Printed 2 Piece Set",
        image: "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png",
        amount: 1900,
        quantity: 2
      },
      {
        id: 2,
        name: "Black LIVA Straight Printed 2 Piece Set",
        image: "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png",
        amount: 1900,
        quantity: 2
      },
      {
        id: 3,
        name: "Black LIVA Straight Printed 2 Piece Set",
        image: "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png",
        amount: 1900,
        quantity: 2
      }
    ],
    trackingStatus: [
      {
        status: "Order Confirmed",
        date: "Fri, 3rd Nov 2024, 12:30PM",
        completed: true
      },
      {
        status: "Shipped",
        date: "Fri, 3rd Nov 2024, 12:30PM",
        completed: true
      },
      {
        status: "Out For Delivery",
        date: "",
        completed: false
      },
      {
        status: "Delivery",
        date: "",
        completed: false
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <img src={logoImage} alt="Zarkha" className="h-10" />
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-1 text-gray-700">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm hidden md:inline">Search</span>
              </div>
              <div 
                onClick={() => navigate("/cart")}
                className="flex items-center gap-1 text-gray-700 cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm hidden md:inline">Cart</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm hidden md:inline">Favourites</span>
              </div>
              <Button 
                onClick={logout}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                <span className="hidden sm:inline">SIGN UP / SIGN IN</span>
                <span className="sm:hidden">SIGN IN</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </button>
            <span className="hidden sm:inline">{'>'}</span>
            <button 
              onClick={() => navigate("/dashboard")}
              className="hover:text-gray-900 hidden sm:inline"
            >
              My Orders
            </button>
            <span className="hidden sm:inline">{'>'}</span>
            <span className="hidden sm:inline">Track Order</span>
            <span className="hidden sm:inline">{'>'}</span>
            <span className="font-medium text-gray-900">{orderData.id}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{orderData.deliveryAddress.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  {orderData.deliveryAddress.address}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Phone Number</h4>
                <p className="text-xs sm:text-sm text-gray-600">{orderData.deliveryAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking No.:</span>
                <span className="font-medium">{orderData.trackingNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ship By:</span>
                <span className="font-medium">{orderData.shipBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">{orderData.orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="font-medium">{orderData.payment}</span>
              </div>
            </div>
          </div>

          {/* More Actions */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">More Actions</h2>
            <div className="space-y-3">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
                <FileText className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full text-orange-500 border-orange-500 hover:bg-orange-50 text-xs sm:text-sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Products Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Products Details</h2>
            <div className="space-y-4 sm:space-y-6">
              {orderData.products.map((product) => (
                <div key={product.id} className="flex gap-3 sm:gap-4">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2">
                      {product.name}
                    </h3>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div>Amount Paid: ₹{product.amount}</div>
                      <div>Total QTY: {product.quantity.toString().padStart(2, '0')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track Order */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Track Order</h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm mb-4 sm:mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking No.:</span>
                <span className="font-medium">{orderData.trackingNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ship By:</span>
                <span className="font-medium">{orderData.shipBy}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-4 sm:space-y-6">
                {orderData.trackingStatus.map((status, index) => (
                  <div key={index} className="relative flex items-start gap-3 sm:gap-4">
                    <div className={`relative z-10 w-6 h-6 rounded-full border-2 ${
                      status.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-gray-200 border-gray-300'
                    }`}>
                      {status.completed && (
                        <div className="absolute inset-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <h3 className={`font-medium text-sm sm:text-base ${
                        status.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {status.status}
                      </h3>
                      {status.date && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {status.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;