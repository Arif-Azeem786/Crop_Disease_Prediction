const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    imageName: { type: String, required: true },
    crop: { type: String, required: true },
    diseaseClass: { type: String, required: true },
    diseaseName: { type: String, required: true },
    confidence: { type: Number, required: true },
    description: { type: String },
    causes: [String],
    symptoms: [String],
    treatment: [String],
    prevention: [String],
    fertilizersPesticides: [String],
    allPredictions: { type: Map, of: Number },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
