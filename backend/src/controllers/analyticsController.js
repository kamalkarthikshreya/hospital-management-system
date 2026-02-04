import User from "../models/user.js";
import EHR from "../models/ehr.js";

// backend/src/controllers/analyticsController.js
// backend/src/controllers/analyticsController.js
// backend/src/controllers/analyticsController.js
// backend/src/controllers/analyticsController.js
// backend/src/controllers/analyticsController.js
// backend/src/controllers/analyticsController.js
export const getDashboardData = async (req, res) => {
  try {
    const patientsCount = await User.countDocuments({ role: "patient" });
    const totalEhrs = await EHR.countDocuments();

    // 1. Create a 7-day date range to ensure the graph isn't empty
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const visitData = days.map(day => ({ day, visits: 0 }));

    // 2. Fetch recent visits from MongoDB
    const recentVisits = await EHR.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 }
      }}
    ]);

    // 3. Merge real DB counts into our 7-day baseline
    recentVisits.forEach(record => {
      // MongoDB $dayOfWeek is 1-indexed (Sunday=1)
      visitData[record._id - 1].visits = record.count;
    });

    res.status(200).json({
      patients: patientsCount, // Shows 6
      visitsToday: 0,
      pendingReports: 5,
      completedEhrs: totalEhrs, // Shows 1
      visits: visitData, // This array makes the lines appear!
      ehrs: visitData    // Populates the second chart
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};