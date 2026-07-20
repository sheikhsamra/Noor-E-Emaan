import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protect } from "../utils/authMiddleware.js";
import { rateLimit } from "express-rate-limit";
import {
  checkEmailRules,
  signupRules,
  loginRules,
  verifyOtpRules,
  resendOtpRules,
  forgotPasswordRules,
  verifyResetOtpRules,
  resendResetOtpRules,
  resetPasswordRules,
  validate,
} from "../utils/validators.js";
import {
  sendVerificationOtpEmail,
  sendPasswordResetOtpEmail,
  sendPasswordChangedEmail,
  sendGoogleAccountInfoEmail,
} from "../utils/email.js";

const router = express.Router();

// ─── Constants ────────────────────────────────────────────────────────────────
const OTP_EXPIRY_MS      = 10 * 60 * 1000;   // 10 minutes
const OTP_RESEND_COOL_MS = 60 * 1000;         // 60 seconds
const MAX_OTP_ATTEMPTS   = 5;
const MAX_RESET_ATTEMPTS = 5;

// Separate secret so reset tokens can never be used as login JWTs
const RESET_SECRET = process.env.RESET_TOKEN_SECRET || `${process.env.JWT_SECRET}::reset`;

// ─── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  validate: { trustProxy: false },
  message: { success: false, message: "Too many attempts, please try again in 15 minutes." },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 8,
  standardHeaders: true, legacyHeaders: false,
  validate: { trustProxy: false },
  message: { success: false, message: "Too many OTP requests, please try again later." },
});

const googleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 20,
  standardHeaders: true, legacyHeaders: false,
  validate: { trustProxy: false },
  message: { success: false, message: "Too many requests. Please try again later." },
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 10,
  standardHeaders: true, legacyHeaders: false,
  validate: { trustProxy: false },
  message: { success: false, message: "Too many password reset attempts. Please try again later." },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateJwt(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, tokenVersion: user.tokenVersion ?? 0 },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function generateResetJwt(userId, sessionId) {
  return jwt.sign(
    { userId: userId.toString(), purpose: "password-reset", sessionId },
    RESET_SECRET,
    { expiresIn: "10m" }
  );
}

function safeUser(user) {
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.emailVerificationOtpHash;
  delete obj.emailVerificationOtpExpires;
  delete obj.emailVerificationOtpLastSentAt;
  delete obj.emailVerificationOtpAttempts;
  return obj;
}

// Verifies a Google access token and returns the user's profile.
// Uses tokeninfo to validate audience, then userinfo to get full profile.
async function verifyGoogleAccessToken(accessToken) {
  const tokenInfoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
  );
  const tokenInfo = await tokenInfoRes.json();
  if (!tokenInfoRes.ok || tokenInfo.error) {
    throw new Error(tokenInfo.error_description || "Invalid Google access token");
  }
  if (
    tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID &&
    tokenInfo.azp !== process.env.GOOGLE_CLIENT_ID
  ) {
    throw new Error("Google token audience mismatch");
  }
  const userInfoRes = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${encodeURIComponent(accessToken)}`
  );
  if (!userInfoRes.ok) throw new Error("Failed to fetch Google user info");
  const u = await userInfoRes.json();
  return {
    sub:            u.id,
    email:          u.email,
    email_verified: u.verified_email,
    name:           u.name,
    picture:        u.picture,
  };
}

async function generateAndSaveOtp(user) {
  const otp     = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  user.emailVerificationOtpHash       = otpHash;
  user.emailVerificationOtpExpires    = new Date(Date.now() + OTP_EXPIRY_MS);
  user.emailVerificationOtpLastSentAt = new Date();
  user.emailVerificationOtpAttempts   = 0;
  return otp;
}

async function generateAndSaveResetOtp(user) {
  const otp     = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  user.passwordResetOtpHash        = otpHash;
  user.passwordResetOtpExpires     = new Date(Date.now() + OTP_EXPIRY_MS);
  user.passwordResetOtpLastSentAt  = new Date();
  user.passwordResetOtpAttempts    = 0;
  // Invalidate any previous verified reset session
  user.passwordResetSessionId      = undefined;
  user.passwordResetSessionUsed    = undefined;
  return otp;
}

// ─── POST /check-email ────────────────────────────────────────────────────────
// Returns minimal info: does this email exist? local or google? verified?
// Never returns googleId, password, OTP fields, or internal IDs.
router.post("/check-email", authLimiter, checkEmailRules, validate, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("authProviders isEmailVerified");

    if (!user) {
      return res.json({ success: true, data: { exists: false } });
    }

    const hasLocal  = user.authProviders?.includes("local");
    const hasGoogle = user.authProviders?.includes("google");

    // Determine the primary provider to surface to the frontend
    // If local exists, show "local" (password flow); if google-only show "google"
    const provider = hasLocal ? "local" : hasGoogle ? "google" : "local";

    return res.json({
      success: true,
      data: {
        exists: true,
        provider,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /signup ─────────────────────────────────────────────────────────────
router.post("/signup", authLimiter, signupRules, validate, async (req, res) => {
  try {
    const { name, email, password } = req.body; // confirmPassword validated, not stored

    const existing = await User.findOne({ email });

    // Already verified → cannot re-register
    if (existing?.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    // Exists but unverified → resend OTP to that user
    if (existing && !existing.isEmailVerified) {
      const cooldownExpiry = existing.emailVerificationOtpLastSentAt
        ? new Date(existing.emailVerificationOtpLastSentAt.getTime() + OTP_RESEND_COOL_MS)
        : null;

      if (cooldownExpiry && cooldownExpiry > new Date()) {
        const waitSec = Math.ceil((cooldownExpiry - new Date()) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSec} seconds before requesting another code.`,
          code: "OTP_RESEND_TOO_SOON",
          waitSeconds: waitSec,
        });
      }

      const otp = await generateAndSaveOtp(existing);
      await existing.save();

      try {
        await sendVerificationOtpEmail({ to: email, name: existing.name, otp });
      } catch {
        // email failed — user can still use resend
      }

      return res.json({
        success: true,
        message: "A new verification code has been sent to your email.",
      });
    }

    // New user — create account (unverified)
    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({
      name,
      email,
      password: hashed,
      isEmailVerified: false,
      authProviders: ["local"],
    });

    const otp = await generateAndSaveOtp(user);
    await user.save();

    try {
      await sendVerificationOtpEmail({ to: email, name, otp });
    } catch {
      // email failed — user can use resend-verification-otp
    }

    return res.status(201).json({
      success: true,
      message: "Account created. Please check your email for the verification code.",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /verify-email ───────────────────────────────────────────────────────
router.post("/verify-email", authLimiter, verifyOtpRules, validate, async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "This email is already verified. Please log in.",
        code: "ALREADY_VERIFIED",
      });
    }

    // Too many failed attempts
    if (user.emailVerificationOtpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new verification code.",
        code: "TOO_MANY_ATTEMPTS",
      });
    }

    // OTP expired
    if (!user.emailVerificationOtpExpires || user.emailVerificationOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    // Compare OTP
    const isMatch = user.emailVerificationOtpHash
      ? await bcrypt.compare(otp, user.emailVerificationOtpHash)
      : false;

    if (!isMatch) {
      user.emailVerificationOtpAttempts += 1;
      await user.save();

      const remaining = MAX_OTP_ATTEMPTS - user.emailVerificationOtpAttempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many incorrect attempts. Please request a new code.",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    // ✓ OTP correct — verify and issue JWT
    user.isEmailVerified                = true;
    user.emailVerificationOtpHash       = undefined;
    user.emailVerificationOtpExpires    = undefined;
    user.emailVerificationOtpLastSentAt = undefined;
    user.emailVerificationOtpAttempts   = 0;
    await user.save();

    const token = generateJwt(user);
    return res.json({
      success: true,
      message: "Email verified successfully. Welcome to Fazaljees!",
      user: safeUser(user),
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /resend-verification-otp ────────────────────────────────────────────
router.post("/resend-verification-otp", otpLimiter, resendOtpRules, validate, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Return same response even if user doesn't exist (avoid enumeration)
    if (!user || user.isEmailVerified) {
      return res.json({
        success: true,
        message: "If an unverified account exists, a new code has been sent.",
      });
    }

    // Cooldown check
    if (user.emailVerificationOtpLastSentAt) {
      const cooldownExpiry = new Date(
        user.emailVerificationOtpLastSentAt.getTime() + OTP_RESEND_COOL_MS
      );
      if (cooldownExpiry > new Date()) {
        const waitSec = Math.ceil((cooldownExpiry - new Date()) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSec} seconds before requesting another code.`,
          code: "OTP_RESEND_TOO_SOON",
          waitSeconds: waitSec,
        });
      }
    }

    const otp = await generateAndSaveOtp(user);
    await user.save();

    try {
      await sendVerificationOtpEmail({ to: email, name: user.name, otp });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Please try again.",
      });
    }

    return res.json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /login ──────────────────────────────────────────────────────────────
router.post("/login", authLimiter, loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Google-only account — no local password set
    if (user && !user.authProviders?.includes("local")) {
      return res.status(401).json({
        success: false,
        message: "This account was created with Google. Please continue with Google.",
        code: "GOOGLE_ACCOUNT_ONLY",
      });
    }

    // User not found or somehow has no password
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Email not verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Wrong password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = generateJwt(user);
    return res.json({
      success: true,
      user: safeUser(user),
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /google ─────────────────────────────────────────────────────────────
// Verifies a Google ID token and finds/creates a Fazaljees account.
// Never trusts frontend-supplied user data — all identity comes from the verified token.
router.post("/google", googleLimiter, async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken || typeof accessToken !== "string") {
      return res.status(400).json({ success: false, message: "Invalid request." });
    }

    // ── 1. Verify token with Google ──────────────────────────────────────────
    let payload;
    try {
      payload = await verifyGoogleAccessToken(accessToken);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed. Please try again.",
        code: "INVALID_GOOGLE_TOKEN",
      });
    }

    const { sub: googleId, email, email_verified, name, picture } = payload;

    // Google must confirm the email is verified
    if (!email_verified) {
      return res.status(401).json({
        success: false,
        message: "Your Google account email is not verified.",
        code: "GOOGLE_EMAIL_NOT_VERIFIED",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── 2. Find existing account ─────────────────────────────────────────────
    // Check by googleId first (most accurate), then by email
    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    if (user) {
      // ── Case 2: existing Google user (same googleId) ─────────────────────
      // ── Case 3: existing verified local account (same email) ─────────────
      // ── Case 4: existing unverified local account (same email) ───────────

      // Add google to authProviders if not already there
      if (!user.authProviders.includes("google")) {
        user.authProviders.push("google");
      }

      // Store googleId if not already set
      if (!user.googleId) user.googleId = googleId;

      // Update profile image only if not already set
      if (!user.profileImage && picture) user.profileImage = picture;

      // Mark email verified (Google confirmed it — handles Case 4)
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        // Clear any pending OTP fields
        user.emailVerificationOtpHash       = undefined;
        user.emailVerificationOtpExpires    = undefined;
        user.emailVerificationOtpLastSentAt = undefined;
        user.emailVerificationOtpAttempts   = 0;
      }

      await user.save();
    } else {
      // ── Case 1: brand-new Google user ────────────────────────────────────
      user = await User.create({
        name,
        email:          normalizedEmail,
        googleId,
        profileImage:   picture || undefined,
        isEmailVerified: true,
        authProviders:  ["google"],
        // password intentionally omitted
      });
    }

    // ── 3. Issue Fazaljees JWT ───────────────────────────────────────────────
    const token = generateJwt(user);

    return res.json({
      success: true,
      user: safeUser(user),
      token,
    });
  } catch (err) {
    // Duplicate key on concurrent requests — find and return the existing user
    if (err.code === 11000) {
      try {
        const existing = await User.findOne({ email: err.keyValue?.email });
        if (existing) {
          const token = generateJwt(existing);
          return res.json({ success: true, user: safeUser(existing), token });
        }
      } catch { /* fall through */ }
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── GET /profile ─────────────────────────────────────────────────────────────
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── POST /forgot-password ────────────────────────────────────────────────────
// Always returns a generic response to prevent email enumeration.
router.post("/forgot-password", resetLimiter, forgotPasswordRules, validate, async (req, res) => {
  const GENERIC = {
    success: true,
    message: "If an account exists for this email, a password reset code has been sent.",
  };
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json(GENERIC);

    // Google-only account — cannot reset a password that doesn't exist
    if (!user.authProviders?.includes("local")) {
      try { await sendGoogleAccountInfoEmail({ to: email, name: user.name }); } catch { /* ignore */ }
      return res.json(GENERIC);
    }

    // Silent cooldown — if recent OTP still active, don't send another one.
    // The user already has a valid code; they can resend from the OTP page.
    if (user.passwordResetOtpLastSentAt) {
      const cooldownExpiry = new Date(user.passwordResetOtpLastSentAt.getTime() + OTP_RESEND_COOL_MS);
      if (cooldownExpiry > new Date()) return res.json(GENERIC);
    }

    const otp = await generateAndSaveResetOtp(user);
    await user.save();

    try { await sendPasswordResetOtpEmail({ to: email, name: user.name, otp }); } catch { /* ignore */ }

    return res.json(GENERIC);
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /verify-reset-otp ───────────────────────────────────────────────────
router.post("/verify-reset-otp", resetLimiter, verifyResetOtpRules, validate, async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.authProviders?.includes("local")) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code.",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    if ((user.passwordResetOtpAttempts ?? 0) >= MAX_RESET_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new reset code.",
        code: "TOO_MANY_ATTEMPTS",
      });
    }

    if (!user.passwordResetOtpExpires || user.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset code has expired. Please request a new one.",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    const isMatch = user.passwordResetOtpHash
      ? await bcrypt.compare(otp, user.passwordResetOtpHash)
      : false;

    if (!isMatch) {
      user.passwordResetOtpAttempts = (user.passwordResetOtpAttempts ?? 0) + 1;
      await user.save();

      const remaining = MAX_RESET_ATTEMPTS - user.passwordResetOtpAttempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many incorrect attempts. Please request a new reset code.",
        code: "INVALID_OR_EXPIRED_OTP",
      });
    }

    // ✓ OTP correct — create a short-lived reset session
    const sessionId = crypto.randomUUID();
    user.passwordResetSessionId   = sessionId;
    user.passwordResetSessionUsed = false;
    // Clear OTP fields — prevent reuse
    user.passwordResetOtpHash        = undefined;
    user.passwordResetOtpExpires     = undefined;
    user.passwordResetOtpLastSentAt  = undefined;
    user.passwordResetOtpAttempts    = 0;
    await user.save();

    const resetToken = generateResetJwt(user._id, sessionId);

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      data: { resetToken },
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /resend-reset-otp ───────────────────────────────────────────────────
router.post("/resend-reset-otp", resetLimiter, resendResetOtpRules, validate, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return generic for non-existent / Google-only users
    if (!user || !user.authProviders?.includes("local")) {
      return res.json({
        success: true,
        message: "If an account exists for this email, a new reset code has been sent.",
      });
    }

    // Enforce cooldown
    if (user.passwordResetOtpLastSentAt) {
      const cooldownExpiry = new Date(user.passwordResetOtpLastSentAt.getTime() + OTP_RESEND_COOL_MS);
      if (cooldownExpiry > new Date()) {
        const waitSec = Math.ceil((cooldownExpiry - new Date()) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSec} seconds before requesting another code.`,
          code: "OTP_RESEND_TOO_SOON",
          waitSeconds: waitSec,
        });
      }
    }

    const otp = await generateAndSaveResetOtp(user);
    await user.save();

    try {
      await sendPasswordResetOtpEmail({ to: email, name: user.name, otp });
    } catch {
      return res.status(500).json({ success: false, message: "Failed to send email. Please try again." });
    }

    return res.json({
      success: true,
      message: "A new reset code has been sent to your email.",
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /reset-password ─────────────────────────────────────────────────────
router.post("/reset-password", resetLimiter, resetPasswordRules, validate, async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // ── 1. Verify reset JWT ──────────────────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(resetToken, RESET_SECRET);
    } catch (err) {
      const code = err.name === "TokenExpiredError" ? "RESET_TOKEN_EXPIRED" : "INVALID_RESET_TOKEN";
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError"
          ? "The reset link has expired. Please request a new one."
          : "The reset token is invalid or expired.",
        code,
      });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({ success: false, message: "Invalid reset token.", code: "INVALID_RESET_TOKEN" });
    }

    // ── 2. Find user and validate session ───────────────────────────────────
    const user = await User.findById(decoded.userId);

    if (!user || !user.authProviders?.includes("local")) {
      return res.status(401).json({ success: false, message: "Invalid reset token.", code: "INVALID_RESET_TOKEN" });
    }

    if (user.passwordResetSessionId !== decoded.sessionId) {
      return res.status(401).json({
        success: false,
        message: "This reset link is no longer valid. Please request a new one.",
        code: "INVALID_RESET_TOKEN",
      });
    }

    if (user.passwordResetSessionUsed) {
      return res.status(401).json({
        success: false,
        message: "This reset link has already been used. Please request a new one.",
        code: "RESET_TOKEN_ALREADY_USED",
      });
    }

    // ── 3. Prevent reuse of current password ────────────────────────────────
    if (user.password) {
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from your current password.",
          code: "SAME_AS_OLD_PASSWORD",
        });
      }
    }

    // ── 4. Save new password and invalidate old sessions ────────────────────
    user.password                = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt       = new Date();
    user.tokenVersion            = (user.tokenVersion ?? 0) + 1;
    // Mark session as used — prevents reset token reuse
    user.passwordResetSessionUsed = true;
    user.passwordResetSessionId   = undefined;
    // Clear any remaining OTP data
    user.passwordResetOtpHash        = undefined;
    user.passwordResetOtpExpires     = undefined;
    user.passwordResetOtpLastSentAt  = undefined;
    user.passwordResetOtpAttempts    = 0;

    await user.save();

    // ── 5. Notify user ───────────────────────────────────────────────────────
    try {
      await sendPasswordChangedEmail({ to: user.email, name: user.name, changedAt: user.passwordChangedAt });
    } catch { /* email failure is non-fatal */ }

    return res.json({
      success: true,
      message: "Your password has been reset successfully. Please log in with your new password.",
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── POST /wishlist/:productId ────────────────────────────────────────────────
router.post("/wishlist/:productId", protect, async (req, res) => {
  try {
    const user      = await User.findById(req.user.id);
    const productId = req.params.productId;
    const index     = user.wishlist.indexOf(productId);

    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.json({ wishlist: user.wishlist, isWishlisted: index === -1 });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
