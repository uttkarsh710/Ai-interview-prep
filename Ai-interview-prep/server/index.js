import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import resumeRoute from "./routes/resumeroutes.js";
import interviewRoute from "./routes/interviewroutes.js";
import forgotPasswordRoute from "./routes/forgotpasswords.js";
import authRoute from "./routes/authroutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB connection */

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
console.log("MongoDB connected");
})
.catch((err)=>{
console.log("MongoDB error:", err);
});

/* routes */

app.use("/api/resume", resumeRoute);
app.use("/api/interview", interviewRoute);
app.use("/api/password", forgotPasswordRoute);
app.use("/api/auth", authRoute);

/* test */

app.get("/", (req,res)=>{
res.send("API working");
});

/* start server */

app.listen(5000,()=>{
console.log("Server running on port 5000");
});