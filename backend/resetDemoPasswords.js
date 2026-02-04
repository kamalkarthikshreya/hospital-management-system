import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/user.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGO_URI";

const resetPassword = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    const hashedPassword = await bcrypt.hash("Medigraph#P9x!42", 10);

    await User.updateOne(
      { email: "doctor@test.com" }, // change if needed
      {
        $set: {
          password: hashedPassword,
          forcePasswordReset: false
        }
      }
    );

    console.log("✅ Password updated successfully!");
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

resetPassword();
