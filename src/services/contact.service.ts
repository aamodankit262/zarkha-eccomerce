import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface ContactPayload {
  name: string;
  mobile: string;
  email: string;
  subject: string;
  message: string;
}

export const contactForm = async (payload: ContactPayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const res = await apiClient.post(
    API_ENDPOINTS.CONTACT_US, // ✅ FIXED
    formData
  );

  return res;
};
