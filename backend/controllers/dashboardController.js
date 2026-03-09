const fs = require("fs");
const path = require("path");
const Prediction = require("../models/Prediction");
const ChatMessage = require("../models/ChatMessage");

function loadModelMetrics() {
  try {
    const metricsPath = path.join(__dirname, "../../ai-model/model_metrics.json");
    const data = fs.readFileSync(metricsPath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

exports.getPublicStats = async (_req, res) => {
  try {
    const totalPredictions = await Prediction.countDocuments();
    const uniqueIPs = await Prediction.distinct("ipAddress");
    const totalUsers = uniqueIPs.length || 0;
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = await Prediction.countDocuments({
      createdAt: { $gte: new Date(today), $lt: new Date(today + "T23:59:59.999Z") },
    });
    res.json({
      success: true,
      totalPredictions,
      totalUsers,
      todayCount,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.getDashboardStats = async (_req, res) => {
  try {
    const totalPredictions = await Prediction.countDocuments();
    const totalChats = await ChatMessage.countDocuments();

    const uniqueIPs = await Prediction.distinct("ipAddress");
    const totalUsers = uniqueIPs.length || 1;

    const diseaseStats = await Prediction.aggregate([
      { $match: { diseaseClass: { $not: /Healthy/ } } },
      { $group: { _id: "$diseaseName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const cropStats = await Prediction.aggregate([
      { $group: { _id: "$crop", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const dailyPredictions = await Prediction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const healthyCount = await Prediction.countDocuments({
      diseaseClass: /Healthy/,
    });

    const diseasedCount = totalPredictions - healthyCount;

    const recentPredictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("diseaseName crop confidence createdAt");

    const confidenceStats = await Prediction.aggregate([
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidence" },
          maxConfidence: { $max: "$confidence" },
          minConfidence: { $min: "$confidence" },
        },
      },
    ]);

    const modelMetrics = loadModelMetrics();

    res.json({
      success: true,
      stats: {
        totalPredictions,
        totalUsers,
        totalChats,
        healthyCount,
        diseasedCount,
        modelMetrics,
        diseaseDistribution: diseaseStats.map((d) => ({
          name: d._id,
          count: d.count,
        })),
        cropDistribution: cropStats.map((c) => ({
          name: c._id,
          count: c.count,
        })),
        dailyPredictions: dailyPredictions.map((d) => ({
          date: d._id,
          count: d.count,
        })),
        recentPredictions,
        confidenceStats: confidenceStats[0] || {
          avgConfidence: 0,
          maxConfidence: 0,
          minConfidence: 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ success: false, message: "Failed to load dashboard data." });
  }
};
