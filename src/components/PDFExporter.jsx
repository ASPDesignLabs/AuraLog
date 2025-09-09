import { useState } from "react";
import { jsPDF } from "jspdf";
import { secureAll, auditExport } from "../utils/encryption.js";

export default function PDFExporter() {
  const [showModal, setShowModal] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [userName, setUserName] = useState("");

  const handleGenerate = async () => {
    if (!acknowledged || !userName.trim()) {
      alert("Please enter your name and acknowledge risks.");
      return;
    }
    setShowModal(false);
    await generatePDF();
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    let y = 20;
    const margin = 14;

    const addSection = (title) => {
      doc.setFontSize(14);
      doc.text(title, margin, y);
      y += 8;
    };

    const addLines = (lines) => {
      doc.setFontSize(10);
      lines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      });
    };

    // Symptoms
    addSection("Symptom Logs");
    const symptoms = await secureAll("symptoms");
    if (symptoms.length === 0) addLines(["No symptom entries."]);
    else
      symptoms.forEach((s) =>
        addLines([
          `${s.time} Pain: ${s.pain} Emotional: ${s.emotionalState}`,
          s.additionalNotes ? `Notes: ${s.additionalNotes}` : "",
        ])
      );

    // Calories
    addSection("Calories");
    const calories = await secureAll("calories");
    if (calories.length === 0) addLines(["No calorie entries."]);
    else calories.forEach((c) => addLines([`${c.date || c.time} | ${c.value} kcal`]));

    // Sleep
    addSection("Sleep");
    const sleep = await secureAll("sleep");
    if (sleep.length === 0) addLines(["No sleep entries."]);
    else sleep.forEach((s) => addLines([`${s.date || s.time} | ${s.hours} hrs`]));

    // Work
    addSection("Work");
    const work = await secureAll("work");
    if (work.length === 0) addLines(["No work entries."]);
    else work.forEach((w) => addLines([`${w.weekStart} | ${w.hours} hrs`]));

    // Weight
    addSection("Weight");
    const weight = await secureAll("weight");
    if (weight.length === 0) addLines(["No weight entries."]);
    else weight.forEach((w) => addLines([`${w.date || w.time} | ${w.value} lbs`]));

    // Nicotine
    addSection("Nicotine");
    const nicotine = await secureAll("nicotine");
    if (nicotine.length === 0) addLines(["No nicotine logs."]);
    else nicotine.forEach((n) => addLines([`${n.date} uses: ${n.uses}/${n.target}`]));

    // Medication
    addSection("Medication");
    const meds = await secureAll("medication");
    if (meds.length === 0) addLines(["No medication logs."]);
    else meds.forEach((m) =>
      addLines([`${m.date} | ${m.taken ? "Taken" : "Missed"}`])
    );

    // Footer
    doc.setFontSize(10);
    doc.text(userName, margin, 285);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 290);

    doc.save("auralog-report.pdf");
    await auditExport("PDF");
    alert("✅ PDF exported + logged.");
  };

  return (
    <div className="card p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
      <h2 className="text-lg font-bold mb-2">📄 Export PDF Report</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full p-2 mb-4 rounded-xl border 
                   hev:border-orange-500 hev:focus:ring-orange-400 
                   v:border-cyan-400 v:focus:ring-cyan-400"
      />

      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 
                   text-white px-4 py-2 rounded-xl font-semibold 
                   hover:scale-[1.02] hover:shadow-lg"
      >
        Generate PDF Report
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 
                        flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl 
                          max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-red-600">
              ⚠️ Sensitive Data Warning
            </h3>
            <p className="text-sm">
              This PDF contains sensitive health data. Handle with care.
            </p>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
              />
              <span>I understand the risks</span>
            </label>
            <button
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 
                         text-white py-2 rounded-xl font-semibold"
            >
              Confirm & Generate PDF
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-300 dark:bg-gray-700 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
