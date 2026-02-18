import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

/* ------------------ Service ------------------ */
export interface BoutiqueSignupPayload {
  shop_name: string;
  owner_name: string;
  password: string;
  phone_number: string;
  shop_address?: string;
  email: string;
  gst_number: string;
  boutique_category_id: string;
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
    // const formData = new FormData();

    // formData.append("shop_name", payload.shop_name);
    // formData.append("owner_name", payload.owner_name);
    // formData.append("email", payload.email);
    // formData.append("password", payload.password);
    // formData.append("phone_number", payload.phone_number);
    // formData.append("shop_address", payload.shop_address || "");
    // formData.append("gst_number", payload.gst_number);
    // formData.append("boutique_category_id", payload.boutique_category_id);

    // if (payload.aadhaar_card) {
    //   formData.append("aadhaar_card", payload.aadhaar_card);
    // }
 
    const res = await apiClient.post<BoutiqueSignupResponse>(
      API_ENDPOINTS.BOUTIQUE.SIGNUP,
      payload
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
