import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CartSlider = () => {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCart();

  const [currentStep] = useState(0);
  const steps = ["Cart", "Address & Shipping", "Payment"];
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(id, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={closeCart} />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <span
                  className={`text-sm ${
                    index === currentStep
                      ? "text-orange-500 font-medium"
                      : index < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <span className="mx-2 text-gray-300">→</span>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm text-gray-900 mb-1 leading-tight pr-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                          Size: {item.size}, Color: {item.color}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden h-7 w-[72px]">
                          <div className="flex-1 flex items-center justify-center text-sm font-medium text-gray-900">
                            {item.quantity}
                          </div>
                          <div className="flex flex-col border-l border-gray-300 h-full w-[28px]">
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="flex-1 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-t border-gray-300"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="font-semibold text-sm">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-[#FAF6F2]">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-medium text-gray-900">
                  Estimated Total
                </span>
                <span className="text-xl font-bold text-gray-900">₹{getTotalPrice()}</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Tax Included. Shipping And Discounts Calculated At Checkout.
              </p>
              <button
                onClick={() => {
                  closeCart()
                  navigate("/checkout");
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-base font-medium rounded-lg transition-colors"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};