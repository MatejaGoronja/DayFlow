export type Category = "work" | "personal" | "study";
export type Freq = "none" | "daily" | "weekly" | "monthly" | "yearly";
export type EndType = "never" | "count" | "until";
export type Remind = "none" | "at" | "10m" | "1h" | "1d";

export type Repeat = {
  freq: Freq;
  interval: number; 
  end: EndType;
  count: number; 
  until: string; 
};

export type CalEvent = {
  id: string;
  title: string;
  date: string; 
  start: string; 
  end: string; 
  category: Category;
  repeat: Repeat;
  remind: Remind;
};

export type EventInput = Omit<CalEvent, "id" | "date">;

export type Status = "todo" | "progress" | "done";
export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  due: string; 
  status: Status;
  remind: Remind; 
};

export type TaskInput = Pick<Task, "title" | "priority" | "due" | "remind">;

export type ReminderItem = {
  key: string; 
  source: "event" | "task";
  id: string;
  title: string;
  detail: string;
  fireAt: number;
  href: string;
};

export const USE_12H = true;

export const noRepeat: Repeat = {
  freq: "none",
  interval: 1,
  end: "never",
  count: 10,
  until: "",
};

export const freqUnit: Record<Exclude<Freq, "none">, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
  yearly: "year",
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const toKey = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

export function parseKey(key: string) {
  return {
    y: Number(key.slice(0, 4)),
    m: Number(key.slice(5, 7)) - 1,
    d: Number(key.slice(8, 10)),
  };
}

export function dateOf(date: Date) {
  return toKey(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(key: string, days: number) {
  const { y, m, d } = parseKey(key);
  return dateOf(new Date(y, m, d + days));
}

export function dayNumber(key: string) {
  const { y, m, d } = parseKey(key);
  return Math.round(Date.UTC(y, m, d) / 86_400_000);
}

export function atTime(key: string, time: string) {
  const { y, m, d } = parseKey(key);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m, d, h, min).getTime();
}

export function hhmm(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTime(time: string) {
  if (!USE_12H) return time;
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

export function formatLong(key: string, options: Intl.DateTimeFormatOptions) {
  const { y, m, d } = parseKey(key);
  return new Date(y, m, d).toLocaleDateString("en-US", options);
}

function dayLabel(date: string, today: string) {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  return formatLong(date, { month: "short", day: "numeric" });
}

export const remindMinutes: Record<Remind, number> = {
  none: 0,
  at: 0,
  "10m": 10,
  "1h": 60,
  "1d": 1440,
};

export const eventRemindOptions: { value: Remind; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "at", label: "At time of event" },
  { value: "10m", label: "10 minutes before" },
  { value: "1h", label: "1 hour before" },
  { value: "1d", label: "1 day before" },
];

export const taskRemindOptions: { value: Remind; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "at", label: `On the due date (${formatTime("09:00")})` },
  { value: "1d", label: `1 day before (${formatTime("09:00")})` },
];

export function eventRemindLabel(value: Remind) {
  return eventRemindOptions.find((o) => o.value === value)?.label ?? "";
}

function occurrenceNumber(ev: CalEvent, key: string): number | null {
  const { freq, interval } = ev.repeat;
  if (key < ev.date) return null;

  if (freq === "none") return key === ev.date ? 0 : null;

  if (freq === "daily" || freq === "weekly") {
    const step = (freq === "daily" ? 1 : 7) * interval;
    const diff = dayNumber(key) - dayNumber(ev.date);
    return diff % step === 0 ? diff / step : null;
  }

  const s = parseKey(ev.date);
  const k = parseKey(key);
  const stepMonths = (freq === "monthly" ? 1 : 12) * interval;
  const monthsDiff = (k.y - s.y) * 12 + (k.m - s.m);

  if (k.d !== s.d || monthsDiff % stepMonths !== 0) return null;
  if (freq === "yearly" && k.m !== s.m) return null;

  let index = 0;
  for (let j = 0; j < monthsDiff / stepMonths; j++) {
    const probe = new Date(s.y, s.m + j * stepMonths, s.d);
    if (probe.getDate() === s.d) index++;
  }
  return index;
}

export function occursOn(ev: CalEvent, key: string) {
  const n = occurrenceNumber(ev, key);
  if (n === null) return false;
  if (ev.repeat.end === "count") return n < ev.repeat.count;
  if (ev.repeat.end === "until") return key <= ev.repeat.until;
  return true;
}

export function describeRepeat(r: Repeat, date: string) {
  if (r.freq === "none") return "Does not repeat";

  const unit = freqUnit[r.freq];
  let text = r.interval === 1 ? `Every ${unit}` : `Every ${r.interval} ${unit}s`;

  if (r.freq === "weekly") text += ` on ${formatLong(date, { weekday: "long" })}`;
  if (r.freq === "monthly") text += ` on day ${parseKey(date).d}`;
  if (r.freq === "yearly") text += ` on ${formatLong(date, { month: "long", day: "numeric" })}`;

  if (r.end === "count") text += `, ${r.count} times`;
  if (r.end === "until" && r.until) {
    text += `, until ${formatLong(r.until, { month: "short", day: "numeric", year: "numeric" })}`;
  }
  return text;
}

type ComputeArgs = {
  events: CalEvent[];
  tasks: Task[];
  now: number;
  today: string;
  dismissed: string[];
  snoozed: Record<string, number>;
};

export function computeReminders({
  events,
  tasks,
  now,
  today,
  dismissed,
  snoozed,
}: ComputeArgs): ReminderItem[] {
  const out: ReminderItem[] = [];
  const tomorrow = addDays(today, 1);
  const visible = (key: string) =>
    !dismissed.includes(key) && (snoozed[key] ?? 0) <= now;

  for (const ev of events) {
    if (ev.remind === "none") continue;

    for (const date of [today, tomorrow]) {
      if (!occursOn(ev, date)) continue;

      const fireAt = atTime(date, ev.start) - remindMinutes[ev.remind] * 60_000;
      const end = atTime(date, ev.end);
      const key = `event:${ev.id}:${date}`;

      if (fireAt <= now && now < end && visible(key)) {
        out.push({
          key,
          source: "event",
          id: ev.id,
          title: ev.title,
          detail: `${dayLabel(date, today)} · ${formatTime(ev.start)}`,
          fireAt,
          href: "/dashboard/calendar",
        });
      }
    }
  }

  for (const task of tasks) {
    if (task.remind === "none" || !task.due || task.status === "done") continue;

    const fireAt = atTime(task.due, "09:00") - remindMinutes[task.remind] * 60_000;
    const expires = atTime(addDays(task.due, 1), "00:00");
    const key = `task:${task.id}:${task.due}`;

    if (fireAt <= now && now < expires && visible(key)) {
      out.push({
        key,
        source: "task",
        id: task.id,
        title: task.title,
        detail: `Due ${dayLabel(task.due, today).toLowerCase()}`,
        fireAt,
        href: "/dashboard/todo",
      });
    }
  }

  return out.sort((a, b) => a.fireAt - b.fireAt);
}