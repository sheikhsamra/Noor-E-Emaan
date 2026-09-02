// One-off: Accessories (Tasbih) and Prayer Set (Jainamaz) each had 4 products
// with 2 images bundled together (8 real photos, only 4 listing cards).
// Splits each into 2 single-image products by color variant, so all 8 real
// photos each get their own listing — matching what's actually in stock.
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

// name -> { name2, color1, color2 } — color1 stays on the original doc,
// color2 becomes the new split-off product's name/color.
const SPLITS = {
  "Elegant Counting Tasbih":      { name2: "Black Counting Tasbih",           color1: "Green",         color2: "Black" },
  "Premium Embroidered Jainamaz": { name2: "Green & Gold Embroidered Jainamaz", color1: "Maroon & Gold", color2: "Green & Gold" },
  "Classic Velvet Prayer Mat":    { name2: "Maroon Velvet Prayer Mat",         color1: "Green",         color2: "Maroon" },
  "Pearl Tasbih Luxury":          { name2: "Cream Pearl Tasbih",               color1: "White Pearl",   color2: "Cream Pearl" },
  "Natural Wooden Tasbih":        { name2: "Dark Walnut Tasbih",               color1: "Rosewood Brown", color2: "Dark Walnut" },
  "Luxury Musallah Set":          { name2: "Emerald Green Musallah Set",       color1: "Maroon",        color2: "Emerald Green" },
  "Crystal Tasbih 99 Beads":      { name2: "Rose Crystal Tasbih",              color1: "Crystal Clear", color2: "Rose Crystal" },
  "Travel Portable Prayer Mat":   { name2: "Grey Travel Prayer Mat",           color1: "Beige",         color2: "Grey" },
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.\n");

  for (const [origName, { name2, color1, color2 }] of Object.entries(SPLITS)) {
    const product = await Product.findOne({ name: origName });
    if (!product) { console.log(`✗ not found: ${origName}`); continue; }
    if (product.images.length < 2) { console.log(`✗ only ${product.images.length} image(s), skipping: ${origName}`); continue; }

    const [img1, img2] = product.images;
    const halfStock = Math.max(1, Math.floor(product.stock / 2));

    // New product from the second image/color
    await Product.create({
      name: name2,
      category: product.category,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      images: [img2],
      stock: product.stock - halfStock,
      sizes: product.sizes,
      colors: [color2],
    });

    // Trim the original to just its first image/color + remaining stock
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
