const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const Prediction = require("../models/Prediction");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

exports.uploadAndPredict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded." });
    }

    const filePath = req.file.path;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000,
    });

    const prediction = aiResponse.data.prediction;

    const saved = await Prediction.create({
      imageName: req.file.filename,
      crop: prediction.crop,
      diseaseClass: prediction.class,
      diseaseName: prediction.disease_name,
      confidence: prediction.confidence,
      description: prediction.description,
      causes: prediction.causes,
      symptoms: prediction.symptoms,
      treatment: prediction.treatment,
      prevention: prediction.prevention,
      fertilizersPesticides: prediction.fertilizers_pesticides,
      allPredictions: aiResponse.data.all_predictions,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    fs.unlink(filePath, () => {});

    res.json({
      success: true,
      predictionId: saved._id,
      prediction: {
        disease_name: prediction.disease_name,
        class: prediction.class,
        crop: prediction.crop,
        confidence: prediction.confidence,
        description: prediction.description,
        causes: prediction.causes,
        symptoms: prediction.symptoms,
        treatment: prediction.treatment,
        prevention: prediction.prevention,
        fertilizers_pesticides: prediction.fertilizers_pesticides,
        chemical_fertilizers: prediction.chemical_fertilizers,
        natural_fertilizers: prediction.natural_fertilizers,
      },
      all_predictions: aiResponse.data.all_predictions,
    });
  } catch (error) {
    console.error("Prediction error:", error.message);
    if (req.file?.path) fs.unlink(req.file.path, () => {});

    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      message: error.response?.data?.detail || "Failed to process the image. Please try again.",
    });
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }
    res.json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getRecentPredictions = async (_req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select("diseaseName crop confidence createdAt");
    res.json({ success: true, predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
