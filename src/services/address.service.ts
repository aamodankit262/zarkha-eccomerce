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

export const getStateList = async (): Promise<any> => {
  const formData = new FormData();
  formData.append("country_id", "68481ffbfba1d82fccf0d2b4");
  const res = await apiClient.post(API_ENDPOINTS.LIST.STATES, formData);
  return res;
};

export const getCityList = async (stateId: string): Promise<any> => {
  const formdata = new FormData();
  formdata.append("state_id", stateId)
  const res = await apiClient.post(API_ENDPOINTS.LIST.CITY, formdata);
  return res;
};

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

  const res = await apiClient.del<ApiResponse<null>>(
    API_ENDPOINTS.ADDRESS.DELETE,
    {
      data: formData, 
    }
  );

  return res;
};

