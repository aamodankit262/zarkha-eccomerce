/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserInterface {
  id: string;
  phone: any;
  mobile?: string;
  name?: string;
  profile_photo?: string;
  created_at?: string
}

export interface LoginRequest {
  mobileNumber: string;
  // mobile: string;
}

export interface LoginResponse {
  // status: boolean;
  success: boolean;
  mobile: number;
  data: {
    token: string;
    user: UserInterface | undefined;
  };
  message: string;
}
export interface VerifyOTPRequest {
  mobileNumber: any;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  data: undefined;
  access_token?: string;
  message?: string;
}
