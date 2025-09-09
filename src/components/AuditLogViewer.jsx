import { useEffect, useState } from "react";
import { secureAuditAll } from "../utils/encryption.js";

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await secureAuditAll();
        const sorted = all.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLogs(sorted);
      } catch (err) {
        console.error("❌ Failed to load audit logs:", err);
      }
    };
    load();
  }, []);

  return (
    <div className="card p-6 rounded-2xl shadow-lg transition-all">
      <h2 className="text-lg font-bold mb-4">Audit Trail</h2>
      {logs.length === 0 && (
        <p className="text-gray-500">No audit logs yet.</p>
      )}
      <ul className="space-y-2 max-h-64 overflow-y-auto text-sm">
        {logs.map((log, idx) => (
          <li key={idx} className="border-b pb-1">
            <span className="font-mono text-xs">{log.timestamp}</span> |{" "}
            <span className="font-semibold">{log.action}</span> →{" "}
            {log.details?.table ?? ""}
            {log.details?.id ? ` (record:${log.details.id})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
