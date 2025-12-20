import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Smartphone, Wallet } from "lucide-react";

interface PaymentOptionsProps {
  onPaymentComplete: () => void;
  onBack: () => void;
  totalAmount: number;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  onPaymentComplete, 
  onBack, 
  totalAmount 
}) => {
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: ""
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
        </div>

        <div className="space-y-4">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPayment === "card" 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPayment("card")}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedPayment === "card"}
                onChange={() => setSelectedPayment("card")}
                className="text-orange-500 focus:ring-orange-500"
              />
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-foreground">Debit/Credit Card</p>
                <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPayment === "upi" 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPayment("upi")}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedPayment === "upi"}
                onChange={() => setSelectedPayment("upi")}
                className="text-orange-500 focus:ring-orange-500"
              />
              <Smartphone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-foreground">UPI</p>
                <p className="text-sm text-gray-600">Pay using UPI ID</p>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPayment === "razorpay" 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedPayment("razorpay")}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedPayment === "razorpay"}
                onChange={() => setSelectedPayment("razorpay")}
                className="text-orange-500 focus:ring-orange-500"
              />
              <Wallet className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-foreground">Razorpay</p>
                <p className="text-sm text-gray-600">Multiple payment options</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPayment === "card" && (
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Number
              </label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  number: formatCardNumber(e.target.value)
                })}
                className="h-12 border-gray-200"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expiry Date
                </label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    expiry: formatExpiry(e.target.value)
                  })}
                  className="h-12 border-gray-200"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CVV
                </label>
                <Input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                  })}
                  className="h-12 border-gray-200"
                  maxLength={3}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cardholder Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  name: e.target.value
                })}
                className="h-12 border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      {selectedPayment === "upi" && (
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold text-foreground mb-4">UPI Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                UPI ID
              </label>
              <Input
                type="text"
                placeholder="yourname@paytm"
                value={upiDetails.upiId}
                onChange={(e) => setUpiDetails({
                  ...upiDetails,
                  upiId: e.target.value
                })}
                className="h-12 border-gray-200"
              />
            </div>
          </div>
        </div>
      )}

      {selectedPayment === "razorpay" && (
        <div className="bg-card rounded-lg p-6 border">
          <div className="text-center py-8">
            <Wallet className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Razorpay Gateway</h3>
            <p className="text-gray-600 text-sm">
              You will be redirected to Razorpay to complete your payment securely
            </p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-lg p-6 border">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-lg font-semibold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-foreground">₹{totalAmount}</span>
          </div>
          
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 font-medium text-lg h-14"
          >
            {isProcessing 
              ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              )
              : `Pay ₹${totalAmount}`
            }
          </Button>
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <span>•</span>
            <span>SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;