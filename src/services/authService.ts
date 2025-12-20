import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface SendOtpPayload {
  full_name: string;
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  token: string;
  message: string;
  user: {
    id: string;
    name: string;
    phone: string;
    profile_photo?: string;
    created_at: string;
  };
}

export const authService = {
  // ✅ POST (NOT GET)
  sendOtp: async (
    payload: SendOtpPayload
  ): Promise<SendOtpResponse> => {
    return apiClient.post<SendOtpResponse>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      payload
    );
  },

  // ✅ POST (NOT GET)
  verifyOtp: async (
    payload: VerifyOtpPayload
  ): Promise<VerifyOtpResponse> => {
    return apiClient.post<VerifyOtpResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      payload
    );
  },
};
