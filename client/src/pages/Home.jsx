import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Home() {

  const navigate = useNavigate();

  return (

    <Layout>
      <BackButton />

      {/* hero section */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>

        <h1 style={{ fontSize: "48px" }}>
          Land your dream job with an
          <span style={{
            background: "linear-gradient(90deg,#8b5cf6,#6366f1)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginLeft: "10px"
          }}>
            AI interview coach
          </span>
          {" "}in your pocket.
        </h1>

        <p style={{ opacity: 0.6 }}>
          Resume scoring, voice mock interviews,
          and curated questions for every role
        </p>

      </div>

      {/* buttons */}
      <div style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        marginTop: "30px"
      }}>
        <button onClick={() => navigate("/resume")}>
          Check my resume →
        </button>
        <button onClick={() => navigate("/voice")}>
          Start voice interview
        </button>
      </div>

      {/* cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginTop: "50px",
        padding: "0 20px"
      }}>

        <div className="card" onClick={() => navigate("/resume")} style={{ cursor: "pointer" }}>
          <h2>📄 Resume Checker</h2>
          <p>Get instant AI graded feedback, ATS score and improvement tips</p>
          <p style={{ color: "#8b5cf6" }}>Try it →</p>
        </div>

        <div className="card" onClick={() => navigate("/voice")} style={{ cursor: "pointer" }}>
          <h2>🎙️ Voice Interview</h2>
          <p>Practice real interview conversation with AI voice assistant</p>
          <p style={{ color: "#8b5cf6" }}>Try it →</p>
        </div>

        <div className="card" onClick={() => navigate("/interview")} style={{ cursor: "pointer" }}>
          <h2>💬 Question Bank</h2>
          <p>Generate interview questions with answers instantly</p>
          <p style={{ color: "#8b5cf6" }}>Try it →</p>
        </div>

        <div className="card" onClick={() => navigate("/practice")} style={{ cursor: "pointer" }}>
          <h2>🎯 Practice Mode</h2>
          <p>Pick a topic, answer AI questions and get scored instantly</p>
          <p style={{ color: "#8b5cf6" }}>Try it →</p>
        </div>

      </div>

    </Layout>

  );

}

export default Home;
