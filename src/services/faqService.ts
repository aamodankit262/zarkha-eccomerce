import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface FaqListParams {
  search?: string;
}

export const faqService = {
  list: async ({ search }: FaqListParams = {}) => {
    const formData = new FormData();

    if (search) {
      formData.append("search", search);
    }

    const res = await apiClient.post(
      API_ENDPOINTS.FAQ.LIST,
      formData
    );

    return res;
  },
};
