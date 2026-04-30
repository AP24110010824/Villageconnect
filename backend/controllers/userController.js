const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;
const SECRET_FALLBACK = "villageconnectsecret";

const generateToken = (id) => {
  if (!JWT_SECRET) {
    console.warn(
      "Warning: JWT_SECRET is not set. Using insecure fallback secret. Configure JWT_SECRET before deploying to production."
    );
  }

  return jwt.sign({ id }, JWT_SECRET || SECRET_FALLBACK, {
    expiresIn: "30d",
  });
};

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendPasswordResetEmail = async (email, code) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return false;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "VillageConnect password reset OTP",
      text: `Your OTP for VillageConnect password reset is ${code}. It expires in 15 minutes.`,
      html: `<p>Your OTP for <strong>VillageConnect</strong> password reset is <strong>${code}</strong>.</p><p>This code expires in 15 minutes.</p>`,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error.message);
    return false;
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password." });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

const getUsers = async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const users = await User.find().select("name email role createdAt");
  res.json(users);
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide your email." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found for this email." });
    }

    const resetCode = generateResetCode();
    user.passwordResetCode = resetCode;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const emailSent = await sendPasswordResetEmail(email, resetCode);
    const responsePayload = {
      message: emailSent
        ? "OTP sent to your email address. Check your inbox."
        : "OTP generated. No email service configured, so the OTP is shown for demo purposes.",
    };

    if (!emailSent) {
      responsePayload.otp = resetCode;
    }

    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !user.passwordResetCode) {
      return res.status(400).json({ message: "Invalid OTP or email." });
    }

    if (user.passwordResetCode !== otp) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    if (user.passwordResetExpires < Date.now()) {
      return res.status(410).json({ message: "OTP has expired. Please request a new one." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, getUsers, forgotPassword, resetPassword }; 