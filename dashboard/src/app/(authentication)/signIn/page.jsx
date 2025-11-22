"use client";
import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import CustomToast from "../../components/CustomToast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3001/api/dashboard/signIn",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setToast({ type: "error", message: data.message || "Not authorized" });
        return;
      }

      if (!response.ok) {
        setToast({ type: "error", message: data.message || "Something went wrong" });
        return;
      };
      console.log("login successfull")
      router.push("/")
    } catch (err) {
      setToast({ type: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden px-4 py-[24px]">

  {/* Decorative background elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-150px] right-[-150px] w-[300px] h-[300px] bg-indigo-200/40 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-[-120px] left-[-120px] w-[280px] h-[280px] bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-200"></div>
  </div>

  <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-10 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)]">

    {/* Logo / Heading */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Horizon Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome back! Please sign in to continue</p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`normal_input ${errors.email && "normal_err"}`}
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-600 text-sm font-medium">{errors.email}</p>
          </div>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`normal_input ${errors.email && "normal_err"}`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
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
        {errors.password && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-600 text-sm font-medium">{errors.password}</p>
          </div>
        )}
        <div className="text-right mt-3">
          <a href="/Forgot" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-all">
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(79,70,229,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>

    {/* Footer hints */}
    <div className="mt-6 text-center space-y-1">
      <p className="text-xs text-gray-500">
        Use any valid email and password ≥ 6 characters
      </p>
      <p className="text-xs text-gray-400 italic">
        This is a demo dashboard for <span className="font-semibold text-indigo-600">Horizon</span> — a product of <a href="https://softivy.com" target="_blank" className="text-blue-600 hover:underline">Softivy.com</a>
      </p>
    </div>
  </div>

  {/* Toast */}
  {toast && (
    <CustomToast
      type={toast.type}
      message={toast.message}
      onClose={() => setToast(null)}
    />
  )}
</div>


  );
};

export default LoginPage;
