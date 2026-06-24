import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../utils/authMiddleware.js";

const router = express.Router();
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, revenueAgg, pendingCount] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ status: "Pending" }),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("_id customerInfo total status createdAt products");

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      revenue: revenueAgg[0]?.total || 0,
      pendingCount,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders
router.get("/orders", async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const filter = status && status !== "All" ? { status } : {};
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit) || 15);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .select("_id customerInfo products total status createdAt"),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status, note } = req.body;
    const valid = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ message: "Invalid status." });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status },
        $push: {
          statusHistory: {
            status,
            note: note || `Order ${status.toLowerCase()}.`,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("_id name email role phone createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
