import "../styles/card.css";

function Card({icon,title,text,click}){

return(

<div className="card" onClick={click}>

<div className="icon">

{icon}

</div>

<h3>{title}</h3>

<p>{text}</p>

<span>Try it →</span>

</div>

);

}

export default Card;