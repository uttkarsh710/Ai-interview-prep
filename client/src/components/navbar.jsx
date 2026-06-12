import { useNavigate } from "react-router-dom";
import "../styles/theme.css";

function Navbar(){

const navigate = useNavigate();

return(

<div className="navbar">

<div>

<div className="logo">

Interview Prep

<small>by Uttkarsh</small>

</div>

</div>

<div className="navLinks">

<span onClick={()=>navigate("/home")}>

Home

</span>

<span onClick={()=>navigate("/resume")}>

Resume Checker

</span>

<span onClick={()=>navigate("/voice")}>

Voice Interview

</span>

<span onClick={()=>navigate("/interview")}>

Question Bank

</span>
<span onClick={() => navigate("/practice")}>
    Practice Mode
    </span>

</div>

</div>

);

}

export default Navbar;