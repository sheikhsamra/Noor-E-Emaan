// One-off: uploads the 6 real kurta photos (frontend/public/mens/men1-6.jpg)
// to Cloudinary and creates one product per photo under category="Men",
// subCategory="Kurta".
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
const SRC_DIR = path.resolve(__dirname, "../../frontend/public/mens");

const PRODUCTS = [
  {
    file: "men1.jpg",
    name: "Classic White Kurta Shalwar",
    price: 2800, discountPrice: 2300, stock: 30,
    colors: ["White"],
    description: "Timeless white kurta with mandarin collar and chest pocket, paired with matching shalwar. Premium cotton blend, perfect for Jummah and everyday wear.",
  },
  {
    file: "men2.jpg",
    name: "Olive Green Kurta Shalwar",
    price: 3000, discountPrice: 2500, stock: 25,
    colors: ["Olive Green"],
    description: "Sharp olive green kurta with a clean mandarin collar, tailored fit and matching shalwar. A modern, versatile addition to any wardrobe.",
  },
  {
    file: "men3.jpg",
    name: "Beige Kurta Shalwar",
    price: 2900, discountPrice: 2400, stock: 28,
    colors: ["Beige"],
    description: "Relaxed beige kurta shalwar in breathable fabric, finished with a mandarin collar and button placket. Comfortable everyday elegance.",
  },
  {
    file: "men4.jpg",
    name: "Navy Blue Kurta Shalwar",
    price: 3000, discountPrice: 2500, stock: 25,
    colors: ["Navy Blue"],
    description: "Rich navy blue kurta with a tailored silhouette and matching shalwar. Sharp mandarin collar detailing for a polished, modern look.",
  },
  {
    file: "men5.jpg",
    name: "Brown Kurta with Waistcoat",
    price: 4200, discountPrice: 3600, stock: 18,
    colors: ["Brown"],
    description: "Complete three-piece set — kurta, shalwar and matching waistcoat in a rich brown tone. Elegant formal wear for special occasions.",
  },
  {
    file: "men6.jpg",
    name: "Black Kurta with Grey Waistcoat",
    price: 4200, discountPrice: 3600, stock: 18,
    colors: ["Black"],
    description: "Sophisticated black kurta shalwar paired with a contrast grey waistcoat. A striking formal look for Eid and special gatherings.",
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
      category: "Men",
      subCategory: "Kurta",
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      images: [result.secure_url],
      stock: p.stock,
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: p.colors,
    });

    console.log(`✓ ${p.file} → "${p.name}"`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
