import { useState, useEffect } from "react";
import SymptomForm from "./components/SymptomForm.jsx";
import CalorieMeter from "./components/CalorieMeter.jsx";
import WeightMeter from "./components/WeightMeter.jsx";
import MedicationReminder from "./components/MedicationReminder.jsx";
import WorkTracker from "./components/WorkTracker.jsx";
import SleepTracker from "./components/SleepTracker.jsx";
import NicotineTracker from "./components/NicotineTracker.jsx";
import LogViewer from "./components/LogViewer.jsx";
import PDFExporter from "./components/PDFExporter.jsx";
import DBManager from "./components/DBManager.jsx";
import StimmingSurface from "./components/StimmingSurface.jsx";
import StimmingModule from "./components/StimmingModule.jsx";
import StimmingSettings from "./components/StimmingSettings.jsx";
import NotificationSettings from "./components/NotificationSettings.jsx";
import { scheduleNotifications } from "./utils/notifications.js";

function App() {
  const [view, setView] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.add(saved);
    }
    scheduleNotifications();

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleTheme = () => {
    let newTheme;
    if (theme === "light") newTheme = "dark";
    else if (theme === "dark") newTheme = "hev";
    else newTheme = "light";

    document.documentElement.classList.remove("light", "dark", "hev");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "symptoms", label: "Symptoms" },
    { id: "logs", label: "Logs" },
    { id: "settings", label: "Settings" },
    { id: "stimming", label: "Stimming" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${theme}`}
    >
      {/* Header (always visible, even in fullscreen) */}
      <header className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 hev:bg-gray-900/80 sticky top-0 z-30 shadow-md transition-all duration-500">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-3">
          {/* App Title */}
          <h1
            className={`text-2xl font-extrabold tracking-tight ${
              theme === "hev"
                ? "text-orange-500 flex items-center space-x-2"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
            }`}
          >
            {theme === "hev" ? (
              <>
                <span className="text-3xl">λ</span>
                <span>HEV Mk III</span>
              </>
            ) : (
              "AuraLog"
            )}
          </h1>

          {/* Right side: Theme toggle + Fullscreen + Hamburger */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 text-gray-800 dark:text-gray-200 hev:text-orange-400 hover:shadow-md transition"
            >
              {theme === "light" && "☀️"}
              {theme === "dark" && "🌙"}
              {theme === "hev" && "λ"}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 text-gray-800 dark:text-gray-200 hev:text-orange-400 hover:shadow-md transition"
            >
              {isFullscreen ? "⛶" : "⤢"}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 text-gray-800 dark:text-gray-200 hev:text-orange-400 hover:shadow-md transition"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 hev:bg-gray-900 shadow-lg transform transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full text-right text-gray-600 dark:text-gray-300 hev:text-orange-400"
          >
            ✕ Close
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                view === item.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hev:bg-orange-500 hev:text-black"
                  : "text-gray-700 dark:text-gray-300 hev:text-orange-400 hover:bg-gray-200 dark:hover:bg-gray-700 hev:hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {view === "dashboard" && (
          <div className="grid gap-6 md:grid-cols-2">
            <CalorieMeter />
            <WeightMeter />
            <MedicationReminder />
            <WorkTracker />
            <SleepTracker />
            <NicotineTracker />
            <StimmingModule onOpen={() => setView("stimming")} />
          </div>
        )}
        {view === "symptoms" && <SymptomForm />}
        {view === "logs" && <LogViewer />}
        {view === "settings" && (
          <div className="space-y-6">
            <PDFExporter />
            <DBManager />
            <StimmingSettings />
            <NotificationSettings />
          </div>
        )}
        {view === "stimming" && <StimmingSurface />}
      </main>
    </div>
  );
}

export default App;
