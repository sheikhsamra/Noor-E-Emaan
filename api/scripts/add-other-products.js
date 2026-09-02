// One-off: uploads the 6 real photos from frontend/public/other/ to
// Cloudinary and creates one product per photo under category="Other".
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
const SRC_DIR = path.resolve(__dirname, "../../frontend/public/other");

const PRODUCTS = [
  {
    file: "other1.jpg",
    name: "Handmade Resin Quran Stand with Bookmark",
    price: 3500, discountPrice: 2900, stock: 10,
    description: "Handcrafted resin Quran stand embedded with real dried rose petals and gold flakes, comes with a matching bookmark. A beautiful handmade piece for the home.",
  },
  {
    file: "other2.jpg",
    name: "Resin Quran Box Set with Bookmark",
    price: 4800, discountPrice: 4000, stock: 8,
    description: "Elegant handmade resin Quran box set in a marbled rose-gold finish with gold-leaf calligraphy, complete with a matching stand and bookmark. A luxurious keepsake gift.",
  },
  {
    file: "other3.jpg",
    name: "Personalized Umrah Mubarak Resin Plaque",
    price: 2800, discountPrice: 2300, stock: 15,
    description: "Custom-made 'Umrah Mubarak' resin plaque on a stand, decorated with dried flowers and personalized with your names and travel date. Message us to customize your order.",
  },
  {
    file: "other4.jpg",
    name: "Islamic Calligraphy Cuff Bracelet Set",
    price: 1500, discountPrice: 1200, stock: 30,
    colors: ["Rose Gold", "Gold", "Silver"],
    description: "Set of adjustable cuff bracelets engraved with Islamic calligraphy, available in rose gold, gold and silver tones. A meaningful everyday accessory.",
  },
  {
    file: "other5.jpg",
    name: "99 Names of Allah Car Hanging Ornament",
    price: 900, discountPrice: 700, stock: 40,
    description: "Brass-finish medallion engraved with the 99 Names of Allah (Asma-ul-Husna), on a beaded hanging chain. A beautiful accessory for your car mirror or home.",
  },
  {
    file: "other6.jpg",
    name: "Islamic LED Wall Clock with Bismillah",
    price: 3200, discountPrice: 2700, stock: 12,
    description: "Elegant crescent-moon wall clock featuring Bismillah calligraphy with warm LED backlighting. A striking piece of Islamic wall decor for any home.",
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
      category: "Other",
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [result.secure_url],
      stock: p.stock,
      sizes: [],
      colors: p.colors || [],
    });

    console.log(`✓ ${p.file} → "${p.name}"`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
