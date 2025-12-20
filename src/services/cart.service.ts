import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import axios from "axios";

const API_BASE = "https://staging.admin.zarkha.com/api/web/products/cart";

export interface AddToCartPayload {
    cart_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
}

/** Get cart list */
export const getCartList = async (cartId: string) => {
    const formData = new FormData();
    formData.append("cart_id", cartId);

    //   const { data } = await axios.post(API_BASE, formData);
    const response = await apiClient.post(API_ENDPOINTS.CART.GET, formData)
    return response;
};

/** Add to cart */
export const addToCartApi = async (payload: AddToCartPayload) => {
    const formData = new FormData();
    formData.append("cart_id", payload.cart_id);
    formData.append("product_id", payload.product_id);
    formData.append("variant_id", payload.variant_id);
    formData.append("quantity", String(payload.quantity));

    // const { data } = await axios.post(`${API_BASE}/add`, formData);
    const response = await apiClient.post(API_ENDPOINTS.CART.ADD, formData);
    return response;
};
