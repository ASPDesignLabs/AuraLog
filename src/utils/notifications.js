// src/utils/notifications.js

// Existing function to schedule meal notifications
export function scheduleNotifications() {
  if (!("Notification" in window)) return;

  const enabled = localStorage.getItem("mealNotifications");
  if (enabled === "false") return; // ✅ respect user preference

  Notification.requestPermission().then((perm) => {
    if (perm !== "granted") return;

    const schedule = (hour, minute, messages) => {
      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      if (target < now) target.setDate(target.getDate() + 1);

      const timeout = target.getTime() - now.getTime();
      setTimeout(() => {
        new Notification("Health Tracker", { body: pickRandom(messages) });
        schedule(hour, minute, messages); // reschedule for next day
      }, timeout);
    };

    schedule(8, 0, breakfastMessages);
    schedule(12, 0, lunchMessages);
    schedule(18, 0, dinnerMessages);
  });
}

// ✅ New helper to request permission explicitly
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("❌ Notifications not supported in this browser.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notifications enabled.");
      return true;
    } else {
      console.log("⚠️ Notifications denied or dismissed.");
      return false;
    }
  } catch (err) {
    console.error("❌ Error requesting notification permission:", err);
    return false;
  }
}

// ✅ Helper to pick a random message
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Example messages
const breakfastMessages = [
  "🍳 Time for breakfast!",
  "🥐 Don’t skip your morning meal.",
  "☕ Fuel up for the day ahead.",
];
const lunchMessages = [
  "🥗 Lunch time!",
  "🍱 Take a break and eat.",
  "🥪 Refuel your body.",
];
const dinnerMessages = [
  "🍲 Dinner is ready!",
  "🍛 Don’t forget your evening meal.",
  "🥘 Time to wind down with food.",
];
