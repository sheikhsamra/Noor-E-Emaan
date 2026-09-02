// One-off: uploads the 10 real hijab photos (frontend/public/hijab/hijab1-10.jpg)
// to Cloudinary and creates one product per photo, tagged with the correct
// subCategory (Chiffon Scarf / Khimar / Jersey Hijab / Pashmina Shawl).
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
const HIJAB_DIR = path.resolve(__dirname, "../../frontend/public/hijab");

const PRODUCTS = [
  {
    file: "hijab1.jpg",
    name: "Mauve Pink Chiffon Hijab",
    subCategory: "Chiffon Scarf",
    price: 950, discountPrice: 750, stock: 40,
    colors: ["Mauve Pink"],
    description: "Soft, breathable chiffon hijab in a dusty mauve pink shade. Drapes beautifully and holds pins securely for an all-day elegant look.",
  },
  {
    file: "hijab2.jpg",
    name: "Teal Sparkle Chiffon Hijab",
    subCategory: "Chiffon Scarf",
    price: 1100, discountPrice: 900, stock: 30,
    colors: ["Teal"],
    description: "Rich teal chiffon hijab finished with delicate gold sparkle dots for a subtle festive shine. Lightweight and easy to style.",
  },
  {
    file: "hijab3.jpg",
    name: "Sage Green Leaf-Trim Hijab",
    subCategory: "Chiffon Scarf",
    price: 1200, discountPrice: 980, stock: 25,
    colors: ["Sage Green"],
    description: "Sage green chiffon hijab with a beautiful lace leaf-pattern trim along the edge. A refined, feminine touch for everyday elegance.",
  },
  {
    file: "hijab4.jpg",
    name: "Emerald Pearl-Studded Hijab",
    subCategory: "Chiffon Scarf",
    price: 1300, discountPrice: 1050, stock: 20,
    colors: ["Emerald Green"],
    description: "Deep emerald chiffon hijab hand-studded with pearl embellishments along the border. Perfect for special occasions and Eid.",
  },
  {
    file: "hijab5.jpg",
    name: "Brown Layered Khimar",
    subCategory: "Khimar",
    price: 2200, discountPrice: 1800, stock: 18,
    colors: ["Brown"],
    description: "Elegant tiered khimar in rich brown chiffon with contrast sleeves. Full coverage with a graceful, layered silhouette.",
  },
  {
    file: "hijab6.jpg",
    name: "Black Layered Khimar with Gold Trim",
    subCategory: "Khimar",
    price: 2500, discountPrice: 2100, stock: 15,
    colors: ["Black"],
    description: "Classic black tiered khimar finished with a fine gold-piped trim on every layer. Elegant, modest and complete coverage.",
  },
  {
    file: "hijab7.jpg",
    name: "Dusty Rose Jersey Hijab",
    subCategory: "Jersey Hijab",
    price: 700, discountPrice: 550, stock: 45,
    colors: ["Dusty Rose"],
    description: "Stretchy, non-slip jersey hijab in a soft dusty rose. No pins needed — stays in place all day, easy to style in seconds.",
  },
  {
    file: "hijab8.jpg",
    name: "Plum Jersey Hijab",
    subCategory: "Jersey Hijab",
    price: 700, discountPrice: 550, stock: 45,
    colors: ["Plum"],
    description: "Stretchy, non-slip jersey hijab in a rich plum shade. No pins needed — stays in place all day, easy to style in seconds.",
  },
  {
    file: "hijab9.jpg",
    name: "Beige Floral Embroidered Pashmina Shawl",
    subCategory: "Pashmina Shawl",
    price: 2800, discountPrice: 2300, stock: 15,
    colors: ["Beige"],
    description: "Luxurious beige pashmina-style shawl with intricate multicolour floral embroidery along the border. A statement piece for winter and special occasions.",
  },
  {
    file: "hijab10.jpg",
    name: "Ivory Floral Fringe Pashmina Shawl",
    subCategory: "Pashmina Shawl",
    price: 2600, discountPrice: 2100, stock: 15,
    colors: ["Ivory White"],
    description: "Elegant ivory pashmina shawl with delicate floral embroidery and a soft tasseled fringe. Warm, soft and beautifully finished.",
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.\n");

  for (const p of PRODUCTS) {
    const filePath = path.join(HIJAB_DIR, p.file);
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
