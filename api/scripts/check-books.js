import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const books = await Product.find({ category: "Islamic Books" }).select("name images");
books.forEach(p => console.log(`"${p.name}" → [${p.images.join(", ")}]`));
await mongoose.disconnect();
