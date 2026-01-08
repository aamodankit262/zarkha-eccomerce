import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AddressPayload, UpdateAddressPayload } from "@/types";

export const CMS_TYPES = {
  ABOUT: "about-us",
  CONTACT: "contact-us",
  FAQ: "faq",
  PRIVACY: "privacy-policy",
  TERMS: "terms-and-conditions",
  SHIPPING: "shipping-policy",
  RETURN: "return-policy",
} as const;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  body: T;
  total_pages: number;
  filtered_by: object
}

export const getCms = async (type: string) => {
  const formData = new FormData();
  formData.append("type", type);

  const res = await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.CMS,
    formData
  );

  return res;
};

