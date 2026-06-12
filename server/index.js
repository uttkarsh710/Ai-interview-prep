import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import resumeRoute from "./routes/resumeroutes.js";
import interviewRoute from "./routes/interviewroutes.js";
import forgotPasswordRoute from "./routes/forgotpasswords.js";
import authRoute from "./routes/authroutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ───────────────────────────────────────────
   RATE LIMITERS
─────────────────────────────────────────── */

/* General limiter — all routes */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per IP
  message: { message: "Too many requests. Please try again after 15 minutes." }
});

/* Strict limiter — AI routes (costs money) */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,                   // max 30 AI requests per IP
  message: { message: "AI request limit reached. Please try again after 15 minutes." }
});

/* Auth limiter — prevent brute force */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts per IP
  message: { message: "Too many login attempts. Please try again after 15 minutes." }
});

/* Apply general limiter to all routes */
app.use(generalLimiter);

/* MongoDB connection */
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("MongoDB connected"); })
  .catch((err) => { console.log("MongoDB error:", err); });

/* ───────────────────────────────────────────
   ROUTES
─────────────────────────────────────────── */
app.use("/api/resume", aiLimiter, resumeRoute);
app.use("/api/interview", aiLimiter, interviewRoute);
app.use("/api/password", forgotPasswordRoute);
app.use("/api/auth", authLimiter, authRoute);

/* test */
app.get("/", (req, res) => {
  res.send("API working");
});

/* start server */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});