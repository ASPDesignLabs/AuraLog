import { useState } from "react";
import sha256 from "crypto-js/sha256";

export default function ChangePin() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePin = (e) => {
    e.preventDefault(); // ✅ prevent form reload

    const savedHash = localStorage.getItem("appPinHash");

    if (!savedHash) {
      setMessage("No PIN is set yet. Please lock the app first.");
      return;
    }

    if (sha256(currentPin).toString() !== savedHash) {
      setMessage("❌ Current PIN is incorrect.");
      return;
    }

    if (newPin.length < 4) {
      setMessage("❌ New PIN must be at least 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setMessage("❌ New PINs do not match.");
      return;
    }

    localStorage.setItem("appPinHash", sha256(newPin).toString());
    setMessage("✅ PIN successfully changed!");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Change PIN</h2>

      {/* ✅ Wrap inputs in a form */}
      <form onSubmit={handleChangePin} className="space-y-3">
        <input
  type="password"
  placeholder="Current PIN"
  value={currentPin}
  onChange={(e) => setCurrentPin(e.target.value)}
  className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
  autoComplete="one-time-code"   // ✅ Use OTP autocomplete
  aria-label="Current App PIN"
/>

<input
  type="password"
  placeholder="New PIN"
  value={newPin}
  onChange={(e) => setNewPin(e.target.value)}
  className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
  autoComplete="one-time-code"
  aria-label="New App PIN"
/>

<input
  type="password"
  placeholder="Confirm New PIN"
  value={confirmPin}
  onChange={(e) => setConfirmPin(e.target.value)}
  className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
  autoComplete="one-time-code"
  aria-label="Confirm New App PIN"
/>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Update PIN
        </button>
      </form>

      {message && (
        <p
          className={`mt-2 text-sm font-semibold ${
            message.startsWith("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}