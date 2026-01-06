declare global {
  interface Window {
    Razorpay: any;
  }
}

export const openRazorpay = ({ amount, orderId, user, onSuccess, onFailure }: any) => {
  const rzp = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY,
    amount: amount * 100,
    currency: "INR",
    order_id: orderId,
    name: "Your Store",
    prefill: user,
    handler: onSuccess,
    modal: { ondismiss: onFailure },
  });

  rzp.open();
};
