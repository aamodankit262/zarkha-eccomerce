import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";


interface ApiResponse<T> {
  success: boolean;
  message: string;
  body: T;
  total_pages: number;
  filtered_by: object
}

/** Get cart list */
export const getAddressList = async (): Promise<any> => {
  const res = await apiClient.post(API_ENDPOINTS.ADDRESS.LIST,);
  return res;
};

/** Add to cart */
// export const addToCartApi = async (payload: AddToCartPayload) => {
//   const formData = new FormData();
//   Object.entries(payload).forEach(([k, v]) =>
//     formData.append(k, String(v))
//   );

//   const res = await apiClient.post<{
//     success: boolean;
//     message: string;
//     cart_id: string;
//     cart: CartResponse;
//   }>(API_ENDPOINTS.CART.ADD, formData);

//   return {
//     cartId: res.cart_id,
//     cart: res.cart,
//   };
// };
