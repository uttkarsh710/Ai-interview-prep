import React, { useState } from "react";
import BackButton from "../components/BackButton";

function Resume() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseResult = (text) => {
    const scoreMatch = text.match(/ATS Score:\s*(\d+)\/100/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    const extractSection = (label) => {
      const regex = new RegExp(`${label}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z][^\\n]+:|$)`, "i");
      const match = text.match(regex);
      if (!match) return [];
      return match[1]
        .split("\n")
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean);
    };

    return {
      score,
      summary: extractSection("Summary"),
      detectedSkills: extractSection("Detected Skills"),
      missingSections: extractSection("Missing Sections"),
      missingSkills: extractSection("Missing Skills"),
      improvements: extractSection("Improvements"),
      contactIssues: extractSection("Contact Issues"),
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: "#052e16", border: "#16a34a", text: "#4ade80" };
    if (score >= 60) return { bg: "#1c1917", border: "#ca8a04", text: "#facc15" };
    return { bg: "#1c0a0a", border: "#dc2626", text: "#f87171" };
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Average";
    return "Weak";
  };

  const checkResume = async () => {
    setError("");
    if (!file) { setError("Please upload a resume PDF."); return; }
    if (!jobRole.trim()) { setError("Please enter a target job role."); return; }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole.trim());

    try {
      const res = await fetch("https://ai-interview-prep-drlz.onrender.com/api/resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.result) {
        setResult(parseResult(data.result));
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }

    setLoading(false);
  };

  const cardStyle = {
    border: "1px solid #1e293b",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "800px",
    marginBottom: "20px",
    background: "#0f172a",
  };

  const SectionCard = ({ title, items, accent = "#6366f1" }) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ ...cardStyle, borderLeft: `3px solid ${accent}` }}>
        <h3 style={{ margin: "0 0 12px", color: "#94a3b8", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </h3>
        <ul style={{ margin: 0, paddingLeft: "18px" }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: "6px", color: "#e2e8f0", lineHeight: "1.6" }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", padding: "40px" }}>
      <BackButton />
      <h1 style={{ marginBottom: "8px" }}>Resume Score</h1>
      <p style={{ color: "#64748b", marginBottom: "32px", marginTop: 0 }}>
        Upload your resume and enter your target job role for a tailored ATS analysis.
      </p>

      {/* Input Card */}
      <div style={cardStyle}>
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "6px" }}>
            TARGET JOB ROLE
          </label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer, Data Analyst, Product Manager"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", marginBottom: "6px" }}>
            RESUME PDF
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ color: "#94a3b8", fontSize: "14px" }}
          />
          {file && (
            <span style={{ marginLeft: "10px", color: "#6366f1", fontSize: "13px" }}>
              ✓ {file.name}
            </span>
          )}
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px" }}>{error}</p>
        )}

        <button
          onClick={checkResume}
          disabled={loading}
          style={{
            padding: "10px 24px",
            background: loading ? "#334155" : "#6366f1",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {loading ? "Analyzing..." : "Check Score"}
        </button>
      </div>

      {/* Score Badge */}
      {result?.score !== null && result?.score !== undefined && (() => {
        const colors = getScoreColor(result.score);
        return (
          <div style={{
            ...cardStyle,
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}>
            <div style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: `4px solid ${colors.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "26px", fontWeight: "700", color: colors.text, lineHeight: 1 }}>
                {result.score}
              </span>
              <span style={{ fontSize: "11px", color: colors.text, opacity: 0.8 }}>/100</span>
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: colors.text }}>
                {getScoreLabel(result.score)} Resume
              </div>
              <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>
                ATS Score for <span style={{ color: "#e2e8f0" }}>{jobRole}</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Result Sections */}
      {result && (
        <>
          <SectionCard title="Summary" items={result.summary} accent="#6366f1" />
          <SectionCard title="Contact Issues" items={result.contactIssues} accent="#ef4444" />
          <SectionCard title="Missing Sections" items={result.missingSections} accent="#f97316" />
          <SectionCard title="Detected Skills" items={result.detectedSkills} accent="#22c55e" />
          <SectionCard title={`Missing Skills for ${jobRole}`} items={result.missingSkills} accent="#eab308" />
          <SectionCard title="Improvements" items={result.improvements} accent="#3b82f6" />
        </>
      )}
    </div>
  );
}

export default Resume;
