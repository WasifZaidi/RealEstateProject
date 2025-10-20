"use client";
import React, { useEffect, useState, useCallback } from "react";
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
          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 outline-none transition-all duration-300 ease-in-out bg-white text-gray-800 placeholder-gray-400
            hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:shadow-md
            ${showError ? "border-red-500 focus:ring-red-100 focus:border-red-500" : "border-gray-200"}
            ${inputClass}`}
        />

        {showError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {showError && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <XCircle className="h-4 w-4" /> {error}
        </p>
      )}
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
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white text-gray-800 placeholder-gray-400
            hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:shadow-md
            outline-none resize-none transition-all duration-300 ease-in-out
            ${showError ? "border-red-500 focus:ring-red-100 focus:border-red-500" : "border-gray-200"}`}
        />
      </div>

      {showError && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <XCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
});

/* ------------------- Main Component ------------------- */
const UpdateAgentPage = () => {
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/dashboard/agent/myProfile", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        const agent = data.agent || {};

        const p = agent.profile || agent;
        setFormData({
          firstName: p.firstName || agent.name?.split(" ")[0] || "",
          lastName: p.lastName || agent.name?.split(" ").slice(1).join(" ") || "",
          email: p.email || agent.email || "",
          phone: p.phone || agent.phone || "",
          bio: p.bio || agent.bio || "",
          designation: p.designation || agent.designation || "",
          licenseNumber: p.licenseNumber || agent.licenseNumber || "",
          experienceYears: p.experienceYears || agent.experienceYears || "",
          specialization: Array.isArray(p.specialization || agent.specialization)
            ? (p.specialization || agent.specialization).join(", ")
            : (p.specialization || agent.specialization || ""),
          languages: Array.isArray(p.languages || agent.languages)
            ? (p.languages || agent.languages).join(", ")
            : (p.languages || agent.languages || ""),
          facebook: p.socialLinks?.facebook || agent.socialLinks?.facebook || "",
          instagram: p.socialLinks?.instagram || agent.socialLinks?.instagram || "",
          linkedin: p.socialLinks?.linkedin || agent.socialLinks?.linkedin || "",
          twitter: p.socialLinks?.twitter || agent.socialLinks?.twitter || "",
          website: p.socialLinks?.website || agent.socialLinks?.website || "",
        });

        setPreview(p.profileImage?.url || agent.image || null);
      } catch (err) {
        console.error("❌ Error fetching agent:", err);
        setToast({ type: "error", message: err.message });
      } finally {
        setFetching(false);
      }
    };

    fetchAgent();
  }, []);


  /* ------------------- Handle Change ------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ------------------- Handle Image Change ------------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return setToast({ type: "error", message: "Only JPG, PNG, or WebP allowed" });
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ------------------- Submit Update ------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("file", image);

      const res = await fetch("http://localhost:3001/api/dashboard/agent/updateProfile", {
        method: "PUT",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setToast({ type: "success", message: "Profile updated successfully!" });
      setImage(null);
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading your profile...
      </div>
    );
  }

  /* ------------------- Render ------------------- */
  return (
    <div className="min-h-screen px-4 py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Update Agent Profile
          </h1>
          <p className="text-gray-600 text-lg">Modify your professional details below</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={User} name="firstName" placeholder="First Name" {...formData} onChange={handleChange} value={formData.firstName} />
                <InputField icon={User} name="lastName" placeholder="Last Name" {...formData} onChange={handleChange} value={formData.lastName} />
                <InputField icon={Mail} name="email" placeholder="Email Address" {...formData} onChange={handleChange} value={formData.email} />
                <InputField icon={Phone} name="phone" placeholder="Phone Number" {...formData} onChange={handleChange} value={formData.phone} />
              </div>
            </section>

            {/* Professional Info */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" /> Professional Details
              </h2>
              <TextAreaField icon={FileText} name="bio" placeholder="Professional Bio" value={formData.bio} onChange={handleChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <InputField icon={Briefcase} name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
                <InputField icon={Award} name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} />
                <InputField icon={Calendar} name="experienceYears" placeholder="Years of Experience" value={formData.experienceYears} onChange={handleChange} />
                <InputField icon={Award} name="specialization" placeholder="Specialization" value={formData.specialization} onChange={handleChange} />
                <InputField icon={Languages} name="languages" placeholder="Languages (comma separated)" value={formData.languages} onChange={handleChange} />
              </div>
            </section>

            {/* Social Links */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-purple-600" /> Social Links
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={Facebook} name="facebook" placeholder="Facebook URL" value={formData.facebook} onChange={handleChange} />
                <InputField icon={Instagram} name="instagram" placeholder="Instagram URL" value={formData.instagram} onChange={handleChange} />
                <InputField icon={Linkedin} name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
                <InputField icon={Twitter} name="twitter" placeholder="Twitter URL" value={formData.twitter} onChange={handleChange} />
                <InputField icon={Globe} name="website" placeholder="Personal/Company Website" value={formData.website} onChange={handleChange} />
              </div>
            </section>

            {/* Image Upload */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" /> Profile Image
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleImageChange}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white cursor-pointer hover:border-purple-400"
                  />
                </div>

                {preview && (
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
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-[50px] font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform duration-200 ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Updating..." : "Update Agent Profile"}
            </button>
          </form>
        </div>
      </div>

      {toast && <CustomToast {...toast} onClose={() => setToast(null)} duration={3000} />}
    </div>
  );
};

export default UpdateAgentPage;
