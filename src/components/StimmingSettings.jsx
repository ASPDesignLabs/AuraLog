import { useState, useEffect } from "react";

export default function StimmingSettings() {
  const [numPoints, setNumPoints] = useState(10);
  const [glowDuration, setGlowDuration] = useState(600);
  const [colorMode, setColorMode] = useState("white");

  useEffect(() => {
    const saved = localStorage.getItem("stimmingSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNumPoints(parsed.numPoints || 10);
      setGlowDuration(parsed.glowDuration || 600);
      setColorMode(parsed.colorMode || "white");
    }
  }, []);

  const saveSettings = () => {
    const settings = { numPoints, glowDuration, colorMode };
    localStorage.setItem("stimmingSettings", JSON.stringify(settings));
    alert("Stimming settings saved!");
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Stimming Settings</h2>

      <label className="block mb-3">
        <span className="text-sm font-medium">Number of Points</span>
        <input
          type="number"
          min="1"
          max="30"
          value={numPoints}
          onChange={(e) => setNumPoints(Number(e.target.value))}
          className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium">Glow Duration (ms)</span>
        <input
          type="number"
          min="100"
          max="2000"
          step="100"
          value={glowDuration}
          onChange={(e) => setGlowDuration(Number(e.target.value))}
          className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        />
      </label>

      <label className="block mb-3">
        <span className="text-sm font-medium">Glow Color Mode</span>
        <select
          value={colorMode}
          onChange={(e) => setColorMode(e.target.value)}
          className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
        >
          <option value="white">White Only</option>
          <option value="random">Random Hues</option>
        </select>
      </label>

      <button
        onClick={saveSettings}
        className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
      >
        Save Settings
      </button>
    </div>
  );
}
