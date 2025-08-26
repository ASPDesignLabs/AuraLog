import { db } from "./schema.js";

// Save a backup (manual or daily)
export async function createBackup() {
  const data = {
    symptoms: await db.symptoms.toArray(),
    weight: await db.weight.toArray(),
    calories: await db.calories.toArray(),
    interactions: await db.calorieInteractions.toArray(),
  };

  const today = new Date().toLocaleDateString("en-US");

  await db.backups.put({ date: today, data });

  // Keep only last 3 backups
  const all = await db.backups.toArray();
  if (all.length > 3) {
    const sorted = all.sort((a, b) => new Date(a.date) - new Date(b.date));
    await db.backups.delete(sorted[0].id);
  }
}

// Restore from a backup
export async function restoreBackup(date) {
  const backup = await db.backups.where("date").equals(date).first();
  if (!backup) throw new Error("No backup found for that date");

  await db.symptoms.clear();
  await db.weight.clear();
  await db.calories.clear();
  await db.calorieInteractions.clear();

  await db.symptoms.bulkAdd(backup.data.symptoms);
  await db.weight.bulkAdd(backup.data.weight);
  await db.calories.bulkAdd(backup.data.calories);
  await db.calorieInteractions.bulkAdd(backup.data.interactions);
}

// Reset DB completely
export async function resetDB() {
  await db.symptoms.clear();
  await db.weight.clear();
  await db.calories.clear();
  await db.calorieInteractions.clear();
}
