// backend/src/controllers/ehrController.js
import EHR from "../models/ehr.js";

export const createEHR = async (req, res) => {
  try {
    const { patientId, symptoms, diagnosis, treatment } = req.body;

    // Use the logged-in doctor's ID from your auth middleware
    const doctorId = req.user.id; 

    const newEHR = new EHR({
      patient: patientId,
      doctor: doctorId,
      symptoms,
      diagnosis,
      treatment,
      status: "completed"
    });

    await newEHR.save();
    res.status(201).json({ message: "EHR created successfully", data: newEHR });
  } catch (error) {
    res.status(500).json({ message: "Failed to create EHR", error: error.message });
  }
};