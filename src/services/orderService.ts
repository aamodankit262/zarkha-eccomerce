import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* ------------------ Types ------------------ */

export interface CreateOrderPayload {
  address_id: string;
  payment_method: "online" | "cod";
  cart_id: string;
  customer_notes?: string;
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
  /** CREATE ORDER */
  createOrder: async (payload: CreateOrderPayload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const res = await apiClient.post(
      API_ENDPOINTS.ORDERS.CREATE,
      formData
    );

    return res;
  },

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
};
