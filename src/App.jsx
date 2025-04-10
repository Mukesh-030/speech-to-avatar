// App.jsx
import React, { useState, useRef } from "react";
import AvatarViewer from "./components/AvatarViewer";
import SpeechInput from "./components/SpeechInput";
import "./App.css";

function App() {
  const [animation, setAnimation] = useState("avatar"); // Default model (avatar.glb)
  const [message, setMessage] = useState("");
  const [recentPhrases, setRecentPhrases] = useState([]);
  const lastProcessed = useRef("");

  const handleTranscriptUpdate = (text, clearTranscript) => {
    const newPhrase = text.toLowerCase().trim();

    if (animation !== "avatar") return;

    if (newPhrase === "hello" || newPhrase === "hi") {
      lastProcessed.current = newPhrase;
      setRecentPhrases((prev) => [newPhrase, ...prev.slice(0, 4)]);
      setAnimation("wave"); // Loads wave.glb
      setMessage("👋 Triggered: 'wave' animation will play!");
      clearTranscript();
    } else if (newPhrase === "thank you" || newPhrase === "thanks") {
      lastProcessed.current = newPhrase;
      setRecentPhrases((prev) => [newPhrase, ...prev.slice(0, 4)]);
      setAnimation("thank"); // Loads thank.glb
      setMessage("🙏 Triggered: 'thank' animation will play!");
      clearTranscript();
    }
  };

  const handleAnimationComplete = () => {
    setAnimation("avatar"); // Return to default idle avatar
    setMessage("🔁 Returned to Idle. Listening again...");
    lastProcessed.current = "";
  };

  const handleStopAnimation = () => {
    setAnimation("avatar");
    setMessage("🛑 Animation manually stopped.");
    lastProcessed.current = "";
  };

  return (
    <div className="app-container">
      <h1>🧠 AI Speech to Sign Avatar</h1>
      <AvatarViewer
        animationName={animation}
        onAnimationComplete={handleAnimationComplete}
      />
      <SpeechInput onTranscriptUpdate={handleTranscriptUpdate} />
      <div className="controls">
        <button onClick={() => setAnimation("wave")}>▶️ Play Wave</button>
        <button onClick={() => setAnimation("thank")}>🙏 Play Thank</button>
        <button onClick={handleStopAnimation}>⛔ Stop Animation</button>
        <p>{message}</p>
        <p className="recent-phrases">
          🕘 Recent Phrases: {recentPhrases.join(", ") || "None"}
        </p>
      </div>
    </div>
  );
}

export default App;
