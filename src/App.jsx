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
import DataManager from "./components/DataManager.jsx";
import StimmingSurface from "./components/StimmingSurface.jsx";
import StimmingModule from "./components/StimmingModule.jsx";
import StimmingSettings from "./components/StimmingSettings.jsx";
import NotificationSettings from "./components/NotificationSettings.jsx";
import ChangePin from "./components/ChangePin.jsx";
import Transcription from "./components/Transcription.jsx";
import About from "./components/About.jsx";
import { scheduleNotifications } from "./utils/notifications.js";
import SecurityGate from "./components/SecurityGate.jsx";

function App() {
  const [view, setView] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showInstallNewBadge, setShowInstallNewBadge] = useState(false);
  const [vThemeAnimation, setVThemeAnimation] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.add(saved);
    }

    const savedSettings = localStorage.getItem("stimmingSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.vThemeAnimation !== undefined) {
          setVThemeAnimation(parsed.vThemeAnimation);
        }
      } catch {}
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const enableInstall = () => {
      setCanInstall(true);
      setShowInstallNewBadge(true);
    };
    window.addEventListener("installpromptavailable", enableInstall);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("installpromptavailable", enableInstall);
    };
  }, []);

  const toggleTheme = () => {
    let newTheme;
    if (theme === "light") newTheme = "dark";
    else if (theme === "dark") newTheme = "hev";
    else if (theme === "hev") newTheme = "v";
    else newTheme = "light";

    document.documentElement.classList.remove("light", "dark", "hev", "v");
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
    { id: "transcription", label: "Transcription" },
    { id: "about", label: "About" },
  ];

  return (
    <SecurityGate>
      <div
        className={`min-h-screen flex flex-col transition-colors duration-500 ${theme}`}
      >
        {/* HEV Background */}
        {theme === "hev" && (
          <div
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: "url(/ui/HEV/HEV_BG.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}

        {/* V Background */}
        {theme === "v" && (
          <div
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: "url(/ui/V/V_BG.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-black/60 to-red-600/30" />
            {vThemeAnimation && <div className="absolute inset-0 v-shimmer" />}
          </div>
        )}

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <header className="backdrop-blur-md bg-white/70 dark:bg-gray-800/70 hev:bg-gray-900/80 v:bg-black/80 sticky top-0 z-30 shadow-md transition-all duration-500">
            <div className="max-w-5xl mx-auto flex justify-between items-center px-4 py-3">
              <h1
                className={`text-2xl font-extrabold tracking-tight ${
                  theme === "hev"
                    ? "text-orange-500 flex items-center space-x-2"
                    : theme === "v"
                    ? "text-red-500 uppercase tracking-widest"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
                }`}
              >
                {theme === "hev" ? (
                  <>
                    <span className="text-3xl">λ</span>
                    <span>Auralog Mk III</span>
                  </>
                ) : theme === "v" ? (
                  "Auralog // V"
                ) : (
                  "Auralog"
                )}
              </h1>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.lockApp && window.lockApp()}
                  className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 v:bg-black 
                             text-gray-800 dark:text-gray-200 hev:text-orange-400 v:text-cyan-400 
                             hover:shadow-md transition"
                >
                  🔒
                </button>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 v:bg-black 
                             text-gray-800 dark:text-gray-200 hev:text-orange-400 v:text-cyan-400 
                             hover:shadow-md transition"
                >
                  {theme === "light" && "☀️"}
                  {theme === "dark" && "🌙"}
                  {theme === "hev" && "λ"}
                  {theme === "v" && "V"}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 v:bg-black 
                             text-gray-800 dark:text-gray-200 hev:text-orange-400 v:text-cyan-400 
                             hover:shadow-md transition"
                >
                  {isFullscreen ? "⛶" : "⤢"}
                </button>
                {/* ✅ New Refresh Button */}
                <button
                  onClick={() => window.refreshApp && window.refreshApp()}
                  className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 v:bg-black 
                             text-gray-800 dark:text-gray-200 hev:text-orange-400 v:text-cyan-400 
                             hover:shadow-md transition"
                >
                  🔄
                </button>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 hev:bg-gray-800 v:bg-black 
                             text-gray-800 dark:text-gray-200 hev:text-orange-400 v:text-cyan-400 
                             hover:shadow-md transition"
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
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
            />
          )}

          {/* Slide-in Menu */}
          <div
            className={`fixed top-0 right-0 h-full w-64 shadow-lg transform transition-transform duration-300 z-40 menu-panel ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 space-y-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full text-right text-gray-600 dark:text-gray-300 hev:text-orange-400 v:text-cyan-400"
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
                  className={`block w-full px-4 py-2 transition menu-button ${
                    view === item.id ? "active" : ""
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
                <StimmingModule onOpen={() => setView("stimming")} />
                <div
                  onClick={() => setView("transcription")}
                  className="card cursor-pointer p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <h2 className="text-lg font-bold mb-2">Transcription</h2>
                  <p className="text-sm">
                    Tap to open live transcription for auditory processing
                    support.
                  </p>
                </div>
                <MedicationReminder />
                <WorkTracker />
                <SleepTracker />
                <NicotineTracker />
                <WeightMeter />
              </div>
            )}
            {view === "symptoms" && <SymptomForm />}
            {view === "logs" && <LogViewer />}
            {view === "settings" && (
              <div className="space-y-6">
                <PDFExporter />
                <DataManager />
                <StimmingSettings />
                <NotificationSettings />
                <ChangePin />
              </div>
            )}
            {view === "stimming" && <StimmingSurface />}
            {view === "transcription" && <Transcription />}
            {view === "about" && <About />}
          </main>
        </div>
      </div>
    </SecurityGate>
  );
}

export default App;
