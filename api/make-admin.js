import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) { console.error("❌ MONGO_URI not found in .env"); process.exit(1); }

await mongoose.connect(uri);
console.log("✓ Connected to MongoDB");

const result = await mongoose.connection.db
  .collection("users")
  .updateOne(
    { email: "admin@gmail.com" },
    { $set: { role: "admin" } }
  );

if (result.matchedCount === 0) {
  console.log("❌ No user found with email admin@gmail.com");
  console.log("   → Pehle website pe signup karo phir ye script chalaao");
} else {
  console.log("✓ Role updated to admin for admin@gmail.com");
  console.log("  Ab logout karke dobara login karo");
}

await mongoose.disconnect();
process.exit(0);
