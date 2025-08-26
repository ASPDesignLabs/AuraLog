import { useState, useEffect } from "react";
import { db } from "../db/schema.js";

export default function NicotineTracker() {
  const [uses, setUses] = useState(0);
  const [tempUses, setTempUses] = useState("");
  const [target, setTarget] = useState(20);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US");

    db.nicotine
      .where("date")
      .equals(today)
      .first()
      .then((entry) => {
        if (entry) {
          setUses(entry.uses);
          setTarget(entry.target);
        } else {
          db.nicotine
            .orderBy("id")
            .reverse()
            .first()
            .then((yesterday) => {
              if (yesterday) {
                if (yesterday.uses <= yesterday.target) {
                  setTarget(Math.max(2, yesterday.target - 2));
                } else {
                  setTarget(yesterday.target);
                }
              }
            });
        }
      });

    const now = new Date();
    const resetTime = new Date();
    resetTime.setHours(24, 0, 0, 0);
    const timeout = resetTime.getTime() - now.getTime();
    const timer = setTimeout(() => {
      setUses(0);
      setTempUses("");
    }, timeout);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const today = new Date().toLocaleDateString("en-US");
    const newUses = uses + Number(tempUses);

    setUses(newUses);
    setTempUses("");

    await db.nicotine.put({ date: today, uses: newUses, target });
  };

  const progress = Math.min((uses / target) * 100, 100);
  const overuse = uses > target;

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Nicotine Use</h2>
      <p className="text-sm mb-2">
        {uses} / {target} uses today
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all ${
            overuse
              ? "bg-gradient-to-r from-red-500 to-red-700"
              : "bg-gradient-to-r from-orange-400 to-orange-600"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          type="number"
          min="1"
          value={tempUses}
          onChange={(e) => setTempUses(e.target.value)}
          className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Add uses"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Add
        </button>
      </div>
      {overuse && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
          ⚠️ Over target! Try to reduce tomorrow.
        </p>
      )}
    </div>
  );
}
