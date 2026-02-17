import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* ------------------ Service ------------------ */
export interface BoutiqueSignupPayload {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  country?: string;
  state_id: string;
  city_id: string;
  affiliate_category_id: string;
  aadhaar_card?: File | null;
}

export interface BoutiqueSignupResponse {
  success: boolean;
  message: string;
  data?: any
  body?: any
}

/* ------------------ Login ------------------ */
export interface BoutiqueLoginPayload {
  email: string;
  password: string;
}

export interface BoutiqueLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  // data?:any
  body?: {
    _id: string;
    affiliate_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    affiliate_category: string;
    aadhaar_card?: File;
    status: "pending" | "approved" | "rejected";
    createdAt: string;

  };
}


export const boutiqueAuthService = {
  /** BOUTIQUE SIGNUP */
  signup: async (payload: BoutiqueSignupPayload) => {
    const formData = new FormData();

    formData.append("full_name", payload.full_name);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("phone_number", payload.phone_number);
    formData.append("state_id", payload.state_id);
    formData.append("city_id", payload.city_id);
    formData.append("affiliate_category_id", payload.affiliate_category_id);

    if (payload.aadhaar_card) {
      formData.append("aadhaar_card", payload.aadhaar_card);
    }

    const res = await apiClient.post<BoutiqueSignupResponse>(
      API_ENDPOINTS.BOUTIQUE.SIGNUP,
      formData
    );

    return res;
  },

  /** BOUTIQUE LOGIN */
  login: async (payload: BoutiqueLoginPayload) => {
    const formData = new URLSearchParams();

    formData.append("email", payload.email);
    formData.append("password", payload.password);

    const res = await apiClient.post<BoutiqueLoginResponse>(
      API_ENDPOINTS.BOUTIQUE.LOGIN,
      formData,
    );
    return res;
  },
};
