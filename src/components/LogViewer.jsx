import { useEffect, useState } from "react";
import { db } from "../db/schema.js";

export default function LogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    db.symptoms.toArray().then((entries) => {
      setLogs(entries.reverse());
    });
  }, []);

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-4">Symptom Log</h2>
      {logs.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No entries yet.</p>
      )}
      <ul className="space-y-4">
        {logs.map((log) => (
          <li
            key={log.id}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {log.date}
            </p>
            <p className="font-medium">Pain: {log.pain}</p>
            <p>
              Heart Rate: {log.heartRateCurrent} / {log.heartRateResting}
            </p>
            <p>Emotional: {log.emotionalState}</p>
            {log.emotionalNotes && (
              <p className="italic text-gray-600 dark:text-gray-300">
                “{log.emotionalNotes}”
              </p>
            )}
            {log.sensory && (
              <p>
                Sensory:{" "}
                {Object.entries(log.sensory)
                  .map(([k, v]) => `${k}(${v})`)
                  .join(", ")}
              </p>
            )}
            <p>Calories: {log.calories}</p>
            <p>Medication: {log.medication ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
