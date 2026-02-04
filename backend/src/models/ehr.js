import mongoose from "mongoose";

const ehrSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medications: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.EHR || mongoose.model("EHR", ehrSchema);
