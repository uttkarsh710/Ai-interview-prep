import { useNavigate } from "react-router-dom";

function Dashboard(){

const navigate = useNavigate();

return(

<div className="dashboard">

<div className="sidebar">

<h2>AI Prep</h2>

<p onClick={()=>navigate("/interview")}>

Interview AI

</p>

<p onClick={()=>navigate("/resume")}>

Resume Score

</p>

<p onClick={()=>navigate("/voice")}>

Voice Interview

</p>

<p onClick={()=>{

localStorage.clear();

navigate("/");

}}>

Logout

</p>

</div>

<div className="content">

<h1>Welcome to AI Interview Preparation</h1>

</div>

</div>

);

}
<button

onClick={()=>window.location="/admin"}

style={{

padding:"10px 20px",
marginTop:"20px",
background:"#6c63ff",
color:"white",
border:"none",
borderRadius:"8px",
cursor:"pointer"

}}

>

Admin Panel

</button>

export default Dashboard;