import { useEffect, useState } from "react";
import { secureAll } from "../utils/encryption.js";

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const symptoms = (await secureAll("symptoms")).map((e) => ({
          ...e,
          type: "symptom",
        }));
        const calories = (await secureAll("calories")).map((e) => ({
          ...e,
          type: "calories",
        }));
        const sleep = (await secureAll("sleep")).map((e) => ({
          ...e,
          type: "sleep",
        }));
        const work = (await secureAll("work")).map((e) => ({
          ...e,
          type: "work",
        }));
        const weight = (await secureAll("weight")).map((e) => ({
          ...e,
          type: "weight",
        }));
        const nicotine = (await secureAll("nicotine")).map((e) => ({
          ...e,
          type: "nicotine",
        }));
        const medication = (await secureAll("medication")).map((e) => ({
          ...e,
          type: "medication",
        }));

        const all = [
          ...symptoms,
          ...calories,
          ...sleep,
          ...work,
          ...weight,
          ...nicotine,
          ...medication,
        ];

        all.sort(
          (a, b) =>
            new Date(b.timestamp || b.date || b.weekStart) -
            new Date(a.timestamp || a.date || a.weekStart)
        );

        setLogs(all);
      } catch (err) {
        console.error("❌ Failed to load logs:", err);
        setLogs([]);
      }
    };
    loadLogs();
  }, []);

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp || log.date || log.weekStart);
    return logDate >= start && logDate <= end;
  });

  const rangeDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const renderLog = (log) => {
    switch (log.type) {
      case "symptom":
        return (
          <>
            <p className="font-semibold">🩺 Symptom Log</p>
            <p>Pain: {log.pain} | Emotional: {log.emotionalState}</p>
            {log.sensory && Object.keys(log.sensory).length > 0 && (
              <p>
                Sensory:{" "}
                {Object.entries(log.sensory)
                  .map(([k, v]) => `${k}(${v})`)
                  .join(", ")}
              </p>
            )}
            {log.additionalNotes && <p className="text-sm">Notes: {log.additionalNotes}</p>}
          </>
        );
      case "calories":
        return (
          <>
            <p className="font-semibold">🍽️ Calories</p>
            <p>{log.value} kcal</p>
          </>
        );
      case "sleep":
        return (
          <>
            <p className="font-semibold">🛏️ Sleep</p>
            <p>{log.hours} hrs</p>
          </>
        );
      case "work":
        return (
          <>
            <p className="font-semibold">💼 Work Hours</p>
            <p>{log.hours} hrs (week {log.weekStart})</p>
          </>
        );
      case "weight":
        return (
          <>
            <p className="font-semibold">⚖️ Weight</p>
            <p>{log.value} lbs</p>
          </>
        );
      case "nicotine":
        return (
          <>
            <p className="font-semibold">🚬 Nicotine</p>
            <p>{log.uses} uses (Target: {log.target})</p>
          </>
        );
      case "medication":
        return (
          <>
            <p className="font-semibold">💊 Medication</p>
            <p>{log.taken ? "Taken ✅" : "Not taken ❌"}</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-xl font-bold mb-4">📑 Logs by Date Range</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <label className="flex-1">
          <span className="text-sm font-medium">Start Date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 rounded-xl border hev:border-orange-500 hev:focus:ring-orange-400 v:border-cyan-400 v:focus:ring-cyan-400"
          />
        </label>
        <label className="flex-1 mt-2 md:mt-0">
          <span className="text-sm font-medium">End Date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded-xl border hev:border-orange-500 hev:focus:ring-orange-400 v:border-cyan-400 v:focus:ring-cyan-400"
          />
        </label>
      </div>

      {rangeDays > 31 && (
        <p className="text-red-500 font-semibold mb-4">
          ⚠️ Viewing {rangeDays} days — limit to 31 for performance.
        </p>
      )}

      {filteredLogs.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No entries in this range.</p>
      )}

      <ul className="space-y-4">
        {filteredLogs.map((log, idx) => (
          <li
            key={`${log.type}-${log.id || idx}`}
            className="p-4 rounded-xl shadow-sm transition border 
                       border-gray-200 dark:border-gray-700 hover:shadow-md
                       hev:border-orange-500 hev:bg-gray-900/80 hev:text-orange-400
                       v:bg-[rgba(69,1,1,0.9)] v:border-cyan-400 v:text-cyan-400"
          >
            <p className="text-xs opacity-70 mb-1">
              {log.date || log.weekStart} {log.time ? `@ ${log.time}` : ""}
            </p>
            {renderLog(log)}
          </li>
        ))}
      </ul>
    </div>
  );
}
