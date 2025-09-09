import { useState, useEffect } from "react";
import { secureAdd, secureGetLatest } from "../utils/encryption.js";

export default function NicotineTracker() {
  const [uses, setUses] = useState(0);
  const [tempUses, setTempUses] = useState("");
  const [target, setTarget] = useState(20);

  // Load the latest nicotine record after unlock
  useEffect(() => {
    const load = async () => {
      if (!window.sessionDEK) return;
      const latest = await secureGetLatest("nicotine");
      if (latest) {
        setUses(latest.uses);
        setTarget(latest.target);
      }
    };
    load();
  }, []);

  const handleAddUses = async () => {
    if (!tempUses) return;
    const now = new Date();
    const newUses = (uses || 0) + Number(tempUses);

    await secureAdd("nicotine", {
      uses: newUses,
      target,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
    });

    const latest = await secureGetLatest("nicotine");
    if (latest) {
      setUses(latest.uses);
      setTarget(latest.target);
    }

    setTempUses("");
    alert("✅ Nicotine use logged!");
  };

  const progress = Math.min((uses / target) * 100, 100);
  const overTarget = uses > target;

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Nicotine Tracker</h2>

      <p className="text-sm mb-2">
        {uses} / {target} uses today
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all ${
            overTarget
              ? "bg-gradient-to-r from-red-500 to-red-700"
              : "bg-gradient-to-r from-orange-400 to-orange-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex space-x-2">
        <input
          type="number"
          min="1"
          value={tempUses}
          onChange={(e) => setTempUses(e.target.value)}
          className="flex-1 p-2 rounded-xl border focus:ring-2 focus:outline-none"
          placeholder="Add uses"
        />
        <button
          onClick={handleAddUses}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Add
        </button>
      </div>

      {overTarget && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
          ⚠️ Over target! Try to reduce tomorrow.
        </p>
      )}
    </div>
  );
}
