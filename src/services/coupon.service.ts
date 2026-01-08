import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AddressPayload, UpdateAddressPayload } from "@/types";


interface ApiResponse<T> {
  success: boolean;
  message: string;
  body: T;
  total_pages: number;
  filtered_by: object
}
export interface CouponPayload {
  cart_id: string;
  coupon_code : string;
}

export const getCouponList = async (): Promise<any> => {
  const res = await apiClient.get(API_ENDPOINTS.COUPON.LIST);
  return res;
};

export const applyCoupon = async (payload: CouponPayload): Promise<any> => {
  const formdata = new FormData();
   Object.entries(payload).forEach(([k, v]) =>
    formdata.append(k, String(v))
  );
  const res = await apiClient.post(API_ENDPOINTS.COUPON.APPLY, formdata);
  return res;
};

export const removeCoupon = async (cartId: string) => {
  const formData = new FormData();
  formData.append("cart_id ", cartId);

  const res = await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.COUPON.REMOVE,
    formData
  );

  return res;
};

