import { useState, useEffect, useRef } from "react";

export default function Transcription() {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(20);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] space-y-6">
      <h2 className="text-2xl font-bold">Transcription</h2>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFontSize((s) => Math.max(12, s - 2))}
          className="px-3 py-2 rounded-lg"
        >
          A-
        </button>
        <button
          onClick={() => setFontSize((s) => Math.min(60, s + 2))}
          className="px-3 py-2 rounded-lg"
        >
          A+
        </button>
        <button
          onClick={() => setText("")}
          className="px-3 py-2 rounded-lg"
        >
          Clear
        </button>
      </div>

      {/* ✅ Text Input Box uses .card so it inherits V theme styling */}
      <textarea
        ref={outputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="card w-full max-w-3xl h-[60vh] overflow-y-auto p-4 text-left resize-none focus:outline-none"
        style={{ fontSize: `${fontSize}px`, lineHeight: "1.5" }}
        placeholder="Type here, or use your keyboard’s microphone button to transcribe automatically..."
      />
    </div>
  );
}
