// One-off: uploads the 4 real kids photos (frontend/public/kids/kid1-4.jpg)
// to Cloudinary and creates one product per photo under category="Kids".
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
const SRC_DIR = path.resolve(__dirname, "../../frontend/public/kids");

const PRODUCTS = [
  {
    file: "kid1.jpg",
    name: "Kids Open Abaya with Hijab",
    price: 2200, discountPrice: 1800, stock: 25,
    colors: ["Brown"],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    description: "Elegant brown open-front abaya with contrast piping, worn over a matching dress with a coordinating hijab. Soft, comfortable fabric perfect for young girls.",
  },
  {
    file: "kid2.jpg",
    name: "Toddler Abaya & Hijab Set",
    price: 1800, discountPrice: 1500, stock: 30,
    colors: ["Olive"],
    sizes: ["2-3Y", "3-4Y", "4-5Y"],
    description: "Soft olive abaya with an attached built-in hijab — no separate pinning needed. Comfortable, easy to wear for toddlers and young girls.",
  },
  {
    file: "kid3.jpg",
    name: "Kids Formal Kurta with Embroidered Waistcoat",
    price: 3200, discountPrice: 2700, stock: 20,
    colors: ["Ivory"],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    description: "Sharp ivory kurta paired with a matching embroidered waistcoat and brooch detail. Perfect formal wear for Eid and special occasions.",
  },
  {
    file: "kid4.jpg",
    name: "Kids Embroidered Kurta Shalwar",
    price: 2600, discountPrice: 2200, stock: 22,
    colors: ["Brown"],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    description: "Rich brown kurta with detailed gold embroidery on the collar and placket, paired with matching pants. Comfortable everyday and festive wear for boys.",
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
      category: "Kids",
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [result.secure_url],
      stock: p.stock,
      sizes: p.sizes,
      colors: p.colors,
    });

    console.log(`✓ ${p.file} → "${p.name}"`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
