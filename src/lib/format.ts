const units = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;

/**
 * A file size for people, such as "1.4 MB".
 */
export function formatBytes(bytes: number): string {
  let value = bytes;
  let unit = 0;

  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
  }

  return new Intl.NumberFormat("en", {
    style: "unit",
    unit: units[unit],
    unitDisplay: unit === 0 ? "long" : "short",
    maximumFractionDigits: unit === 0 ? 0 : 1,
  }).format(value);
}

/**
 * The locale dates and times are shown in: English, with a 24-hour clock.
 */
const locale = "en-GB";

/**
 * A date and time in full, such as "30 September 2026 at 18:41:07".
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "medium" }).format(date);
}

/**
 * A time of day to the millisecond, such as "18:41:07.123", for log lines.
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hourCycle: "h23",
  }).format(date);
}

const relativeUnits: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["minute", 60],
  ["hour", 60 * 60],
  ["day", 24 * 60 * 60],
];

/**
 * How long ago or from now a time is, such as "5 minutes ago" or
 * "yesterday"; the date itself after a week.
 */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);

  if (Math.abs(seconds) < 45) {
    return "just now";
  }
  if (Math.abs(seconds) >= 7 * 24 * 60 * 60) {
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
  }

  const [unit, size] = relativeUnits.findLast(([, size]) => Math.abs(seconds) >= size) ?? relativeUnits[0];

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(Math.round(seconds / size), unit);
}

/**
 * A length of time, such as "2 min 13 s" or "1 h 5 min", in its two
 * largest units.
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);

  if (seconds < 1) {
    return "< 1 s";
  }

  const parts = [
    [Math.floor(seconds / 86400), "d"],
    [Math.floor(seconds / 3600) % 24, "h"],
    [Math.floor(seconds / 60) % 60, "min"],
    [seconds % 60, "s"],
  ] as const;
  const first = parts.findIndex(([value]) => value > 0);

  return parts
    .slice(first, first + 2)
    .filter(([value]) => value > 0)
    .map(([value, unit]) => `${value} ${unit}`)
    .join(" ");
}
