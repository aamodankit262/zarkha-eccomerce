// src/store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { UserInterface } from "@/types/authInterface";
import { authService } from "@/services/authService";

interface AuthState {
  isLogin: boolean;
  isLoading: boolean;
  otpSent: boolean;
  token: string | null;
  userDetails: UserInterface | null;
  mobile: string | null;
  error: string | null;

  sendOtp: (name: string, mobile: string) => Promise<void>;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isLogin: false,
        isLoading: false,
        otpSent: false,
        token: null,
        userDetails: null,
        mobile: null,
        error: null,

        //  Dummy Send OTP
        sendOtp: async (name, mobile) => {
          set({ isLoading: true, error: null });

          try {
            const res = await authService.sendOtp({
              full_name: name,
              phone: mobile,
            });

            set({
              otpSent: true,
              userDetails: { name, mobile } as UserInterface,
              mobile,
            });
          } catch (err: any) {
            set({
              error: err?.message || "Failed to send OTP",
            });
            throw err; // 🔥 important: propagate error to UI if needed
          } finally {
            set({ isLoading: false });
          }
        },


        verifyOtp: async (mobile, otp) => {
          set({ isLoading: true, error: null });

          try {
            const res = await authService.verifyOtp({ phone: mobile, otp });

            if (otp.length !== 4) {
              throw new Error("Invalid OTP");
            }

            set({
              token: res.token ?? "dummy_token",
              isLogin: true,
              otpSent: false,
            });
          } catch (err: any) {
            set({
              error: err?.message || "OTP verification failed",
            });
            throw err;
          } finally {
            set({ isLoading: false });
          }
        },


        logout: () => {
          set({
            isLogin: false,
            token: null,
            userDetails: null,
            otpSent: false,
            mobile: null,
            error: null,
          });
          localStorage.removeItem("zarkha-auth");
        },
      }),
      {
        name: "zarkha-auth",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
