import React, { useState, useRef } from "react";
import BackButton from "../components/BackButton";

export default function VoiceInterview() {

  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Stopped");

  const recognitionRef = useRef(null);

  /* start listening */

  const startListening = () => {

    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setStatus("Listening...");
      setListening(true);
    };

    recognition.onresult = async (event) => {

      const transcript = event.results[0][0].transcript;

      setQuestion(transcript);
      setStatus("Processing...");

      /* call backend */
const res = await fetch("http://localhost:5000/api/interview", {
      
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: transcript
        })
      });

      const data = await res.json();

      let aiAnswer = data.answer || "No answer";

      /* remove #, **, markdown symbols */

      aiAnswer = aiAnswer
        .replace(/#+\s?/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .replace(/__/g, "")
        .replace(/>/g, "");

      setAnswer(aiAnswer);

      /* speak answer */

      speakAnswer(aiAnswer);

      setStatus("Stopped");
      setListening(false);
    };

    recognition.onerror = () => {
      setStatus("Error");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();

    recognitionRef.current = recognition;
  };


  /* stop listening + stop voice */

  const stopListening = () => {

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    window.speechSynthesis.cancel();

    setStatus("Stopped");
    setListening(false);
  };


  /* text to speech */

  const speakAnswer = (text) => {

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };


  return (

    <div className="container">

      <BackButton />

      <h1>Voice AI Interview</h1>

      <div className="card">

        <button onClick={startListening} disabled={listening}>
          Start
        </button>

        <button onClick={stopListening}>
          Stop
        </button>

        <p>
          Status: <b>{status}</b>
        </p>

      </div>


      <div className="card">

        <h3>You asked:</h3>

        <p>{question}</p>

      </div>


      <div className="card">

        <h3>AI Answer:</h3>

        <pre style={{ whiteSpace: "pre-wrap" }}>
          {answer}
        </pre>

      </div>

    </div>

  );

}