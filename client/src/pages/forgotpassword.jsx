import { useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";


function ForgotPassword(){

const [email,setEmail]=useState("");

const reset = async()=>{

await axios.post(

"https://ai-interview-prep-drlz.onrender.com/api/auth/forgot",

{ email }

);

alert("Password reset link sent");

};

return (
  <>
    <BackButton />

    <div style={{ padding: "50px" }}>
      <h2>Forgot Password</h2>

      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={reset}>
        Send Reset Link
      </button>
    </div>
  </>
);

}

export default ForgotPassword;