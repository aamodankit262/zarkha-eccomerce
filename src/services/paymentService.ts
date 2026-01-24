import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface CreatePaymentOrderPayload {
  amount: number;      // in rupees
  cart_id: string;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  message: string;
  body: {
    order_id: string;
    amount: number;
    amount_in_rupees: number;
    currency: string;
    receipt: string;
    status: string;
    key_id: string;
    created_at: number;
  };
}

/* ------------------ Verify Payment ------------------ */
export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  address_id: string
  cart_id?: string
  customer_notes?: string
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  body?: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    verified: boolean
    order: {
      order_id: string;
      total_amount: number;
      items_count: number;
      payment_method: string;
      order_status: string;
      _id: string;
      ordered_at: string;
    };
  };
}

export const paymentService = {
  /** CREATE RAZORPAY ORDER */
  createPaymentOrder: async (
    payload: CreatePaymentOrderPayload
  ) => {
    const params = new URLSearchParams();

    params.append("amount", String(payload.amount));
    params.append("cart_id", payload.cart_id);

    const res = await apiClient.post<CreatePaymentOrderResponse>(
      API_ENDPOINTS.PAYMENT.CREATE_ORDER,
      params,
      // {
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      // }
    );

    return res;
  },

  /** VERIFY RAZORPAY PAYMENT */
  verifyPayment: async (
    payload: VerifyPaymentPayload
  ) => {
    const params = new URLSearchParams();

    params.append("razorpay_order_id", payload.razorpay_order_id);
    params.append("razorpay_payment_id", payload.razorpay_payment_id);
    params.append("razorpay_signature", payload.razorpay_signature);
    params.append("address_id", payload.address_id);
    params.append("cart_id", payload.cart_id);
    params.append("customer_notes", payload.customer_notes);

    const res = await apiClient.post<VerifyPaymentResponse>(
      API_ENDPOINTS.PAYMENT.VERIFY,
      params,
      // {
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      // }
    );

    return res;
  },
};
