import { useState } from "react";
import { db } from "../db/schema.js";

const sensoryOptions = [
  "Dizziness",
  "Touch",
  "Sound",
  "Light",
  "Environment",
  "Movement",
];

export default function SymptomForm() {
  const [pain, setPain] = useState(0);
  const [heartRateCurrent, setHeartRateCurrent] = useState("");
  const [heartRateResting, setHeartRateResting] = useState("");
  const [emotionalState, setEmotionalState] = useState("regulated");
  const [emotionalNotes, setEmotionalNotes] = useState("");
  const [calories, setCalories] = useState("");
  const [medication, setMedication] = useState(false);
  const [sensory, setSensory] = useState({});

  const toggleSensory = (option) => {
    setSensory((prev) => {
      const updated = { ...prev };
      if (updated[option]) {
        delete updated[option];
      } else {
        updated[option] = 5;
      }
      return updated;
    });
  };

  const updateSeverity = (option, value) => {
    setSensory((prev) => ({ ...prev, [option]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!calories || calories <= 0) {
      alert("Calories consumed is required.");
      return;
    }

    const entry = {
      date: new Date().toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      pain: Number(pain),
      heartRateCurrent: heartRateCurrent ? Number(heartRateCurrent) : null,
      heartRateResting: heartRateResting ? Number(heartRateResting) : null,
      emotionalState,
      emotionalNotes: emotionalState === "dysregulated" ? emotionalNotes : "",
      sensory,
      calories: Number(calories),
      medication,
    };

    await db.symptoms.add(entry);
    alert("Symptom entry saved!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all space-y-6 border border-white/20 dark:border-gray-700/40"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Log Symptoms
      </h2>

      {/* Pain */}
      <label className="block">
        <span className="font-medium">Pain Severity (1-10)</span>
        <input
          type="range"
          min="1"
          max="10"
          value={pain}
          onChange={(e) => setPain(e.target.value)}
          className="w-full accent-pink-500"
        />
        <span className="text-sm text-gray-500">Current: {pain}</span>
      </label>

      {/* Heart Rate */}
      <label className="block">
        <span className="font-medium">Current Heart Rate</span>
        <input
          type="number"
          min="30"
          max="220"
          value={heartRateCurrent}
          onChange={(e) => setHeartRateCurrent(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="font-medium">Resting Heart Rate</span>
        <input
          type="number"
          min="30"
          max="220"
          value={heartRateResting}
          onChange={(e) => setHeartRateResting(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </label>

      {/* Emotional State */}
      <label className="block">
        <span className="font-medium">Emotional State</span>
        <select
          value={emotionalState}
          onChange={(e) => setEmotionalState(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        >
          <option value="regulated">Regulated</option>
          <option value="dysregulated">Dysregulated</option>
        </select>
      </label>

      {emotionalState === "dysregulated" && (
        <textarea
          placeholder="Describe feelings..."
          value={emotionalNotes}
          onChange={(e) => setEmotionalNotes(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          required
        />
      )}

      {/* Sensory Troubles */}
      <div>
        <h3 className="font-semibold">Sensory Troubles</h3>
        {sensoryOptions.map((option) => (
          <div key={option} className="mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={option in sensory}
                onChange={() => toggleSensory(option)}
              />
              <span>{option}</span>
            </label>
            {option in sensory && (
              <input
                type="range"
                min="1"
                max="10"
                value={sensory[option]}
                onChange={(e) => updateSeverity(option, e.target.value)}
                className="w-full accent-purple-500"
              />
            )}
          </div>
        ))}
      </div>

      {/* Calories */}
      <label className="block">
        <span className="font-medium">Calories Consumed</span>
        <input
          type="number"
          min="0"
          max="10000"
          required
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </label>

      {/* Medication */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={medication}
          onChange={(e) => setMedication(e.target.checked)}
        />
        <span>Medication Taken</span>
      </label>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
      >
        Save Entry
      </button>
    </form>
  );
}
