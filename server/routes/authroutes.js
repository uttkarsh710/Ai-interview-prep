import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import LoginHistory from "../models/loginHistory.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

const ADMIN_EMAIL = "admin@gmail.com";

/* SIGNUP */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isAdmin: email.toLowerCase().trim() === ADMIN_EMAIL
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin || user.email === ADMIN_EMAIL
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await LoginHistory.create({ email: user.email, loginTime: new Date() });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || user.email === ADMIN_EMAIL
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login error" });
  }
});

/* ADMIN - GET ALL USERS */
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User fetch error" });
  }
});

/* ADMIN - LOGIN HISTORY */
router.get("/login-history", verifyAdmin, async (req, res) => {
  try {
    const history = await LoginHistory.find().sort({ loginTime: -1 });
    res.json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "History fetch error" });
  }
});

export default router;