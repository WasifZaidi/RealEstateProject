"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import CustomToast from "../components/SideComponents/CustomToast";
import CustomLoader from "../components/CustomLoader";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
    const [userName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Errors, setErrors] = useState({});
    const [Loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState(null);

    const router = useRouter();
    const abortControllerRef = useRef(null);

    // Abort any pending requests when unmounting
    useEffect(() => {
        return () => abortControllerRef.current?.abort();
    }, []);

    // ✅ Field validation
    const validateFields = () => {
        const newErrors = {};
        if (!userName.trim()) newErrors.userName = "User Name is required";
        if (!Email.trim()) newErrors.Email = "Email is required";
        if (!Password.trim()) newErrors.Password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle Signup
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            setToast({ type: "error", message: "Please fill all required fields." });
            return;
        }

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            setErrors({});

            const res = await fetch("http://localhost:3001/api/signUp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userName, Email, Password }),
                signal: abortControllerRef.current.signal,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setToast({
                    type: "error",
                    message: data.message || "Signup failed. Please try again.",
                });
                return;
            }

            setToast({ type: "success", message: data.message || "Signup successful" });
            setEmail("");
            setPassword("");
            setUserName("");
            router.push(`/OtpVerification/${data.userId}`);
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error(err);
                setToast({ type: "error", message: "Network error. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Google Signup/Login
    const googleSignUp = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            try {
                setLoading(true);

                const res = await fetch("http://localhost:3001/api/google-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ access_token: tokenResponse.access_token }),
                    signal: abortControllerRef.current.signal,
                });

                const data = await res.json();

                if (!res.ok) {
                    setToast({
                        type: "error",
                        message: data.message || "Google Signup/Login failed.",
                    });
                    return;
                }

                setToast({ type: "success", message: "Signup successful" });
                setEmail("");
                setPassword("");
                setUserName("");
                router.push("/");
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setToast({
                        type: "error",
                        message: "Google Signup/Login failed. Please try again.",
                    });
                }
            } finally {
                setLoading(false);
            }
        },
        onError: () =>
            setToast({ type: "error", message: "Google Signup/Login failed." }),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us and get started today</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                    <div className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${Errors.userName
                                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        }`}
                                    placeholder="Choose a username"
                                />
                            </div>
                            {Errors.userName && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-600 text-sm font-medium">{Errors.userName}</p>
                                </div>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${Errors.Email
                                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {Errors.Email && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={Password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${Errors.Password
                                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        }`}
                                    placeholder="Create a strong password"
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
                                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-600 text-sm font-medium">{Errors.Password}</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={Loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {Loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
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
                        onClick={() => googleSignUp()}
                        className="w-full border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-gray-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow"
                    >
                        <FcGoogle className="text-2xl" />
                        Sign up with Google
                    </button>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-gray-600 mt-8">
                    Already have an account?{" "}
                    <a href="/signin" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                        Sign In
                    </a>
                </p>
            </div>

            {/* Toast & Loader */}
            {toast && (
                <CustomToast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                    duration={3000}
                />
            )}
            {Loading && <CustomLoader message="Creating your account..." />}

        </div>
    );
};

export default SignUpPage;
