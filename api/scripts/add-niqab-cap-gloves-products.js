// One-off: uploads the 11 real photos from frontend/public/naqab/ to
// Cloudinary and creates one product per photo, all under category="Hijab"
// with subCategory = Niqab / Cap / Hand Gloves as appropriate. The mask
// photo is filed under "Niqab" per instruction (not a separate style).
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
const SRC_DIR = path.resolve(__dirname, "../../frontend/public/naqab");

const PRODUCTS = [
  // ── Cap ──────────────────────────────────────────────────────
  {
    file: "cap1.jpg",
    name: "Black Stretch Under-Cap",
    subCategory: "Cap",
    price: 450, discountPrice: 350, stock: 50,
    colors: ["Black"],
    description: "Soft stretch under-cap with tie-back closure — worn beneath the hijab or niqab for extra grip and coverage.",
  },
  {
    file: "cap2.jpg",
    name: "Beige Stretch Under-Cap",
    subCategory: "Cap",
    price: 450, discountPrice: 350, stock: 50,
    colors: ["Beige"],
    description: "Soft stretch under-cap with tie-back closure in a neutral beige tone — comfortable all-day wear beneath the hijab.",
  },

  // ── Hand Gloves ──────────────────────────────────────────────
  {
    file: "glubs1.jpg",
    name: "Floral Embroidered Gloves",
    subCategory: "Hand Gloves",
    price: 650, discountPrice: 500, stock: 60,
    colors: ["Purple", "Sage Blue", "Yellow", "Brown", "Black", "Taupe", "Olive", "Navy"],
    description: "Soft everyday gloves with a delicate floral embroidery accent. Available in a wide range of colours to match any outfit.",
  },
  {
    file: "glubs2.jpg",
    name: "Fingerless Modesty Gloves",
    subCategory: "Hand Gloves",
    price: 500, discountPrice: 400, stock: 45,
    colors: ["Black", "Pink"],
    description: "Fingerless gloves covering the back of the hand and wrist while keeping fingertips free — light, breathable and easy to wear.",
  },
  {
    file: "glubs3.jpg",
    name: "Long Arm Sleeve Gloves",
    subCategory: "Hand Gloves",
    price: 750, discountPrice: 600, stock: 35,
    colors: ["Black", "Grey", "White"],
    description: "Extra-long arm sleeve gloves for full forearm coverage. Soft, stretchy fabric with an open-thumb design for comfort.",
  },

  // ── Niqab (incl. mask, filed under Niqab) ───────────────────
  {
    file: "naqab1.jpg",
    name: "Mocha Single-Layer Niqab",
    subCategory: "Niqab",
    price: 1200, discountPrice: 950, stock: 25,
    colors: ["Mocha"],
    description: "Simple single-layer niqab in a soft mocha chiffon. Lightweight, breathable and easy to drape.",
  },
  {
    file: "naqab2.jpg",
    name: "Mauve Ruffled Niqab with Brooch",
    subCategory: "Niqab",
    price: 1800, discountPrice: 1500, stock: 18,
    colors: ["Mauve"],
    description: "Elegant tiered ruffle niqab in dusty mauve, finished with a decorative brooch pin at the crown for a refined look.",
  },
  {
    file: "naqab3.jpg",
    name: "Mauve Chain-Accent Niqab Set",
    subCategory: "Niqab",
    price: 2200, discountPrice: 1850, stock: 15,
    colors: ["Mauve"],
    description: "Premium niqab set with a delicate gold chain and floral accent along the headpiece — a graceful finishing touch for special occasions.",
  },
  {
    file: "naqab4.jpg",
    name: "Sage Green Niqab Set",
    subCategory: "Niqab",
    price: 1400, discountPrice: 1150, stock: 22,
    colors: ["Sage Green"],
    description: "Two-piece niqab set in soft sage green chiffon with adjustable tie strap. Comfortable, breathable everyday wear.",
  },
  {
    file: "naqab5.jpg",
    name: "Navy Blue Niqab Set",
    subCategory: "Niqab",
    price: 1400, discountPrice: 1150, stock: 22,
    colors: ["Navy Blue"],
    description: "Two-piece niqab set in deep navy blue chiffon with adjustable tie strap. Comfortable, breathable everyday wear.",
  },
  {
    file: "maks1.jpg",
    name: "Waffle-Knit Face Mask Set",
    subCategory: "Niqab",
    price: 400, discountPrice: 300, stock: 60,
    colors: ["Grey", "White", "Beige", "Black"],
    description: "Soft waffle-knit face mask with ear loops — a lightweight modesty layer, available in four neutral shades.",
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
      category: "Hijab",
      subCategory: p.subCategory,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [result.secure_url],
      stock: p.stock,
      sizes: [],
      colors: p.colors,
    });

    console.log(`✓ ${p.file} → "${p.name}" (${p.subCategory})`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
