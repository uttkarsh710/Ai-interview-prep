import "../styles/Admin.css";
import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin(){

const navigate = useNavigate();

const [users,setUsers] = useState([]);
const [history,setHistory] = useState([]);

useEffect(()=>{

getUsers();
getHistory();

},[]);


/* GET USERS */
const getUsers = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/auth/users?email=admin@gmail.com"
);

setUsers(res.data);

}
catch(err){

console.log(err);

}

};


/* GET LOGIN HISTORY */
const getHistory = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/auth/login-history?email=admin@gmail.com"
);

setHistory(res.data);

}
catch(err){

console.log(err);

}

};


return(

<div className="adminContainer">

<button
className="backBtn"
onClick={()=>navigate("/home")}
>

← Back

</button>


<h1>Admin Dashboard</h1>


{/* USERS */}

<div className="adminCard">

<h2>Total Users: {users.length}</h2>

<table className="adminTable">

<thead>

<tr>

<th>Name</th>
<th>Email</th>

</tr>

</thead>


<tbody>

{users.map((u)=>(

<tr key={u._id}>

<td>{u.name}</td>
<td>{u.email}</td>

</tr>

))}

</tbody>

</table>

</div>



{/* LOGIN HISTORY */}

<div className="adminCard">

<h2>Login History</h2>

<table className="adminTable">

<thead>

<tr>

<th>Email</th>
<th>Login Time</th>

</tr>

</thead>


<tbody>

{history.length === 0 ? (

<tr>

<td colSpan="2">No login history</td>

</tr>

) : (

history.map((item)=>(

<tr key={item._id}>

<td>{item.email}</td>

<td>

{item.loginTime
? new Date(item.loginTime).toLocaleString()
: "No Time"}

</td>

</tr>

))

)}

</tbody>

</table>


</div>

</div>

);

}

export default Admin;