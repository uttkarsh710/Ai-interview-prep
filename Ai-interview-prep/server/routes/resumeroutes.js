import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();


/* file upload config */

const upload = multer({
  dest: "uploads/"
});


router.post("/", upload.single("resume"), async (req, res) => {

  try {

    /* check file */

    if (!req.file) {

      return res.status(400).json({
        error: "No resume uploaded"
      });

    }


    const filePath = req.file.path;


    /* read pdf */

    const fileBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(fileBuffer);

    const resumeText = pdfData.text;


    /* check extracted text */

    if (!resumeText || resumeText.trim().length < 20) {

      return res.json({

        result:
          "Resume text not detected properly. Please upload text-based PDF exported from Word or Canva."

      });

    }


    /* send to AI */

    const aiResponse = await fetch(

      "https://openrouter.ai/api/v1/chat/completions",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${process.env.OPENAI_KEY}`

        },

        body: JSON.stringify({

          model: "openai/gpt-4o-mini",

          messages: [

            {

              role: "user",

              content: `

You are an ATS (Applicant Tracking System).

Carefully read the resume text and evaluate realistically.

Instructions:

1. Score should depend on resume quality.
2. Do NOT give same score for every resume.
3. Extract skills from resume text.
4. Identify missing skills based on current job market.
5. Provide specific improvement suggestions.
6. Do NOT use markdown symbols like ** or ###.
7. Use simple bullet points using (-).

Return output in this format:

ATS Score: number/100

Summary:
- 2 lines summary based on resume profile

Detected Skills:
- skill 1
- skill 2
- skill 3

Missing Skills:
- missing skill 1
- missing skill 2

Improvements:
- improvement suggestion 1
- improvement suggestion 2


Resume Content:
${resumeText}

`

            }

          ]

        })

      }

    );


    const aiData = await aiResponse.json();


    let resultText =
      aiData?.choices?.[0]?.message?.content ||
      "Error analyzing resume";


    /* remove markdown symbols if any */

    resultText = resultText

      .replace(/#+\s?/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/__/g, "")
      .replace(/>/g, "");


    /* delete uploaded file */

    fs.unlinkSync(filePath);


    res.json({

      result: resultText

    });


  } catch (error) {

    console.log("Resume error:", error);


    res.status(500).json({

      result: "Resume analysis failed"

    });

  }

});


export default router;