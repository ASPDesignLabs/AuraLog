import { useState, useEffect } from "react";
import { db } from "../db/schema.js";
import { secureAuditAll, auditExport } from "../utils/encryption.js";

export default function DataManager() {
  const [showModal, setShowModal] = useState(false);
  const [exported, setExported] = useState(false);
  const [cached, setCached] = useState(false);
  const [persistent, setPersistent] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  // --- cache/persistent status listeners ---
  useEffect(() => {
    const checkCached = () => {
      if (window.isAppCached && window.isAppCached()) {
        setCached(true);
      }
    };
    const checkPersistent = () => {
      if (window.isPersistentStorage && window.isPersistentStorage()) {
        setPersistent(true);
      } else {
        setPersistent(false);
      }
    };

    checkCached();
    checkPersistent();

    window.addEventListener("appcached", () => setCached(true));
    window.addEventListener("storagecheck", checkPersistent);

    return () => {
      window.removeEventListener("appcached", () => setCached(true));
      window.removeEventListener("storagecheck", checkPersistent);
    };
  }, []);

  // --- audit logs ---
  const loadAuditLogs = async () => {
    if (!window.sessionDEK) return;
    const logs = await secureAuditAll();
    setAuditLogs(logs);
  };
  useEffect(() => {
    loadAuditLogs();
  }, []);

  // --- Export JSON backup ---
  const handleExport = async () => {
    const data = {
      symptoms: await db.symptoms.toArray(),
      calories: await db.calories.toArray(),
      sleep: await db.sleep.toArray(),
      work: await db.work.toArray(),
      weight: await db.weight.toArray(),
      nicotine: await db.nicotine.toArray(),
      medication: await db.medication.toArray(),
      stimming: await db.stimming.toArray(),
      backups: await db.backups.toArray(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auralog-backup-${new Date()
      .toISOString()
      .split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExported(true);
    await auditExport("JSON");
    alert("✅ Data exported successfully.");
    loadAuditLogs();
  };

  // --- Import JSON backup ---
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);

    await db.symptoms.clear();
    await db.calories.clear();
    await db.sleep.clear();
    await db.work.clear();
    await db.weight.clear();
    await db.nicotine.clear();
    await db.medication.clear();
    await db.stimming.clear();
    await db.backups.clear();

    if (data.symptoms) await db.symptoms.bulkAdd(data.symptoms);
    if (data.calories) await db.calories.bulkAdd(data.calories);
    if (data.sleep) await db.sleep.bulkAdd(data.sleep);
    if (data.work) await db.work.bulkAdd(data.work);
    if (data.weight) await db.weight.bulkAdd(data.weight);
    if (data.nicotine) await db.nicotine.bulkAdd(data.nicotine);
    if (data.medication) await db.medication.bulkAdd(data.medication);
    if (data.stimming) await db.stimming.bulkAdd(data.stimming);
    if (data.backups) await db.backups.bulkAdd(data.backups);

    alert("✅ Data imported successfully.");
    loadAuditLogs();
  };

  // --- Reset database ---
  const handleReset = async () => {
    if (!exported) {
      alert("⚠️ You must export your data before resetting.");
      return;
    }
    await db.symptoms.clear();
    await db.calories.clear();
    await db.sleep.clear();
    await db.work.clear();
    await db.weight.clear();
    await db.nicotine.clear();
    await db.medication.clear();
    await db.stimming.clear();
    await db.backups.clear();
    setExported(false);
    setShowModal(false);
    alert("✅ Database has been reset.");
  };

  // --- Install / Update App ---
  const handleInstall = async () => {
    await handleExport();
    if (window.promptInstallApp) {
      window.promptInstallApp();
    } else {
      alert("⚠️ Install prompt not available. Try refreshing.");
    }
    setShowInstallModal(false);
  };

  // --- Register Passkey ---
  const handleRegisterPasskey = async () => {
    if (!window.PublicKeyCredential) {
      alert("Passkeys not supported on this device.");
      return;
    }
    const publicKey = {
      challenge: new Uint8Array(32),
      rp: { name: "Auralog" },
      user: {
        id: new Uint8Array(16),
        name: "local-user",
        displayName: "Auralog User",
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "none",
    };
    try {
      const credential = await navigator.credentials.create({ publicKey });
      const credId = btoa(
        String.fromCharCode(...new Uint8Array(credential.rawId))
      );
      localStorage.setItem("auralog-passkey-id", credId);
      alert("✅ Passkey registered!");
      setShowPasskeyModal(false);
    } catch (err) {
      console.error("Passkey registration failed:", err);
      alert("❌ Failed to register passkey.");
    }
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-xl font-bold mb-4">⚙️ Data Management</h2>

      <div className="space-y-3">
        {/* Export */}
        <button
          onClick={handleExport}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 
                     hev:from-orange-500 hev:to-yellow-500 
                     v:from-red-600 v:to-red-800 v:text-cyan-200
                     text-white px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg"
        >
          📤 Export All Data
        </button>

        {/* Import */}
        <label className="w-full block">
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
            id="importFile"
          />
          <button
            onClick={() => document.getElementById("importFile").click()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600
                       text-white px-4 py-2 rounded-xl font-semibold 
                       hover:scale-[1.02] hover:shadow-lg"
          >
            📥 Import Data
          </button>
        </label>

        {/* Cache App */}
        <button
          onClick={() => window.cacheApp && window.cacheApp()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500
                     text-white px-4 py-2 rounded-xl font-semibold 
                     hover:scale-[1.02] hover:shadow-lg"
        >
          📦 Cache App for Offline Use
        </button>
        <p
          className={`text-sm font-semibold ${
            cached ? "text-green-500" : "text-red-500"
          }`}
        >
          {cached ? "✅ App cached for offline use" : "⚠️ App not cached yet"}
        </p>

        {/* Persistent Storage Status */}
        <p className={`text-sm font-semibold ${persistent ? "text-green-500":"text-red-500"}`}>
          {persistent
            ? "✅ Persistent storage granted"
            : "⚠️ Persistent storage not granted"}
        </p>

        {/* Refresh */}
        <button
          onClick={() => window.refreshApp && window.refreshApp()}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500
                     text-white px-4 py-2 rounded-xl font-semibold 
                     hover:scale-[1.02] hover:shadow-lg"
        >
          🔄 Refresh App
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reloads with updates without clearing data.
        </p>

        {/* Install Update */}
        <button
          onClick={() => setShowInstallModal(true)}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white px-4 py-2 rounded-xl font-semibold 
                     hover:scale-[1.02] hover:shadow-lg"
        >
          📲 Install / Update App
        </button>

        {/* Register Passkey */}
        <button
          onClick={() => setShowPasskeyModal(true)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700
                     text-white px-4 py-2 rounded-xl font-semibold 
                     hover:scale-[1.02] hover:shadow-lg"
        >
          🔑 Register Passkey
        </button>

        {/* Reset */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500
                     text-white px-4 py-2 rounded-xl font-semibold 
                     hover:scale-[1.02] hover:shadow-lg"
        >
          🗑️ Reset Database
        </button>
      </div>

      {/* Reset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-red-600">⚠️ Reset Database</h3>
            <p className="text-sm">
              This will permanently delete all records.{" "}
              <strong>Export first!</strong>
            </p>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold"
              >
                📤 Export Now
              </button>
              <button
                onClick={handleReset}
                disabled={!exported}
                className={`w-full px-4 py-2 rounded-xl font-semibold transition-all ${
                  exported
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-indigo-600">
              📲 Install / Update App
            </h3>
            <p className="text-sm">
              Installs or updates the PWA. Backup will be exported first.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Confirm & Install
              </button>
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Passkey Modal */}
      {showPasskeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-green-600">🔑 Register Passkey</h3>
            <p className="text-sm">
              Register biometric passkey. Unlock with FaceID, TouchID, etc.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleRegisterPasskey}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold"
              >
                Confirm & Register
              </button>
              <button
                onClick={() => setShowPasskeyModal(false)}
                className="w-full bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-bold mb-2">📜 Audit Trail</h3>
        {!window.sessionDEK && (
          <p className="text-red-500">
            🔒 Locked — unlock app to view logs.
          </p>
        )}
        {window.sessionDEK && auditLogs.length === 0 && (
          <p className="text-gray-500">No audit logs yet.</p>
        )}
        {window.sessionDEK && auditLogs.length > 0 && (
          <ul className="space-y-1 max-h-64 overflow-y-auto text-xs font-mono">
            {auditLogs.map((log, idx) => (
              <li
                key={idx}
                className="border-b pb-1 flex justify-between text-xs"
              >
                <span>{log.timestamp}</span>
                <span>{log.action}</span>
                {log.details?.table && <span>{log.details.table}</span>}
                {log.details?.id && <span>ID:{log.details.id}</span>}
                {log.details?.type && <span>{log.details.type}</span>}
              </li>
            ))}
          </ul>
        )}
        {window.sessionDEK && (
          <button
            onClick={loadAuditLogs}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-xl text-xs font-semibold hover:bg-blue-600"
          >
            Refresh Logs
          </button>
        )}
      </div>
    </div>
  );
}
