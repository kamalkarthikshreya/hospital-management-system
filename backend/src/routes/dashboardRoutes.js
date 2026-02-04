import express from "express";
import EHR from "../models/EHR.js";   // adjust name if different
import Patient from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {

    /* ================= TOTAL COUNTS ================= */

    const totalPatients = await Patient.countDocuments();

    const completedEhrs = await EHR.countDocuments({
      status: "completed"
    });

    const pendingReports = await EHR.countDocuments({
      status: "pending"
    });

    /* ================= TODAY VISITS ================= */

    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);

    const visitsToday = await EHR.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    /* ================= WEEKLY VISITS ================= */

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);

    const visits = await EHR.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1=Sun
          visits: { $sum: 1 }
        }
      }
    ]);

    // convert Mongo result into Mon-Sun format
    const daysMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat"
    };

    const weeklyVisits = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
      .map(day => {
        const found = visits.find(
          v => daysMap[v._id] === day
        );

        return {
          day,
          visits: found ? found.visits : 0
        };
      });

    /* ================= RESPONSE ================= */

    res.json({
      patients: totalPatients,
      visitsToday,
      pendingReports,
      completedEhrs,
      visits: weeklyVisits
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load dashboard"
    });
  }
});

export default router;
