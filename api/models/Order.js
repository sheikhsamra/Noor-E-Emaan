import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note:   { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name:     String,
      price:    Number,
      quantity: Number,
      image:    String,
    }
  ],
  total:  Number,
  status: { type: String, default: "Pending", enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] },
  statusHistory: [statusHistorySchema],
  customerInfo: {
    name:    String,
    email:   String,
    phone:   String,
    address: String,
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
