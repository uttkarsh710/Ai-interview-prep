import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton(){

const navigate = useNavigate();

return(

<button
onClick={()=>navigate("/home")}

style={{
marginBottom:"20px",
padding:"8px 16px",
background:"#020617",
color:"white",
border:"1px solid #6366f1",
borderRadius:"8px",
cursor:"pointer"
}}

>

← Back

</button>

);

}

export default BackButton;