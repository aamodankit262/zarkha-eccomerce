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

/** Get cart list */
export const getAddressList = async (): Promise<any> => {
  const res = await apiClient.post(API_ENDPOINTS.ADDRESS.LIST,);
  return res;
};
export const createAddress = async (payload: AddressPayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const res = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.ADDRESS.CREATE,
    formData
  );

  return res;
};
export const updateAddress = async (payload: UpdateAddressPayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const res = await apiClient.put<ApiResponse<any>>(
    API_ENDPOINTS.ADDRESS.EDIT,
    formData
  );

  return res;
};
export const deleteAddress = async (addressId: string) => {
  const formData = new FormData();
  formData.append("id", addressId);

  const res = await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.ADDRESS.DELETE,
    formData
  );

  return res;
};
