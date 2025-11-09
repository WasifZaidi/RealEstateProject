const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const birthdaySchema = new mongoose.Schema({
  Month: { type: String, required: true },
  Day: { type: Number, required: true },
  Year: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema({
  defaultAddress: { type: Boolean, default: false },
  userName: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },

  address2: {
    type: String,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
  },

  postalCode: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  phoneCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  Password: {
    type: String,
    required: function () {
      return this.loginProvider === "local";
    }
  },

  loginProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  customId: { type: String, required: true },

  PhoneNumber: { type: String, required: false },
  Birthday: { type: birthdaySchema },
  ProfilePicture: {
    url: { type: String, required: false },
    public_id: { type: String, required: false }
  },
  Gender: { type: String },
  Address: { type: [addressSchema], default: [] },
  role: { type: String, default: "user" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otp: Number,
  otpExpire: Date,
  tempEmail: { type: String },
  emailChangeVerified: { type: Boolean, default: false },
  emailChangeVerifiedAt: { type: Date },
  isVerified: { type: Boolean, default: false },
  isVerifiedAgent: { type: Boolean, default: false },
}, { timestamps: true });


// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  try {
    const salt = await bcrypt.genSalt(10)
    this.Password = await bcrypt.hash(this.Password, salt)
    next();
  } catch (err) {
    next(err)
  }
})

// Optional: method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.Password) return false;
  return bcrypt.compare(candidatePassword, this.Password);
};
// Genrating reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex")
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken
}

module.exports = mongoose.model('User', userSchema);