const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadAndPredict,
  getPrediction,
  getRecentPredictions,
} = require("../controllers/predictionController");

router.post("/upload", upload.single("image"), uploadAndPredict);
router.get("/prediction/:id", getPrediction);
router.get("/predictions/recent", getRecentPredictions);

module.exports = router;
