import React, { useEffect, useRef } from "react";

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 4,
  value,
  onChange,
  onComplete,
  autoFocus = true,
}) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Focus first input when mounted
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return; // allow only single digit number

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    // Move to next input
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Trigger onComplete
    if (newOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const newOtp = [...value];
        newOtp[index] = "";
        onChange(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (!pasteData) return;

    const newOtp = pasteData.slice(0, length).split("");

    const filledOtp = Array.from({ length }, (_, i) => newOtp[i] || "");
    onChange(filledOtp);

    // focus last filled input
    const lastIndex = Math.min(newOtp.length - 1, length - 1);
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex]?.focus();
    }

    if (filledOtp.every((digit) => digit !== "") && onComplete) {
      onComplete(filledOtp.join(""));
    }
  };

  return (
    <div className="flex justify-center space-x-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="tel"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        />
      ))}
    </div>
  );
};

export default OTPInput;
