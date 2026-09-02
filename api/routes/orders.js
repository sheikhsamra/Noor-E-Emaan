import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import twilio from "twilio";
import { protect } from "../utils/authMiddleware.js";
import { orderRules, validate } from "../utils/validators.js";

const router = express.Router();

const getTwilioClient = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  if (!sid || !sid.startsWith("AC")) return null;
  return twilio(sid, process.env.TWILIO_AUTH_TOKEN);
};

// GET /api/orders/my-orders  OR  /api/orders/:id
// Express 5 path-to-regexp v8 does not reliably match literal "/my-orders" before "/:id",
// so we handle both cases inside a single parameterised route.
router.get("/:id", protect, async (req, res) => {
  const { id } = req.params;

  // ── my-orders: return all orders for the logged-in user ──
  if (id === "my-orders") {
    try {
      const userId = new mongoose.Types.ObjectId(req.user.id);
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("_id products total status customerInfo createdAt statusHistory");
      return res.json(orders);
    } catch (err) {
      console.error("my-orders fetch error:", err.message);
      return res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
    }
  }

  // ── single order detail ──
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    console.error("order detail fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch order.", error: err.message });
  }
});

// POST /api/orders — place new order
router.post("/", protect, orderRules, validate, async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    const productIds = items.map((item) => item.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== items.length) {
      return res.status(404).json({ message: "One or more products were not found." });
    }

    // Atomically reserve stock per item — the $gte guard means concurrent
    // orders can never both succeed in taking the last unit(s).
    const reserved = [];
    let insufficientProduct = null;

    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        insufficientProduct = dbProducts.find((p) => p._id.toString() === item.productId);
        break;
      }
      reserved.push({ product: updated, quantity: item.quantity });
    }

    // Not enough stock for some item — release whatever we already reserved
    if (insufficientProduct) {
      await Promise.all(
        reserved.map((r) => Product.findByIdAndUpdate(r.product._id, { $inc: { stock: r.quantity } }))
      );
      return res.status(400).json({
        message: `"${insufficientProduct.name}" only has ${insufficientProduct.stock} unit(s) in stock.`,
      });
    }

    const orderProducts = [];
    let total = 0;

    for (const { product, quantity } of reserved) {
      const unitPrice = product.discountPrice || product.price;
      total += unitPrice * quantity;

      orderProducts.push({
        productId: product._id,
        name:      product.name,
        price:     unitPrice,
        quantity,
        image:     product.images?.[0] || "",
      });
    }

    const delivery = total >= 3000 ? 0 : 200;
    let order;
    try {
      order = await Order.create({
        user:         req.user.id,
        products:     orderProducts,
        total:        total + delivery,
        customerInfo,
        status:       "Pending",
        statusHistory: [{ status: "Pending", note: "Order placed successfully." }],
      });
    } catch (createErr) {
      // Order record failed — release the stock we reserved above
      await Promise.all(
        reserved.map((r) => Product.findByIdAndUpdate(r.product._id, { $inc: { stock: r.quantity } }))
      );
      throw createErr;
    }

    try {
      const client = getTwilioClient();
      if (!client) throw new Error("Twilio not configured");
      await client.messages.create({
        body: `New Order #${order._id}\nCustomer: ${customerInfo.name} | ${customerInfo.phone}\nItems: ${orderProducts.map((p) => `${p.name} x${p.quantity}`).join(", ")}\nTotal: Rs. ${total}\nAddress: ${customerInfo.address}`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to:   `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
      });
    } catch (twilioErr) {
      console.error("Twilio notification failed:", twilioErr.message);
    }

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order.", error: err.message });
  }
});

export default router;
