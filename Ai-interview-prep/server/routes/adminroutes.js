import express from "express";

import User from "../models/user.js";

import LoginHistory from "../models/loginHistory.js";

const router = express.Router();


router.get("/users", async(req,res)=>{

const users = await User.find();

res.json(users);

});


router.get("/history", async(req,res)=>{

const history = await LoginHistory.find();

res.json(history);

});


export default router;