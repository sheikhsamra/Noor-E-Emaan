import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  discountPrice: Number,
  images: [String],
  stock: Number,
  sizes: [String],
  colors: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
