
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const User = require("../models/user.model");
const { authenticateToken } = require("../utilities");
const logger = require("../utilities/logger");
require("dotenv").config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to generate JWT
function generateToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}
// Helper function to send emails using Resend
async function sendEmail(to, subject, html) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_USER, 
      to,
      subject,
      html,
    });
    logger.info(`Email sent successfully: ${response.id}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error("Failed to send email");
  }
}


//  Create Account
router.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Full Name, Email, and Password are required",
    });
  }

  try {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        error: true,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword, isVerified: false });
    await user.save();

    const verificationToken = generateToken(
      { id: user._id, email: user.email },
      process.env.VERIFY_EMAIL_SECRET,
      "1h"
    );

    const verificationLink = `${process.env.SERVER_URL}/api/auth/verify-email/${verificationToken}?redirect=dashboard`;

    await sendEmail(
      email,
      "Email Verification",
      `<p>Click <a href="${verificationLink}">here</a> to verify your email. This link is valid for 1 hour.</p>`
    );

    return res.status(201).json({
      error: false,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error. Please try again later.",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and Password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: true,
        message: "Email not verified. Please check your email.",
      });
    }

    const accessToken = generateToken(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      "1h"
    );

    return res.json({
      error: false,
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error. Please try again later.",
    });
  }
});

//  Email Verify
router.get("/verify-email/:token", async (req, res) => {
  try {
    console.log("Received token:", req.params.token); // Debug log
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    const redirectUrl = `${process.env.CLIENT_URL}/dashboard`;
    console.log("Redirecting to:", redirectUrl); // Debug log
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during verification:", error.message);
    return res.redirect(`${process.env.CLIENT_URL}/email-verification?verified=false`);
  }
});

//  Forget Password
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const resetToken = generateToken(
      { id: user._id, email: user.email },
      process.env.RESET_PASSWORD_SECRET,
      "15m"
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Password Reset",
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`
    );

    return res.json({
      error: false,
      message: "Password reset email sent.",
    });
  } catch (error) {
    logger.error(`Error during forget password: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error. Please try again later.",
    });
  }
});

//  Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({
      error: true,
      message: "New password is required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({
      error: false,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Invalid or expired token",
    });
  }
});

//  Get User
router.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    return res.json({
      error: false,
      user,
    });
  } catch (error) {
    logger.error(`Error fetching user details: ${error.message}`);
    return res.status(500).json({
      error: true,
      message: "Server error. Please try again later.",
    });
  }
});

module.exports = router;
