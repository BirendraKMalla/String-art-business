const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// REGISTER
// ========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Create JWT

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Remove password from response

    const userResponse = user.toObject();

    delete userResponse.password;

    // Send token + user

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// ========================================
// GET CURRENT USER
// ========================================

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});

// ========================================
// LOGIN
// ========================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;
