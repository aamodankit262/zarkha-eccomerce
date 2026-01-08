import HeaderOtherPages from "@/components/common/HeaderOtherPages";
import { ArrowLeft, Download } from "lucide-react";

const TrackOrderPage = ({onBack}) => (
    <div className="min-h-screen bg-[#FAF6F2]">
      <HeaderOtherPages />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Delivery Address */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">Delivery Address</h3>
            <p className="font-medium mb-2">Name Customer Here</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Shop no 9-10, Ram mandir, Govind Marg, near DISCOUNT Fashion Hub,
              opp. Dashera Maidan, Raja Park, Jaipur, Rajasthan 302004
            </p>
            <p className="text-sm text-gray-600 mt-4">+91 8912345678</p>
          </div>

          {/* Order Info */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking No.</span>
                <span className="font-medium">12001220</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ship By</span>
                <span className="font-medium">DHL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">12001220</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">12-Nov-2024, 12:10 Pm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium text-green-600">Done</span>
              </div>
            </div>
          </div>

          {/* More Actions */}
          <div className="bg-[#FAF6F2] rounded-lg p-6">
            <h3 className="font-semibold mb-4">More Actions</h3>
            <button className="w-full flex items-center justify-center gap-3 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50">
              <Download className="h-5 w-5" />
              Download Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-6">Product Details</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 pb-6 border-b last:border-0">
                  <img
                    src="/product-1.jpg"
                    alt="Product"
                    className="w-20 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium mb-2">
                      Black LIVA Straight Printed 2 Piece Set
                    </p>
                    <p className="text-sm text-gray-600">Amount Paid: ₹ 1900</p>
                    <p className="text-sm text-gray-600">QTY: 02</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-6">Track Order</h3>
            <div className="bg-[#FAF6F2] rounded-md p-4 mb-6">
              <p>
                <strong>Tracking No.:</strong> 12001220
              </p>
              <p>
                <strong>Ship By:</strong> DHL
              </p>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300" />
              {[
                { label: "Order Confirmed", date: "Fri, 3rd Nov 2024, 12:30PM", done: true },
                { label: "Shipped", date: "Fri, 3rd Nov 2024, 12:30PM", done: true },
                { label: "Out For Delivery", date: "Expected soon", done: false },
                { label: "Delivered", date: "Pending", done: false },
              ].map((step, i) => (
                <div key={i} className="relative mb-8 last:mb-0">
                  <div
                    className={`absolute -left-9 w-5 h-5 rounded-full border-4 border-white ${step.done ? "bg-green-500" : "bg-gray-300"
                      }`}
                  />
                  <p className={`font-medium ${step.done ? "text-gray-900" : "text-gray-500"}`}>
                    {step.label}
                  </p>
                  <p className={`text-sm ${step.done ? "text-gray-600" : "text-gray-400"}`}>
                    {step.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
export default TrackOrderPage