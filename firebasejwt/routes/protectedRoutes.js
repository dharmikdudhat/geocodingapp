const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
