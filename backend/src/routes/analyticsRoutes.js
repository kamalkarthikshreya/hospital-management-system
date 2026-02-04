import express from "express";
import User from "../models/user.js"; 
import EHR from "../models/ehr.js"; 

const router = express.Router();

/**
 * Combined Analytics Route
 * Frontend calls: /api/analytics/doctor (for charts) 
 * AND /api/dashboard-stats (for cards)
 */
const getSharedAnalytics = async (req, res) => {
  try {
    // 1. Fetch Real Counts
    const patientsCount = await User.countDocuments({ role: "patient" });
    const totalEhrs = await EHR.countDocuments();
    
    // 2. Weekly Aggregation for the Chart "Flow"
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = await EHR.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedVisits = weeklyStats.map(item => ({
      day: dayNames[item._id - 1],
      visits: item.count
    }));

    // 3. Unified Response
    res.status(200).json({
      patients: patientsCount,     
      completedEhrs: totalEhrs,    
      visitsToday: 0,
      pendingReports: 5,
      visits: formattedVisits,     // For Weekly Visits chart
      ehrs: formattedVisits        // For EHRs Created chart
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Data fetch failed" });
  }
};

// Map both potential endpoints to the same logic to prevent 404s
router.get("/dashboard-stats", getSharedAnalytics);
router.get("/doctor", getSharedAnalytics);

export default router;