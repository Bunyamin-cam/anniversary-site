export type Duration = { years: number; months: number; days: number; hours: number; minutes: number };

function calendarDate(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23" }).formatToParts(date);
  const value = (type: string) => Number(parts.find(part => part.type === type)?.value);
  return new Date(Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second")));
}

function addMonths(start: Date, months: number) {
  const endOfMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, Math.min(start.getUTCDate(), endOfMonth), start.getUTCHours(), start.getUTCMinutes(), start.getUTCSeconds()));
}

// Calendar months/years, rather than approximating a month as 30 days.
export function relationshipDuration(startISO: string, now: Date, timeZone = "Europe/Istanbul"): Duration {
  const startInstant = new Date(startISO);
  if (!Number.isFinite(startInstant.getTime()) || !Number.isFinite(now.getTime())) throw new Error("Invalid relationship date");
  if (now <= startInstant) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0 };
  const start = calendarDate(startInstant, timeZone);
  const end = calendarDate(now, timeZone);
  let months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth();
  if (addMonths(start, months) > end) months--;
  const minutes = Math.floor((end.getTime() - addMonths(start, months).getTime()) / 60000);
  return { years: Math.floor(months / 12), months: months % 12, days: Math.floor(minutes / 1440), hours: Math.floor(minutes / 60) % 24, minutes: minutes % 60 };
}
