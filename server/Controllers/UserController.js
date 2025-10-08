const User = require("../Model/User");
const { sendEmail } = require('../utils/sendEmail');
const sendToken = require("../utils/sendToken")
const { ObjectId } = require("mongodb")


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

        const newUser = new User({
            userName,
            Email,
            Password,
            otpCode: otp,
            otpExpire: Date.now() + 10 * 60 * 1000, // 10 min expiry
            isVerified: false,
            loginProvider: "local"  // ✅ Explicitly mark as local signup
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

        if (user.otpCode !== Number(otp) || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }
        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpire = undefined;

        await user.save({ validateBeforeSave: false });

        sendToken(user, "user", res, "Email Verified", "user_token_realEstate");

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

        sendToken(user, "user", res, "Login successful", "user_token_realEstate");
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

            return sendToken(user, "user", res, "Login successful", "user_token_realEstate");
        }

        // Create new Google user
        user = await User.create({
            Email: email,
            userName: name,
            ProfileImage: picture,
            loginProvider: "google",
            isVerified: true,
        });

        sendToken(user, "user", res, "Account created and logged in successfully", "user_token_realEstate");
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
        sendToken(user, 200, res, "Password reset successful", "user_token_realEstate");
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
exports.sendOtpForEmailChange = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const currentEmail = req.user.Email;
        if (!currentEmail || !newEmail) {
            return res.status(400).json({ success: false, message: "Both current and new email are required" });
        }
        const existing = await User.findOne({ Email: newEmail });
        if (existing) {
            return res.status(400).json({ success: false, message: "New email is already in use" });
        }
        const verifiedAt = req.user.emailChangeVerifiedAt;
        const isVerifiedRecently = verifiedAt && (Date.now() - verifiedAt.getTime()) < 10 * 60 * 1000; // 10 min

        if (!req.user.emailChangeVerified || !isVerifiedRecently) {
            return res.status(403).json({
                success: false,
                message: "Password re-verification required to change email.",
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);

        req.user.otpCode = otp;
        req.user.otpExpire = Date.now() + 10 * 60 * 1000;
        req.user.tempEmail = newEmail;
        await req.user.save({ validateBeforeSave: false });

        const message = `Your OTP code for updating your email is: ${otp}\n\nIt expires in 10 minutes.`;
        await sendEmail({
            to: newEmail,
            subject: "Verify New Email Address",
            text: message,
        });

        return res.status(200).json({ success: true, message: "OTP sent to new email" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        const { otpCode } = req.body;
        const Email = req.user.Email;
        if (!Email || !otpCode) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with this email" });
        }
        if (!user.otpCode || !user.otpExpire || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }
        if (user.otpCode !== Number(otpCode)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }
        if (user.tempEmail) {
            user.Email = user.tempEmail;
        }
        user.otpCode = undefined;
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
  const Email = req.user.Email
  if (!Email) {
    return res.status(401).json({ success: false, message: "Data is Missing" })
  }
  const user = await User.findOne({ Email })
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid Email or Password" })
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