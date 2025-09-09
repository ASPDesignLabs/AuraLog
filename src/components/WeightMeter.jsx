import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { secureAdd, secureGetLatest } from "../utils/encryption.js";

export default function WeightMeter() {
  const [weight, setWeight] = useState(null);
  const [tempWeight, setTempWeight] = useState("");
  const goal = 160;
  const start = 120;
  const mountRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!window.sessionDEK) return;
      const latest = await secureGetLatest("weight");
      setWeight(latest ? latest.value : null);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!tempWeight) return;
    const now = new Date();

    await secureAdd("weight", {
      value: Number(tempWeight),
      timestamp: now.toISOString(),
      time: now.toLocaleTimeString("en-US"),
    });

    const latest = await secureGetLatest("weight");
    setWeight(latest ? latest.value : null);
    setTempWeight("");
  };

  const progress =
    weight && weight >= start
      ? Math.min(((weight - start) / (goal - start)) * 100, 100)
      : 0;

  useEffect(() => {
    if (!mountRef.current) return;

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

    // Base background bar
    const baseBar = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 2),
      new THREE.MeshBasicMaterial({ color: "#e5e7eb", side: THREE.DoubleSide })
    );
    scene.add(baseBar);

    // Progress indicator bar
    const progressHeight = (2 * progress) / 100;
    const progressBar = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, progressHeight),
      new THREE.MeshBasicMaterial({ color: "#a855f7", side: THREE.DoubleSide })
    );
    progressBar.position.y = -(1 - progressHeight / 2);
    scene.add(progressBar);

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
    <div className="card p-6">
      <h2 className="text-lg font-bold mb-2">Weight Tracker</h2>
      <div ref={mountRef} className="w-full h-40" />
      <p>{weight !== null ? `${weight} lbs (Goal: ${goal})` : "No entry yet"}</p>
      <div className="flex space-x-2">
        <input
          type="number"
          value={tempWeight}
          onChange={(e) => setTempWeight(e.target.value)}
          className="flex-1 p-2 border rounded-xl"
          placeholder="Enter weight"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
