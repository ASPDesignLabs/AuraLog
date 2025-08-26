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
