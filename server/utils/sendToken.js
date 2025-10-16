const jwt = require("jsonwebtoken");

const sendToken = (entity, res, message, cookieName) => {
  // Create JWT with 7d expiry
  const role = entity.role;
  const token = jwt.sign(
    { id: entity._id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  // Cookie options
  const options = {
  httpOnly: true,
  secure: false,    
  sameSite: "Lax",  
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};


  // Send cookie + response
  res
    .cookie(cookieName, token, options)
    .json({
      success: true,
      message,
      role,
      [role]: { ...entity.toObject(), password: undefined },
    });
};

module.exports = sendToken;
