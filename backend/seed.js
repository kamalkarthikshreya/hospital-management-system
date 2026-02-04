import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "./src/models/user.js";
import EHR from "./src/models/EHR.js";

dotenv.config();

/* ================= CONNECT DB ================= */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
    process.exit(1);
  }
};

/* ================= SEED FUNCTION ================= */

const seedDatabase = async () => {

  try {

    await connectDB();

    console.log("🧹 Clearing old data...");

    await User.deleteMany({
      role: { $in: ["patient", "doctor"] }
    });

    await EHR.deleteMany({});

    /* ================= PASSWORD ================= */

    const hashedPassword = await bcrypt.hash("Medigraph#P9x!42", 10);

    /* ================= CREATE DOCTOR ================= */

    const doctor = await User.create({
      name: "Dr. Sarah Williams",
      email: "doctor@test.com",
      password: hashedPassword,
      role: "doctor"
    });

    console.log("✅ Doctor created");

    /* ================= CREATE PATIENTS ================= */

    const patientArray = [];

    for (let i = 1; i <= 15; i++) {
      patientArray.push({
        name: `Patient ${i}`,
        email: `patient${i}@test.com`,
        password: hashedPassword,
        role: "patient",
        createdAt: new Date(Date.now() - Math.random() * 90*24*60*60*1000),
        updatedAt: new Date()
      });
    }

    const patients = await User.insertMany(patientArray);

    console.log("✅ Patients created:", patients.length);

    /* ================= DIAGNOSIS POOL ================= */

    const diagnoses = [
      "Viral Infection",
      "Flu",
      "Hypertension",
      "Diabetes",
      "Migraine",
      "Asthma",
      "COVID-19",
      "Allergy"
    ];

    /* ================= CREATE REALISTIC EHR DATA ================= */

    const ehrRecords = [];

    for (let i = 0; i < 60; i++) {

      // Random day within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);

      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() - daysAgo);

      ehrRecords.push({
        patient: patients[Math.floor(Math.random() * patients.length)]._id,
        doctor: doctor._id,

        symptoms: "Fever, cough, fatigue",
        diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
        medications: "Paracetamol",
        notes: "Auto seeded record",

        status: Math.random() > 0.2 ? "completed" : "pending",

        createdAt: visitDate,
        updatedAt: visitDate
      });
    }

    // VERY IMPORTANT → prevent timestamp override
    await EHR.insertMany(ehrRecords, { timestamps: false });

    console.log("✅ EHR records inserted:", ehrRecords.length);

    console.log("\n🔥 Database Successfully Seeded!");
    console.log("👉 Your analytics dashboard is now DATA-READY.");

    process.exit();

  } catch (error) {

    console.error("❌ Seeding Error:", error);
    process.exit(1);

  }
};

seedDatabase();
