import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const TOPICS = [
  "React",
  "Node.js",
  "JavaScript",
  "MongoDB",
  "Express.js",
  "DSA",
  "System Design",
  "HR / Behavioral",
  "Python",
  "CSS",
];

export default function Practice() {

  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);
  const [step, setStep] = useState("select"); // "select" | "answer" | "feedback"

  /* ── generate question from topic ── */
  const generateQuestion = async () => {

    if (!selectedTopic) {
      alert("Please select a topic first");
      return;
    }

    setQuestionLoading(true);
    setQuestion("");
    setUserAnswer("");
    setFeedback("");

    try {

      const res = await fetch("http://localhost:5000/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Generate 1 interview question about ${selectedTopic}. 
          Only give the question, nothing else. No answer, no explanation.`
        })
      });

      const data = await res.json();
      setQuestion(data.answer || "Could not generate question");
      setStep("answer");

    } catch (err) {
      alert("Failed to generate question. Try again.");
    }

    setQuestionLoading(false);

  };

  /* ── evaluate user's answer ── */
  const evaluateAnswer = async () => {

    if (!userAnswer.trim()) {
      alert("Please write your answer first");
      return;
    }

    setEvalLoading(true);
    setFeedback("");

    try {

      const res = await fetch("http://localhost:5000/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userAnswer })
      });

      const data = await res.json();
      setFeedback(data.feedback);
      setStep("feedback");

    } catch (err) {
      setFeedback("Evaluation failed. Please try again.");
    }

    setEvalLoading(false);

  };

  /* ── next question ── */
  const nextQuestion = () => {
    setQuestion("");
    setUserAnswer("");
    setFeedback("");
    setStep("select");
  };

  /* ── score color ── */
  const getScoreColor = (text) => {
    const match = text.match(/Score:\s*(\d+)/);
    if (!match) return "#6c63ff";
    const score = parseInt(match[1]);
    if (score >= 8) return "#22c55e";
    if (score >= 5) return "#f59e0b";
    return "#ef4444";
  };

  return (

    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#020617,#0f172a)",
      color: "white",
      padding: "30px"
    }}>

      <BackButton />

      <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
        🎯 Practice Interview
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "30px" }}>
        Select a topic → Answer the question → Get AI feedback
      </p>

      {/* ── STEP 1: SELECT TOPIC ── */}
      {step === "select" && (
        <div style={{ maxWidth: "600px" }}>

          <h3 style={{ marginBottom: "16px" }}>Select a Topic:</h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  border: `2px solid ${selectedTopic === topic ? "#8b5cf6" : "#1e293b"}`,
                  background: selectedTopic === topic ? "#8b5cf6" : "transparent",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "0.2s"
                }}
              >
                {topic}
              </button>
            ))}
          </div>

          <button
            onClick={generateQuestion}
            disabled={questionLoading || !selectedTopic}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(90deg,#8b5cf6,#6366f1)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              opacity: !selectedTopic ? 0.5 : 1
            }}
          >
            {questionLoading ? "Generating..." : "Generate Question →"}
          </button>

        </div>
      )}

      {/* ── STEP 2: ANSWER THE QUESTION ── */}
      {step === "answer" && (
        <div style={{ maxWidth: "700px" }}>

          {/* question box */}
          <div style={{
            background: "#0f172a",
            border: "2px solid #8b5cf6",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px"
          }}>
            <p style={{ color: "#8b5cf6", fontSize: "13px", marginBottom: "8px" }}>
              📌 {selectedTopic} Question
            </p>
            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>{question}</p>
          </div>

          {/* answer textarea */}
          <textarea
            placeholder="Type your answer here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            rows={8}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid #1e293b",
              background: "#0f172a",
              color: "white",
              fontSize: "15px",
              resize: "vertical",
              boxSizing: "border-box",
              marginBottom: "16px"
            }}
          />

          <div style={{ display: "flex", gap: "12px" }}>

            <button
              onClick={evaluateAnswer}
              disabled={evalLoading}
              style={{
                padding: "12px 28px",
                background: "linear-gradient(90deg,#8b5cf6,#6366f1)",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              {evalLoading ? "Evaluating..." : "📊 Submit & Evaluate"}
            </button>

            <button
              onClick={nextQuestion}
              style={{
                padding: "12px 28px",
                background: "transparent",
                border: "2px solid #8b5cf6",
                borderRadius: "10px",
                color: "white",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              Skip →
            </button>

          </div>

        </div>
      )}

      {/* ── STEP 3: FEEDBACK ── */}
      {step === "feedback" && (
        <div style={{ maxWidth: "700px" }}>

          {/* question recap */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px"
          }}>
            <p style={{ color: "#8b5cf6", fontSize: "13px", marginBottom: "6px" }}>Question:</p>
            <p style={{ opacity: 0.8 }}>{question}</p>
          </div>

          {/* your answer recap */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px"
          }}>
            <p style={{ color: "#8b5cf6", fontSize: "13px", marginBottom: "6px" }}>Your Answer:</p>
            <p style={{ opacity: 0.8 }}>{userAnswer}</p>
          </div>

          {/* AI feedback */}
          <div style={{
            background: "#f8f8ff",
            border: `2px solid ${getScoreColor(feedback)}`,
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px"
          }}>
            <h3 style={{ color: getScoreColor(feedback), marginBottom: "12px" }}>
              AI Feedback
            </h3>
            <pre style={{
              whiteSpace: "pre-wrap",
              fontSize: "15px",
              lineHeight: "1.8",
              color: "#1e293b"
            }}>
              {feedback}
            </pre>
          </div>

          {/* next question button */}
          <button
            onClick={nextQuestion}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(90deg,#8b5cf6,#6366f1)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Try Another Question →
          </button>

        </div>
      )}

    </div>

  );

}
