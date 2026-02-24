import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { logoImage } from "@/api/endpoints";
import { Link } from "react-router-dom";
import OTPInput from "../OtpInput";
import { logger } from "@/helper/logger";


interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const { sendOtp, verifyOtp, isLoading, error } = useAuthStore();
  const { toast } = useToast();

  const [showOTP, setShowOTP] = useState(false);
  const [countdown, setCountdown] = useState(35);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);

  // useEffect(() => {
  //   if (error) {
  //     toast({
  //       title: "Error",
  //       description: error,
  //       variant: "destructive",
  //     });
  //   }
  // }, [error, toast]);

  useEffect(() => {
    if (!showOTP || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOTP, countdown]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      toast({
        title: "sorry",
        description: "Enter valid 10 digit mobile number",
        variant: "destructive",
      });
      return;
    }

    const res = await sendOtp(formData.name, formData.phone);
    // console.log("OTP send response:", res);
    setShowOTP(true);
    // toast({
    //   title: "OTP Sent",
    //   description: "Please check your phone for the verification code.",
    // });
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 4) return;

    const res: any = await verifyOtp(formData.phone, code);
    logger.log("OTP verification response", res);
    // toast({
    //   title: "Success",
    //   description: "Account created successfully!",
    // });

    onClose();
    setShowOTP(false);
    setFormData({ name: "", phone: "" });
    setOtp(["", "", "", ""]);
  };

  const handleBack = () => {
    setShowOTP(false);
    setOtp(["", "", "", ""]);
    setCountdown(35);
  };

  const handleResendOTP = async () => {
    setCountdown(35);
    setOtp(["", "", "", ""]);

    await sendOtp(formData.name, formData.phone);

    toast({
      title: "OTP Resent",
      description: "Please check your phone for the new OTP.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white">
        <div className="flex min-h-[600px]">
          <div className="hidden md:block w-1/2 relative">
            <img src="/login.webp" alt="Fashion model" className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[350px]">
              <img src="/login_mode.webp" alt="Fashion model" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 bg-[#FAF6F2] flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-8">
                <img src={logoImage} alt="Zarkha" className="h-8 mx-auto" />
              </div>

              {!showOTP ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
                    Sign in / Sign up
                  </h2>

                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <div className="flex">
                        <div className="flex items-center border border-gray-300 rounded-l-lg px-3 py-2 bg-white">
                          <span className="text-orange-500 mr-1">🇮🇳</span>
                          <span className="text-sm text-gray-600">+91</span>
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter Mobile Number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                            })
                          }
                          className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                          min={10}
                          maxLength={10}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-lg"
                    >
                      {isLoading ? "Please wait..." : "Send OTP"}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-xs text-gray-500">
                    I Accept That I Have Read & Understood Your {" "}
                    <Link to="/privacy-policy" className="text-orange-500 underline">Privacy Policy</Link> And {" "}
                    <Link to="/terms" className="text-orange-500 underline">T&Cs</Link>.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 mr-3">←</button>

                    <div className="text-center flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">Verification Code Sent To</h2>
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-sm text-gray-600">+91 {formData.phone}</span>
                        <button
                          onClick={handleBack}
                          className="ml-2 text-xs text-green-600 border border-green-600 rounded px-2 py-1 hover:bg-green-50"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <OTPInput
                      length={4}
                      value={otp}
                      onChange={setOtp}
                      onComplete={handleVerify}
                    />

                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500">
                          🕐 Resend OTP In {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                          {String(countdown % 60).padStart(2, "0")}
                        </p>
                      ) : (
                        <button type="button" onClick={handleResendOTP} className="text-sm text-orange-500 hover:underline">
                          🕐 Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
