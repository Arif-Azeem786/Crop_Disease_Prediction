const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    sessionId: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
