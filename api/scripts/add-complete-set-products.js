// One-off: uploads the 3 real "Complete Set" gift-box photos
// (frontend/public/compelet set/set1-3.jpg) to Cloudinary and creates one
// product per photo under category="Prayer Set", subCategory="Complete Set".
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../../frontend/public/compelet set");

const PRODUCTS = [
  {
    file: "set1.jpg",
    name: "Rose Velvet Quran & Tasbih Gift Set",
    price: 3200, discountPrice: 2700, stock: 15,
    colors: ["Dusty Rose"],
    description: "Elegant gift set featuring a velvet-bound Quran, matching pearl tasbih and a gold-fringed velvet pouch. A beautiful presentation piece for Eid or special occasions.",
  },
  {
    file: "set2.jpg",
    name: "Royal Purple Quran Gift Box Set",
    price: 4200, discountPrice: 3600, stock: 12,
    colors: ["Purple"],
    description: "Luxurious gift box set with a gold-embossed Holy Quran, matching tasbih, and bookmark — presented in a satin-lined keepsake box with ribbon.",
  },
  {
    file: "set3.jpg",
    name: "Black Luxury Quran & Tasbih Box Set",
    price: 4500, discountPrice: 3800, stock: 12,
    colors: ["Black"],
    description: "Premium black leatherette gift box featuring a gold-detailed Quran, matching tasbih and a plush velvet prayer cloth — an elegant gift for any occasion.",
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.\n");

  for (const p of PRODUCTS) {
    const filePath = path.join(SRC_DIR, p.file);
    const result = await cloudinary.uploader.upload(filePath, { folder: "products" });

    await Product.create({
      name: p.name,
      category: "Prayer Set",
      subCategory: "Complete Set",
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [result.secure_url],
      stock: p.stock,
      sizes: [],
      colors: p.colors,
    });

    console.log(`✓ ${p.file} → "${p.name}"`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
