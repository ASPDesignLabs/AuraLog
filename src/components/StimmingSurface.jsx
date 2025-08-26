import { useState, useEffect, useRef } from "react";
import { db } from "../db/schema.js";

export default function StimmingSurface() {
  const [points, setPoints] = useState([]);
  const [glow, setGlow] = useState(false);
  const [ripples, setRipples] = useState([]);
  const surfaceRef = useRef(null);
  const [settings, setSettings] = useState({
    numPoints: 10,
    glowDuration: 600,
    colorMode: "white",
  });

  useEffect(() => {
    // Load settings
    const saved = localStorage.getItem("stimmingSettings");
    if (saved) setSettings(JSON.parse(saved));

    const today = new Date().toLocaleDateString("en-US");

    // Load today's points or generate new ones
    db.stimming
      .where("date")
      .equals(today)
      .first()
      .then((entry) => {
        if (entry) {
          setPoints(entry.points);
        } else {
          const newPoints = Array.from({ length: settings.numPoints }).map(
            () => ({
              x: Math.random(),
              y: Math.random(),
              intensity: Math.floor(Math.random() * 3) + 1,
              duration: 50 + Math.floor(Math.random() * 200),
            })
          );
          setPoints(newPoints);
          db.stimming.put({ date: today, points: newPoints });
        }
      });
  }, []);

  const handleTouch = (e) => {
    e.preventDefault(); // 🚫 stop scroll/refresh
    if (!surfaceRef.current) return;
    const rect = surfaceRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    // Add ripple
    addRipple(touch.clientX - rect.left, touch.clientY - rect.top);

    // Check hidden points
    points.forEach((p) => {
      const dx = x - p.x;
      const dy = y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.05) {
        triggerFeedback(p);
      }
    });
  };

  const triggerFeedback = (point) => {
    if ("vibrate" in navigator) {
      const pattern = Array(point.intensity).fill(point.duration);
      navigator.vibrate(pattern);
    }
    setGlow(true);
    setTimeout(() => setGlow(false), settings.glowDuration);
  };

  const addRipple = (x, y) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  };

  return (
    <div
      ref={surfaceRef}
      onTouchMove={handleTouch}
      onTouchStart={handleTouch}
      className={`w-full h-[calc(100vh-5rem)] rounded-2xl relative overflow-hidden 
        bg-gray-400 bg-opacity-50 backdrop-blur-xl touch-none select-none
        transition-all duration-500
        ${
          glow
            ? settings.colorMode === "random"
              ? "bg-gray-200 shadow-[0_0_40px_rgba(0,200,255,0.6)]"
              : "bg-gray-200 shadow-[0_0_40px_rgba(255,255,255,0.6)]"
            : ""
        }`}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-black/10" />

      {/* Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/40 dark:bg-white/30 animate-ripple"
          style={{
            left: r.x,
            top: r.y,
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
          }}
        />
      ))}
    </div>
  );
}
