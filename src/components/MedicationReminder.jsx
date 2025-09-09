import { useState, useEffect } from "react";
import { secureAdd, secureGetLatest } from "../utils/encryption.js";

export default function MedicationReminder() {
  const [taken, setTaken] = useState(false);
  const [warning, setWarning] = useState(false);

  // Load today's med status
  useEffect(() => {
    const load = async () => {
      if (!window.sessionDEK) return;
      const latest = await secureGetLatest("medication");
      if (latest) {
        const today = new Date().toISOString().split("T")[0];
        if (latest.date === today && latest.taken) {
          setTaken(true);
        }
      }
    };
    load();

    // Warning check after 10am
    const checkWarning = () => {
      const now = new Date();
      if (now.getHours() >= 10 && !taken) {
        setWarning(true);
      }
    };
    checkWarning();
    const interval = setInterval(checkWarning, 60 * 1000);
    return () => clearInterval(interval);
  }, [taken]);

  const handleSubmit = async () => {
    if (taken) return;
    const now = new Date();
    const date = now.toISOString().split("T")[0];

    await secureAdd("medication", {
      date,
      taken: true,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
    });

    setTaken(true);
    setWarning(false);
    alert("✅ Medication logged!");
  };

  return (
    <div
      className={`card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all ${
        warning ? "border-2 border-red-500" : ""
      }`}
    >
      <h2 className="text-lg font-bold mb-4">Morning Medication</h2>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={taken}
          disabled={taken}
          onChange={handleSubmit}
          className="w-5 h-5 rounded accent-blue-500 hev:accent-orange-500 v:accent-cyan-400"
        />
        <span className="text-sm font-medium">
          {taken ? "Taken today ✅" : "Mark as taken"}
        </span>
      </div>

      {warning && !taken && (
        <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">
          ⚠️ Medication not logged by 10am!
        </p>
      )}

      {!taken && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 rounded-xl font-semibold transition-all
                     bg-gradient-to-r from-green-500 to-emerald-600 text-white
                     hover:scale-[1.02] hover:shadow-lg"
        >
          Log Medication
        </button>
      )}
      {taken && (
        <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-semibold">
          🎉 Medication taken — you're on track!
        </p>
      )}
    </div>
  );
}
