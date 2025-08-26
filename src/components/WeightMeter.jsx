import { useState, useEffect, useRef } from "react";
import { db } from "../db/schema.js";
import * as THREE from "three";

export default function WeightMeter() {
  const [weight, setWeight] = useState(null);
  const [tempWeight, setTempWeight] = useState("");
  const goal = 160;
  const start = 120;
  const mountRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toLocaleDateString("en-US");

    db.weight
      .where("date")
      .equals(weekStart)
      .first()
      .then((entry) => {
        if (entry) {
          setWeight(entry.value);
          setTempWeight(entry.value);
        }
      });

    const resetTime = new Date(monday);
    resetTime.setDate(monday.getDate() + 7);
    resetTime.setHours(2, 0, 0, 0);
    const timeout = resetTime.getTime() - now.getTime();
    const timer = setTimeout(() => {
      setWeight(null);
      setTempWeight("");
    }, timeout);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toLocaleDateString("en-US");

    setWeight(tempWeight);
    await db.weight.put({ date: weekStart, value: tempWeight });
    alert("Weekly weight logged!");
  };

  const progress =
    weight && weight >= start
      ? Math.min(((weight - start) / (goal - start)) * 100, 100)
      : 0;

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

    const geometry = new THREE.PlaneGeometry(0.5, 2);
    const material = new THREE.MeshBasicMaterial({
      color: "#e5e7eb",
      side: THREE.DoubleSide,
    });
    const bar = new THREE.Mesh(geometry, material);
    scene.add(bar);

    const progressHeight = 2 * (progress / 100);
    const progressGeometry = new THREE.PlaneGeometry(0.5, progressHeight);
    const progressMaterial = new THREE.MeshBasicMaterial({
      color: "#a855f7",
      side: THREE.DoubleSide,
    });
    const progressBar = new THREE.Mesh(progressGeometry, progressMaterial);
    progressBar.position.y = -(1 - progressHeight / 2);
    scene.add(progressBar);

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
      <h2 className="text-lg font-bold mb-2">Weekly Weight Tracker</h2>
      <div ref={mountRef} className="w-full h-40 flex items-center justify-center" />
      <p className="text-sm mb-3 text-center">
        {weight ? `${weight} lbs (Goal: ${goal})` : "No entry this week"}
      </p>
      <div className="flex space-x-2">
        <input
          type="number"
          min="80"
          max="300"
          step="1"
          value={tempWeight}
          onChange={(e) => setTempWeight(Number(e.target.value))}
          className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          placeholder="Enter weekly weight"
        />
        <button
          onClick={handleSubmit}
          disabled={weight !== null}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            weight !== null
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02] hover:shadow-lg"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
