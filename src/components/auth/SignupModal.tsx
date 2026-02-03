import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { logoImage } from "@/api/endpoints";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const { sendOtp, verifyOtp, otpSent, isLoading, error } = useAuthStore()
  const { toast } = useToast();
  const [showOTP, setShowOTP] = useState(false);
  const [countdown, setCountdown] = useState(35);
  const [notifyMe, setNotifyMe] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: ["", "", "", ""],
  });
  // const { signup, login } = useAuth();
  // const [mobile, setMobile] = useState("");
  // const [name, setName] = useState("");
  // const [otp, setOtp] = useState("");
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  // useEffect(() => {
  //   if (otpSent) {
  //     setShowOTP(true);
  //     setCountdown(35);
  //   }
  // }, [otpSent]);
  useEffect(() => {
    if (!showOTP || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOTP, countdown]);

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   if (showOTP && countdown > 0) {
  //     timer = setInterval(() => {
  //       setCountdown((prev) => prev - 1);
  //     }, 1000);
  //   }
  //   return () => clearInterval(timer);
  // }, [showOTP, countdown]);

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

    await sendOtp(formData.name, formData.phone);
    setShowOTP(true);
    toast({
      title: "OTP Sent",
      description: "Please check your phone for the verification code.",
    });
  };


  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...formData.otp];
      newOTP[index] = value;
      setFormData({ ...formData, otp: newOTP });

      if (value && index < 3) {
        const nextInput = document.getElementById(
          `otp-${index + 1}`
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = formData.otp.join("");

    if (otpString.length !== 4) {
      toast({
        title: "Error",
        description: "Please enter 4 digit OTP",
        variant: "destructive",
      });
      return;
    }

    await verifyOtp(formData.phone, otpString);

    toast({
      title: "Success",
      description: "Account created successfully!",
    });

    onClose();
    setShowOTP(false);
    setFormData({ name: "", phone: "", otp: ["", "", "", ""] });
  };

  const handleBack = () => {
    setShowOTP(false);
    setFormData({ ...formData, otp: ["", "", "", ""] });
    setCountdown(35);
  };

  const handleResendOTP = async () => {
    setCountdown(35);
    setFormData({ ...formData, otp: ["", "", "", ""] });

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
            <img
              src="/login.webp"
              alt="Fashion model"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[350px]">
              <img
                src="/login_mode.webp"
                alt="Fashion model"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 bg-[#FAF6F2] flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              <div className="text-center mb-8">
                <img
                  src={logoImage}
                  alt="Zarkha"
                  className="h-8 mx-auto"
                // onClick={() => navigate("/")}
                />
              </div>

              {!showOTP ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
                    Sign in / Sign up
                  </h2>
                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Your Full Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <div className="flex items-center border border-gray-300 rounded-l-lg px-3 py-2 bg-white">
                          <span className="text-orange-500 mr-1">🇮🇳</span>
                          <span className="text-sm text-gray-600">+91</span>
                        </div>
                        <input
                          type="tel"
                          placeholder="Enter Mobile Number"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                            })
                          }

                          className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                          maxLength={10}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your 10-digit mobile number to continue
                      </p>
                    </div>
                    {/* <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify"
                        checked={notifyMe}
                        onChange={(e) => setNotifyMe(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label
                        htmlFor="notify"
                        className="ml-2 text-sm text-gray-600"
                      >
                        Notify Me With Offers & Updates
                      </label>
                    </div> */}
                    {/* <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      Send OTP
                    </button> */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-lg"
                    >
                      {isLoading ? "Please wait..." : "Send OTP"}
                    </button>
                  </form>
                  <div className="mt-6 text-center text-xs text-gray-500">
                    I Accept That I Have Read & Understood Your{" "}
                    <a href="#" className="text-orange-500 underline">
                      Privacy Policy
                    </a>{" "}
                    And{" "}
                    <a href="#" className="text-orange-500 underline">
                      T&Cs
                    </a>
                    .
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      onClick={handleBack}
                      className="text-gray-500 hover:text-gray-700 mr-3"
                    >
                      ←
                    </button>
                    <div className="text-center flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Verification Code Sent To
                      </h2>
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-sm text-gray-600">
                          +91 {formData.phone}
                        </span>
                        <button
                          onClick={handleBack}
                          className="ml-2 text-xs text-green-600 border border-green-600 rounded px-2 py-1 hover:bg-green-50"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleOTPSubmit} className="space-y-6">
                    <div className="flex justify-center space-x-4">
                      {formData.otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) =>
                            handleOTPChange(index, e.target.value)
                          }
                          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          maxLength={1}
                        />
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        For demo purpose: Enter any 4-digit code
                      </p>
                    </div>
                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500">
                          🕐 Resend OTP In{" "}
                          {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                          {String(countdown % 60).padStart(2, "0")}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="text-sm text-orange-500 hover:underline"
                        >
                          🕐 Resend OTP
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      Submit
                    </button>
                  </form>
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
