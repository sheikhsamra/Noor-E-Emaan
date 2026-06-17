import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  images: [String],
  stock: Number,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
