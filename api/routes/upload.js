import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import fs from "fs";
const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path, { folder: "products" });
  fs.unlinkSync(req.file.path);
  res.json({ url: result.secure_url });
});

export default router;
