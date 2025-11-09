"use client";
import React, { useCallback, useMemo, useState } from "react";
import CustomToast from "@/app/components/CustomToast";
import {
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Award,
  Globe,
  Link as LinkIcon,
  Calendar,
  Languages,
  Upload,
  CheckCircle,
  XCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------- Reusable InputField ------------------- */
const InputField = React.memo(function InputField({
  icon: Icon,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  error,
  required,
  inputClass = "",
  disabled,
}) {
  const showError = Boolean(error);
  return (
    <div className="flex flex-col">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-blue-400 transition-colors duration-200 group-focus-within:text-blue-500" />
        </div>

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder + (required ? " *" : "")}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete="off"
          aria-invalid={showError}
          aria-describedby={showError ? `${name}-error` : undefined}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 outline-none transition-all duration-300 ease-in-out bg-white text-gray-800 placeholder-gray-400
            hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:shadow-md
            [autofill:background-color:transparent] autofill:bg-transparent
            ${showError ? "border-red-500 focus:ring-red-100 focus:border-red-500" : "border-gray-200"}
            ${inputClass}`}
        />

        {showError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      <div className="min-h-[1.25rem] mt-1">
        {showError ? (
          <p
            id={`${name}-error`}
            className="text-red-500 text-sm flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            {error}
          </p>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
    </div>
  );
});

/* ------------------- TextAreaField ------------------- */
const TextAreaField = React.memo(function TextAreaField({
  icon: Icon,
  name,
  value,
  placeholder,
  rows = 3,
  onChange,
  error,
}) {
  const showError = Boolean(error);
  return (
    <div className="flex flex-col">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none">
          <Icon className="h-5 w-5 text-blue-400 transition-colors duration-200 group-focus-within:text-blue-500" />
        </div>

        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          autoComplete="off"
          aria-invalid={showError}
          aria-describedby={showError ? `${name}-error` : undefined}
          className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400
            hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:shadow-md
            outline-none resize-none transition-all duration-300 ease-in-out
            [autofill:background-color:transparent] autofill:bg-transparent
            ${showError ? "border-red-500 focus:ring-red-100 focus:border-red-500" : ""}`}
        />
      </div>

      <div className="min-h-[1.25rem] mt-1">
        {showError ? (
          <p
            id={`${name}-error`}
            className="text-red-500 text-sm flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            {error}
          </p>
        ) : (
          <div className="h-[1rem]" />
        )}
      </div>
    </div>
  );
});

const CreateAgentPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    designation: "",
    licenseNumber: "",
    experienceYears: "",
    specialization: "",
    languages: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    website: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  /* ------------------- Validation ------------------- */
  const validateField = useCallback((name, value) => {
    const val = (value || "").trim();

    switch (name) {
      case "firstName":
      case "lastName":
      case "designation":
      case "licenseNumber":
      case "specialization":
        if (!val) return "This field is required";
        if (val.length < 2) return "Too short";
        return "";

      case "email":
        if (!val) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return "Invalid email format";
        return "";

      case "phone":
        if (!val) return "Phone number is required";
        if (!/^\+?[0-9]{7,15}$/.test(val)) return "Enter valid phone number";
        return "";

      case "bio":
        if (!val) return "Bio is required";
        if (val.length < 10) return "Bio too short";
        return "";

      case "experienceYears":
        if (!val) return "Experience is required";
        if (!/^\d+$/.test(val)) return "Must be numeric";
        if (val < 0 || val > 100) return "Invalid experience";
        return "";

      case "languages":
        if (!val) return "Languages required";
        return "";

      case "facebook":
      case "instagram":
      case "linkedin":
      case "twitter":
      case "website":
        if (!val) return "This link is required";
        if (!/^https?:\/\/\S+\.\S+$/.test(val))
          return "Enter a valid URL (include http:// or https://)";
        return "";

      default:
        return "";
    }
  }, []);

  const validateAll = useCallback(() => {
    const next = {};
    Object.keys(formData).forEach((k) => {
      const msg = validateField(k, formData[k]);
      if (msg) next[k] = msg;
    });
    if (!image) next._image = "Profile image (600x700) is required";
    return next;
  }, [formData, validateField, image]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    // Prevent non-numeric input for experienceYears
    if (name === "experienceYears" && /[^0-9]/.test(value)) return;

    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  /* ------------------- Image Upload ------------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setToast({
        type: "error",
        message: `Unsupported file type: ${file.name} (Allowed: JPEG, PNG, WebP)`,
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width !== 600 || img.height !== 700) {
        setToast({
          type: "error",
          message: `Invalid image dimensions: ${img.width}x${img.height}. Required: 600x700`,
        });
        setImage(null);
        setPreview(null);
      } else {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    };
    img.src = URL.createObjectURL(file);
  };

  /* ------------------- Submit ------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateAll();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      setToast({ type: "error", message: "Please fix highlighted fields" });
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v ?? ""));
      fd.append("file", image);

      const res = await fetch("http://localhost:3001/api/dashboard/agent/create", {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create agent");

      setToast({ type: "success", message: "Agent created successfully!" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        designation: "",
        licenseNumber: "",
        experienceYears: "",
        specialization: "",
        languages: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        website: "",
      });
      setImage(null);
      setPreview(null);
      setErrors({});
      router.push("/")
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- Bind Helper ------------------- */
  const bind = (name) => ({
    value: formData[name],
    onChange: handleChange,
    error: errors[name],
  });

  /* ------------------- Render ------------------- */
  return (
    <div className="min-h-screen px-4 py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Create Agent Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in the details to create a new agent profile
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={User} name="firstName" placeholder="First Name" required {...bind("firstName")} />
                <InputField icon={User} name="lastName" placeholder="Last Name" required {...bind("lastName")} />
                <InputField icon={Mail} name="email" placeholder="Email Address" required {...bind("email")} />
                <InputField icon={Phone} name="phone" placeholder="Phone Number" required {...bind("phone")} />
              </div>
            </section>

            {/* Professional Details */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" /> Professional Details
              </h2>
              <TextAreaField icon={FileText} name="bio" placeholder="Professional Bio" {...bind("bio")} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[10px]">
                <InputField icon={Briefcase} name="designation" placeholder="Designation" {...bind("designation")} />
                <InputField icon={Award} name="licenseNumber" placeholder="License Number" {...bind("licenseNumber")} />
                <InputField icon={Calendar} name="experienceYears" placeholder="Years of Experience" {...bind("experienceYears")} />
                <InputField icon={Award} name="specialization" placeholder="Specialization" {...bind("specialization")} />
                <InputField icon={Languages} name="languages" placeholder="Languages (comma separated)" {...bind("languages")} />
              </div>
            </section>

            {/* Social Links */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-purple-600" /> Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={Facebook} name="facebook" placeholder="Facebook URL" required {...bind("facebook")} />
                <InputField icon={Instagram} name="instagram" placeholder="Instagram URL" required {...bind("instagram")} />
                <InputField icon={Linkedin} name="linkedin" placeholder="LinkedIn URL" required {...bind("linkedin")} />
                <InputField icon={Twitter} name="twitter" placeholder="Twitter URL" required {...bind("twitter")} />
                <InputField icon={Globe} name="website" placeholder="Personal/Company Website" required {...bind("website")} />
              </div>
            </section>

            {/* Upload Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" />
                Profile Image
              </h2>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (600x700 required)
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center group-hover:border-purple-400 transition-colors duration-200 bg-white">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Click to upload image
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        JPEG, PNG, WebP • 600x700px required
                      </p>
                    </div>
                  </div>
                </div>

                {preview && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="rounded-2xl w-32 h-40 object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      Image ready
                    </p>
                  </div>
                )}
              </div>

              {errors._image && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="h-4 w-4" /> {errors._image}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-[50px] font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating Agent..." : "Create Agent Profile"}
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <CustomToast {...toast} onClose={() => setToast(null)} duration={3000} />
      )}
    </div>
  );
};

export default CreateAgentPage;
