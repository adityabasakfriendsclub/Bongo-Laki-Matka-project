// Bazi schedule — times in minutes since midnight
// 10:30 AM = 630, 12:00 PM = 720, etc.
export const BAZI_TIMES = [
  { bazi: "1st", time: "10:30 AM", minutesSinceMidnight: 630 },
  { bazi: "2nd", time: "12:00 PM", minutesSinceMidnight: 720 },
  { bazi: "3rd", time: "01:30 PM", minutesSinceMidnight: 810 },
  { bazi: "4th", time: "03:00 PM", minutesSinceMidnight: 900 },
  { bazi: "5th", time: "04:30 PM", minutesSinceMidnight: 990 },
  { bazi: "6th", time: "06:00 PM", minutesSinceMidnight: 1080 },
  { bazi: "7th", time: "07:30 PM", minutesSinceMidnight: 1170 },
  { bazi: "8th", time: "09:00 PM", minutesSinceMidnight: 1260 },
];

/**
 * Returns how many bazis have passed their scheduled time.
 * e.g. if current time is 1:45 PM, returns 3 (bazis 1, 2, 3 are done).
 * Returns 0 if before 10:30 AM, 8 if after 9:00 PM.
 */
export function getVisibleBaziCount() {
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();
  let count = 0;
  for (const bazi of BAZI_TIMES) {
    if (total >= bazi.minutesSinceMidnight) count++;
    else break;
  }
  return count;
}

/**
 * Returns today's date string in the format used across the app.
 * e.g. "29-May-2026"
 */
export function getTodayStr() {
  return new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
}
