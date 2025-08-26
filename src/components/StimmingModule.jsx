export default function StimmingModule({ onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="card cursor-pointer p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
    >
      <h2 className="text-lg font-bold mb-2">Stimming Tool</h2>
      <p className="text-sm">
        Tap to open a calming surface for grounding and decompression.
      </p>
    </div>
  );
}
