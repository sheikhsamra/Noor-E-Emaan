import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
