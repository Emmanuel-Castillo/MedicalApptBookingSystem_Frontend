export const OPEN_HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
]

// Utility function to setup Dto
// Setting hour value into a formatted string "HH:mm:ss"
export function formatTime(time: string): string {
  const [hour, minute, seconds] = time.split(":");
  const hourAsNumber = Number(hour)
  const ampm = hourAsNumber < 12 ? "AM" : "PM";
  const adjustedHr = hourAsNumber <= 12 ? hourAsNumber : hourAsNumber % 12;
  return adjustedHr + ":" + minute + " " + ampm;
}

export function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year.padStart(4,"0")}`;
}
