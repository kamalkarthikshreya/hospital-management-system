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

// ALWAYS first
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

/* ================= HEALTH ================= */

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
  .catch((err) => console.log("❌ Mongo error:", err));

/* ================= ROUTES ================= */

// ⭐ CLEAN ROUTE DESIGN
/* ================= ROUTES ================= */

// This handles /api/dashboard-stats
app.use("/api", analyticsRoutes); 

// This handles /api/analytics/doctor (for the charts)
app.use("/api/analytics", analyticsRoutes); 

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ehr", ehrRoutes);
/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

/* ================= START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
