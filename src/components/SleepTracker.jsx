import { useState, useEffect } from "react";
import { db } from "../db/schema.js";

export default function SleepTracker() {
  const [hours, setHours] = useState(null);
  const [tempHours, setTempHours] = useState("");
  const minTarget = 6;

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US");
    db.sleep
      .where("date")
      .equals(today)
      .first()
      .then((entry) => {
        if (entry) setHours(entry.hours);
      });

    const now = new Date();
    const resetTime = new Date();
    resetTime.setHours(10, 0, 0, 0);
    if (now > resetTime) resetTime.setDate(resetTime.getDate() + 1);
    const timeout = resetTime.getTime() - now.getTime();
    const timer = setTimeout(() => {
      setHours(null);
      setTempHours("");
    }, timeout);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const today = new Date().toLocaleDateString("en-US");
    setHours(tempHours);
    await db.sleep.put({ date: today, hours: Number(tempHours) });
    setTempHours("");
  };

  const progress = Math.min(((hours || 0) / minTarget) * 100, 100);

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Sleep Tracker</h2>
      <p className="text-sm mb-2">
        {hours !== null ? `${hours} hrs` : "No entry yet"} (Min: {minTarget})
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          type="number"
          min="0"
          value={tempHours}
          onChange={(e) => setTempHours(e.target.value)}
          className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
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
