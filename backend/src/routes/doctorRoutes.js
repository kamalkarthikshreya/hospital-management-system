import express from "express";
import {
  createEHR,
  getDoctorEHRs,
  updateEHR,
  deleteEHR,
} from "../controllers/doctorController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* Doctor-only routes */
router.post("/", protect, authorizeRoles("doctor"), createEHR);
router.get("/", protect, authorizeRoles("doctor"), getDoctorEHRs);
router.put("/:id", protect, authorizeRoles("doctor"), updateEHR);
router.delete("/:id", protect, authorizeRoles("doctor"), deleteEHR);

export default router;
