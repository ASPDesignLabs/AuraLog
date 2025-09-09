import { useState, useEffect } from "react";

export default function StimmingSettings() {
  const [settings, setSettings] = useState({
    barIntensity: 50,
    clockIntensity: 75,
    clockDuration: 200,
    switchIntensity: 100,
    switchDuration: 500,
    vThemeAnimation: true, // ✅ new setting
  });

  useEffect(() => {
    const saved = localStorage.getItem("stimmingSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("stimmingSettings", JSON.stringify(newSettings));
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all space-y-4">
      <h2 className="text-lg font-bold mb-2">Stimming Device & Theme Settings</h2>

      {/* Bar Intensity */}
      <label className="block">
        <span className="font-medium">Bar Haptic Intensity (ms)</span>
        <input
          type="number"
          min="10"
          max="500"
          value={settings.barIntensity}
          onChange={(e) => updateSetting("barIntensity", Number(e.target.value))}
          className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
        />
      </label>

      {/* Clock Intensity */}
      <label className="block">
        <span className="font-medium">Clock Haptic Intensity (ms)</span>
        <input
          type="number"
          min="10"
          max="500"
          value={settings.clockIntensity}
          onChange={(e) => updateSetting("clockIntensity", Number(e.target.value))}
          className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
        />
      </label>

      {/* Clock Duration */}
      <label className="block">
        <span className="font-medium">Clock Haptic Duration (ms)</span>
        <input
          type="number"
          min="50"
          max="2000"
          value={settings.clockDuration}
          onChange={(e) => updateSetting("clockDuration", Number(e.target.value))}
          className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
        />
      </label>

      {/* Switch Intensity */}
      <label className="block">
        <span className="font-medium">Switch Haptic Intensity (ms)</span>
        <input
          type="number"
          min="10"
          max="1000"
          value={settings.switchIntensity}
          onChange={(e) => updateSetting("switchIntensity", Number(e.target.value))}
          className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
        />
      </label>

      {/* Switch Duration */}
      <label className="block">
        <span className="font-medium">Switch Haptic Duration (ms)</span>
        <input
          type="number"
          min="100"
          max="2000"
          value={settings.switchDuration}
          onChange={(e) => updateSetting("switchDuration", Number(e.target.value))}
          className="w-full p-2 rounded-xl border focus:ring-2 focus:outline-none"
        />
      </label>

      {/* ✅ V Theme Animation Toggle */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={settings.vThemeAnimation}
          onChange={(e) => updateSetting("vThemeAnimation", e.target.checked)}
        />
        <span>Enable V Theme Animation</span>
      </label>
    </div>
  );
}
