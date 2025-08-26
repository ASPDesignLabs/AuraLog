import { useState, useEffect } from "react";
import { db } from "../db/schema.js";
import { createBackup, restoreBackup, resetDB } from "../db/backup.js";

export default function DBManager() {
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    db.backups.toArray().then((b) => setBackups(b.reverse()));
  }, []);

  const handleBackup = async () => {
    await createBackup();
    const b = await db.backups.toArray();
    setBackups(b.reverse());
    alert("Backup created!");
  };

  const handleRestore = async (date) => {
    if (window.confirm(`Restore backup from ${date}?`)) {
      await restoreBackup(date);
      alert("Database restored!");
    }
  };

  const handleReset = async () => {
    if (window.confirm("This will clear ALL data. Continue?")) {
      await resetDB();
      alert("Database reset!");
    }
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Database Manager</h2>
      <div className="space-y-3">
        <button
          onClick={handleBackup}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Create Backup
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Reset Database
        </button>
      </div>
      <h3 className="mt-4 font-semibold">Available Backups</h3>
      <ul className="mt-2 space-y-2">
        {backups.map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
          >
            <span>{b.date}</span>
            <button
              onClick={() => handleRestore(b.date)}
              className="text-blue-500 hover:underline"
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
