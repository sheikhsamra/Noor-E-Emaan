import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the minimum fields needed for version check + role
    const user = await User.findById(decoded.id).select("role tokenVersion");
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Reject tokens issued before a password reset
    // ?? 0 makes this migration-safe: old JWTs without tokenVersion are treated as version 0
    const jwtVersion = decoded.tokenVersion ?? 0;
    const dbVersion  = user.tokenVersion    ?? 0;
    if (jwtVersion !== dbVersion) {
      return res.status(401).json({
        message: "Your session has expired. Please log in again.",
        code: "TOKEN_VERSION_MISMATCH",
      });
    }

    req.user = { ...decoded, role: user.role };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};
