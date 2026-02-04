import express from "express";
import EHR from "../models/ehr.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * CREATE EHR (Doctor only)
 * POST /api/ehr
 */
router.post(
  "/",
  protect,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const { patientId, symptoms, diagnosis, medications, notes } = req.body;

      if (!patientId || !symptoms || !diagnosis) {
        return res.status(400).json({
          message: "Patient, symptoms and diagnosis are required"
        });
      }

      const ehr = await EHR.create({
        patient: patientId,
        doctor: req.user.id,
        symptoms,
        diagnosis,
        medications,
        notes
      });

      res.status(201).json({
        message: "EHR record created",
        ehr
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET MY EHRs (Patient)
 * GET /api/ehr/my
 */
router.get(
  "/my",
  protect,
  authorizeRoles("patient"),
  async (req, res) => {
    try {
      const records = await EHR.find({ patient: req.user.id })
        .populate("doctor", "name email");

      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET PATIENT EHRs (Doctor)
 * GET /api/ehr/patient/:id
 */
router.get(
  "/patient/:id",
  protect,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const records = await EHR.find({ patient: req.params.id })
        .populate("patient", "name email")
        .populate("doctor", "name email");

      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
