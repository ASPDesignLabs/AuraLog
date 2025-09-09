import { useState, useEffect } from "react";
import { secureAdd, secureGetLatest } from "../utils/encryption.js";

export default function SleepTracker() {
  const [hours, setHours] = useState(null);
  const [tempHours, setTempHours] = useState("");

  // Load latest hours after DB is unlocked
  useEffect(() => {
    const load = async () => {
      if (!window.sessionDEK) return;
      const latest = await secureGetLatest("sleep");
      setHours(latest ? latest.hours : null);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!tempHours) return;
    const now = new Date();

    await secureAdd("sleep", {
      hours: Number(tempHours),
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
    });

    const latest = await secureGetLatest("sleep");
    setHours(latest ? latest.hours : null);
    setTempHours("");
    alert("✅ Sleep entry saved");
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Sleep Tracker</h2>

      <p className="text-sm mb-2">
        {hours !== null ? `${hours} hrs` : "No entry yet"}
      </p>

      <div className="flex space-x-2">
        <input
          type="number"
          value={tempHours}
          onChange={(e) => setTempHours(e.target.value)}
          className="flex-1 p-2 rounded-xl border focus:ring-2 focus:outline-none"
          placeholder="Hours slept"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
