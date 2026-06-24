import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protect } from "../utils/authMiddleware.js";
import { signupRules, loginRules, validate } from "../utils/validators.js";
import { rateLimit } from "express-rate-limit";
const router = express.Router();

// Strict limiter for auth — 10 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in 15 minutes." },
});

// Signup
router.post("/signup", authLimiter, signupRules, validate, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: _, ...safeUser } = user.toObject();
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", authLimiter, loginRules, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const match = user && await bcrypt.compare(password, user.password);
    if (!user || !match) return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: _, ...safeUser } = user.toObject();
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get User Profile (including wishlist)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle Wishlist
router.post("/wishlist/:productId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    
    const index = user.wishlist.indexOf(productId);
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
