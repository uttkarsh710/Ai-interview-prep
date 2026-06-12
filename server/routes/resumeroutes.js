import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

/* file upload config */
const upload = multer({ dest: "uploads/" });


router.post("/", upload.single("resume"), async (req, res) => {
  try {

    /* check file */
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const jobRole = req.body.jobRole?.trim() || "General";
    const filePath = req.file.path;

    /* read pdf */
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    /* check extracted text */
    if (!resumeText || resumeText.trim().length < 20) {
      return res.json({
        result:
          "Resume text not detected properly. Please upload a text-based PDF exported from Word or Canva.",
      });
    }

    

    // word count check
    const wordCount = resumeText.trim().split(/\s+/).length;

    
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
    const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
    const hasLinkedIn = /linkedin\.com\/in\//i.test(resumeText);

   
    const hasEducation = /\beducation\b/i.test(resumeText);
    const hasExperience = /\b(experience|work history|employment)\b/i.test(resumeText);
    const hasProjects = /\b(projects?|portfolio)\b/i.test(resumeText);
    const hasSkills = /\b(skills?|technical skills?|core competencies)\b/i.test(resumeText);
    const hasSummary = /\b(summary|objective|profile|about)\b/i.test(resumeText);

   
    const preCheckNotes = `
Pre-Analysis Data (use this for scoring — do NOT ignore):
- Word Count: ${wordCount} words ${wordCount < 200 ? "(Very short — penalise heavily)" : wordCount < 400 ? "(Below average length)" : "(Acceptable length)"}
- Email present: ${hasEmail ? "Yes" : "No — penalise"}
- Phone present: ${hasPhone ? "Yes" : "No — penalise"}
- LinkedIn present: ${hasLinkedIn ? "Yes" : "No — minor deduction"}
- Education section: ${hasEducation ? "Found" : "Missing — penalise"}
- Experience section: ${hasExperience ? "Found" : "Missing — penalise"}
- Projects section: ${hasProjects ? "Found" : "Missing — minor deduction"}
- Skills section: ${hasSkills ? "Found" : "Missing — penalise"}
- Summary/Objective section: ${hasSummary ? "Found" : "Missing — minor deduction"}
`;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
You are a strict ATS (Applicant Tracking System) evaluator.
Target Job Role: ${jobRole}

${preCheckNotes}

Scoring Rules — follow these strictly:
- Start from 100 and deduct for every issue found below.
- Missing email: -10
- Missing phone: -8
- Missing LinkedIn: -4
- Word count under 200: -20, under 400: -10
- Missing Skills section: -12
- Missing Experience section: -15
- Missing Education section: -10
- Missing Projects section: -6
- Missing Summary section: -5
- Skills irrelevant to the target role: -5 to -15 depending on severity
- Generic or vague bullet points in experience: -5 to -10
- No quantified achievements (numbers, percentages): -8
- Poor formatting signals (very short sentences, no structure): -5
- NEVER give a score above 85 unless the resume is genuinely strong across all criteria.
- NEVER give the same score to two different resumes — base it on actual content.

Instructions:
1. Calculate a realistic score using the deduction rules above.
2. List only contact issues that are actually missing.
3. List only sections that are actually missing.
4. Extract skills found in the resume.
5. List skills missing specifically for the role: ${jobRole}.
6. Give 3-5 specific, actionable improvement suggestions.
7. Do NOT use markdown symbols like ** or ### or backticks.
8. Use simple bullet points using (-).

Return output in EXACTLY this format (no extra text, no intro line):

ATS Score: number/100

Summary:
- one line about the candidate profile
- one line about overall resume quality

Contact Issues:
- list any missing contact fields, or write "None" if all present

Missing Sections:
- list missing sections, or write "None" if all present

Detected Skills:
- skill 1
- skill 2

Missing Skills:
- missing skill relevant to ${jobRole}

Improvements:
- specific improvement 1
- specific improvement 2
- specific improvement 3

Resume Text:
${resumeText}
`,
          },
        ],
      }),
    });

    const aiData = await aiResponse.json();

    let resultText =
      aiData?.choices?.[0]?.message?.content || "Error analyzing resume";

    
    resultText = resultText
      .replace(/#+\s?/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/__/g, "")
      .replace(/>/g, "");

    
    fs.unlinkSync(filePath);

    res.json({ result: resultText });

  } catch (error) {
    console.log("Resume error:", error);
    res.status(500).json({ result: "Resume analysis failed" });
  }
});

export default router;