const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/userController");
const { requireUser } = require("../middleware/userAuthMiddleware");

router.post("/users/register", register);
router.post("/users/login", login);
router.get("/users/profile", requireUser, getProfile);
router.put("/users/profile", requireUser, updateProfile);

module.exports = router;
