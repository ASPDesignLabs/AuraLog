import { useState, useEffect } from "react";
import sha256 from "crypto-js/sha256";
import { requestNotificationPermission } from "../utils/notifications.js";
import {
  deriveSessionKeyFromPin,
  auditLogin,
  auditLogout,
} from "../utils/encryption.js";

let idleTimer = null;
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export default function SecurityGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  async function lockApp(reason = "manual") {
    if (window.sessionDEK) await auditLogout(reason);
    window.sessionDEK = null;
    setUnlocked(false);
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      console.log("⏳ Idle timeout: auto-locking");
      lockApp("idle-timeout");
    }, IDLE_TIMEOUT_MS);
  }

  useEffect(() => {
    document.addEventListener("mousemove", resetIdleTimer);
    document.addEventListener("keydown", resetIdleTimer);
    document.addEventListener("click", resetIdleTimer);
    resetIdleTimer();

    if (window.PublicKeyCredential) setBiometricAvailable(true);
    window.lockApp = lockApp;

    return () => {
      document.removeEventListener("mousemove", resetIdleTimer);
      document.removeEventListener("keydown", resetIdleTimer);
      document.removeEventListener("click", resetIdleTimer);
    };
  }, []);

  // ✅ PIN Unlock
  const handleUnlock = async () => {
    const savedHash = localStorage.getItem("appPinHash");

    if (!savedHash) {
      if (pin.length < 4) {
        setError("PIN must be at least 4 digits");
        return;
      }
      localStorage.setItem("appPinHash", sha256(pin).toString());
    } else if (sha256(pin).toString() !== savedHash) {
      setError("Incorrect PIN");
      return;
    }

    window.sessionDEK = await deriveSessionKeyFromPin(pin);
    await auditLogin("PIN");
    setUnlocked(true);
    setPin("");
    setError("");
    resetIdleTimer();

    const granted = await requestNotificationPermission();
    if (granted && window.scheduleNotifications) {
      window.scheduleNotifications();
    }
  };

  // ✅ Passkey Unlock
  const unlockWithPasskey = async () => {
    const credId = localStorage.getItem("auralog-passkey-id");
    if (!credId) {
      setError("No passkey registered yet.");
      return;
    }
    try {
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [
            {
              id: Uint8Array.from(atob(credId), (c) => c.charCodeAt(0)),
              type: "public-key",
            },
          ],
          userVerification: "required",
          timeout: 60000,
        },
      });
      const hash = await crypto.subtle.digest("SHA-256", assertion.rawId);
      window.sessionDEK = await crypto.subtle.importKey(
        "raw",
        hash,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );
      await auditLogin("PASSKEY");
      setUnlocked(true);
      resetIdleTimer();

      const granted = await requestNotificationPermission();
      if (granted && window.scheduleNotifications) {
        window.scheduleNotifications();
      }
    } catch (err) {
      console.error("Passkey auth failed:", err);
      setError("Biometric auth failed");
    }
  };

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white select-none">
        <h2 className="text-2xl font-bold mb-4">🔒 Auralog Locked</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUnlock();
          }}
          className="flex flex-col items-center space-y-4"
        >
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="p-3 rounded-xl text-black w-48 text-center"
            placeholder="Enter PIN"
            autoComplete="one-time-code"
            aria-label="App PIN"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Unlock
          </button>
        </form>

        {biometricAvailable && (
          <button
            onClick={unlockWithPasskey}
            className="mt-4 px-4 py-2 bg-green-500 rounded-xl font-semibold hover:bg-green-600 transition"
          >
            Use Passkey (Biometrics)
          </button>
        )}

        {error && <p className="mt-3 text-red-400">{error}</p>}

        <p className="mt-6 text-sm text-gray-400">
          {localStorage.getItem("appPinHash")
            ? "Enter your PIN or use biometrics"
            : "Set a new PIN (first-time setup)"}
        </p>
      </div>
    );
  }

  return children;
}
