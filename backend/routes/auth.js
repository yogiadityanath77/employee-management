// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  asyncHandler,
  ValidationError,
  DatabaseError,
} = require("../middleware/errorHandler");

const router = express.Router();

// REGISTER
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    console.log("➡️  POST /api/auth/register called"); // LOG
    console.log("Body:", req.body); // LOG

    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      throw new ValidationError("All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Please provide a valid email address");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully!",
    });
  })
);

// LOGIN
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    console.log("➡️  POST /api/auth/login called"); // LOG
    console.log("Body:", req.body); // LOG

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ValidationError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ValidationError("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  })
);

module.exports = router;
