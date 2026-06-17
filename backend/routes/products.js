import express from "express";
import Product from "../models/Product.js";
import { protect } from "../utils/authMiddleware.js";
const router = express.Router();

// Get all products (newest first)
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Get single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// Admin: Add product
router.post("/", protect, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// Admin: Update product
router.put("/:id", protect, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Admin: Delete product
router.delete("/:id", protect, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
