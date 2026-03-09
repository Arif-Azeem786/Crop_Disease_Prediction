const express = require("express");
const router = express.Router();
const { login, verify } = require("../controllers/authController");

router.post("/admin/login", login);
router.get("/admin/verify", verify);

module.exports = router;
