import express from "express";
import fetch from "node-fetch";

const router = express.Router();


router.post("/", async(req,res)=>{

try{

const {question} = req.body;

const response = await fetch(
"https://openrouter.ai/api/v1/chat/completions",

{

method:"POST",

headers:{

"Authorization":`Bearer ${process.env.OPENAI_KEY}`,

"Content-Type":"application/json"

},

body:JSON.stringify({

model:"openai/gpt-4o-mini",

messages:[

{
role:"system",
content:
"Answer like ChatGPT. Give detailed explanation. Provide code when coding question is asked."
},

{
role:"user",
content:question
}

]

})

}

);


const data = await response.json();

res.json({

answer:data.choices[0].message.content

});


}catch(e){

res.json({

answer:"Server error"

});

}

});


export default router;