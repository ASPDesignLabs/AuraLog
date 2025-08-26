import { useState, useEffect, useRef } from "react";
import { db } from "../db/schema.js";
import * as THREE from "three";

export default function CalorieMeter() {
  const [calories, setCalories] = useState(null);
  const [tempCalories, setTempCalories] = useState("");
  const dailyGoal = 2100;
  const mountRef = useRef(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US");
    db.calories
      .where("date")
      .equals(today)
      .first()
      .then((entry) => {
        if (entry) setCalories(entry.value);
      });
  }, []);

  useEffect(() => {
    const now = new Date();
    const resetTime = new Date();
    resetTime.setHours(2, 0, 0, 0);
    if (now > resetTime) resetTime.setDate(resetTime.getDate() + 1);
    const timeout = resetTime.getTime() - now.getTime();
    const timer = setTimeout(() => {
      setCalories(null);
      setTempCalories("");
    }, timeout);
    return () => clearTimeout(timer);
  }, []);

  const handleAddCalories = async () => {
    if (!tempCalories) return;
    const today = new Date().toLocaleDateString("en-US");
    const newTotal = (calories || 0) + Number(tempCalories);

    setCalories(newTotal);
    setTempCalories("");

    await db.calories.put({ date: today, value: newTotal });

    const now = new Date();
    const time = now.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    await db.calorieInteractions.add({ date: today, time });
  };

  const progress = Math.min((calories || 0) / dailyGoal, 1);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.RingGeometry(1, 1.2, 64, 1, 0, Math.PI * 2);
    const material = new THREE.MeshBasicMaterial({
      color: "#e5e7eb",
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(geometry, material);
    scene.add(ring);

    const progressGeometry = new THREE.RingGeometry(
      1,
      1.2,
      64,
      1,
      0,
      Math.PI * 2 * progress
    );
    const progressMaterial = new THREE.MeshBasicMaterial({
      color: "#10b981",
      side: THREE.DoubleSide,
    });
    const progressRing = new THREE.Mesh(progressGeometry, progressMaterial);
    scene.add(progressRing);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [progress]);

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">Calorie Tracker</h2>
      <div ref={mountRef} className="w-full h-40 flex items-center justify-center" />
      <p className="text-sm mb-3 text-center">
        {calories !== null ? `${calories} / ${dailyGoal} kcal` : "No entry yet"}
      </p>
      <div className="flex space-x-2">
        <input
          type="number"
          min="0"
          max="10000"
          step="50"
          value={tempCalories}
          onChange={(e) => setTempCalories(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
          placeholder="Add calories"
        />
        <button
          onClick={handleAddCalories}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}
