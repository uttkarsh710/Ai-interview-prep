import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Interview() {

  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ── clean markdown symbols ── */
  const cleanText = (text) =>
    text
      .replace(/#+\s?/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`/g, "")
      .replace(/__/g, "")
      .replace(/>/g, "")
      .replace(/\\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n");

  /* ── send question to AI ── */
  const sendQuestion = async () => {

    if (!question.trim()) return;

    const userMessage = { type: "user", text: question };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {

      const res = await fetch("https://ai-interview-prep-drlz.onrender.com/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      const aiMessage = {
        type: "ai",
        text: cleanText(
          data.answer || data.result || data.message || "AI not responding"
        )
      };

      setMessages(prev => [...prev, aiMessage]);
      setQuestion("");

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { type: "ai", text: "Error getting response" }
      ]);
    }

    setLoading(false);

  };

  return (

    <div className="home-container">

      <button className="btn" onClick={() => navigate("/home")}>
        ← Back
      </button>

      <h1>Interview Questions</h1>

      <div className="chat-box">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.type === "user" ? "user-msg" : "ai-msg"}
          >
            <b>{msg.type === "user" ? "You:" : "AI:"}</b>
            <pre style={{ whiteSpace: "pre-wrap" }}>{msg.text}</pre>
          </div>
        ))}

        {loading && (
          <div className="ai-msg">AI is typing...</div>
        )}

      </div>

      <div className="input-box">

        <input
          type="text"
          placeholder="Ask anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
        />

        <button onClick={sendQuestion}>Send</button>

      </div>

    </div>

  );

}
