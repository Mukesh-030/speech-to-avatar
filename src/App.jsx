import React, { useState, useRef } from "react";
import AvatarViewer from "./components/AvatarViewer";
import SpeechInput from "./components/SpeechInput";

function App() {
  const [animation, setAnimation] = useState("Idle");
  const [message, setMessage] = useState("");
  const [recentPhrases, setRecentPhrases] = useState([]);
  const lastProcessed = useRef(""); // Store last processed phrase

  const handleTranscriptUpdate = (text, clearTranscript) => {
    const newPhrase = text.toLowerCase().trim();

    // Prevent repeated triggers for same phrase
    if (newPhrase === lastProcessed.current || animation !== "Idle") return;

    if (newPhrase === "hello" || newPhrase === "hi") {
      lastProcessed.current = newPhrase;
      setRecentPhrases((prev) => [newPhrase, ...prev.slice(0, 4)]);
      setAnimation("wave");
      setMessage("👋 Triggered: 'wave' animation will play!");
      clearTranscript(); // Reset transcript after processing
    } else if (newPhrase === "thank you" || newPhrase === "thanks") {
      lastProcessed.current = newPhrase;
      setRecentPhrases((prev) => [newPhrase, ...prev.slice(0, 4)]);
      setAnimation("thank");
      setMessage("🙏 Triggered: 'thank' animation will play!");
      clearTranscript(); // Reset transcript after processing
    }
  };

  const handleAnimationComplete = () => {
    setAnimation("Idle");
    setMessage("🔁 Returned to Idle. Listening again...");
  };

  const handleStopAnimation = () => {
    setAnimation("Idle");
    setMessage("🛑 Animation manually stopped.");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🧠 AI Speech to Sign Avatar</h1>
      <AvatarViewer
        animationName={animation}
        onAnimationComplete={handleAnimationComplete}
      />
      <SpeechInput onTranscriptUpdate={handleTranscriptUpdate} />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setAnimation("wave")}>▶️ Play Wave</button>
        <button onClick={() => setAnimation("thank")}>🙏 Play Thank</button>
        <button onClick={handleStopAnimation}>⛔ Stop Animation</button>
        <p>{message}</p>
        <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
          🕘 Recent Phrases: {recentPhrases.join(", ") || "None"}
        </p>
      </div>
    </div>
  );
}

export default App;
