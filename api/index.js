import express from "express";
import connectDB from "./db/connect.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import uploadRoutes from "./routes/upload.js";
import adminRoutes from "./routes/admin.js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
// express-mongo-sanitize is incompatible with Express 5 (req.query is read-only)
// Custom body sanitizer strips MongoDB operator keys from req.body
const stripDollarKeys = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => !k.startsWith("$"))
      .map(([k, v]) => [k, stripDollarKeys(v)])
  );
};

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS — dev allows localhost, prod allows known frontend URLs
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://noor-e-emaan-hfmp.vercel.app", // production frontend
        process.env.CLIENT_URL,                  // override via env if needed
      ].filter(Boolean)
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Strip MongoDB operators ($gt, $where, etc.) from request body
app.use((req, res, next) => {
  if (req.body) req.body = stripDollarKeys(req.body);
  next();
});

// General rate limit — 100 requests per 15 min per IP across all /api routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api", generalLimiter);

// Root route — confirms API is running
app.get("/", (req, res) => {
  res.json({
    name: "Noor-E-Emaan API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      auth:     "/api/auth",
      products: "/api/products",
      orders:   "/api/orders",
      upload:   "/api/upload",
      test:     "/api/test",
    },
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is reachable", status: "OK" });
});

// Ensure DB is connected on every request (safe for serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(503).json({ message: "Service unavailable. Please try again." });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Local dev only — Vercel manages its own HTTP server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
}

export default app;
