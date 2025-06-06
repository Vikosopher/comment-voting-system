const express = require("express");
const router = express.Router();
const { signup, login, refreshToken, logout } = require("../controllers/auth.controller");

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
