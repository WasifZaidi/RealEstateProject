"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomToast from "../components/SideComponents/CustomToast";
import CustomLoader from "../components/CustomLoader";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const abortControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        if (!email) {
            setErrors({ email: "Email is Required" });
            setToast({ type: "error", message: "Please enter your email address." });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors({ email: "Please enter a valid email address" });
            setToast({ type: "error", message: "Please enter a valid email address." });
            return;
        }

        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);

            const response = await fetch("http://localhost:3001/api/forgotPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email: email }),
                signal: abortControllerRef.current.signal,
            });

            const data = await response.json();

            if (!response.ok) {
                setToast({ type: "error", message: data.message || "Unable to process request. Please try again." });
                return;
            }

            setToast({ type: "success", message: "If this email is registered, a password reset link has been sent." });
            setEmail("");
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Forgot password request aborted.");
            } else {
                console.error("Forgot password error:", err);
                setToast({ type: "error", message: "An error occurred. Please try again later." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-8`}>
            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-2`}>
                        Forgot Password
                    </h3>
                    <p className="text-gray-600 text-sm">
                        We will send a verification link to your email
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleForgotPassword} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label htmlFor="signin_email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="signin_email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                errors.email 
                                ? "border-red-500 bg-red-50" 
                                : "border-gray-300 bg-gray-50 hover:bg-white"
                            }`}
                            placeholder="Enter your email address"
                            disabled={loading}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm font-medium">{errors.email}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Sending...
                            </div>
                        ) : (
                            "Continue"
                        )}
                    </button>
                </form>

                {/* Back to Sign In Link */}
                <div className="text-center mt-6">
                    <Link 
                        href="/SignIn" 
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 inline-flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Go Back to Sign In
                    </Link>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && <CustomLoader message="Please Wait" />}

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

export default Page;