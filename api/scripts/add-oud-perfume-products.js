// One-off: uploads 3 Oud + 4 Perfume photos to Cloudinary and creates
// products under category="Fragrances" with subCategory Oud / Perfumes.
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
const PUBLIC_DIR = path.resolve(__dirname, "../../frontend/public");

const PRODUCTS = [
  // ── Oud ──────────────────────────────────────────────────────
  {
    dir: "oud", file: "oud1.jpg",
    name: "Oud Mood Roll-On Attar",
    subCategory: "Oud",
    price: 1800, discountPrice: 1500, stock: 30,
    description: "Rich roll-on oud attar with warm, woody depth. Long-lasting, alcohol-free formula in a convenient travel-friendly bottle.",
  },
  {
    dir: "oud", file: "oud2.jpg",
    name: "Premium Oudh Pure Agarwood Oil",
    subCategory: "Oud",
    price: 3500, discountPrice: 2900, stock: 15,
    description: "Pure agarwood (oudh) oil with an intense, smoky-sweet aroma. A concentrated, premium fragrance oil for the true oud connoisseur.",
  },
  {
    dir: "oud", file: "oud3.jpg",
    name: "Oud De Arabia Eau De Perfume",
    subCategory: "Oud",
    price: 4200, discountPrice: 3600, stock: 18,
    description: "Bold, resinous oud fragrance in a striking amber glass bottle. Deep, long-lasting sillage inspired by classic Arabian perfumery.",
  },

  // ── Perfumes ─────────────────────────────────────────────────
  {
    dir: "perfums", file: "perfum1.jpg",
    name: "Janan Gold Edition Perfume",
    subCategory: "Perfumes",
    price: 3800, discountPrice: 3200, stock: 20,
    description: "Janan Gold Edition — a warm, spiced fragrance with notes of amber and cinnamon in an elegant matte-black and gold bottle.",
  },
  {
    dir: "perfums", file: "perfum2.jpg",
    name: "Wisal Al Dhahab Perfume",
    subCategory: "Perfumes",
    price: 4500, discountPrice: 3800, stock: 15,
    description: "Wisal Al Dhahab — a luxurious Arabian fragrance in a striking gold ornamental bottle, rich and long-lasting on the skin.",
  },
  {
    dir: "perfums", file: "perfum3.jpg",
    name: "Bloom Pour Femme",
    subCategory: "Perfumes",
    price: 3200, discountPrice: 2700, stock: 25,
    description: "Bloom Pour Femme by J. — a fresh floral eau de parfum with soft rose notes, perfect for everyday elegance. 100ml.",
  },
  {
    dir: "perfums", file: "perfume4.jpg",
    name: "Wasim Akram 502 For Her (Limited Edition)",
    subCategory: "Perfumes",
    price: 4800, discountPrice: 4100, stock: 12,
    description: "Wasim Akram 502 For Her — a limited edition eau de parfum with a soft floral-fruity blend, presented in an elegant crystal-topped bottle. 3.4 fl oz.",
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.\n");

  for (const p of PRODUCTS) {
    const filePath = path.join(PUBLIC_DIR, p.dir, p.file);
    const result = await cloudinary.uploader.upload(filePath, { folder: "products" });

    await Product.create({
      name: p.name,
      category: "Fragrances",
      subCategory: p.subCategory,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [result.secure_url],
      stock: p.stock,
      sizes: [],
      colors: [],
    });

    console.log(`✓ ${p.file} → "${p.name}" (${p.subCategory})`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
