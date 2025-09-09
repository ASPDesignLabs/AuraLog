import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { secureAdd, secureGetLatest } from "../utils/encryption.js";

export default function CalorieMeter() {
  const [calories, setCalories] = useState(0);
  const [tempCalories, setTempCalories] = useState("");
  const dailyGoal = 2100;
  const mountRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!window.sessionDEK) return;
      const latest = await secureGetLatest("calories");
      setCalories(latest ? latest.value : 0);
    };
    load();
  }, []);

  const handleAddCalories = async () => {
    if (!tempCalories) return;
    const now = new Date();
    const newTotal = (calories || 0) + Number(tempCalories);

    await secureAdd("calories", {
      value: newTotal,
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
    });

    const latest = await secureGetLatest("calories");
    setCalories(latest ? latest.value : 0);
    setTempCalories("");
  };

  const progress = Math.min((calories || 0) / dailyGoal, 1);

  useEffect(() => {
    if (!mountRef.current) return;

    // clear any old children
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Base ring
    const baseRing = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.2, 64, 1, 0, Math.PI * 2),
      new THREE.MeshBasicMaterial({ color: "#e5e7eb", side: THREE.DoubleSide })
    );
    scene.add(baseRing);

    // Progress ring
    const progressRing = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.2, 64, 1, 0, Math.PI * 2 * progress),
      new THREE.MeshBasicMaterial({ color: "#10b981", side: THREE.DoubleSide })
    );
    scene.add(progressRing);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [progress]);

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl">
      <h2 className="text-lg font-bold mb-2">Calorie Tracker</h2>

      <div ref={mountRef} className="w-full h-40 flex items-center justify-center" />

      <p className="text-sm mb-3 text-center">
        {calories > 0 ? `${calories} / ${dailyGoal} kcal` : "No entry yet"}
      </p>

      <div className="flex space-x-2">
        <input
          type="number"
          min="0"
          step="50"
          value={tempCalories}
          onChange={(e) => setTempCalories(e.target.value)}
          className="flex-1 p-3 rounded-xl border focus:ring-2 focus:outline-none"
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
