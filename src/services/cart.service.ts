import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface AddToCartPayload {
  cart_id: string;
  product_id: string;
  item_id: string;
  quantity: number;
}

/* ---------- TYPES ---------- */

export interface CartItem {
  _id: string;
  product_id: string;
  // variant_id: string;
  item_id: string;
  quantity: number;
  product_title?: string;
  product_image?: string;
  price: number;
  discount_price?: number;
}

export interface CartResponse {
  cart_id: string;
  items: CartItem[];
  total_price: number;
}

/* ---------- API CALLS ---------- */

/** Get cart list */
export const getCartList = async (cartId: string): Promise<CartResponse> => {
  const formData = new FormData();
  formData.append("cart_id", cartId);

  const res = await apiClient.post<{
    success: boolean;
    cart: CartResponse;
  }>(API_ENDPOINTS.CART.GET, formData);

  return res.cart; // ✅ correct
};

/** Add to cart */
export const addToCartApi = async (payload: AddToCartPayload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([k, v]) =>
    formData.append(k, String(v))
  );

  const res = await apiClient.post<{
    success: boolean;
    message: string;
    cart_id: string;
    cart: CartResponse;
  }>(API_ENDPOINTS.CART.ADD, formData);

  return {
    cartId: res.cart_id,
    cart: res.cart,
  };
};
export const UpdateQuantities = async (
  cartId: string,
  productId: string,
  variantId: string,
  quantity: number
) => {
  return apiClient.post(API_ENDPOINTS.CART.UPDATE, {
    cart_id: cartId,
    product_id: productId,
    item_id: variantId,
    quantity,
  });
}
export const RemoveProduct = async (
  cartId: string,
  productId: string,
  variantId: string,
) => {
  return apiClient.post(API_ENDPOINTS.CART.REMOVE, {
    cart_id: cartId,
    product_id: productId,
    item_id: variantId,
  });
}
