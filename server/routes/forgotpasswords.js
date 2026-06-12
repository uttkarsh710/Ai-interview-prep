import express from "express";

const router = express.Router();

router.post("/send-otp",(req,res)=>{

const { email } = req.body;

console.log("OTP requested for:", email);

res.json({

success:true,
message:"OTP sent to email"

});

});

export default router;