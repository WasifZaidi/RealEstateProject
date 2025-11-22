'use client'
import React, { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import { useParams } from 'next/navigation'
import CustomToast from "@/app/components/SideComponents/CustomToast";
import CustomLoader from "@/app/components/CustomLoader";

const Page = () => {
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [Errors, setErrors] = useState({})
    const [toast, setToast] = useState(null);
    const params = useParams()
    const token = params.id;
    const abortControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const validateFields = () => {
        const newErrors = {};
        if (!Password.trim()) newErrors.Password = "New password is required.";
        if (!ConfirmPassword.trim()) newErrors.ConfirmPassword = "Confirm password is required.";
        if (Password && ConfirmPassword && Password !== ConfirmPassword) {
            newErrors.ConfirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            setToast({ type: "error", message: "Please Provide Valid Password & Confirm Password." })
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resetPassword/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Password, ConfirmPassword }),
                signal: abortControllerRef.current.signal,
            });

            const data = await response.json();

            if (!response.ok) {
                setToast({ type: "error", message: data.message || "Unable to reset password. Please try again." })
                return;
            }

            setToast({ type: "success", message: "Your password has been reset successfully." });

            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            if (err.name === "AbortError") {
                console.log("Password reset request aborted.");
            } else {
                console.error("Password reset error:", err);
                setToast({ type: "error", message: "An error occurred. Please try again later." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Main Auth Container */}
            <div className={`w-full mx-auto my-[40px] border border-gray-200 max-w-md bg-white rounded-2xl shadow-xl p-8`}>
                {/* Title */}
                <div className="mb-6 text-center">
                    <h3 className={`text-2xl font-semibold text-gray-800 `}>
                        Reset Password
                    </h3>
                </div>

                {/* Form */}
                <form onSubmit={handleResetPassword} className="space-y-5">
                    {/* New Password Field */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="new_password"
                            className="text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="new_password"
                                className={`normal_input pr-10 ${Errors.Password && "normal_err"}`}
                                placeholder="Enter New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {Errors.Password && (
                            <span className="text-sm text-red-600">{Errors.Password}</span>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="confirm_password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={ConfirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                id="confirm_password"
                                className={`normal_input pr-10 ${Errors.ConfirmPassword && "normal_err"}`}
                                placeholder="Confirm New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {Errors.ConfirmPassword && (
                            <span className="text-sm text-red-600">{Errors.ConfirmPassword}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-[50px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                        Continue
                    </button>
                </form>
            </div>

            {/* Loading Overlay */}
            {loading && <CustomLoader message="Reseting your password" />}
            {toast && (
                <CustomToast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                    duration={3000}
                />
            )}
        </div>
    )
}

export default Page