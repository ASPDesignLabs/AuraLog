import { useState, useEffect, useRef } from "react";

export default function StimmingSurface() {
  const [theme, setTheme] = useState("light");
  const hapticLoopRef = useRef(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) setTheme("dark");
    else if (html.classList.contains("hev")) setTheme("hev");
    else if (html.classList.contains("v")) setTheme("v");
    else setTheme("light");

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      stopHaptics();
    };
  }, []);

  const triggerHaptics = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const stopHaptics = () => {
    if (hapticLoopRef.current) {
      clearInterval(hapticLoopRef.current);
      hapticLoopRef.current = null;
    }
    triggerHaptics(0);
  };

  // === Unique Haptic Profiles (continuous) ===
  const startWavePulse = () => {
    stopHaptics();
    hapticLoopRef.current = setInterval(() => {
      triggerHaptics([50, 100, 100, 100, 200, 100, 100, 100, 50, 200]);
    }, 1200);
  };

  const startHeartbeat = () => {
    stopHaptics();
    hapticLoopRef.current = setInterval(() => {
      triggerHaptics([80, 80, 200, 150, 0, 300, 80, 80, 200, 150]);
    }, 1500);
  };

  const startThunder = () => {
    stopHaptics();
    hapticLoopRef.current = setInterval(() => {
      triggerHaptics([300, 100, 50, 50, 400, 200, 100, 50, 500, 300]);
    }, 2000);
  };

  // === Theme Styles ===
  const themeStyles = {
    light: {
      button:
        "bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-200 active:bg-blue-300",
      slider: "accent-blue-500",
    },
    dark: {
      button:
        "bg-purple-900 text-purple-200 border-purple-500 hover:bg-purple-800 active:bg-purple-700",
      slider: "accent-purple-400",
    },
    hev: {
      button:
        "bg-orange-900 text-orange-300 border-orange-500 hover:bg-orange-800 active:bg-orange-700",
      slider: "accent-orange-500",
    },
    v: {
      button:
        "bg-red-900 text-cyan-300 border-cyan-500 hover:bg-red-800 active:bg-red-700",
      slider: "accent-cyan-400",
    },
  };

  const t = themeStyles[theme];

  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col items-center justify-center space-y-6 p-6 select-none">
      {/* Horizontal Slider (no text) */}
      <input
        type="range"
        min="0"
        max="9"
        step="1"
        className={`w-full max-w-lg ${t.slider}`}
        onChange={(e) => triggerHaptics(Number(e.target.value) * 20)}
      />

      {/* Stimming Buttons */}
      <button
        onMouseDown={startWavePulse}
        onTouchStart={startWavePulse}
        onMouseUp={stopHaptics}
        onTouchEnd={stopHaptics}
        onMouseLeave={stopHaptics}
        className={`w-64 py-6 rounded-xl border-2 font-semibold transition ${t.button} select-none`}
      >
        🌊 Wave Pulse
      </button>

      <button
        onMouseDown={startHeartbeat}
        onTouchStart={startHeartbeat}
        onMouseUp={stopHaptics}
        onTouchEnd={stopHaptics}
        onMouseLeave={stopHaptics}
        className={`w-64 py-6 rounded-xl border-2 font-semibold transition ${t.button} select-none`}
      >
        ❤️ Heartbeat
      </button>

      <button
        onMouseDown={startThunder}
        onTouchStart={startThunder}
        onMouseUp={stopHaptics}
        onTouchEnd={stopHaptics}
        onMouseLeave={stopHaptics}
        className={`w-64 py-6 rounded-xl border-2 font-semibold transition ${t.button} select-none`}
      >
        ⚡ Thunder
      </button>
    </div>
  );
}
