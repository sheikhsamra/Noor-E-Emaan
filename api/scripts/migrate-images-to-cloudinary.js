// One-off migration — uploads every product image that's still a local
// /public path (served as a static file) to Cloudinary, then rewrites each
// product's `images` array to use the returned Cloudinary URL instead.
// Skips any image that's already an http(s) URL.
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
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

const uploadLocal = (localPath) => {
  const relPath = localPath.replace(/^\//, "");
  const filePath = path.join(PUBLIC_DIR, relPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ✗ File not found, skipping: ${filePath}`);
    return null;
  }
  return cloudinary.uploader.upload(filePath, { folder: "products" });
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.\n");

  const products = await Product.find({});
  const cache = new Map(); // local path -> secure_url (avoid re-uploading duplicates)
  let uploaded = 0;
  let updatedProducts = 0;

  for (const product of products) {
    let changed = false;
    const newImages = [];

    for (const img of product.images) {
      if (/^https?:\/\//.test(img)) {
        newImages.push(img); // already on Cloudinary/remote — leave as-is
        continue;
      }
      if (cache.has(img)) {
        newImages.push(cache.get(img));
        changed = true;
        continue;
      }
      const result = await uploadLocal(img);
      if (!result) {
        newImages.push(img); // couldn't find the file — keep original path
        continue;
      }
      cache.set(img, result.secure_url);
      newImages.push(result.secure_url);
      uploaded++;
      changed = true;
      console.log(`  ✓ ${img} → ${result.secure_url}`);
    }

    if (changed) {
      product.images = newImages;
      await product.save();
      updatedProducts++;
    }
  }

  console.log(`\nDone. ${uploaded} unique files uploaded to Cloudinary, ${updatedProducts} products updated.`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
