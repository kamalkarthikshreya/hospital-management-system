import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import ehrRoutes from "./routes/ehrRoutes.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

// Parse JSON FIRST
app.use(express.json());

/* ================= CORS (VERY IMPORTANT) ================= */

// Allowed domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://healthcare-system-kamal.vercel.app", // ⭐ Your LIVE frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS not allowed for this origin"));
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server running",
  });
});

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================= ROUTES ================= */

// Auth routes
app.use("/api/auth", authRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Analytics (only mount once)
app.use("/api/analytics", analyticsRoutes);

// EHR
app.use("/api/ehr", ehrRoutes);

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
