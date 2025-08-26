import { useState, useEffect } from "react";
import { db } from "../db/schema.js";

export default function MedicationReminder() {
  const [taken, setTaken] = useState(false);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US");
    db.medication
      .where("date")
      .equals(today)
      .first()
      .then((entry) => {
        if (entry) setTaken(true);
      });

    const now = new Date();
    const resetTime = new Date();
    resetTime.setHours(2, 0, 0, 0);
    if (now > resetTime) resetTime.setDate(resetTime.getDate() + 1);
    const timeout = resetTime.getTime() - now.getTime();
    const timer = setTimeout(() => {
      setTaken(false);
      setWarning(false);
    }, timeout);

    const checkWarning = () => {
      const now = new Date();
      if (now.getHours() >= 10 && !taken) {
        setWarning(true);
      }
    };
    checkWarning();
    const interval = setInterval(checkWarning, 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [taken]);

  const handleSubmit = async () => {
    if (taken) return;

    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    await db.medication.add({ date, time, taken: true });
    setTaken(true);
    setWarning(false);
    alert("Medication logged!");
  };

  return (
    <div
      className={`card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all ${
        warning ? "border-red-500" : ""
      }`}
    >
      <h2 className="text-lg font-bold mb-2">Morning Medication</h2>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={taken}
          disabled={taken}
          onChange={handleSubmit}
        />
        <span>{taken ? "Taken today ✅" : "Mark as taken"}</span>
      </label>
      {warning && !taken && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
          ⚠️ Medication not logged by 10am!
        </p>
      )}
    </div>
  );
}
