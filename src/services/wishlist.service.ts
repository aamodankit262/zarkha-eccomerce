import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * Wishlist Services
 */
export const wishlistService = {

  add: async (productId: string) => {
    const formData = new FormData();
    formData.append("product_id", productId);

    const res = await apiClient.post(
      API_ENDPOINTS.WISHLIST.ADD,
      formData
    );

    return res;
  },

  remove: async (productId: string) => {
    const formData = new FormData();
    formData.append("product_id", productId);

    const res = await apiClient.post(
      API_ENDPOINTS.WISHLIST.REMOVE,
      formData
    );

    return res;
  },
 
  list: async (page = 1, limit = 20) => {
    const formData = new FormData();
    formData.append("page", String(page));
    formData.append("limit", String(limit));

    const res = await apiClient.post(
      API_ENDPOINTS.WISHLIST.LIST,
      formData
    );

    return res;
  }
};
