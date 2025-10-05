"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import CustomToast from "../components/SideComponents/CustomToast"; // ✅ Import your toast component
import CustomLoader from "../components/CustomLoader";
import { FcGoogle } from "react-icons/fc";

const Page = () => {
  const [Email, SetEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [Errors, setErrors] = useState({});
  const [Loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const abortControllerRef = useRef(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // === Field Validation ===
  const validateFields = () => {
    const newErrors = {};
    if (!Email.trim()) newErrors.Email = "Email is required";
    if (!Password.trim()) newErrors.Password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === Email / Password Login ===
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      setErrors({});
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Email, Password }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.log("yeah it runs")
        let msg = "Sign-in failed. Please try again.";
        switch (response.status) {
          case 400:
            msg = "Please provide both email and password.";
            break;
          case 401:
            msg = "Invalid email or password.";
            setErrors({ Email: "Check your email", Password: "Check your password" });
            break;
          case 403:
            msg = "Your account is not verified. Please check your email.";
            break;
          default:
            msg = data.message || msg;
        }

        setToast({ type: "error", message: msg });
        return;
      }

      // Success flow
      SetEmail("");
      setPassword("");
      setToast({ type: "success", message: "Sign-in successful!" });
      router.push("/");
    } catch (err) {
      if (err.name !== "AbortError") {
        setToast({ type: "error", message: "Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  // === Google Login ===
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });

        if (!response.ok) {
          setToast({ type: "error", message: "Google SignIn failed." });
          return;
        }

        setToast({ type: "success", message: "SignIn Successful" });
        SetEmail("");
        setPassword("");
        router.push("/");
      } catch {
        setToast({ type: "error", message: "Google login failed. Please try again." });
      } finally {
        setLoading(false);
      }
    },
    onError: () => setToast({ type: "error", message: "Google login failed. Please try again." }),
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={Email}
                    onChange={(e) => SetEmail(e.target.value)}
                    className={`w-full pl-4 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${Errors.Email
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      }`}
                    placeholder="you@example.com"
                  />

                </div>
                {Errors.Email && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm font-medium">{Errors.Email}</p>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-4 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${Errors.Password
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {Errors.Password && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm font-medium">{Errors.Password}</p>
                  </div>
                )}
                <div className="text-right mt-3">
                  <a href="/Forgot" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={Loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {Loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              onClick={() => googleLogin()}
              className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-gray-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{" "}
            <a href="/SignUp" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Create Account
            </a>
          </p>
        </div>
      </div>

      {
        toast && (
          <CustomToast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            duration={3000}
          />
        )
      }

    </>

  );
};

export default Page;
