import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../utils/authMiddleware.js";
import { productCreateRules, productUpdateRules, validate } from "../utils/validators.js";
const router = express.Router();

// In-memory cache for product listings — 2 minute TTL
const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000;
const getCache = (k) => { const e = cache.get(k); return e && Date.now() - e.ts < CACHE_TTL ? e.data : null; };
const setCache = (k, d) => cache.set(k, { data: d, ts: Date.now() });
const clearCache = () => cache.clear();

// Get products — supports search, category, sort, pagination
router.get("/", async (req, res) => {
  try {
    const cacheKey = JSON.stringify(req.query);
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const { search, category, sort, page = 1, limit = 12 } = req.query;

    const filter = {};

    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const response = {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limitNum),
      },
    };
    setCache(cacheKey, response);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products.", error: err.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product ID." });
  }
});

// Admin: Add product
router.post("/", protect, adminOnly, productCreateRules, validate, async (req, res) => {
  const product = await Product.create(req.body);
  clearCache();
  res.json(product);
});

// Admin: Update product
router.put("/:id", protect, adminOnly, productUpdateRules, validate, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  clearCache();
  res.json(product);
});

// Admin: Delete product
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  clearCache();
  res.json({ message: "Deleted" });
});

// Submit a review
router.post("/:id/review", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name?.trim() || !comment?.trim() || !rating) {
      return res.status(400).json({ message: "Name, rating and comment are required." });
    }
    const star = parseInt(rating);
    if (star < 1 || star > 5) return res.status(400).json({ message: "Rating must be 1–5." });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    product.reviews.push({ name: name.trim(), rating: star, comment: comment.trim() });
    await product.save();
    clearCache();
    res.status(201).json({ reviews: product.reviews });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review.", error: err.message });
  }
});

// Like/Unlike Product
router.post("/:id/like", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const index = product.likes.indexOf(req.user.id);
    if (index === -1) {
      product.likes.push(req.user.id);
    } else {
      product.likes.splice(index, 1);
    }

    await product.save();
    res.json({ likes: product.likes.length, isLiked: index === -1 });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
