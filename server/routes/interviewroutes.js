import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { question } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Answer like ChatGPT. Give detailed explanation. Provide code when coding question is asked."
            },
            {
              role: "user",
              content: question
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({ answer: data.choices[0].message.content });

  } catch (e) {
    res.status(500).json({ answer: "Server error" });
  }

});


router.post("/evaluate", async (req, res) => {

  try {

    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a strict but fair technical interview evaluator.
When given a question and a candidate's answer, evaluate it and respond in this exact format:

Score: <number>/10
Verdict: <Excellent | Good | Needs Improvement | Poor>

Strengths:
- <point 1>
- <point 2>

Weaknesses:
- <point 1>
- <point 2>

Ideal Answer:
<write a concise ideal answer>

Be honest and specific. Do not be overly generous.`
            },
            {
              role: "user",
              content: `Question: ${question}\n\nCandidate's Answer: ${userAnswer}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({ feedback: data.choices[0].message.content });

  } catch (e) {
    console.log(e);
    res.status(500).json({ feedback: "Evaluation failed. Please try again." });
  }

});

export default router;