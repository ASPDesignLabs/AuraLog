import { useState, useEffect } from "react";
import { db } from "../db/schema.js";

export default function WorkTracker() {
  const [hours, setHours] = useState(0);
  const [tempHours, setTempHours] = useState("");
  const target = 35;

  useEffect(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toLocaleDateString("en-US");

    db.work
      .where("weekStart")
      .equals(weekStart)
      .first()
      .then((entry) => {
        if (entry) setHours(entry.hours);
      });
  }, []);

  const handleAddHours = async () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toLocaleDateString("en-US");

    const newTotal = hours + Number(tempHours);
    setHours(newTotal);
    setTempHours("");

    await db.work.put({ weekStart, hours: newTotal });
  };

  const progress = Math.min((hours / target) * 100, 100);

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Work Tracker</h2>
      <p className="text-sm mb-2">{hours} / {target} hrs this week</p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          type="number"
          min="0"
          value={tempHours}
          onChange={(e) => setTempHours(e.target.value)}
          className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
