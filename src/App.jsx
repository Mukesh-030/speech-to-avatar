import React, { useState, useRef } from "react";
import AvatarViewer from "./components/AvatarViewer";
import SpeechInput from "./components/SpeechInput";
import "./App.css";

function App() {
  const [animation, setAnimation] = useState("avatar");
  const [message, setMessage] = useState("");
  const [recentPhrases, setRecentPhrases] = useState([]);
  const lastProcessed = useRef("");

  const phraseAnimationMap = {
    "hello": "wave",
    "hi": "wave",
    "thank you": "thankful",
    "thanks": "thankful",
    "agree": "agreeing",
    "banging fist": "banging fist",
    "crazy": "crazy gesture",
    "cry": "crying",
    "defeated": "defeated",
    "disappointed": "disapointed",
    "excited": "excited",
    "flip kick": "flip kick",
    "guitar": "guitar playing",
    "happy": "happy",
    "hurt": "hurted",
    "loser": "loser",
    "no": "no",
    "open lid": "opening a lid",
    "piano": "playing piano",
    "push": "push",
    "salute": "salute",
    "sleep": "sleeping",
    "talk": "talking",
    "terrified": "terrified",
    "thankful": "thankful",
    "threaten": "threatening",
    "tired": "tired",
    "victory": "victory",
    "waiting": "waiting",
    "walk": "walking",
    "whatever": "whatever gesture",
    "wave": "wave",
  };

  const speakStatus = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const handleTranscriptUpdate = (text, clearTranscript) => {
    const newPhrase = text.toLowerCase().trim();
    if (animation !== "avatar") return;

    const matchedAnimation = Object.entries(phraseAnimationMap).find(
      ([phrase]) => newPhrase.includes(phrase)
    );

    if (matchedAnimation) {
      const [, animationFile] = matchedAnimation;
      lastProcessed.current = newPhrase;
      setRecentPhrases((prev) => [newPhrase, ...prev.slice(0, 4)]);
      setAnimation(animationFile);
      const status = `Triggered: ${animationFile} animation!`;
      setMessage(`🎬 ${status}`);
      speakStatus(status);
      clearTranscript();
    }
  };

  const handleAnimationComplete = () => {
    const status = "Returned to Idle. Listening again.";
    setAnimation("avatar");
    setMessage(`🔁 ${status}`);
    speakStatus(status);
    lastProcessed.current = "";
  };

  const handleStopAnimation = () => {
    const status = "Animation manually stopped.";
    setAnimation("avatar");
    setMessage(`🛑 ${status}`);
    speakStatus(status);
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
        <select
          value={animation}
          onChange={(e) => {
            const selected = e.target.value;
            if (selected !== "avatar") {
              setAnimation(selected);
              const status = `Manually selected: ${selected} animation playing!`;
              setMessage(`🎬 ${status}`);
              speakStatus(status);
            } else {
              handleStopAnimation();
            }
          }}
        >
          <option value="avatar">Select Animation</option>
          {[...new Set(Object.values(phraseAnimationMap))].sort().map((anim) => (
            <option key={anim} value={anim}>{anim}</option>
          ))}
        </select>

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
