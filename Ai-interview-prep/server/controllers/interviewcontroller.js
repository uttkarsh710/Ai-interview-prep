const axios = require("axios");

exports.generateQuestion = async (req,res)=>{

try{

const topic = req.body.topic;

const response = await axios.post(

"https://openrouter.ai/api/v1/chat/completions",

{

model:"meta-llama/llama-3-8b-instruct",

messages:[
{
role:"user",

content:`

Generate 1 technical interview question and its answer about ${topic}.

Format:

Question:
<question>

Answer:
<answer>

Keep answer simple and clear.

`

}
]

},

{

headers:{

"Authorization":`Bearer ${process.env.OPENAI_KEY}`,

"Content-Type":"application/json",

"HTTP-Referer":"http://localhost:3000",

"X-Title":"AI Interview Prep"

}

}

);

res.json({

choices:[
{
message:{
content:response.data.choices[0].message.content
}
}
]

});

}

catch(error){

console.log(error.response?.data || error.message);

res.json({

choices:[
{
message:{
content:"AI temporarily unavailable"
}
}
]

});

}

};