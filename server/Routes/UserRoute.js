const express = require('express')
const { signUp, login, logout, getLoggedInUser, forgotPassword, resetPassword, matchUser, sendOtpForEmailChange, verifyEmail, googleLogin, updateUser, uploadProfileImage, verifyOtpEmailChange } = require('../Controllers/UserController')
const { isAuthenticated, authorizeRoles } = require('../middelware/auth')
const { uploadProfile } = require("../middelware/upload");
const router = express.Router()
router.post("/signUp", signUp)
router.post("/verifyEmail", verifyEmail)
router.post("/login", login)
router.post("/google-login", googleLogin);
router.post("/logout", logout)
router.get("/me", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), getLoggedInUser)
router.post("/forgotPassword", forgotPassword),
router.post("/resetPassword/:token", resetPassword),
router.post("/matchuser", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), matchUser)
router.post("/updateUser", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), updateUser)
router.post("/sendOtp", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), sendOtpForEmailChange)
router.post("/verifyOtpEmailChange", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), verifyOtpEmailChange)
router.put(
  "/upload-profile-image",
  isAuthenticated("user_token_realEstate"),
  uploadProfile.single("profileImage"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Profile image too large. Maximum size is 5MB.",
        });
      }
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  },
  uploadProfileImage
);
module.exports = router