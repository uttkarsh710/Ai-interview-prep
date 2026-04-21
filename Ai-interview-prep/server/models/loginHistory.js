import mongoose from "mongoose";

const LoginHistorySchema = new mongoose.Schema({

email:{
type:String,
required:true
},

loginTime:{
type:Date,
default:Date.now
}

});

export default mongoose.model(
"LoginHistory",
LoginHistorySchema
);