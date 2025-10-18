"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import CustomToast from "../../components/SideComponents/CustomToast";
import CustomLoader from "../../components/CustomLoader";

const EmailOtpPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const otpRefs = useRef([]);
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL query param ?newEmail=
    const newEmail = searchParams.get("newEmail");
    if (newEmail) {
      const decodedEmail = decodeURIComponent(newEmail);
      setEmail(decodedEmail);

      // Optionally store it for later use
      sessionStorage.setItem("userEmail", decodedEmail);
    } else {
      // Fallback: check sessionStorage
      const storedEmail = sessionStorage.getItem("userEmail");
      if (storedEmail) setEmail(storedEmail);
    }
  }, [searchParams])

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      setOtp((prev) => prev.map((d, i) => (i === index ? value : d)));
      if (index < otp.length - 1) otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const combinedOtp = otp.join("");
      const res = await fetch("http://localhost:3001/api/verifyOtpEmailChange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: combinedOtp }),
      });

      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", message: "OTP verified successfully" });
        sessionStorage.removeItem("unverfIedUserId");
        sessionStorage.removeItem("userEmail");
        router.push("/");
      } else {
        setToast({ type: "error", message: data.message || "OTP verification failed" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    const maskedUser =
      user.length <= 2
        ? user[0] + "*"
        : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];
    return `${maskedUser}@${domain}`;
  };

  const handleResendOtp = async () => {
  setResendLoading(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sendOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ newEmail: email }),
    });

    const data = await res.json();

    if (res.status === 429) {
      // Too Many Requests: respect server cooldown
      setToast({ type: "error", message: data.message });
      setResendCooldown(data.retryAfter || 60);
    } else if (data.success) {
      setToast({ type: "success", message: "OTP sent successfully!" });
      setResendCooldown(60);
    } else {
      setToast({ type: "error", message: data.message || "Failed to resend OTP" });
    }
  } catch (err) {
    console.error(err);
    setToast({ type: "error", message: "Something went wrong. Try again later." });
  } finally {
    setResendLoading(false);
  }
};

useEffect(() => {
  if (resendCooldown > 0) {
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }
}, [resendCooldown]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 relative transition-all duration-300 hover:shadow-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h3>
          <p className="text-sm text-gray-600">
            We sent a verification code to{" "}
            <span className="font-semibold text-gray-800">
              {email ? maskEmail(email) : "your email"}
            </span>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleOtpVerify} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-2">
            {otp.map((val, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleOtpChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>

          {/* Helper Text */}
          <p className="text-xs text-center text-gray-500 mb-4">
            Enter the 6-digit code sent to your email
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.some(digit => digit === '')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Didn't receive the code?
          </p>
          <button
  onClick={handleResendOtp}
  disabled={resendCooldown > 0 || resendLoading}
  className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mx-auto"
>
  {resendLoading ? (
    <div className="flex items-center">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
      Sending...
    </div>
  ) : resendCooldown > 0 ? (
    `Resend code in ${resendCooldown}s`
  ) : (
    <div className="flex items-center">
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Resend OTP
    </div>
  )}
</button>

        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-700 font-medium">Verifying your code...</p>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <CustomToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default EmailOtpPage;
