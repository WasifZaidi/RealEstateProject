const jwt = require("jsonwebtoken");
const User = require("../Model/User");

// ✅ Role → Model Map (easily extendable)
const ROLE_MODEL_MAP = {
  user: User,
};

// ============================
// 🔐 Auth Middleware
// ============================
exports.isAuthenticated = (cookieName = "token") => {
  return async (req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Always store decoded token payload

      const Model = ROLE_MODEL_MAP[decoded.role];

      if (!Model) {
        return res.status(400).json({
          success: false,
          message: `Invalid role '${decoded.role}' detected.`,
        });
      }

      // Fetch account (User/Seller/Admin)
      const account = await Model.findById(decoded.id).select(
        "-Password -password -passwordHash"
      );

      if (!account) {
        return res.status(404).json({
          success: false,
          message: `${decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1)} not found.`,
        });
      }

      // Attach the entity to req
      req.account = account;

      next();
    } catch (err) {
      console.error("Auth Error:", err);

      return res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Session expired. Please log in again."
            : "Invalid token. Please log in again.",
      });
    }
  };
};

// ============================
// 🛡️ Role-based Authorization
// ============================
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to perform this action.",
      });
    }
    next();
  };
};
