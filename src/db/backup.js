import { db } from "./schema.js";

// ✅ Save a backup (manual or daily)
export async function createBackup() {
  const data = {
    // ✅ includes sensory + additionalNotes automatically
    symptoms: await db.symptoms.toArray(),
    weight: await db.weight.toArray(),
    calories: await db.calories.toArray(),
    interactions: await db.calorieInteractions.toArray(),
    medication: await db.medication.toArray(),
    work: await db.work.toArray(),
    sleep: await db.sleep.toArray(),
    nicotine: await db.nicotine.toArray(),
    stimming: await db.stimming.toArray(),
  };

  const today = new Date().toISOString().split("T")[0];

  await db.backups.put({ date: today, data });

  // Keep only last 3 backups
  const all = await db.backups.toArray();
  if (all.length > 3) {
    const sorted = all.sort((a, b) => new Date(a.date) - new Date(b.date));
    await db.backups.delete(sorted[0].id);
  }
}

// ✅ Restore from a backup
export async function restoreBackup(date) {
  const backup = await db.backups.where("date").equals(date).first();
  if (!backup) throw new Error("No backup found for that date");

  // Clear all tables
  await db.symptoms.clear();
  await db.weight.clear();
  await db.calories.clear();
  await db.calorieInteractions.clear();
  await db.medication.clear();
  await db.work.clear();
  await db.sleep.clear();
  await db.nicotine.clear();
  await db.stimming.clear();

  // ✅ Restore all data (sensory + additionalNotes included automatically)
  if (backup.data.symptoms) await db.symptoms.bulkAdd(backup.data.symptoms);
  if (backup.data.weight) await db.weight.bulkAdd(backup.data.weight);
  if (backup.data.calories) await db.calories.bulkAdd(backup.data.calories);
  if (backup.data.interactions)
    await db.calorieInteractions.bulkAdd(backup.data.interactions);
  if (backup.data.medication) await db.medication.bulkAdd(backup.data.medication);
  if (backup.data.work) await db.work.bulkAdd(backup.data.work);
  if (backup.data.sleep) await db.sleep.bulkAdd(backup.data.sleep);
  if (backup.data.nicotine) await db.nicotine.bulkAdd(backup.data.nicotine);
  if (backup.data.stimming) await db.stimming.bulkAdd(backup.data.stimming);
}

// ✅ Reset DB completely
export async function resetDB() {
  await db.symptoms.clear();
  await db.weight.clear();
  await db.calories.clear();
  await db.calorieInteractions.clear();
  await db.medication.clear();
  await db.work.clear();
  await db.sleep.clear();
  await db.nicotine.clear();
  await db.stimming.clear();
  await db.backups.clear();
}
