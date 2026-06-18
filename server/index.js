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

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests. Please try again after 15 minutes." }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "AI request limit reached. Please try again after 15 minutes." }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again after 15 minutes." }
});

app.use(generalLimiter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("MongoDB connected"); })
  .catch((err) => { console.log("MongoDB error:", err); });

app.use("/api/resume", aiLimiter, resumeRoute);
app.use("/api/interview", aiLimiter, interviewRoute);
app.use("/api/password", forgotPasswordRoute);
app.use("/api/auth", authLimiter, authRoute);

app.get("/", (req, res) => {
  res.send("API working");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});