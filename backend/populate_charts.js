import mongoose from 'mongoose';
import EHR from './src/models/ehr.js'; 
import User from './src/models/user.js';

const MONGO_URI = 'mongodb://localhost:27017/healthcare';

const populate = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const doctor = await User.findOne({ role: "doctor" });
    const patient = await User.findOne({ role: "patient" });

    if (!doctor || !patient) {
      console.log("❌ Need at least one doctor and one patient to run this.");
      process.exit();
    }

    const entries = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      // Randomly spread records across the last 6 days
      date.setDate(date.getDate() - Math.floor(Math.random() * 7)); 
      
      entries.push({
        patient: patient._id,
        doctor: doctor._id,
        symptoms: "Checkup",
        diagnosis: "Healthy",
        treatment: "None",
        createdAt: date
      });
    }

    await EHR.insertMany(entries);
    console.log("✅ 15 EHR records added across different days!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

populate();