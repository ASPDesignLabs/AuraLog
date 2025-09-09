import { useState, useEffect } from "react";
import { secureAdd, secureGetLatest } from "../utils/encryption.js";

export default function WorkTracker() {
  const [hours, setHours] = useState(0);
  const [tempHours, setTempHours] = useState("");

  // Load latest decrypted work record once unlocked
  useEffect(() => {
    const load = async () => {
      if (!window.sessionDEK) return;
      const latest = await secureGetLatest("work");
      setHours(latest ? latest.hours : 0);
    };
    load();
  }, []);

  const handleAddHours = async () => {
    if (!tempHours) return;
    const now = new Date();
    const newTotal = (hours || 0) + Number(tempHours);

    await secureAdd("work", {
      hours: newTotal,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
    });

    const latest = await secureGetLatest("work");
    setHours(latest ? latest.hours : 0);
    setTempHours("");
    alert("✅ Work hours logged!");
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Work Tracker</h2>
      <p className="text-sm mb-2">{hours} hrs this week</p>

      <div className="flex space-x-2">
        <input
          type="number"
          min="0"
          value={tempHours}
          onChange={(e) => setTempHours(e.target.value)}
          className="flex-1 p-2 rounded-xl border focus:ring-2 focus:outline-none"
          placeholder="Add hours"
        />
        <button
          onClick={handleAddHours}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}
