const jwt = require("jsonwebtoken");
const User = require("../Model/User");

const ROLE_MODEL_MAP = {
  user: User,
};

// ✅ Optional Auth Middleware (non-blocking)
exports.optionalAuth = (cookieName = "token") => {
  return async (req, res, next) => {
    const token = req.cookies?.[cookieName];
    if (!token) return next(); // ✅ No token → proceed as guest
    try {
      // Verify token (non-blocking)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const Model = ROLE_MODEL_MAP[decoded.role];
      if (!Model) return next(); // Skip if invalid role

      const account = await Model.findById(decoded.id).select(
        "-Password -password -passwordHash"
      );

      if (account) req.account = account;
    } catch (err) {
      console.warn("OptionalAuth Warning:", err.message);
      // Don’t throw error → just move on
    }

    next();
  };
};
