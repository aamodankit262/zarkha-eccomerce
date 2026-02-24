import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* ------------------ Types ------------------ */

export interface CreateOrderPayload {
  address_id: string;
  payment_method: "online" | "cod";
  cart_id: string;
  customer_notes?: string;
}
export interface OrderUpdateStatusPayload {
  order_id: string;
  order_status: "confirmed" | "pending" | "cancelled"; // adjust if more
}
export interface OrderCancelPayload {
  order_id: string;
  reason: string;
}
export interface OrderListPayload {
  page?: number;
  limit?: number;
  search?: string;
}

export interface OrderViewPayload {
  order_id: string;
}

/* ------------------ Services ------------------ */

export const orderService = {
  
 
  /** ORDER LIST */
  getOrderList: async (payload: OrderListPayload) => {
    const formData = new FormData();

    formData.append("page", String(payload.page ?? 1));
    formData.append("limit", String(payload.limit ?? 5));
    if (payload.search) {
      formData.append("search", payload.search);
    }
    const res = await apiClient.post(
      API_ENDPOINTS.ORDERS.LIST,
      formData
    );

    return res;
  },

  /** VIEW ORDER DETAILS */
  getOrderDetails: async (orderId: string) => {
    const formData = new FormData();
    formData.append("order_id", orderId);

    const res = await apiClient.post(
      API_ENDPOINTS.ORDERS.VIEW,
      formData
    );

    return res;
  },
  
  updateOrderStatus: async (payload: OrderUpdateStatusPayload) => {
    const formData = new FormData();
    formData.append("order_id", payload.order_id);
    formData.append("order_status", payload.order_status);

    const res = await apiClient.post(
      API_ENDPOINTS.ORDERS.UPDATE,
      formData
    );

    return res;
  },
  cancelOrder: async (payload: OrderCancelPayload) => {
    const formData = new FormData();
    formData.append("order_id", payload.order_id);
    formData.append("reason", payload.reason);

    const res = await apiClient.post(
      API_ENDPOINTS.ORDERS.CANCEL,
      formData
    );

    return res;
  },
};
