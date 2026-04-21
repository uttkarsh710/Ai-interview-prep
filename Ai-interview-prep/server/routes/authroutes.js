import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import LoginHistory from "../models/loginHistory.js";

const router = express.Router();

const ADMIN_EMAIL="admin@gmail.com";


/* SIGNUP */

router.post("/signup",async(req,res)=>{

try{

const {name,email,password}=req.body;

const existingUser=await User.findOne({
email:email.toLowerCase().trim()
});

if(existingUser){

return res.json({
message:"User already exists"
});

}

const hashedPassword=await bcrypt.hash(password,10);

const newUser=new User({

name,
email:email.toLowerCase().trim(),
password:hashedPassword

});

await newUser.save();

res.json({
message:"Signup successful"
});

}

catch(error){

console.log(error);

res.status(500).json({
message:"Signup error"
});

}

});


/* LOGIN */

router.post("/login",async(req,res)=>{

try{

const {email,password}=req.body;

const user=await User.findOne({
email:email.toLowerCase().trim()
});

if(!user){

return res.json({
message:"User not found"
});

}

const match=await bcrypt.compare(password,user.password);

if(!match){

return res.json({
message:"Wrong password"
});

}


/* SAVE LOGIN HISTORY */

await LoginHistory.create({

email:user.email,
loginTime:new Date()

});

console.log("Login saved:",user.email);


res.json({

message:"Login successful",
user

});

}

catch(error){

console.log(error);

res.status(500).json({

message:"Login error"

});

}

});


/* ADMIN USERS */

router.get("/users",async(req,res)=>{

try{

if(req.query.email!==ADMIN_EMAIL){

return res.status(403).json({

message:"Admin only"

});

}

const users=await User.find().select("-__v");

res.json(users);

}

catch(error){

console.log(error);

res.status(500).json({

message:"User fetch error"

});

}

});


/* LOGIN HISTORY */

router.get("/login-history",async(req,res)=>{

try{

if(req.query.email!==ADMIN_EMAIL){

return res.status(403).json({

message:"Admin only"

});

}

const history=await LoginHistory.find()
.sort({loginTime:-1});

res.json(history);

}

catch(error){

console.log(error);

res.status(500).json({

message:"History fetch error"

});

}

});

export default router;