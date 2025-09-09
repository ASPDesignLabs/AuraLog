import { useState } from "react";
import { secureAdd } from "../utils/encryption.js";

const sensoryOptions = [
  "Dizziness",
  "Touch",
  "Sound",
  "Light",
  "Headache",
  "Nausea",
];

export default function SymptomForm() {
  const [pain, setPain] = useState(0);
  const [heartRateCurrent, setHeartRateCurrent] = useState("");
  const [heartRateResting, setHeartRateResting] = useState("");
  const [emotionalState, setEmotionalState] = useState("regulated");
  const [emotionalNotes, setEmotionalNotes] = useState("");
  const [sensory, setSensory] = useState({});
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [additionalMeds, setAdditionalMeds] = useState(false);
  const [medications, setMedications] = useState({
    ibuprofen: 0,
    tylenol: 0,
    naproxen: 0,
  });

  const toggleSensory = (option) => {
    setSensory((prev) => {
      const updated = { ...prev };
      if (updated[option] !== undefined) delete updated[option];
      else updated[option] = 0;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    await secureAdd("symptoms", {
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
      pain: Number(pain),
      heartRateCurrent: heartRateCurrent ? Number(heartRateCurrent) : null,
      heartRateResting: heartRateResting ? Number(heartRateResting) : null,
      emotionalState,
      emotionalNotes: emotionalState === "dysregulated" ? emotionalNotes : "",
      sensory,
      additionalNotes: additionalNotes.trim() || null,
      additionalMeds: additionalMeds ? medications : null,
    });
    alert("✅ Symptom entry saved!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 space-y-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
    >
      <h2 className="text-2xl font-bold">Log Symptoms</h2>

      {/* Pain */}
      <label className="block">
        <span className="font-medium">Pain Severity</span>
        <input
          type="range"
          min="0"
          max="10"
          value={pain}
          onChange={(e) => setPain(e.target.value)}
          className="w-full accent-pink-500 hev:accent-orange-500 v:accent-cyan-400"
        />
        <span className="text-sm">Current: {pain}</span>
      </label>

      {/* Heart rates */}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-medium">Current HR</span>
          <input
            type="number"
            value={heartRateCurrent}
            onChange={(e) => setHeartRateCurrent(e.target.value)}
            className="w-full p-2 rounded-xl border focus:ring-2 outline-none
                       hev:border-orange-500 hev:focus:ring-orange-400
                       v:border-cyan-400 v:focus:ring-cyan-400"
          />
        </label>
        <label className="block">
          <span className="font-medium">Resting HR</span>
          <input
            type="number"
            value={heartRateResting}
            onChange={(e) => setHeartRateResting(e.target.value)}
            className="w-full p-2 rounded-xl border focus:ring-2 outline-none
                       hev:border-orange-500 hev:focus:ring-orange-400
                       v:border-cyan-400 v:focus:ring-cyan-400"
          />
        </label>
      </div>

      {/* Emotional state */}
      <label className="block">
        <span className="font-medium">Emotional State</span>
        <select
          value={emotionalState}
          onChange={(e) => setEmotionalState(e.target.value)}
          className="w-full p-2 rounded-xl border focus:ring-2 outline-none
                     hev:border-orange-500 hev:focus:ring-orange-400
                     v:border-cyan-400 v:focus:ring-cyan-400"
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
          className="w-full p-2 rounded-xl border focus:ring-2 outline-none
                     hev:border-orange-500 hev:focus:ring-orange-400
                     v:border-cyan-400 v:focus:ring-cyan-400"
        />
      )}

      {/* Sensory issues */}
      <div>
        <h3 className="font-semibold">Sensory Issues</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {sensoryOptions.map((opt) => (
            <div key={opt} className="mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={opt in sensory}
                  onChange={() => toggleSensory(opt)}
                  className="accent-purple-500 hev:accent-orange-500 v:accent-cyan-400"
                />
                <span>{opt}</span>
              </label>
              {opt in sensory && (
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={sensory[opt]}
                  onChange={(e) =>
                    setSensory((prev) => ({
                      ...prev,
                      [opt]: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-purple-500 hev:accent-orange-500 v:accent-cyan-400"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Meds */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={additionalMeds}
          onChange={(e) => setAdditionalMeds(e.target.checked)}
          className="accent-purple-500 hev:accent-orange-500 v:accent-cyan-400"
        />
        <span>Additional Medication Taken</span>
      </label>
      {additionalMeds && (
        <div className="grid md:grid-cols-3 gap-3 p-3 rounded-xl hev:border-orange-500 v:border-cyan-400">
          <input
            type="number"
            placeholder="Ibuprofen"
            value={medications.ibuprofen}
            onChange={(e) =>
              setMedications((prev) => ({
                ...prev,
                ibuprofen: Number(e.target.value),
              }))
            }
            className="w-full p-2 rounded-xl border"
          />
          <input
            type="number"
            placeholder="Tylenol"
            value={medications.tylenol}
            onChange={(e) =>
              setMedications((prev) => ({
                ...prev,
                tylenol: Number(e.target.value),
              }))
            }
            className="w-full p-2 rounded-xl border"
          />
          <input
            type="number"
            placeholder="Naproxen"
            value={medications.naproxen}
            onChange={(e) =>
              setMedications((prev) => ({
                ...prev,
                naproxen: Number(e.target.value),
              }))
            }
            className="w-full p-2 rounded-xl border"
          />
        </div>
      )}

      {/* Additional Notes */}
      <label className="block">
        <span className="font-medium">Additional Notes</span>
        <textarea
          placeholder="Any extra details..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          className="w-full p-2 rounded-xl border focus:ring-2 outline-none
                     hev:border-orange-500 hev:focus:ring-orange-400
                     v:border-cyan-400 v:focus:ring-cyan-400"
        />
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="w-full px-4 py-3 rounded-xl font-semibold transition-all
                   bg-gradient-to-r from-blue-500 to-indigo-500 text-white
                   hev:from-orange-500 hev:to-yellow-500
                   v:from-red-600 v:to-red-800 v:text-cyan-200"
      >
        Save Entry
      </button>
    </form>
  );
}
