import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");

  const existing = await User.findOne({ email: "admin@gmail.com" });

  const hashed = await bcrypt.hash("admin1234", 10);

  if (existing) {
    await User.updateOne(
      { email: "admin@gmail.com" },
      { $set: { name: "Admin", password: hashed, role: "admin" } }
    );
    console.log("✓ Admin account updated (password reset + role set to admin).");
  } else {
    await User.create({
      name:     "Admin",
      email:    "admin@gmail.com",
      password: hashed,
      role:     "admin",
    });
    console.log("✓ Admin account created!");
  }

  console.log("  Email:    admin@gmail.com");
  console.log("  Password: admin1234");
  console.log("  Role:     admin");

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
