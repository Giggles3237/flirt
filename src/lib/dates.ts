import commentsData from "@/data/flirtyComments_with_risque.json";

export interface CommentEntry {
  date: string;
  specialDay: string;
  risqueImageUrl: string;
  risquePrompt: string;
  flirtyComment: string;
  risqueComment: string;
  innocentlyDirtyComment: string;
  graphicFlirtyComment: string;
}

export type FlirtLevel =
  | "innocentlyDirtyComment"
  | "flirtyComment"
  | "risqueComment"
  | "graphicFlirtyComment";

export const entries = commentsData as CommentEntry[];

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAYS_LONG = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const indexByDate = new Map(entries.map((entry, index) => [entry.date, index]));

export function hasEntry(dateString: string): boolean {
  return indexByDate.has(dateString);
}

export function entryFor(dateString: string): CommentEntry | undefined {
  const index = indexByDate.get(dateString);
  return index === undefined ? undefined : entries[index];
}

/** Step through the year in calendar order, wrapping at either end. */
export function neighbourOf(dateString: string, step: 1 | -1): string {
  const index = indexByDate.get(dateString) ?? 0;
  return entries[(index + step + entries.length) % entries.length].date;
}

export function randomDate(except: string): string {
  let pick = except;
  while (pick === except && entries.length > 1) {
    pick = entries[Math.floor(Math.random() * entries.length)].date;
  }
  return pick;
}

export function parseDateString(dateString: string): { month: number; day: number } {
  const [month, day] = dateString.split(" ");
  return { month: MONTHS_SHORT.indexOf(month), day: parseInt(day, 10) };
}

export function toDateString(month: number, day: number): string {
  return `${MONTHS_SHORT[month]} ${day}`;
}

/** Today's page, or the nearest page if today has none (Feb 29). */
export function todayDateString(now: Date = new Date()): string {
  const exact = toDateString(now.getMonth(), now.getDate());
  if (hasEntry(exact)) return exact;

  const target = now.getMonth() * 31 + now.getDate();
  let closest = entries[0]?.date ?? "";
  let smallest = Infinity;
  for (const entry of entries) {
    const { month, day } = parseDateString(entry.date);
    const distance = Math.abs(month * 31 + day - target);
    if (distance < smallest) {
      smallest = distance;
      closest = entry.date;
    }
  }
  return closest;
}
