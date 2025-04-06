import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function SpeechInput({ onTranscriptUpdate }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript.trim()) {
      onTranscriptUpdate(transcript, resetTranscript);
    }
  }, [transcript]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });

  const stopListening = () => SpeechRecognition.stopListening();

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <p>🎤 Status: <strong>{listening ? "Listening..." : "Stopped"}</strong></p>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <button onClick={resetTranscript}>Clear Text</button>
      <p><strong>Speech Text:</strong> {transcript}</p>
    </div>
  );
}
