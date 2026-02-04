import EHR from "../models/ehr.js";

/* Create EHR */
export const createEHR = async (req, res) => {
  const { patientName, diagnosis, prescription } = req.body;

  const ehr = await EHR.create({
    patientName,
    diagnosis,
    prescription,
    doctorId: req.user.id,
  });

  res.status(201).json(ehr);
};

/* Get all EHRs created by doctor */
export const getDoctorEHRs = async (req, res) => {
  const records = await EHR.find({ doctorId: req.user.id });
  res.json(records);
};

/* Update EHR */
export const updateEHR = async (req, res) => {
  const updated = await EHR.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

/* Delete EHR */
export const deleteEHR = async (req, res) => {
  await EHR.findByIdAndDelete(req.params.id);
  res.json({ message: "EHR deleted" });
};
