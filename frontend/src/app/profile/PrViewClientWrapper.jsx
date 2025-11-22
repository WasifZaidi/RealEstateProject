"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Camera,
  Shield,
  Key,
  Globe,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

/**
 * -------------------------
 * Helper utilities
 * -------------------------
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""; // Ensure this is set in your .env

const safe = (fn, fallback = "") => {
  try {
    const v = fn();
    return v === undefined || v === null ? fallback : v;
  } catch {
    return fallback;
  }
};

const isValidEmail = (e) =>
  typeof e === "string" &&
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i.test(
    e
  );

const isValidPhone = (p) =>
  typeof p === "string" && p.trim().length >= 6 && p.trim().length <= 25;

/**
 * Checks if the verification time is within the allowed window.
 * @param {string | number | Date | undefined} verifiedAt - The timestamp of verification.
 * @param {number} minutesAllowed - The maximum allowed time in minutes.
 * @returns {boolean} True if the timestamp is present and within the time window.
 */
const isVerificationValid = (verifiedAt, minutesAllowed = 10) => {
  if (!verifiedAt) return false;
  try {
    const verifiedTime = new Date(verifiedAt).getTime();
    const currentTime = Date.now();
    const differenceInMinutes = (currentTime - verifiedTime) / (1000 * 60);
    return differenceInMinutes < minutesAllowed;
  } catch {
    return false;
  }
};

/**
 * -------------------------
 * EnterpriseModal
 * -------------------------
 */
const EnterpriseModal = ({
  children,
  title,
  onClose,
  onSave,
  saveDisabled,
  isLoading,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 id="modal-title" className="text-xl font-bold text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-blue-600"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {children}

          <div className="flex space-x-3 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-[50px] hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-[50px] hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={saveDisabled || isLoading}
            >
              {isLoading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isLoading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SingleFieldEdit - stable input component to avoid losing focus
 */
const SingleFieldEdit = React.forwardRef(
  ({ fieldLabel, fieldName, fieldType = "text", currentValue, onChange, placeholder, Icon }, ref) => (
    <div>
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
        {fieldLabel}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          id={fieldName}
          type={fieldType}
          name={fieldName}
          value={currentValue}
          onChange={onChange}
          // Assuming 'normal_input' and 'pl_2' are defined in a global CSS file
          className={`normal_input  ${Icon ? "pl_medium " : ""}`}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    </div>
  )
);
SingleFieldEdit.displayName = "SingleFieldEdit";

/**
 * -------------------------
 * Main component
 * -------------------------
 */

const PrViewClientWrapper = ({ data }) => {
  const router = useRouter();

  // Primary source of truth
  const [userData, setUserData] = useState(() => data || {});
  const [activeModal, setActiveModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // password verification state and input
  const [passwordInput, setPasswordInput] = useState("");

  // profile image state
  const [profileImage, setProfileImage] = useState({
    file: null,
    preview: safe(() => data?.ProfilePicture?.url, null),
  });
  const fileInputRef = useRef(null);

  // temporary edit state for the modal
  const [tempEditValue, setTempEditValue] = useState({
    fieldName: "",
    value: "",
    fieldLabel: "",
    fieldType: "text",
    fieldIcon: User,
  });

  const inputRef = useRef(null);

  /**
   * MEMOIZED CALCULATION FOR VERIFICATION STATE
   * This is the core logic update.
   */
  const isPasswordVerifiedRecently = useMemo(() => {
    // Check if the verification flag is set AND the timestamp is within 10 minutes
    const verifiedFlag = safe(() => userData.emailChangeVerified, false);
    const verifiedAt = safe(() => userData.emailChangeVerifiedAt);

    if (verifiedFlag && verifiedAt) {
      return isVerificationValid(verifiedAt, 10);
    }
    return false;
  }, [userData.emailChangeVerified, userData.emailChangeVerifiedAt]);
  // ---------------------------------------------

  // Keep local state in sync if parent data updates
  useEffect(() => {
    if (data) {
      setUserData(data);
      setProfileImage((prev) => ({ ...prev, preview: safe(() => data?.ProfilePicture?.url, prev.preview) }));
      // Note: We no longer track isPasswordVerified as simple boolean from data,
      // it's now derived from data.emailChangeVerifiedAt in isPasswordVerifiedRecently.
    }
  }, [data]);

  // Cleanup object URL if created
  useEffect(() => {
    return () => {
      if (profileImage.preview && profileImage.file) {
        try {
          URL.revokeObjectURL(profileImage.preview);
        } catch {}
      }
    };
  }, []); // Empty dependency array, cleanup only on unmount

  // Convenience: mapping incoming modal-friendly field names to backend schema keys
  const FIELD_MAP = {
    userName: "userName",
    Email: "Email",
    PhoneNumber: "PhoneNumber",
    // add more mappings if needed (Birthday -> Birthday etc.)
  };

  // open modal and set temp value
  const openEditModal = useCallback((fieldName, fieldLabel, fieldValue, fieldType = "text", fieldIcon) => {
    setTempEditValue({
      fieldName,
      value: fieldValue === undefined || fieldValue === null ? "" : String(fieldValue),
      fieldLabel,
      fieldType,
      fieldIcon: fieldIcon || User,
    });
    setActiveModal(fieldName);
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  const handleTempEditChange = useCallback((e) => {
    const { value } = e.target;
    setTempEditValue((prev) => ({ ...prev, value }));
  }, []);

  // Generic updater for simple fields (userName, Email, PhoneNumber)
  const handleSaveGeneralField = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const { fieldName, value } = tempEditValue;
    const backendKey = FIELD_MAP[fieldName];
    if (!backendKey) {
      toast.error("Unknown field.");
      return;
    }

    const trimmed = value ? value.trim() : "";

    // validation per-field (omitted for brevity, assume original logic is fine)
    if (backendKey === "Email" && !isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (backendKey === "PhoneNumber" && trimmed && !isValidPhone(trimmed)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (trimmed.length === 0) {
      toast.error("Value cannot be empty.");
      return;
    }

    // check if no change
    const currentValue = safe(() => userData[backendKey], "");
    if (String(currentValue) === trimmed) {
      toast("No changes detected.", { icon: "ℹ️" });
      setActiveModal(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = { [backendKey]: trimmed };

      const res = await fetch(`${API_BASE}/updateUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to update profile.");
      }

      // update UI
      setUserData((prev) => ({ ...prev, ...json.user }));
      toast.success(json.message || "Profile updated!");
      setActiveModal(null);
    } catch (err) {
      const msg = err?.message || "Failed to update profile.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Email change OTP flow: send OTP to new email (requires password re-verified earlier)
  const handleSendOtpForEmailChange = async () => {
    const newEmail = tempEditValue.value ? tempEditValue.value.trim() : "";
    if (!isValidEmail(newEmail)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (newEmail === safe(() => userData.Email, "")) {
      toast("New email is the same as the current email.", { icon: "ℹ️" });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newEmail }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to send OTP.");

      toast.success(json.message || "OTP sent successfully!");
      setActiveModal(null);
      router.push(`/otpVerification?newEmail=${encodeURIComponent(newEmail)}`);
    } catch (err) {
      const msg = err?.message || "Failed to send OTP.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Image change handler (omitted for brevity, assume original logic is fine)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    // revoke previous object URL if present and created
    if (profileImage.file && profileImage.preview) {
      try {
        URL.revokeObjectURL(profileImage.preview);
      } catch {}
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImage({ file, preview: previewUrl });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload profile image to backend (omitted for brevity, assume original logic is fine)
  const handleSaveProfileImage = async () => {
    if (!profileImage.file) {
      toast("Please select an image to upload.", { icon: "ℹ️" });
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage.file);

      const res = await fetch(`${API_BASE}/upload-profile-image`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to upload image.");

      // Important: Ensure the server response includes the updated user data
      setUserData((prev) => ({ ...prev, ...(json.user || {}) }));
      setProfileImage({
        file: null,
        preview: safe(() => json.user.ProfilePicture.url, profileImage.preview),
      });

      toast.success("Profile picture updated successfully!");
      setActiveModal(null);
    } catch (err) {
      const msg = err?.message || "Failed to upload image.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Password verification before allowing email change
  const handleVerifyPassword = async () => {
    if (!passwordInput.trim()) {
      toast.error("Please enter your password");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/matchuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Password: passwordInput }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Invalid credentials");

      toast.success("Password verified successfully! You have 10 minutes to change your email.");
      setPasswordInput(""); // Clear password input

      /**
       * Crucial update: Set emailChangeVerified and emailChangeVerifiedAt in local state
       * to reflect the successful verification, which will update the useMemo hook.
       * The backend *should* also update these fields on the server.
       */
      setUserData((prev) => ({
        ...prev,
        ...json.user, // Merge user data from backend response
        emailChangeVerified: true,
        emailChangeVerifiedAt: new Date().toISOString(), // Use client-side time for immediate UI update, relying on server for persistence
      }));

      setActiveModal(null);

      // After verifying, open email change modal to enter new email
      setTimeout(() => openEditModal("Email", "Change Email Address", safe(() => userData.Email, ""), "email", Mail), 300);
    } catch (err) {
      const msg = err?.message || "Password verification failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // helper to compute initials (omitted for brevity, assume original logic is fine)
  const getInitials = (name) =>
    (name || "")
      .split(" ")
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // Modal definitions (omitted for brevity, assume original logic is fine)
  const modals = {
    userName: {
      title: "Edit Username",
      content: (
        <SingleFieldEdit
          ref={inputRef}
          fieldLabel="New Username"
          fieldName="userName"
          currentValue={tempEditValue.value}
          onChange={handleTempEditChange}
          placeholder="Enter your new username"
          Icon={User}
        />
      ),
      onSave: handleSaveGeneralField,
      saveDisabled:
        tempEditValue.value.trim() === safe(() => userData.userName, "") || !tempEditValue.value.trim(),
    },
    Email: {
      title: "Change Email Address",
      content: (
        <>
          <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>A new email will be verified with an OTP. **Password is verified for this session.**</span>
          </p>
          <SingleFieldEdit
            ref={inputRef}
            fieldLabel="New Email Address"
            fieldName="Email"
            fieldType="email"
            currentValue={tempEditValue.value}
            onChange={handleTempEditChange}
            placeholder="Enter your new email"
            Icon={Mail}
          />
        </>
      ),
      onSave: handleSendOtpForEmailChange,
      saveDisabled:
        tempEditValue.value.trim() === safe(() => userData.Email, "") ||
        !tempEditValue.value.trim() ||
        !isValidEmail(tempEditValue.value) || // Added extra validation for saving an email
        isLoading,
    },
    PhoneNumber: {
      title: "Edit Phone Number",
      content: (
        <SingleFieldEdit
          ref={inputRef}
          fieldLabel="New Phone Number"
          fieldName="PhoneNumber"
          fieldType="tel"
          currentValue={tempEditValue.value}
          onChange={handleTempEditChange}
          placeholder="Enter your new phone number"
          Icon={Phone}
        />
      ),
      onSave: handleSaveGeneralField,
      saveDisabled:
        tempEditValue.value.trim() === safe(() => userData.PhoneNumber, "") || !tempEditValue.value.trim(),
    },
    profileImage: {
      title: "Update Profile Picture",
      // ... content (omitted)
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-blue-200 flex items-center justify-center mx-auto overflow-hidden">
                {profileImage.preview ? (
                  <img src={profileImage.preview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-blue-600 text-3xl font-bold">{getInitials(userData?.userName)}</div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {profileImage.file ? "New image selected" : "Current profile picture"}
            </p>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={triggerFileInput}
          >
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">Click to upload a new image</span>
                <p className="text-gray-500 text-xs mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
            </div>

            {profileImage.file && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {(() => {
                      const name = profileImage.file.name;
                      const dotIndex = name.lastIndexOf(".");
                      const extension = dotIndex !== -1 ? name.slice(dotIndex) : "";
                      const baseName = dotIndex !== -1 ? name.slice(0, dotIndex) : name;
                      const trimmedName = baseName.length > 10 ? `${baseName.slice(0, 10)}…` : baseName;
                      return `${trimmedName}${extension}`;
                    })()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!safe(() => userData.ProfilePicture?.url, null) && !profileImage.preview && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Professional website placeholder active</span>
              </div>
              <p className="text-yellow-700 text-xs mt-1">Upload a profile picture to enhance your professional appearance</p>
            </div>
          )}
        </div>
      ),
      onSave: handleSaveProfileImage,
      saveDisabled: !profileImage.file || isLoading,
    },
    passwordVerify: {
      title: "Verify Password for Email Change",
      content: (
        <>
          <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded-lg flex items-center space-x-2">
            <Shield className="w-4 h-4 text-yellow-600" />
            <span>For your security, you must verify your password before changing your email address. **Verification lasts for 10 minutes.**</span>
          </p>
          <SingleFieldEdit
            ref={inputRef}
            fieldLabel="Password"
            fieldName="Password"
            fieldType="password"
            currentValue={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter your account password"
            Icon={Key}
          />
        </>
      ),
      onSave: handleVerifyPassword,
      saveDisabled: !passwordInput.trim(),
    },
  };

  const currentModalConfig = activeModal ? modals[activeModal] : null;

  const DetailField = ({ label, value, Icon, fieldName, fieldType = "text" }) => {
    const handleEditClick = () => {
      if (fieldName === "Email") {
        if (!isPasswordVerifiedRecently) {
          // If not recently verified, open password verification modal
          setActiveModal("passwordVerify");
        } else {
          // If recently verified, proceed to email change modal
          openEditModal(fieldName, label, safe(() => userData[fieldName], ""), fieldType, Icon);
        }
      } else {
        openEditModal(fieldName, label, safe(() => userData[fieldName], ""), fieldType, Icon);
      }
    };

    const displayValue = value ?? (fieldName === "PhoneNumber" ? "Not provided" : "N/A");

    return (
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group transition-all duration-300 hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 flex items-center space-x-2 mb-1">
              <Icon className="w-4 h-4 text-blue-500" />
              <span>{label}</span>
            </p>
            <p className="font-semibold text-gray-900 break-words pr-12">{displayValue}</p>
          </div>

          <button
            onClick={handleEditClick}
            className="absolute top-2 right-2 p-2 rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 md:opacity-100 md:group-hover:opacity-100"
            aria-label={`Edit ${label}`}
            disabled={isLoading}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p className="font-bold">API Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profileImage.preview || safe(() => userData.ProfilePicture?.url, null) ? (
                  <img
                    src={profileImage.preview || safe(() => userData.ProfilePicture.url, "")}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center shadow-lg">
                    <div className="text-white text-3xl font-bold">{getInitials(userData?.userName)}</div>
                  </div>
                )}

                <button
                  onClick={() => openEditModal("profileImage", "Profile Picture", null, "file", Camera)}
                  className="absolute -bottom-0 -right-0 bg-white text-blue-600 hover:bg-blue-100 rounded-full p-2 border-2 border-blue-600 transition-colors shadow-md"
                  aria-label="Change profile picture"
                  disabled={isLoading}
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">{safe(() => userData.userName, "Unnamed User")}</h2>
                <p className="text-blue-200">{safe(() => userData.Email, "—")}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b pb-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal Details</span>
                </h3>

                <div className="space-y-4">
                  <DetailField label="Username" value={safe(() => userData.userName, "")} Icon={User} fieldName="userName" />

                  <DetailField
                    label="Email Address"
                    value={safe(() => userData.Email, "")}
                    Icon={Mail}
                    fieldName="Email"
                    fieldType="email"
                  />

                  <DetailField
                    label="Phone Number"
                    value={safe(() => userData.PhoneNumber, "")}
                    Icon={Phone}
                    fieldName="PhoneNumber"
                    fieldType="tel"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b pb-2 mb-4">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Account & Security</span>
                </h3>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Key className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Login Provider</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        safe(() => userData.loginProvider, "local") === "google" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {String(safe(() => userData.loginProvider, "local"))
                        .charAt(0)
                        .toUpperCase() + String(safe(() => userData.loginProvider, "local")).slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900 text-sm font-mono break-all">{safe(() => userData.customId, "—")}</p>
                  </div>
                </div>

                {/* UPDATED Security Status Display */}
                <div
                  className={`flex items-start space-x-3 p-4 rounded-xl border ${
                    isPasswordVerifiedRecently ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  {isPasswordVerifiedRecently ? (
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="flex-shrink-0 w-5 h-5 text-yellow-600 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">Email Change Security</p>
                    <p className={`text-xs ${isPasswordVerifiedRecently ? "text-green-700" : "text-yellow-700"} mt-0.5`}>
                      {isPasswordVerifiedRecently
                        ? `Password re-verified recently. Verification is active for 10 minutes.`
                        : "Password re-verification is required before changing your email for security."}
                    </p>
                    {safe(() => userData.emailChangeVerifiedAt) && (
                      <p className={`text-xs text-gray-600 mt-1`}>
                        Last verification: {new Date(userData.emailChangeVerifiedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                {/* END UPDATED Security Status Display */}
              </div>
            </div>
          </div>
        </div>
      </div> {/* container */}

      {currentModalConfig && (
        <EnterpriseModal
          title={currentModalConfig.title}
          onClose={() => setActiveModal(null)}
          onSave={currentModalConfig.onSave}
          saveDisabled={currentModalConfig.saveDisabled}
          isLoading={isLoading && activeModal !== "Email"}
        >
          {currentModalConfig.content}
        </EnterpriseModal>
      )}
    </div>
  );
};

export default PrViewClientWrapper;