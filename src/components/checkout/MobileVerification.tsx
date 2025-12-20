import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

interface MobileVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onBack: () => void;
}

const MobileVerification: React.FC<MobileVerificationProps> = ({
  phoneNumber,
  onVerified,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    setError("");
    setIsVerifying(true);

    // Check if OTP is 123456
    if (otpString === "123456") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsVerifying(false);
      onVerified();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsVerifying(false);
      setError("Invalid OTP. Please use 123456");
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">
          Mobile Verification
        </h2>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Verify Your Mobile Number
            </h3>
            <p className="text-gray-600 text-sm">
              We have sent a 6-digit verification code to
            </p>
            <p className="text-foreground font-medium">{phoneNumber}</p>
            <p className="text-orange-500 text-sm font-medium mt-2">
              Use code: 123456
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Enter Verification Code
            </label>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-medium border-gray-200 focus:border-orange-500"
                  maxLength={1}
                />
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </div>

          <div className="text-center">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Resend OTP in{" "}
                <span className="font-medium text-orange-500">{timer}s</span>
              </p>
            ) : (
              <Button
                variant="link"
                onClick={handleResendOtp}
                className="text-orange-500 hover:text-orange-600 p-0 h-auto text-sm"
              >
                Resend OTP
              </Button>
            )}
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={otp.join("").length !== 6 || isVerifying}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-medium text-base h-12"
          >
            {isVerifying ? "Verifying..." : "Verify & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileVerification;
