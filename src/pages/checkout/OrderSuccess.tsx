import React from "react";
import { X } from "lucide-react";

interface OrderSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ isOpen, onClose, orderId }) => {
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
            src="/payment-success.webp" // <-- replace with your provided image
            alt="Order Success"
            className="w-36 h-36 object-contain"
          />
        </div>

        {/* Success Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Order Placed Successfully
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Thank You For Your Purchase — We’re Getting Your Order Ready And Will
          Update You Soon!
        </p>
        <p className="text-gray-800 font-medium mb-6">
          Your Order ID: <span className="font-bold">{orderId}</span>
        </p>
        {/* Ok Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
        >
          Ok
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
