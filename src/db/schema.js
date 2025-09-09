import Dexie from "dexie";

// Explicitly export a *named* constant `db` for other modules
export const db = new Dexie("HealthTrackerDB");

/**
 * ✅ Version 17
 * Clean reset: ensures encrypted-only rows
 */
db.version(17).stores({
  calories: "++id, encrypted",
  weight: "++id, encrypted",
  sleep: "++id, encrypted",
  work: "++id, encrypted",
  nicotine: "++id, encrypted",
  symptoms: "++id, encrypted",
  medication: "++id, encrypted",
  stimming: "++id, encrypted",
  backups: "++id, encrypted",
  calorieInteractions: "++id, encrypted",
  auditLogs: "++id, encrypted",
});

// Clean wipe during upgrade to enforce HIPAA-safe encrypted-only DB
db.version(17).upgrade(async (tx) => {
  console.warn(
    "⚠️ Resetting all tables to enforce encrypted-only data (schema v17)"
  );
  await Promise.all(
    [
      "calories",
      "weight",
      "sleep",
      "work",
      "nicotine",
      "symptoms",
      "medication",
      "stimming",
      "backups",
      "calorieInteractions",
      "auditLogs",
    ].map((table) => tx.table(table).clear())
  );
});
