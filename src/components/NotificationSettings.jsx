import { useState, useEffect } from "react";

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("mealNotifications");
    if (saved !== null) {
      setEnabled(saved === "true");
    }
  }, []);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem("mealNotifications", newValue);
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Notification Settings</h2>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={enabled} onChange={handleToggle} />
        <span>Enable Meal Notifications (Breakfast, Lunch, Dinner)</span>
      </label>
    </div>
  );
}
