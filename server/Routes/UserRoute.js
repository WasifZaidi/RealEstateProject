const express = require('express')
const { signUp, login, logout, getLoggedInUser, forgotPassword, resetPassword, matchUser, sendOtpForEmailChange, verifyOtp, verifyEmail, googleLogin } = require('../Controllers/UserController')
const { isAuthenticated, authorizeRoles } = require('../middelware/auth')
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
router.post("/sendOtp", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), sendOtpForEmailChange)
router.post("/verifyOtp", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), verifyOtp)
module.exports = router