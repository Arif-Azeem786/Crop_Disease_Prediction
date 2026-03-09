const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "cropguard-admin-secret-change-in-production";

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Access denied. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};
