// One-off: 3 Abaya products (Modern Butterfly, Luxury Open, Embroidered Set)
// each have 2 real photos bundled as one listing, one per color. Splits each
// into 2 single-image products by color — same pattern as the earlier
// Tasbih/Jainamaz split. "Premium Black Abaya" (single color) and the
// Cloudinary-only Ombre abaya are left alone — nothing to split cleanly.
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

// original name -> new split-off product's name
const SPLITS = {
  "Modern Butterfly Abaya": "Dark Grey Butterfly Abaya",
  "Luxury Open Abaya":      "Maroon Luxury Abaya",
  "Embroidered Abaya Set":  "Navy Blue Embroidered Abaya",
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.\n");

  for (const [origName, name2] of Object.entries(SPLITS)) {
    const product = await Product.findOne({ name: origName });
    if (!product) { console.log(`✗ not found: ${origName}`); continue; }
    if (product.images.length < 2 || product.colors.length < 2) {
      console.log(`✗ not enough images/colors, skipping: ${origName}`);
      continue;
    }

    const [img1, img2] = product.images;
    const [color1, color2] = product.colors;
    const halfStock = Math.max(1, Math.floor(product.stock / 2));

    await Product.create({
      name: name2,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      images: [img2],
      stock: product.stock - halfStock,
      sizes: product.sizes,
      colors: [color2],
    });

    product.images = [img1];
    product.colors = [color1];
    product.stock = halfStock;
    await product.save();

    console.log(`✓ ${origName} → split into "${origName}" (${color1}) + "${name2}" (${color2})`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => { console.error("Failed:", err.message); process.exit(1); });
