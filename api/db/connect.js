import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "islamic-ecommerce-site", // Explicitly set database name
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Re-throw to handle in index.js
  }
};

export default connectDB;