import Dexie from "dexie";

export const db = new Dexie("HealthTrackerDB");

db.version(8).stores({
  symptoms:
    "++id, date, pain, heartRateCurrent, heartRateResting, emotionalState, sensory, calories, medication",
  weight: "++id, date, value",
  calories: "++id, date, value",
  calorieInteractions: "++id, date, time",
  backups: "++id, date",
  medication: "++id, date, time, taken",
  work: "++id, weekStart, hours",
  sleep: "++id, date, hours",
  nicotine: "++id, date, uses, target",
  stimming: "++id, date, points" // NEW: daily random points
});
