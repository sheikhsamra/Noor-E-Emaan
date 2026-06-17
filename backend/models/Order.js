import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: Number,
  status: { type: String, default: "Pending" },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
