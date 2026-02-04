import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Patient route
 */
router.get(
  "/patient",
  protect,
  authorizeRoles("patient"),
  (req, res) => {
    res.json({
      message: "Patient access granted",
      user: req.user
    });
  }
);

/**
 * Doctor route
 */
router.get(
  "/doctor",
  protect,
  authorizeRoles("doctor"),
  (req, res) => {
    res.json({
      message: "Doctor access granted",
      user: req.user
    });
  }
);

/**
 * Admin route
 */
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted",
      user: req.user
    });
  }
);

export default router;
