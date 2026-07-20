import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:  { type: String, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String },
  phone: { type: String },
  role:  { type: String, default: "user" },

  orders:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // ── Email verification ────────────────────────────────────────────
  isEmailVerified:                { type: Boolean, default: true },
  emailVerificationOtpHash:       { type: String },
  emailVerificationOtpExpires:    { type: Date },
  emailVerificationOtpLastSentAt: { type: Date },
  emailVerificationOtpAttempts:   { type: Number, default: 0 },

  // ── Auth providers ────────────────────────────────────────────────
  authProviders: { type: [String], default: ["local"] },

  // ── Google OAuth ──────────────────────────────────────────────────
  googleId:     { type: String, sparse: true },
  profileImage: { type: String },

  // ── Password reset ────────────────────────────────────────────────
  passwordResetOtpHash:        { type: String },
  passwordResetOtpExpires:     { type: Date },
  passwordResetOtpLastSentAt:  { type: Date },
  passwordResetOtpAttempts:    { type: Number, default: 0 },
  // Set after OTP is verified; ties the reset JWT to this user
  passwordResetSessionId:      { type: String },
  // Becomes true once /reset-password is used — prevents token reuse
  passwordResetSessionUsed:    { type: Boolean },

  // ── JWT invalidation ──────────────────────────────────────────────
  // Incremented on password reset; old tokens with a lower version are rejected
  tokenVersion:      { type: Number, default: 0 },
  passwordChangedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
