import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { protect, adminOnly } from "../utils/authMiddleware.js";

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: "products" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
