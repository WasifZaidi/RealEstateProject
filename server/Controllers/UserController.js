const User = require("../Model/User");
const { sendEmail } = require('../utils/sendEmail');
const sendToken = require("../utils/sendToken")
const { ObjectId } = require("mongodb")
const { nanoid } = require('nanoid');
const cloudinary = require("../utils/cloudinary");
const { v4: uuidv4 } = require("uuid")
const FileCleanupManager = require("../utils/fileCleanup");
const crypto = require("crypto");

exports.signUp = async (req, res) => {
    try {
        const { userName, Email, Password } = req.body;

        if (!userName || !Email || !Password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const userExists = await User.findOne({ Email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "Email is already in use." });
        }

        // Generate OTP for email verification
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Custom Id
        const customId = `${Date.now()}-${nanoid(6)}`
        const newUser = new User({
            userName,
            Email,
            Password,
            otp: otp,
            otpExpire: Date.now() + 10 * 60 * 1000, // 10 min expiry
            isVerified: false,
            loginProvider: "local",
            customId,
        });

        await newUser.save();

        const message = `Your OTP code for verifying your email is: ${otp}\n\nIt expires in 10 minutes.`;

        await sendEmail({
            to: Email,
            subject: "Verify Your Email",
            text: message,
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete signup.",
            userId: newUser._id
        });

    } catch (err) {
        console.error("SignUp Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};
exports.verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid User ID." });
        }

        if (!otp) {
            return res.status(400).json({ success: false, message: "User ID and OTP are required." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User is already verified." });
        }

        if (user.otp !== Number(otp) || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save({ validateBeforeSave: false });

        sendToken(user, res, "SignIn successful", "user_token_realEstate");

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

exports.login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        if (user.loginProvider !== "local") {
            return res.status(401).json({
                success: false,
                message: "This account was registered with Google. Please log in using Google."
            });
        }

        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your account before logging in." });
        }
        sendToken(user, res, "SignIn successful", "user_token_realEstate");
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
    }
};


exports.googleLogin = async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ success: false, message: "Google login failed. Access token missing." });
        }

        const googleRes = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );

        const payload = await googleRes.json();

        if (!payload || !payload.email) {
            return res.status(400).json({ success: false, message: "Failed to retrieve Google account information." });
        }

        const { email, name, picture } = payload;

        let user = await User.findOne({ Email: email });

        if (user) {
            // Prevent login confusion between local and Google accounts
            if (user.loginProvider === "local") {
                return res.status(400).json({
                    success: false,
                    message: "This email is already registered. Please log in using your usual method."
                });
            }

            return sendToken(user, res, "SignIn successful", "user_token_realEstate");
        }

                const customId = `${Date.now()}-${nanoid(6)}`

        // Create new Google user
        user = await User.create({
            Email: email,
            userName: name,
            ProfileImage: picture,
            customId,
            loginProvider: "google",
            isVerified: true,
        });

        sendToken(user, res, "SignIn successful", "user_token_realEstate");
    } catch (err) {
        console.error("Google Login Error:", err);
        res.status(500).json({ success: false, message: "An error occurred during Google login. Please try again later." });
    }
};


exports.getLoggedInUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const user = await User.findById(req.user.id).select("-Password");
        res.status(200).json({ success: true, user: user })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


exports.logout = (req, res) => {
    const cookieName = req.user?.role === "seller" ? "seller_token" : "user_token_realEstate";

    res.cookie(cookieName, null, {
        expires: new Date(0),
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
};


exports.forgotPassword = async (req, res) => {
    try {
        const { Email } = req.body;
        if (!Email) {
            return res.status(400).json({ success: false, message: "Data is not provided" });
        }
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        };
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        const resetURL = `${req.protocol}://${req.get("host")}/Reset/${resetToken}`;
        const message = `You requested a password reset. Click the link below:\n\n${resetURL}\n\nIf you didn't request this, please ignore.`;
        await sendEmail({
            to: user.Email,
            subject: "Password Reset",
            text: message
        });
        res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { Password, ConfirmPassword } = req.body;
        if (!Password || !ConfirmPassword) {
            return res.status(400).json({ success: false, message: "Both password fields are required" });
        }
        if (Password !== ConfirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Token is invalid or expired" });
        }
        user.Password = Password;
        user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined;
        await user.save();
        sendToken(user, res, "SignIn successful", "user_token_realEstate");
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
// controllers/emailController.js
exports.sendOtpForEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const currentEmail = user.Email;
    if (!currentEmail || !newEmail)
      return res.status(400).json({ success: false, message: "Both current and new email are required" });

    const existing = await User.findOne({ Email: newEmail });
    if (existing)
      return res.status(400).json({ success: false, message: "New email is already in use" });

    // Check last OTP request (cooldown)
    if (user.lastOtpSentAt && Date.now() - user.lastOtpSentAt.getTime() < 60 * 1000) {
      const secondsLeft = Math.ceil(60 - (Date.now() - user.lastOtpSentAt.getTime()) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting another OTP.`,
        retryAfter: secondsLeft,
      });
    }

    // Ensure password re-verification still valid
    const verifiedAt = user.emailChangeVerifiedAt;
    const isVerifiedRecently = verifiedAt && (Date.now() - verifiedAt.getTime()) < 10 * 60 * 1000;
    if (!user.emailChangeVerified || !isVerifiedRecently) {
      return res.status(403).json({
        success: false,
        message: "Password re-verification required to change email.",
      });
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.tempEmail = newEmail;
    user.lastOtpSentAt = new Date(); // record time
    await user.save({ validateBeforeSave: false });

    const message = `Your OTP for verifying new email is: ${otp}\n\nIt expires in 10 minutes.`;
    await sendEmail({
      to: newEmail,
      subject: "Verify New Email Address",
      text: message,
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.verifyOtpEmailChange = async (req, res) => {
    try {
        const { otp } = req.body;
        const mainUser = await User.findById(req.user.id);
        const Email = mainUser.Email;
        console.log(Email, otp)
        if (!Email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        }
        if (!user.otp || !user.otpExpire || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }
        if (user.otp !== Number(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.tempEmail) {
            user.Email = user.tempEmail;
        }
        user.otp = undefined;
        user.otpExpire = undefined;
        user.tempEmail = undefined;
        user.emailChangeVerified = false;
        user.emailChangeVerifiedAt = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.matchUser = async (req, res) => {
    const { Password } = req.body
    const user = await User.findById(req.user.id)
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid Email or Password" })
    }

    const Email = user.Email;
    if (!Email) {
        return res.status(401).json({ success: false, message: "Data is Missing" })
    }
    const isMatch = await user.comparePassword(Password)
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid Email or Password" })
    }
    user.emailChangeVerified = true;
    user.emailChangeVerifiedAt = Date.now();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, user })
}

exports.updateUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { userName, PhoneNumber } = req.body;
    const updatedData = {};

    // ✅ userName validation
    if (userName !== undefined) {
      if (typeof userName !== "string" || !userName.trim()) {
        return res.status(400).json({ success: false, message: "Invalid user name" });
      }
      updatedData.userName = userName.trim();
    }

    // ✅ PhoneNumber validation
    if (PhoneNumber !== undefined) {
      const phoneRegex = /^[0-9]{10,15}$/; // Allow 10–15 digits
      if (!phoneRegex.test(PhoneNumber)) {
        return res.status(400).json({ success: false, message: "Invalid phone number" });
      }
      updatedData.PhoneNumber = PhoneNumber;
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    // ✅ Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-Password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

const uploadToCloudinary = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder: "user_profiles",
      public_id: `${uuidv4()}_${Date.now()}`,
      resource_type: "image",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });
  } catch (err) {
    throw new Error("MEDIA_UPLOAD_ERROR: Cloudinary upload failed");
  }
};

exports.uploadProfileImage = async (req, res) => {
  let newCloudinaryPublicId = null;
  const tempFiles = req.file ? [req.file] : [];

  try {
    // 1️⃣ Check authorization and file
    if (!req.user?.id) {
      await FileCleanupManager.cleanupFiles(tempFiles);
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file?.path) {
      await FileCleanupManager.cleanupFiles(tempFiles);
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    // 2️⃣ Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      await FileCleanupManager.cleanupFiles(tempFiles);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3️⃣ Delete old Cloudinary image
    if (user?.ProfilePicture?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.ProfilePicture.public_id);
        console.log(`🗑️ Deleted old Cloudinary image: ${user.ProfilePicture.public_id}`);
      } catch (destroyErr) {
        console.warn(`⚠️ Failed to delete old Cloudinary image: ${destroyErr.message}`);
      }
    }

    // 4️⃣ Upload new image
    const uploadedImage = await uploadToCloudinary(req.file.path);
    newCloudinaryPublicId = uploadedImage.public_id;

    // 5️⃣ Save new profile picture to DB
    user.ProfilePicture = {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
    await user.save();

    // 6️⃣ Cleanup temp file after success
    await FileCleanupManager.cleanupFiles(tempFiles);

    // ✅ 7️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: uploadedImage,
    });

  } catch (error) {
    console.error("❌ Profile Image Upload Error:", {
      message: error.message,
      stack: error.stack,
      user: req.user?.id,
      timestamp: new Date().toISOString(),
    });

    // 8️⃣ Rollback Cloudinary upload if something failed mid-way
    if (newCloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(newCloudinaryPublicId);
        console.log(`🔄 Rolled back Cloudinary image: ${newCloudinaryPublicId}`);
      } catch (rollbackErr) {
        console.error("⚠️ Failed to rollback Cloudinary upload:", rollbackErr.message);
      }
    }

    // 9️⃣ Always cleanup temp file
    await FileCleanupManager.cleanupFiles(tempFiles);

    // 🔟 Return standardized error response
    let statusCode = 500;
    let userMessage = "Server error while uploading profile image";

    if (error.message.includes("MEDIA_UPLOAD_ERROR")) {
      statusCode = 400;
      userMessage = "Failed to upload image. Please try again.";
    }

    return res.status(statusCode).json({
      success: false,
      message: userMessage,
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};