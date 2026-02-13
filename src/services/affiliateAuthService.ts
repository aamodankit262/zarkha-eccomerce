import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* ------------------ Service ------------------ */
export interface AffiliateSignupPayload {
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

export interface AffiliateSignupResponse {
  success: boolean;
  message: string;
  data?: any
  body?: any
}

/* ------------------ Login ------------------ */
export interface AffiliateLoginPayload {
  email: string;
  password: string;
}

export interface AffiliateLoginResponse {
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


export const affiliateAuthService = {
  /** AFFILIATE SIGNUP */
  signup: async (payload: AffiliateSignupPayload) => {
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

    const res = await apiClient.post<AffiliateSignupResponse>(
      API_ENDPOINTS.AFFILIATE.SIGNUP,
      formData
    );

    return res;
  },

  /** AFFILIATE LOGIN */
  login: async (payload: AffiliateLoginPayload) => {
    const formData = new URLSearchParams();

    formData.append("email", payload.email);
    formData.append("password", payload.password);

    const res = await apiClient.post<AffiliateLoginResponse>(
      API_ENDPOINTS.AFFILIATE.LOGIN,
      formData,
      // {
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      // }
    );

    return res;
  },
};
