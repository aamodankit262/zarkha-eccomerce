import React from "react";
import { X } from "lucide-react";

interface PaymentFailedProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({
  isOpen,
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full relative text-center p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Placeholder Image */}
        <div className="flex justify-center mb-4">
          <img
            src="/payment-failed.webp" // <-- replace with your failed image
            alt="Payment Failed"
            className="w-28 h-28 object-contain"
          />
        </div>

        {/* Failure Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Something Went Wrong With Your Transaction. Please Try Again Or Use A
          Different Payment Method.
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
        >
          Re-Try
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
