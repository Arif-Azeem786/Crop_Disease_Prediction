const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { getDashboardStats, getPublicStats } = require("../controllers/dashboardController");

router.get("/stats/public", getPublicStats);
router.get("/dashboard", requireAuth, getDashboardStats);

module.exports = router;
